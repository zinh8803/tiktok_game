import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import {
  GameEvent,
  LeaderboardEntry,
  OptionLabel,
  RoomStatus,
  SessionQuestionSnapshot,
} from '../common/types';

export type ScreenPhase =
  | 'WAITING_ROOM'
  | 'COUNTDOWN'
  | 'QUESTION'
  | 'ANSWER_REVEAL'
  | 'LEADERBOARD'
  | 'VICTORY';

export interface ActiveRoomRuntime {
  roomId: string;
  roomCode: string;
  title: string;
  status: RoomStatus;
  phase: ScreenPhase;
  sessionId: string | null;
  questions: SessionQuestionSnapshot[];
  currentQuestionIndex: number;
  isQuestionOpen: boolean;
  questionStartedAt: number;
  questionEndsAt: number;
  remainingSeconds: number;
  answeredCountCurrentQuestion: number;
  answeredPlayersCurrentQuestion: Array<{
    playerId: string;
    nickname: string;
    username: string;
  }>;
  eliminatedHintOption: OptionLabel | null;
  playersMap: Map<string, { id: string; username: string; nickname: string; avatarUrl?: string }>;
  leaderboard: LeaderboardEntry[];
  lastQuestionResult: any | null;
  gameFinishedPayload: any | null;
  timerInterval?: NodeJS.Timeout;
  phaseTimeout?: NodeJS.Timeout;
  autoCrowdEnabled: boolean;
  autoCrowdMin: number;
  autoCrowdMax: number;
  autoCrowdJoinTimer?: NodeJS.Timeout;
  autoCrowdAnswerTimers: NodeJS.Timeout[];
  recentEvents: Array<{
    id: string;
    type: string;
    nickname: string;
    username: string;
    summary: string;
    timestamp: number;
  }>;
}

@Injectable()
export class GameEngineService {
  private readonly logger = new Logger(GameEngineService.name);
  private readonly runtimes = new Map<string, ActiveRoomRuntime>();

  constructor(
    private readonly db: DatabaseService,
    @Inject(forwardRef(() => RealtimeGateway))
    private readonly realtime: RealtimeGateway
  ) {}

  public getOrCreateRuntime(roomCode = 'KB2026'): ActiveRoomRuntime {
    const normalizedCode = roomCode.toUpperCase();
    let runtime = this.runtimes.get(normalizedCode);
    if (runtime) {
      return runtime;
    }

    const roomRecord =
      this.db.getRoomWithConfig(normalizedCode) ||
      this.db.getRoomWithConfig('KB2026');

    if (!roomRecord) {
      throw new Error(`Room ${normalizedCode} not found`);
    }

    // Luôn khởi tạo về WAITING khi server vừa khởi động lại để tránh kẹt trạng thái cũ
    if (roomRecord.status !== 'WAITING') {
      this.db.updateRoomStatus(roomRecord.id, 'WAITING');
    }

    runtime = {
      roomId: roomRecord.id,
      roomCode: roomRecord.roomCode,
      title: roomRecord.title,
      status: 'WAITING',
      phase: 'WAITING_ROOM',
      sessionId: null,
      questions: [],
      currentQuestionIndex: -1,
      isQuestionOpen: false,
      questionStartedAt: 0,
      questionEndsAt: 0,
      remainingSeconds: 0,
      answeredCountCurrentQuestion: 0,
      answeredPlayersCurrentQuestion: [],
      eliminatedHintOption: null,
      playersMap: new Map(),
      leaderboard: [],
      lastQuestionResult: null,
      gameFinishedPayload: null,
      autoCrowdEnabled: false,
      autoCrowdMin: 50,
      autoCrowdMax: 100,
      autoCrowdAnswerTimers: [],
      recentEvents: [],
    };

    this.runtimes.set(roomRecord.roomCode, runtime);
    return runtime;
  }

  private clearAutoCrowdAnswerTimers(runtime: ActiveRoomRuntime) {
    if (runtime.autoCrowdAnswerTimers?.length) {
      for (const t of runtime.autoCrowdAnswerTimers) {
        clearTimeout(t);
      }
      runtime.autoCrowdAnswerTimers = [];
    }
  }

  private clearTimers(runtime: ActiveRoomRuntime) {
    if (runtime.timerInterval) {
      clearInterval(runtime.timerInterval);
      runtime.timerInterval = undefined;
    }
    if (runtime.phaseTimeout) {
      clearTimeout(runtime.phaseTimeout);
      runtime.phaseTimeout = undefined;
    }
    this.clearAutoCrowdAnswerTimers(runtime);
  }

  public pushRecentEvent(
    runtime: ActiveRoomRuntime,
    entry: { id: string; type: string; nickname: string; username: string; summary: string }
  ) {
    runtime.recentEvents.unshift({
      ...entry,
      timestamp: Date.now(),
    });
    if (runtime.recentEvents.length > 40) {
      runtime.recentEvents.length = 40;
    }
    this.realtime.emitToRoom(runtime.roomCode, 'activity.feed', runtime.recentEvents[0]);
  }

  public getRoomStatePayload(roomCode = 'KB2026') {
    const runtime = this.getOrCreateRuntime(roomCode);
    const roomRecord = this.db.getRoomWithConfig(runtime.roomCode);

    return {
      roomId: runtime.roomId,
      roomCode: runtime.roomCode,
      title: roomRecord?.title || runtime.title,
      tiktokUsername: roomRecord?.tiktokUsername || '',
      status: runtime.status,
      phase: runtime.phase,
      sessionId: runtime.sessionId,
      playerCount: runtime.playersMap.size,
      players: Array.from(runtime.playersMap.values()).slice(-24),
      currentQuestionIndex: runtime.currentQuestionIndex,
      totalQuestions:
        runtime.questions.length ||
        (roomRecord?.config.questionCount && roomRecord.config.questionCount > 0
          ? roomRecord.config.questionCount
          : this.db.getSystemStats().publishedQuestions),
      isQuestionOpen: runtime.isQuestionOpen,
      remainingSeconds: runtime.remainingSeconds,
      answeredCountCurrentQuestion: runtime.answeredCountCurrentQuestion,
      answeredPlayersCurrentQuestion: runtime.answeredPlayersCurrentQuestion.slice(-30),
      eliminatedHintOption: runtime.eliminatedHintOption,
      autoCrowd: {
        enabled: runtime.autoCrowdEnabled,
        minPlayers: runtime.autoCrowdMin,
        maxPlayers: runtime.autoCrowdMax,
      },
      config: roomRecord?.config,
      recentEvents: runtime.recentEvents.slice(0, 15),
    };
  }

  /**
   * Phục hồi trạng thái đầy đủ cho OBS Browser Source hoặc Dashboard khi reload (Mục 10.1)
   */
  public getFullClientRecoveryState(roomCode = 'KB2026') {
    const runtime = this.getOrCreateRuntime(roomCode);
    const roomState = this.getRoomStatePayload(roomCode);

    let activeQuestion: any = null;
    if (
      runtime.currentQuestionIndex >= 0 &&
      runtime.currentQuestionIndex < runtime.questions.length
    ) {
      const q = runtime.questions[runtime.currentQuestionIndex];
      const remainingMs = runtime.isQuestionOpen
        ? Math.max(0, runtime.questionEndsAt - Date.now())
        : 0;
      activeQuestion = {
        questionId: q.questionId,
        questionIndex: runtime.currentQuestionIndex + 1,
        totalQuestions: runtime.questions.length,
        categoryName: q.categoryName,
        difficulty: q.difficulty,
        question: q.content,
        options: q.options, // Tuyệt đối không có correctOption
        duration: q.timeLimit,
        remainingSeconds: Math.ceil(remainingMs / 1000),
        endsAt: runtime.questionEndsAt,
        answeredCount: runtime.answeredCountCurrentQuestion,
        eliminatedHintOption: runtime.eliminatedHintOption,
      };
    }

    return {
      roomState,
      activeQuestion,
      lastQuestionResult:
        runtime.phase === 'ANSWER_REVEAL' ? runtime.lastQuestionResult : null,
      leaderboard: {
        leaderboard: runtime.leaderboard,
        questionIndex: runtime.currentQuestionIndex + 1,
        totalQuestions: runtime.questions.length,
      },
      gameFinished:
        runtime.status === 'FINISHED' ? runtime.gameFinishedPayload : null,
    };
  }

  public emitRoomState(roomCode = 'KB2026') {
    const payload = this.getRoomStatePayload(roomCode);
    this.realtime.emitToRoom(payload.roomCode, 'room.state', payload);
    return payload;
  }

  /**
   * Bắt đầu trận đấu: WAITING -> STARTING -> PLAYING (Mục 2 & 3.1 & 4.5)
   */
  public startMatch(roomCode = 'KB2026', options?: { immediate?: boolean }) {
    const runtime = this.getOrCreateRuntime(roomCode);
    this.clearTimers(runtime);

    const roomRecord = this.db.getRoomWithConfig(runtime.roomCode);
    if (!roomRecord) {
      throw new Error('Room config not found');
    }

    const snapshots = this.db.selectQuestionsForSession({
      roomId: roomRecord.id,
      categoryId: roomRecord.config.categoryId,
      difficulty: roomRecord.config.difficulty,
      questionCount: roomRecord.config.questionCount,
      timePerQuestion: roomRecord.config.timePerQuestion,
    });

    if (snapshots.length === 0) {
      throw new Error('Không tìm thấy câu hỏi PUBLISHED nào trong ngân hàng câu hỏi.');
    }

    const sessionId = this.db.createGameSession(roomRecord.id, snapshots);

    runtime.sessionId = sessionId;
    runtime.questions = snapshots;
    runtime.currentQuestionIndex = -1;
    runtime.isQuestionOpen = false;
    runtime.answeredCountCurrentQuestion = 0;
    runtime.answeredPlayersCurrentQuestion = [];
    runtime.eliminatedHintOption = null;
    runtime.lastQuestionResult = null;
    runtime.gameFinishedPayload = null;
    runtime.leaderboard = [];

    // Đăng ký tất cả người chơi đang có trong phòng chờ vào session mới
    for (const plr of runtime.playersMap.values()) {
      this.db.upsertPlayer(sessionId, plr);
    }
    runtime.leaderboard = this.db.getSessionLeaderboard(sessionId);

    runtime.status = 'STARTING';
    runtime.phase = 'COUNTDOWN';
    this.db.updateRoomStatus(runtime.roomId, 'STARTING');
    this.emitRoomState(runtime.roomCode);

    const delayMs = options?.immediate ? 50 : 2500;
    runtime.phaseTimeout = setTimeout(() => {
      runtime.status = 'PLAYING';
      this.db.updateRoomStatus(runtime.roomId, 'PLAYING');
      this.startQuestionByIndex(runtime.roomCode, 0);
    }, delayMs);

    return {
      sessionId,
      questionCount: snapshots.length,
      status: runtime.status,
    };
  }

  /**
   * Mở một câu hỏi theo chỉ số (Mục 3.1 & 7.1 & 7.2)
   * Tuyệt đối không gửi đáp án đúng xuống client khi câu hỏi đang mở
   */
  public startQuestionByIndex(roomCode: string, index: number) {
    const runtime = this.getOrCreateRuntime(roomCode);
    this.clearTimers(runtime);

    if (index < 0 || index >= runtime.questions.length) {
      return this.finishMatch(roomCode);
    }

    const q = runtime.questions[index];
    const now = Date.now();
    const durationSec = Math.max(5, q.timeLimit || 15);

    runtime.status = 'PLAYING';
    runtime.phase = 'QUESTION';
    runtime.currentQuestionIndex = index;
    runtime.isQuestionOpen = true;
    runtime.questionStartedAt = now;
    runtime.questionEndsAt = now + durationSec * 1000;
    runtime.remainingSeconds = durationSec;
    runtime.answeredCountCurrentQuestion = 0;
    runtime.answeredPlayersCurrentQuestion = [];
    runtime.eliminatedHintOption = null;
    runtime.lastQuestionResult = null;

    if (runtime.sessionId) {
      this.db.updateSessionProgress(runtime.sessionId, index, 'PLAYING');
    }
    this.db.updateRoomStatus(runtime.roomId, 'PLAYING');

    const questionStartedPayload = {
      event: 'question.started',
      questionId: q.questionId,
      questionIndex: index + 1,
      totalQuestions: runtime.questions.length,
      categoryName: q.categoryName,
      difficulty: q.difficulty,
      question: q.content,
      options: {
        A: q.options.A,
        B: q.options.B,
        C: q.options.C,
        D: q.options.D,
      },
      duration: durationSec,
      endsAt: runtime.questionEndsAt,
    };

    this.emitRoomState(runtime.roomCode);
    this.realtime.emitToRoom(runtime.roomCode, 'question.started', questionStartedPayload);

    if (runtime.autoCrowdEnabled) {
      this.scheduleAutoCrowdAnswersForQuestion(runtime);
    }

    // Bộ đếm thời gian ở backend phát question.timer mỗi giây
    runtime.timerInterval = setInterval(() => {
      const remainingMs = Math.max(0, runtime.questionEndsAt - Date.now());
      const remainingSec = Math.ceil(remainingMs / 1000);
      runtime.remainingSeconds = remainingSec;

      this.realtime.emitToRoom(runtime.roomCode, 'question.timer', {
        questionId: q.questionId,
        questionIndex: index + 1,
        remainingSeconds: remainingSec,
        remainingMs,
        duration: durationSec,
        endsAt: runtime.questionEndsAt,
      });

      if (remainingMs <= 0) {
        this.closeAndGradeCurrentQuestion(runtime.roomCode);
      }
    }, 250);

    return questionStartedPayload;
  }

  /**
   * Đóng câu hỏi hiện tại, chấm điểm bằng Transaction và phát question.result + leaderboard.updated (Mục 3.1, 3.2, 7.1, 9)
   */
  public closeAndGradeCurrentQuestion(roomCode = 'KB2026') {
    const runtime = this.getOrCreateRuntime(roomCode);
    this.clearTimers(runtime);

    if (
      runtime.currentQuestionIndex < 0 ||
      runtime.currentQuestionIndex >= runtime.questions.length ||
      !runtime.sessionId
    ) {
      return null;
    }

    runtime.isQuestionOpen = false;
    runtime.remainingSeconds = 0;
    runtime.phase = 'ANSWER_REVEAL';

    const q = runtime.questions[runtime.currentQuestionIndex];
    const gradeStats = this.db.gradeQuestionInTransaction({
      sessionId: runtime.sessionId,
      questionId: q.questionId,
      correctOption: q.correctOption,
      timeLimitSec: q.timeLimit,
    });

    const leaderboard = this.db.getSessionLeaderboard(
      runtime.sessionId,
      q.questionId
    );
    runtime.leaderboard = leaderboard;

    const resultPayload = {
      questionId: q.questionId,
      questionIndex: runtime.currentQuestionIndex + 1,
      totalQuestions: runtime.questions.length,
      question: q.content,
      options: q.options,
      correctOption: q.correctOption,
      correctContent: q.options[q.correctOption],
      explanation: q.explanation,
      sourceAttribution: q.sourceAttribution,
      optionCounts: gradeStats.optionCounts,
      correctPlayersCount: gradeStats.correctPlayersCount,
      totalAnswersCount: gradeStats.totalAnswersCount,
      fastestPlayers: gradeStats.fastestPlayers,
      allAnswers: gradeStats.allAnswers,
    };

    runtime.lastQuestionResult = resultPayload;

    this.emitRoomState(runtime.roomCode);
    this.realtime.emitToRoom(runtime.roomCode, 'question.result', resultPayload);
    this.realtime.emitToRoom(runtime.roomCode, 'leaderboard.updated', {
      leaderboard,
      questionIndex: runtime.currentQuestionIndex + 1,
      totalQuestions: runtime.questions.length,
    });

    const roomRecord = this.db.getRoomWithConfig(runtime.roomCode);
    const revealDurationSec = roomRecord?.config.revealDuration ?? 6;
    const autoAdvance = roomRecord?.config.autoAdvance ?? true;

    if (autoAdvance && runtime.status === 'PLAYING') {
      const revealMs = Math.max(2000, revealDurationSec * 1000);
      // Sau nửa thời gian reveal, chuyển sang phase LEADERBOARD rồi sang câu kế tiếp
      runtime.phaseTimeout = setTimeout(() => {
        if (runtime.status !== 'PLAYING') return;
        runtime.phase = 'LEADERBOARD';
        this.emitRoomState(runtime.roomCode);

        runtime.phaseTimeout = setTimeout(() => {
          if (runtime.status !== 'PLAYING') return;
          if (runtime.currentQuestionIndex + 1 < runtime.questions.length) {
            this.startQuestionByIndex(
              runtime.roomCode,
              runtime.currentQuestionIndex + 1
            );
          } else {
            this.finishMatch(runtime.roomCode);
          }
        }, Math.max(2500, Math.floor(revealMs * 0.65)));
      }, Math.max(2500, Math.floor(revealMs * 0.65)));
    }

    return resultPayload;
  }

  public nextStep(roomCode = 'KB2026') {
    const runtime = this.getOrCreateRuntime(roomCode);
    if (runtime.isQuestionOpen) {
      return this.closeAndGradeCurrentQuestion(roomCode);
    }
    if (runtime.currentQuestionIndex + 1 < runtime.questions.length) {
      return this.startQuestionByIndex(
        roomCode,
        runtime.currentQuestionIndex + 1
      );
    }
    return this.finishMatch(roomCode);
  }

  public showLeaderboardPhase(roomCode = 'KB2026') {
    const runtime = this.getOrCreateRuntime(roomCode);
    runtime.phase = 'LEADERBOARD';
    this.emitRoomState(runtime.roomCode);
    this.realtime.emitToRoom(runtime.roomCode, 'leaderboard.updated', {
      leaderboard: runtime.leaderboard,
      questionIndex: runtime.currentQuestionIndex + 1,
      totalQuestions: runtime.questions.length,
    });
    return runtime.leaderboard;
  }

  public pauseMatch(roomCode = 'KB2026') {
    const runtime = this.getOrCreateRuntime(roomCode);
    this.clearTimers(runtime);
    runtime.isQuestionOpen = false;
    runtime.status = 'PAUSED';
    this.db.updateRoomStatus(runtime.roomId, 'PAUSED');
    return this.emitRoomState(runtime.roomCode);
  }

  public resumeMatch(roomCode = 'KB2026') {
    const runtime = this.getOrCreateRuntime(roomCode);
    if (runtime.status !== 'PAUSED') return this.getRoomStatePayload(roomCode);
    runtime.status = 'PLAYING';
    this.db.updateRoomStatus(runtime.roomId, 'PLAYING');
    if (runtime.phase === 'QUESTION') {
      return this.startQuestionByIndex(
        runtime.roomCode,
        Math.max(0, runtime.currentQuestionIndex)
      );
    }
    return this.emitRoomState(runtime.roomCode);
  }

  public finishMatch(roomCode = 'KB2026') {
    const runtime = this.getOrCreateRuntime(roomCode);
    this.clearTimers(runtime);
    runtime.isQuestionOpen = false;
    runtime.status = 'FINISHED';
    runtime.phase = 'VICTORY';

    this.db.updateRoomStatus(runtime.roomId, 'FINISHED');
    if (runtime.sessionId) {
      this.db.updateSessionProgress(
        runtime.sessionId,
        runtime.currentQuestionIndex,
        'FINISHED'
      );
      runtime.leaderboard = this.db.getSessionLeaderboard(runtime.sessionId);
    }

    const top3 = runtime.leaderboard.slice(0, 3);
    const winner = top3[0] || null;

    const finishedPayload = {
      sessionId: runtime.sessionId,
      roomCode: runtime.roomCode,
      winner,
      top3,
      leaderboard: runtime.leaderboard,
      totalPlayers: runtime.leaderboard.length,
      totalQuestions: runtime.questions.length,
      finishedAt: new Date().toISOString(),
    };

    runtime.gameFinishedPayload = finishedPayload;

    this.emitRoomState(runtime.roomCode);
    this.realtime.emitToRoom(runtime.roomCode, 'game.finished', finishedPayload);
    return finishedPayload;
  }

  public resetToWaitingRoom(roomCode = 'KB2026') {
    const runtime = this.getOrCreateRuntime(roomCode);
    this.clearTimers(runtime);
    runtime.status = 'WAITING';
    runtime.phase = 'WAITING_ROOM';
    runtime.sessionId = null;
    runtime.questions = [];
    runtime.currentQuestionIndex = -1;
    runtime.isQuestionOpen = false;
    runtime.remainingSeconds = 0;
    runtime.answeredCountCurrentQuestion = 0;
    runtime.answeredPlayersCurrentQuestion = [];
    runtime.eliminatedHintOption = null;
    runtime.lastQuestionResult = null;
    runtime.gameFinishedPayload = null;
    runtime.leaderboard = [];
    runtime.playersMap.clear();
    if (runtime.autoCrowdEnabled) {
      this.seedAutoCrowdPopulation(runtime);
    }

    this.db.updateRoomStatus(runtime.roomId, 'WAITING');
    return this.emitRoomState(runtime.roomCode);
  }

  /**
   * Xử lý sự kiện người chơi tham gia hoặc gửi đáp án A/B/C/D (Mục 3.1, 3.2, 3.3, 5.3)
   */
  public handleCommentEvent(
    event: GameEvent,
    normalizedAnswer: OptionLabel | null,
    isJoinCommand: boolean
  ): {
    handled: boolean;
    action: string;
    acceptedAnswer?: boolean;
    reason?: string;
  } {
    const runtime = this.getOrCreateRuntime(event.roomId);

    // Ghi nhận người chơi vào danh sách phòng
    const isNewPlayerInRoom = !runtime.playersMap.has(event.user.id);
    runtime.playersMap.set(event.user.id, {
      id: event.user.id,
      username: event.user.username,
      nickname: event.user.nickname,
      avatarUrl: event.user.avatarUrl,
    });

    if (runtime.sessionId) {
      this.db.upsertPlayer(runtime.sessionId, event.user);
    }

    // Nếu phòng đang ở WAITING và người xem bình luận tham gia / hoặc bất kỳ bình luận nào
    if (runtime.status === 'WAITING' || isJoinCommand) {
      if (isNewPlayerInRoom) {
        this.pushRecentEvent(runtime, {
          id: event.id,
          type: 'JOIN',
          nickname: event.user.nickname,
          username: event.user.username,
          summary: 'đã tham gia phòng chờ!',
        });
        this.emitRoomState(runtime.roomCode);
      }
      if (!normalizedAnswer) {
        return { handled: true, action: 'PLAYER_JOINED' };
      }
    }

    // Nếu bình luận không phải đáp án A/B/C/D
    if (!normalizedAnswer) {
      this.pushRecentEvent(runtime, {
        id: event.id,
        type: 'COMMENT',
        nickname: event.user.nickname,
        username: event.user.username,
        summary: `bình luận: "${(event.payload.content || '').slice(0, 40)}"`,
      });
      return { handled: true, action: 'GENERAL_COMMENT' };
    }

    // Kiểm tra câu hỏi có đang mở và còn hạn ở server hay không (Mục 3.2 & 3.3)
    const serverNow = event.receivedAt || Date.now();
    if (
      runtime.status !== 'PLAYING' ||
      !runtime.sessionId ||
      runtime.currentQuestionIndex < 0
    ) {
      this.pushRecentEvent(runtime, {
        id: event.id,
        type: 'LATE_ANSWER',
        nickname: event.user.nickname,
        username: event.user.username,
        summary: `gửi đáp án ${normalizedAnswer} khi trận đấu chưa mở câu hỏi`,
      });
      return {
        handled: false,
        action: 'ANSWER_REJECTED',
        acceptedAnswer: false,
        reason: 'QUESTION_CLOSED',
      };
    }

    // Khi câu hỏi đã hết thời gian hoặc đã đóng trên server:
    // TUYỆT ĐỐI KHÔNG ghi nhận thêm kết quả để đảm bảo công bằng (tránh nhìn đáp án công bố trên màn hình rồi gõ theo)
    if (!runtime.isQuestionOpen || serverNow > runtime.questionEndsAt) {
      this.pushRecentEvent(runtime, {
        id: event.id,
        type: 'LATE_ANSWER',
        nickname: event.user.nickname,
        username: event.user.username,
        summary: `gửi đáp án ${normalizedAnswer} sau khi câu hỏi đã hết giờ`,
      });
      return {
        handled: false,
        action: 'ANSWER_REJECTED',
        acceptedAnswer: false,
        reason: 'QUESTION_CLOSED',
      };
    }

    const currentQuestion = runtime.questions[runtime.currentQuestionIndex];
    const playerRecord = this.db.upsertPlayer(runtime.sessionId, event.user);
    const timeRemainingMs = Math.max(0, runtime.questionEndsAt - serverNow);

    const recordResult = this.db.recordFirstAnswer({
      sessionId: runtime.sessionId,
      questionId: currentQuestion.questionId,
      playerId: playerRecord.id,
      tiktokUserId: event.user.id,
      selectedOption: normalizedAnswer,
      receivedAt: serverNow,
      timeRemainingMs,
    });

    if (!recordResult.accepted) {
      this.pushRecentEvent(runtime, {
        id: event.id,
        type: 'DUPLICATE_ANSWER',
        nickname: event.user.nickname,
        username: event.user.username,
        summary: `gửi trùng đáp án ${normalizedAnswer}`,
      });
      return {
        handled: false,
        action: 'ANSWER_REJECTED',
        acceptedAnswer: false,
        reason: recordResult.reason || 'ALREADY_ANSWERED',
      };
    }

    if (!recordResult.updatedExisting) {
      runtime.answeredCountCurrentQuestion++;
    }
    if (!runtime.answeredPlayersCurrentQuestion.some((p) => p.playerId === playerRecord.id)) {
      runtime.answeredPlayersCurrentQuestion.push({
        playerId: playerRecord.id,
        nickname: event.user.nickname,
        username: event.user.username,
      });
    }

    this.pushRecentEvent(runtime, {
      id: event.id,
      type: 'ANSWER_LOCKED',
      nickname: event.user.nickname,
      username: event.user.username,
      summary: recordResult.updatedExisting
        ? `đã cập nhật lại đáp án mới!`
        : `đã chốt đáp án thành công!`,
    });

    // Phát sự kiện người chơi vừa chốt đáp án (không lộ đáp án để chống nhìn bài)
    this.realtime.emitToRoom(runtime.roomCode, 'player.answered', {
      playerId: playerRecord.id,
      nickname: event.user.nickname,
      username: event.user.username,
      answeredCount: runtime.answeredCountCurrentQuestion,
      answeredPlayers: runtime.answeredPlayersCurrentQuestion.slice(-30),
      playerCount: runtime.playersMap.size,
    });
    this.emitRoomState(runtime.roomCode);

    return {
      handled: true,
      action: 'ANSWER_ACCEPTED',
      acceptedAnswer: true,
    };
  }

  /**
   * Xử lý sự kiện Quà tặng TikTok (Mục 3.4 & 7.1)
   * Quà tặng thực hiện hành động đã cấu hình: cộng điểm hoặc loại một đáp án sai.
   */
  public handleGiftEvent(event: GameEvent) {
    const runtime = this.getOrCreateRuntime(event.roomId);
    const mappings = this.db.getGiftMappings();

    const matched =
      mappings.find(
        (m) =>
          m.giftId === String(event.payload.giftId) ||
          (event.payload.giftName &&
            m.giftName.toLowerCase().includes(event.payload.giftName.toLowerCase()))
      ) || {
        giftId: event.payload.giftId || 'default',
        giftName: event.payload.giftName || 'Quà tặng TikTok',
        effectType: 'FIREWORKS',
        rewardType: 'POINTS',
        rewardPoints: 100,
        displayMessage: 'đã gửi quà tặng khuấy động sân khấu!',
        durationMs: 4000,
        icon: 'sparkles',
      };

      let giftPoints = 0;
      if (runtime.sessionId) {
        runtime.playersMap.set(event.user.id, {
          id: event.user.id,
          username: event.user.username,
          nickname: event.user.nickname,
          avatarUrl: event.user.avatarUrl,
        });
        const playerRecord = this.db.upsertPlayer(runtime.sessionId, event.user);
        if (matched.rewardType !== 'ELIMINATE_WRONG' && matched.rewardType !== 'NONE') {
          giftPoints = this.db.addGiftPoints(
            runtime.sessionId,
            playerRecord.id,
            matched.rewardPoints ?? 100
          );
          runtime.leaderboard = this.db.getSessionLeaderboard(runtime.sessionId);
          this.realtime.emitToRoom(runtime.roomCode, 'leaderboard.updated', {
            leaderboard: runtime.leaderboard,
            questionIndex: runtime.currentQuestionIndex + 1,
            totalQuestions: runtime.questions.length,
          });
        }
      }

    // SHARED_HINT vẫn được hỗ trợ để tương thích cấu hình cũ.
    let sharedHintEliminated: OptionLabel | null = null;
    if (
      (matched.rewardType === 'ELIMINATE_WRONG' || matched.effectType === 'SHARED_HINT') &&
      runtime.isQuestionOpen &&
      runtime.currentQuestionIndex >= 0
    ) {
      const q = runtime.questions[runtime.currentQuestionIndex];
      const wrongOptions = (['A', 'B', 'C', 'D'] as OptionLabel[]).filter(
        (opt) => opt !== q.correctOption
      );
      sharedHintEliminated =
        runtime.eliminatedHintOption ||
        wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
      runtime.eliminatedHintOption = sharedHintEliminated;
    }

    const animationPayload = {
      id: event.id,
      user: event.user,
      giftId: matched.giftId,
      giftName: event.payload.giftName || matched.giftName,
      repeatCount: event.payload.repeatCount || 1,
      effectType: matched.effectType,
      displayMessage: matched.displayMessage,
      durationMs: matched.durationMs,
      icon: matched.icon,
      eliminatedHintOption: sharedHintEliminated,
      giftPoints,
      receivedAt: event.receivedAt,
    };

    this.pushRecentEvent(runtime, {
      id: event.id,
      type: 'GIFT',
      nickname: event.user.nickname,
      username: event.user.username,
      summary: `tặng ${animationPayload.giftName} (${matched.effectType})`,
    });

    this.realtime.emitToRoom(runtime.roomCode, 'gift.animation', animationPayload);
    if (sharedHintEliminated) {
      this.emitRoomState(runtime.roomCode);
    }
    if (giftPoints > 0) {
      this.emitRoomState(runtime.roomCode);
    }

    return animationPayload;
  }

  // =====================================================================
  // CHẾ ĐỘ TỰ ĐỘNG GIẢ LẬP USER RA/VÀO & TỰ CHƠI (50 - 100 NGƯỜI)
  // =====================================================================

  private getAutoBotPool() {
    const firstNames = [
      'Minh', 'Hoàng', 'Thảo', 'Quốc', 'Khánh', 'Tuấn', 'Ngọc', 'Duy', 'Phương', 'Gia',
      'Bảo', 'Thành', 'Linh', 'Hải', 'Anh', 'Cẩm', 'Đức', 'Kiều', 'Quang', 'Mai',
      'Trung', 'Yến', 'Thủy', 'Nam', 'Bích', 'Hoài', 'Việt', 'Nhật', 'Trúc', 'Hương',
    ];
    const lastNames = [
      'Anh 🌸', 'Long ⚡', 'Vy 🎀', 'Bảo 🏆', 'Linh ✨', 'Kiệt 🔥', 'Hân 💎', 'Khánh 🚀',
      'Thảo 🍀', 'Huy ⭐', 'Châu 🎵', 'Đạt 🎯', 'Chi 🍓', 'Trí 🦁', 'Đăng 🌊', 'Tuấn ⚡',
      'Tú 🌺', 'Mạnh 🛡️', 'Oanh 🦋', 'Vinh 👑', 'Phương 🌷', 'Hiếu 🎮', 'Nhi 💖', 'Tiên 🧚',
    ];
    const pool: Array<{ id: string; username: string; nickname: string }> = [];
    for (let i = 1; i <= 120; i++) {
      const fn = firstNames[(i * 7) % firstNames.length];
      const ln = lastNames[(i * 11) % lastNames.length];
      pool.push({
        id: `auto-bot-${i}`,
        username: `user_vn_${1000 + i}`,
        nickname: `${fn} ${ln} #${i}`,
      });
    }
    return pool;
  }

  public seedAutoCrowdPopulation(runtime: ActiveRoomRuntime) {
    const pool = this.getAutoBotPool();
    const min = runtime.autoCrowdMin || 50;
    const max = runtime.autoCrowdMax || 100;
    const targetCount = Math.floor(min + Math.random() * (max - min + 1));

    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, targetCount);

    for (const bot of selected) {
      runtime.playersMap.set(bot.id, bot);
      if (runtime.sessionId) {
        this.db.upsertPlayer(runtime.sessionId, bot);
      }
    }
  }

  public scheduleAutoCrowdAnswersForQuestion(runtime: ActiveRoomRuntime) {
    this.clearAutoCrowdAnswerTimers(runtime);
    if (!runtime.autoCrowdEnabled || !runtime.isQuestionOpen || runtime.currentQuestionIndex < 0) {
      return;
    }

    const q = runtime.questions[runtime.currentQuestionIndex];
    if (!q) return;

    const onlineBots = Array.from(runtime.playersMap.values()).filter((p) =>
      p.id.startsWith('auto-bot-')
    );
    const min = runtime.autoCrowdMin || 50;
    const max = runtime.autoCrowdMax || 100;

    // Nếu số bot trong phòng đang ít hơn min, bổ sung ngay vào phòng
    if (onlineBots.length < min) {
      this.seedAutoCrowdPopulation(runtime);
    }

    const botsToAnswer = Array.from(runtime.playersMap.values())
      .filter((p) => p.id.startsWith('auto-bot-'))
      .slice(0, max);

    const remainingWindowMs = Math.max(
      2500,
      Math.min((q.timeLimit || 20) * 1000 * 0.78, runtime.questionEndsAt - Date.now() - 1200)
    );
    const wrongOptions = (['A', 'B', 'C', 'D'] as OptionLabel[]).filter(
      (opt) => opt !== q.correctOption
    );

    botsToAnswer.forEach((bot) => {
      const delayMs = Math.floor(400 + Math.random() * remainingWindowMs);
      // 62% chọn đáp án đúng, 38% chọn ngẫu nhiên đáp án sai để bảng xếp hạng chân thực
      const pickCorrect = Math.random() < 0.62;
      const choice: OptionLabel = pickCorrect
        ? q.correctOption
        : wrongOptions[Math.floor(Math.random() * wrongOptions.length)];

      const timer = setTimeout(() => {
        if (!runtime.autoCrowdEnabled || !runtime.isQuestionOpen) return;
        this.handleCommentEvent(
          {
            id: `auto-ans-${q.questionId}-${bot.id}`,
            roomId: runtime.roomCode,
            type: 'COMMENT',
            user: bot,
            payload: { content: choice },
            receivedAt: Date.now(),
          },
          choice,
          false
        );
      }, delayMs);

      runtime.autoCrowdAnswerTimers.push(timer);
    });
  }

  public toggleAutoCrowd(
    roomCode = 'KB2026',
    enabled?: boolean,
    minPlayers = 50,
    maxPlayers = 100
  ) {
    const runtime = this.getOrCreateRuntime(roomCode);
    const nextState = enabled !== undefined ? Boolean(enabled) : !runtime.autoCrowdEnabled;

    runtime.autoCrowdEnabled = nextState;
    runtime.autoCrowdMin = Math.max(10, Number(minPlayers) || 50);
    runtime.autoCrowdMax = Math.max(runtime.autoCrowdMin + 5, Number(maxPlayers) || 100);

    if (runtime.autoCrowdJoinTimer) {
      clearInterval(runtime.autoCrowdJoinTimer);
      runtime.autoCrowdJoinTimer = undefined;
    }
    this.clearAutoCrowdAnswerTimers(runtime);

    if (!nextState) {
      // Xóa các auto-bot khỏi phòng chờ khi tắt chế độ tự động
      for (const key of Array.from(runtime.playersMap.keys())) {
        if (key.startsWith('auto-bot-')) {
          runtime.playersMap.delete(key);
        }
      }
      this.emitRoomState(runtime.roomCode);
      return {
        enabled: false,
        playerCount: runtime.playersMap.size,
        minPlayers: runtime.autoCrowdMin,
        maxPlayers: runtime.autoCrowdMax,
      };
    }

    // Bật chế độ tự động: khởi tạo ngay 50-100 user trong phòng
    this.seedAutoCrowdPopulation(runtime);
    this.emitRoomState(runtime.roomCode);

    // Nếu đang ở giữa câu hỏi thì cho các bot trả lời luôn
    if (runtime.isQuestionOpen && runtime.phase === 'QUESTION') {
      this.scheduleAutoCrowdAnswersForQuestion(runtime);
    }

    // Chu kỳ mỗi 3 giây: tự động có user mới vào và user cũ rời phòng, giữ tổng số trong khoảng [50, 100]
    const pool = this.getAutoBotPool();
    runtime.autoCrowdJoinTimer = setInterval(() => {
      if (!runtime.autoCrowdEnabled) return;

      const currentBotIds = Array.from(runtime.playersMap.keys()).filter((k) =>
        k.startsWith('auto-bot-')
      );
      const currentCount = currentBotIds.length;
      const min = runtime.autoCrowdMin;
      const max = runtime.autoCrowdMax;

      // Quyết định số lượng ra / vào
      const leaveCount =
        currentCount > min ? Math.floor(1 + Math.random() * Math.min(5, currentCount - min)) : 0;
      const joinCount =
        currentCount - leaveCount < max
          ? Math.floor(1 + Math.random() * Math.min(6, max - (currentCount - leaveCount)))
          : 0;

      // Cho một số bot rời phòng
      for (let i = 0; i < leaveCount; i++) {
        const idx = Math.floor(Math.random() * currentBotIds.length);
        const botId = currentBotIds[idx];
        if (botId) {
          runtime.playersMap.delete(botId);
          currentBotIds.splice(idx, 1);
        }
      }

      // Cho một số bot mới vào phòng
      const offlineBots = pool.filter((b) => !runtime.playersMap.has(b.id));
      for (let i = 0; i < joinCount && offlineBots.length > 0; i++) {
        const idx = Math.floor(Math.random() * offlineBots.length);
        const bot = offlineBots.splice(idx, 1)[0];
        if (bot) {
          runtime.playersMap.set(bot.id, bot);
          if (runtime.sessionId) {
            this.db.upsertPlayer(runtime.sessionId, bot);
          }
          // Nếu câu hỏi đang mở và còn hơn 2 giây, bot mới vào cũng trả lời luôn!
          if (
            runtime.isQuestionOpen &&
            runtime.phase === 'QUESTION' &&
            runtime.currentQuestionIndex >= 0 &&
            runtime.questionEndsAt - Date.now() > 2000
          ) {
            const q = runtime.questions[runtime.currentQuestionIndex];
            const options: OptionLabel[] = ['A', 'B', 'C', 'D'];
            const choice =
              Math.random() < 0.6
                ? q.correctOption
                : options[Math.floor(Math.random() * options.length)];
            const t = setTimeout(() => {
              if (!runtime.autoCrowdEnabled || !runtime.isQuestionOpen) return;
              this.handleCommentEvent(
                {
                  id: `auto-ans-${q.questionId}-${bot.id}`,
                  roomId: runtime.roomCode,
                  type: 'COMMENT',
                  user: bot,
                  payload: { content: choice },
                  receivedAt: Date.now(),
                },
                choice,
                false
              );
            }, 600 + Math.floor(Math.random() * 1400));
            runtime.autoCrowdAnswerTimers.push(t);
          }
        }
      }

      this.emitRoomState(runtime.roomCode);
    }, 3000);

    return {
      enabled: true,
      playerCount: runtime.playersMap.size,
      minPlayers: runtime.autoCrowdMin,
      maxPlayers: runtime.autoCrowdMax,
    };
  }
}
