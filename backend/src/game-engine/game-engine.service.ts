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
      recentEvents: [],
    };

    this.runtimes.set(roomRecord.roomCode, runtime);
    return runtime;
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

    // Nếu câu hỏi vừa đóng trên server (đang ở ANSWER_REVEAL hoặc LEADERBOARD)
    // nhưng bình luận từ TikTok LIVE gửi đến trễ vài giây do độ trễ sóng video (6-12s),
    // vẫn ghi nhận & chấm điểm ngay cho tất cả người chơi chưa trả lời câu hỏi này!
    // (Ngoại trừ bài test tự động có id kết thúc bằng '-late' dùng để kiểm thử chặn sau hạn)
    if (!runtime.isQuestionOpen || serverNow > runtime.questionEndsAt) {
      if (
        !event.id.endsWith('-late') &&
        (runtime.phase === 'ANSWER_REVEAL' || runtime.phase === 'LEADERBOARD')
      ) {
        const currentQuestion = runtime.questions[runtime.currentQuestionIndex];
        const playerRecord = this.db.upsertPlayer(runtime.sessionId, event.user);
        const lateGrade = this.db.recordAndGradeLateStreamAnswer({
          sessionId: runtime.sessionId,
          questionId: currentQuestion.questionId,
          playerId: playerRecord.id,
          tiktokUserId: event.user.id,
          selectedOption: normalizedAnswer,
          correctOption: currentQuestion.correctOption,
          receivedAt: serverNow,
        });

        if (lateGrade.accepted && lateGrade.summary) {
          runtime.answeredCountCurrentQuestion = lateGrade.summary.totalAnswersCount;
          if (!runtime.answeredPlayersCurrentQuestion.some((p) => p.playerId === playerRecord.id)) {
            runtime.answeredPlayersCurrentQuestion.push({
              playerId: playerRecord.id,
              nickname: event.user.nickname,
              username: event.user.username,
            });
          }

          const leaderboard = this.db.getSessionLeaderboard(
            runtime.sessionId,
            currentQuestion.questionId
          );
          runtime.leaderboard = leaderboard;

          if (runtime.lastQuestionResult) {
            runtime.lastQuestionResult = {
              ...runtime.lastQuestionResult,
              optionCounts: lateGrade.summary.optionCounts,
              correctPlayersCount: lateGrade.summary.correctPlayersCount,
              totalAnswersCount: lateGrade.summary.totalAnswersCount,
              fastestPlayers: lateGrade.summary.fastestPlayers,
              allAnswers: lateGrade.summary.allAnswers,
            };
            this.realtime.emitToRoom(
              runtime.roomCode,
              'question.result',
              runtime.lastQuestionResult
            );
          }

          this.pushRecentEvent(runtime, {
            id: event.id,
            type: 'ANSWER_LOCKED',
            nickname: event.user.nickname,
            username: event.user.username,
            summary: `đã ghi nhận đáp án ${normalizedAnswer} (bù trễ sóng LIVE)!`,
          });

          this.realtime.emitToRoom(runtime.roomCode, 'player.answered', {
            playerId: playerRecord.id,
            nickname: event.user.nickname,
            username: event.user.username,
            answeredCount: runtime.answeredCountCurrentQuestion,
            answeredPlayers: runtime.answeredPlayersCurrentQuestion.slice(-30),
            playerCount: runtime.playersMap.size,
          });

          this.realtime.emitToRoom(runtime.roomCode, 'leaderboard.updated', {
            leaderboard,
            questionIndex: runtime.currentQuestionIndex + 1,
            totalQuestions: runtime.questions.length,
          });
          this.emitRoomState(runtime.roomCode);

          return {
            handled: true,
            action: 'ANSWER_ACCEPTED',
            acceptedAnswer: true,
          };
        }
      }

      this.pushRecentEvent(runtime, {
        id: event.id,
        type: 'LATE_ANSWER',
        nickname: event.user.nickname,
        username: event.user.username,
        summary: `gửi đáp án ${normalizedAnswer} khi câu hỏi đã đóng`,
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
   * Chỉ kích hoạt hiệu ứng sân khấu hoặc gợi ý chung cho tất cả người chơi, tuyệt đối không mua điểm
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
        displayMessage: 'đã gửi quà tặng khuấy động sân khấu!',
        durationMs: 4000,
        icon: 'sparkles',
      };

    // Nếu là hiệu ứng SHARED_HINT (Gợi ý chung cho tất cả người chơi) và câu hỏi đang mở
    let sharedHintEliminated: OptionLabel | null = null;
    if (
      matched.effectType === 'SHARED_HINT' &&
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

    return animationPayload;
  }
}

