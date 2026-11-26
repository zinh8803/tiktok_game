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
  questionHardCloseAt: number;
  remainingSeconds: number;
  answeredCountCurrentQuestion: number;
  answeredPlayersCurrentQuestion: Array<{
    playerId: string;
    nickname: string;
    username: string;
  }>;
  eliminatedHintOption: OptionLabel | null;
  eliminatedOptions: OptionLabel[];
  heartCountPhase: number;
  totalLikesReceived: number;
  isDoublePoints: boolean;
  goldenQuestionActive: boolean;
  lastLikeProgressBroadcastAt?: number;
  playersMap: Map<string, { id: string; username: string; nickname: string; avatarUrl?: string }>;
  sessionPlayersCache: Map<
    string,
    { id: string; tiktokUserId: string; username: string; nickname: string }
  >;
  leaderboard: LeaderboardEntry[];
  lastQuestionResult: any | null;
  gameFinishedPayload: any | null;
  timerInterval?: NodeJS.Timeout;
  phaseTimeout?: NodeJS.Timeout;
  coalescedBroadcastTimer?: NodeJS.Timeout;
  pendingBroadcastFlags?: {
    roomState?: boolean;
    playerAnswered?: {
      playerId: string;
      nickname: string;
      username: string;
    };
    questionResult?: boolean;
    leaderboardUpdated?: boolean;
  };
  lastActivityFeedEmitAt?: number;
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

/**
 * Độ trễ bù trừ cho luồng phát TikTok LIVE:
 * - SERVER_CLOSE_GRACE_MS (1800ms): Giữ cổng nhận đáp án mở thêm 1.8s sau khi đồng hồ đếm về 0s
 *   trước khi chốt bảng điểm lần đầu.
 * - LATE_STREAM_GRACE_MS (8500ms): Cho phép người xem bị trễ sóng TikTok LIVE (2-7 giây)
 *   vẫn được tính đáp án đầu tiên của họ khi server đang ở pha ANSWER_REVEAL / LEADERBOARD.
 */
const SERVER_CLOSE_GRACE_MS = 1800;
const LATE_STREAM_GRACE_MS = 8500;

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
      questionHardCloseAt: 0,
      remainingSeconds: 0,
      answeredCountCurrentQuestion: 0,
      answeredPlayersCurrentQuestion: [],
      eliminatedHintOption: null,
      eliminatedOptions: [],
      heartCountPhase: 0,
      totalLikesReceived: 0,
      isDoublePoints: false,
      goldenQuestionActive: false,
      playersMap: new Map(),
      sessionPlayersCache: new Map(),
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

  private getOrUpsertSessionPlayer(
    runtime: ActiveRoomRuntime,
    user: { id: string; username: string; nickname: string; avatarUrl?: string }
  ) {
    if (!runtime.sessionId) {
      throw new Error('No active sessionId');
    }
    const cached = runtime.sessionPlayersCache.get(user.id);
    if (cached && cached.nickname === user.nickname && cached.username === user.username) {
      return cached;
    }
    const record = this.db.upsertPlayer(runtime.sessionId, user);
    runtime.sessionPlayersCache.set(user.id, record);
    return record;
  }

  private flushCoalescedBroadcast(runtime: ActiveRoomRuntime) {
    if (runtime.coalescedBroadcastTimer) {
      clearTimeout(runtime.coalescedBroadcastTimer);
      runtime.coalescedBroadcastTimer = undefined;
    }
    const flags = runtime.pendingBroadcastFlags;
    if (!flags) return;
    runtime.pendingBroadcastFlags = undefined;

    if (flags.playerAnswered) {
      this.realtime.emitToRoom(runtime.roomCode, 'player.answered', {
        ...flags.playerAnswered,
        answeredCount: runtime.answeredCountCurrentQuestion,
        answeredPlayers: runtime.answeredPlayersCurrentQuestion.slice(-30),
        playerCount: runtime.playersMap.size,
      });
    }
    if (flags.questionResult && runtime.lastQuestionResult) {
      this.realtime.emitToRoom(runtime.roomCode, 'question.result', runtime.lastQuestionResult);
    }
    if (flags.leaderboardUpdated) {
      this.realtime.emitToRoom(runtime.roomCode, 'leaderboard.updated', {
        leaderboard: runtime.leaderboard,
        questionIndex: runtime.currentQuestionIndex + 1,
        totalQuestions: runtime.questions.length,
      });
    }
    if (flags.roomState) {
      this.emitRoomState(runtime.roomCode);
    }
  }

  private scheduleCoalescedBroadcast(
    runtime: ActiveRoomRuntime,
    flags: NonNullable<ActiveRoomRuntime['pendingBroadcastFlags']>,
    delayMs = 60
  ) {
    runtime.pendingBroadcastFlags = {
      ...runtime.pendingBroadcastFlags,
      ...flags,
    };
    if (runtime.coalescedBroadcastTimer) {
      return;
    }
    runtime.coalescedBroadcastTimer = setTimeout(() => {
      this.flushCoalescedBroadcast(runtime);
    }, delayMs);
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
    this.flushCoalescedBroadcast(runtime);
    this.clearAutoCrowdAnswerTimers(runtime);
  }

  public pushRecentEvent(
    runtime: ActiveRoomRuntime,
    entry: { id: string; type: string; nickname: string; username: string; summary: string }
  ) {
    const now = Date.now();
    runtime.recentEvents.unshift({
      ...entry,
      timestamp: now,
    });
    if (runtime.recentEvents.length > 40) {
      runtime.recentEvents.length = 40;
    }
    // Throttle phát lẻ activity.feed khi có hàng chục user comment cùng lúc để chống nghẽn Socket.IO
    if (!runtime.lastActivityFeedEmitAt || now - runtime.lastActivityFeedEmitAt >= 100) {
      runtime.lastActivityFeedEmitAt = now;
      this.realtime.emitToRoom(runtime.roomCode, 'activity.feed', runtime.recentEvents[0]);
    }
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
      eliminatedOptions: runtime.eliminatedOptions,
      heartProgress: {
        current: runtime.heartCountPhase,
        target: 500,
        total: runtime.totalLikesReceived,
      },
      isDoublePoints: runtime.isDoublePoints,
      goldenQuestionActive: runtime.goldenQuestionActive,
      autoCrowd: {
        enabled: runtime.autoCrowdEnabled,
        minPlayers: runtime.autoCrowdMin,
        maxPlayers: runtime.autoCrowdMax,
      },
      config: roomRecord?.config,
      randomPoolStats: this.db.getRoomRandomPoolStats(runtime.roomCode),
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
    let streamerActiveQuestion: any = null;
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
        options: q.options, // Tuyệt đối không có correctOption gửi cho người chơi OBS
        duration: q.timeLimit,
        remainingSeconds: Math.ceil(remainingMs / 1000),
        endsAt: runtime.questionEndsAt,
        answeredCount: runtime.answeredCountCurrentQuestion,
        eliminatedHintOption: runtime.eliminatedHintOption,
        eliminatedOptions: runtime.eliminatedOptions,
        isDoublePoints: runtime.isDoublePoints,
        goldenQuestionActive: runtime.goldenQuestionActive,
      };

      // Bản dành riêng cho Streamer Dashboard / Admin có sẵn đáp án đúng
      streamerActiveQuestion = {
        ...activeQuestion,
        correctOption: q.correctOption,
        explanation: q.explanation,
      };
    }

    return {
      roomState,
      activeQuestion,
      streamerActiveQuestion,
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
      easyRatio: roomRecord.config.easyRatio,
      mediumRatio: roomRecord.config.mediumRatio,
      hardRatio: roomRecord.config.hardRatio,
      randomMode: roomRecord.config.randomMode,
      antiRepeat: roomRecord.config.antiRepeat,
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
    runtime.eliminatedOptions = [];
    // KHÔNG reset số tim tích lũy (heartCountPhase & totalLikesReceived) để cộng dồn liên tục suốt phiên LIVE
    runtime.isDoublePoints = false;
    runtime.goldenQuestionActive = false;
    runtime.lastQuestionResult = null;
    runtime.gameFinishedPayload = null;
    runtime.leaderboard = [];
    runtime.sessionPlayersCache.clear();

    // Đăng ký tất cả người chơi đang có trong phòng chờ vào session mới
    for (const plr of runtime.playersMap.values()) {
      this.getOrUpsertSessionPlayer(runtime, plr);
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
    runtime.questionHardCloseAt = runtime.questionEndsAt + SERVER_CLOSE_GRACE_MS;
    runtime.remainingSeconds = durationSec;
    runtime.answeredCountCurrentQuestion = 0;
    runtime.answeredPlayersCurrentQuestion = [];
    runtime.eliminatedHintOption = null;
    runtime.eliminatedOptions = [];
    // KHÔNG reset runtime.heartCountPhase về 0 - Giữ nguyên số tim tích lũy cộng dồn qua các câu hỏi
    if (runtime.goldenQuestionActive) {
      runtime.isDoublePoints = true;
      runtime.goldenQuestionActive = false;
    } else {
      runtime.isDoublePoints = false;
    }

    // Nếu số tim tích lũy dồn từ câu trước đã đủ từ 500 tim trở lên, tự động kích hoạt quyền lợi cho câu mới
    while (runtime.heartCountPhase >= 500 && runtime.eliminatedOptions.length < 2) {
      const availableWrong = (['A', 'B', 'C', 'D'] as OptionLabel[]).filter(
        (opt) => opt !== q.correctOption && !runtime.eliminatedOptions.includes(opt)
      );
      if (availableWrong.length > 0) {
        const eliminated = availableWrong[Math.floor(Math.random() * availableWrong.length)];
        runtime.eliminatedOptions.push(eliminated);
        runtime.eliminatedHintOption = eliminated;
        runtime.heartCountPhase -= 500;
        if (runtime.eliminatedOptions.length === 2) {
          runtime.isDoublePoints = true;
        }
      } else {
        break;
      }
    }

    runtime.lastQuestionResult = null;

    if (runtime.sessionId) {
      this.db.updateSessionProgress(runtime.sessionId, index, 'PLAYING');
    }
    this.db.markQuestionAsAsked(runtime.roomId, q.questionId, q.content);
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
      eliminatedOptions: runtime.eliminatedOptions,
      isDoublePoints: runtime.isDoublePoints,
    };

    // Bản dành riêng cho Dashboard Streamer / Admin (chứa đáp án đúng để MC biết trước khi live)
    const streamerQuestionPayload = {
      ...questionStartedPayload,
      correctOption: q.correctOption,
      explanation: q.explanation,
    };

    this.emitRoomState(runtime.roomCode);
    this.realtime.emitToRoom(runtime.roomCode, 'question.started', questionStartedPayload);
    this.realtime.emitToRoom(runtime.roomCode, 'streamer.question.started', streamerQuestionPayload);

    if (runtime.autoCrowdEnabled) {
      this.scheduleAutoCrowdAnswersForQuestion(runtime);
    }

    // Bộ đếm thời gian ở backend chỉ phát question.timer khi số giây thay đổi (1 lần/giây thay vì 4 lần/giây)
    // Và giữ thêm SERVER_CLOSE_GRACE_MS sau khi về 0s để bù trễ mạng cho các bình luận giây cuối
    runtime.timerInterval = setInterval(() => {
      const nowTick = Date.now();
      const remainingMs = Math.max(0, runtime.questionEndsAt - nowTick);
      const remainingSec = Math.ceil(remainingMs / 1000);

      if (remainingSec !== runtime.remainingSeconds) {
        runtime.remainingSeconds = remainingSec;
        this.realtime.emitToRoom(runtime.roomCode, 'question.timer', {
          questionId: q.questionId,
          questionIndex: index + 1,
          remainingSeconds: remainingSec,
          remainingMs,
          duration: durationSec,
          endsAt: runtime.questionEndsAt,
        });
      }

      if (nowTick >= runtime.questionHardCloseAt) {
        this.closeAndGradeCurrentQuestion(runtime.roomCode);
      }
    }, 200);

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
    const pointMultiplier = runtime.isDoublePoints ? 2 : 1;
    const gradeStats = this.db.gradeQuestionInTransaction({
      sessionId: runtime.sessionId,
      questionId: q.questionId,
      correctOption: q.correctOption,
      timeLimitSec: q.timeLimit,
      pointMultiplier,
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

    // Sau khi chơi xong hiển thị bảng thành tích (VICTORY) rồi 5s sau quay lại sảnh chờ
    runtime.phaseTimeout = setTimeout(() => {
      if (runtime.status === 'FINISHED') {
        this.resetToWaitingRoom(runtime.roomCode);
      }
    }, 5000);

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
    runtime.eliminatedOptions = [];
    // KHÔNG reset số tim tích lũy (heartCountPhase & totalLikesReceived) để cộng dồn liên tục suốt phiên LIVE
    runtime.isDoublePoints = false;
    runtime.goldenQuestionActive = false;
    runtime.lastQuestionResult = null;
    runtime.gameFinishedPayload = null;
    runtime.leaderboard = [];
    runtime.playersMap.clear();
    runtime.sessionPlayersCache.clear();
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
    isJoinCommand: boolean,
    isStartCommand = false
  ): {
    handled: boolean;
    action: string;
    acceptedAnswer?: boolean;
    reason?: string;
  } {
    const runtime = this.getOrCreateRuntime(event.roomId);

    // Nếu chỉ là sự kiện vào xem live thụ động (JOIN) khi đang PLAYING thì không ghi DB để tránh nghẽn
    if (event.type === 'JOIN' && runtime.status === 'PLAYING' && !normalizedAnswer && !isStartCommand) {
      if (!runtime.playersMap.has(event.user.id)) {
        runtime.playersMap.set(event.user.id, {
          id: event.user.id,
          username: event.user.username,
          nickname: event.user.nickname,
          avatarUrl: event.user.avatarUrl,
        });
      }
      return { handled: true, action: 'PLAYER_JOINED_SILENT' };
    }

    // Ghi nhận người chơi vào danh sách phòng
    const isNewPlayerInRoom = !runtime.playersMap.has(event.user.id);
    runtime.playersMap.set(event.user.id, {
      id: event.user.id,
      username: event.user.username,
      nickname: event.user.nickname,
      avatarUrl: event.user.avatarUrl,
    });

    // Nếu phòng đang ở sảnh chờ (WAITING) hoặc vừa kết thúc (FINISHED) và có người bình luận "SS" / "sẵn sàng" / "start"
    if ((runtime.status === 'WAITING' || runtime.status === 'FINISHED') && isStartCommand) {
      this.pushRecentEvent(runtime, {
        id: event.id,
        type: 'START',
        nickname: event.user.nickname,
        username: event.user.username,
        summary: "bình luận 'SS' - Kích hoạt bắt đầu trận đấu!",
      });
      try {
        this.startMatch(runtime.roomCode);
        return { handled: true, action: 'MATCH_STARTED_BY_COMMENT' };
      } catch (err: any) {
        this.logger.error(`Lỗi khi bắt đầu trận bằng lệnh SS: ${err?.message}`);
      }
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
        this.scheduleCoalescedBroadcast(runtime, { roomState: true });
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

    const currentQuestion = runtime.questions[runtime.currentQuestionIndex];
    const playerRecord = this.getOrUpsertSessionPlayer(runtime, event.user);

    // Xử lý bù độ trễ phát sóng TikTok LIVE (TikTok Studio nhanh hơn điện thoại người xem 2-6 giây):
    // Nếu câu hỏi trên server vừa chuyển sang ANSWER_REVEAL hoặc LEADERBOARD nhưng vẫn trong cửa sổ
    // bù trễ LATE_STREAM_GRACE_MS (8.5s) và người chơi này CHƯA trả lời câu hiện tại lần nào,
    // hệ thống vẫn ghi nhận và chấm điểm ngay lập tức (nhưng tuyệt đối không cho phép đổi đáp án nếu đã trả lời trước đó).
    if (!runtime.isQuestionOpen) {
      const canAcceptLateStreamAnswer =
        (runtime.phase === 'ANSWER_REVEAL' || runtime.phase === 'LEADERBOARD') &&
        serverNow <= runtime.questionEndsAt + LATE_STREAM_GRACE_MS;

      if (canAcceptLateStreamAnswer) {
        const lateResult = this.db.recordAndGradeLateStreamAnswer({
          sessionId: runtime.sessionId,
          questionId: currentQuestion.questionId,
          playerId: playerRecord.id,
          tiktokUserId: event.user.id,
          selectedOption: normalizedAnswer,
          correctOption: currentQuestion.correctOption,
          receivedAt: serverNow,
        });

        if (lateResult.accepted) {
          runtime.answeredCountCurrentQuestion++;
          if (!runtime.answeredPlayersCurrentQuestion.some((p) => p.playerId === playerRecord.id)) {
            runtime.answeredPlayersCurrentQuestion.push({
              playerId: playerRecord.id,
              nickname: event.user.nickname,
              username: event.user.username,
            });
          }

          if (
            lateResult.summary &&
            runtime.lastQuestionResult &&
            runtime.lastQuestionResult.questionId === currentQuestion.questionId
          ) {
            runtime.lastQuestionResult = {
              ...runtime.lastQuestionResult,
              optionCounts: lateResult.summary.optionCounts,
              correctPlayersCount: lateResult.summary.correctPlayersCount,
              totalAnswersCount: lateResult.summary.totalAnswersCount,
              fastestPlayers: lateResult.summary.fastestPlayers,
              allAnswers: lateResult.summary.allAnswers,
            };
          }

          runtime.leaderboard = this.db.getSessionLeaderboard(
            runtime.sessionId,
            currentQuestion.questionId
          );

          this.pushRecentEvent(runtime, {
            id: event.id,
            type: 'ANSWER_LOCKED',
            nickname: event.user.nickname,
            username: event.user.username,
            summary: `chốt đáp án giây cuối (bù trễ sóng LIVE)!`,
          });

          this.scheduleCoalescedBroadcast(runtime, {
            playerAnswered: {
              playerId: playerRecord.id,
              nickname: event.user.nickname,
              username: event.user.username,
            },
            questionResult: true,
            leaderboardUpdated: true,
            roomState: true,
          });

          return {
            handled: true,
            action: 'LATE_STREAM_ANSWER_ACCEPTED',
            acceptedAnswer: true,
          };
        }

        return {
          handled: false,
          action: 'ANSWER_REJECTED',
          acceptedAnswer: false,
          reason: 'ALREADY_ANSWERED',
        };
      }

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

    // Câu hỏi đang mở (bao gồm cả cửa sổ SERVER_CLOSE_GRACE_MS ở giây cuối):
    // Đảm bảo người chơi trả lời ở giây cuối trên client luôn có tối thiểu 1000ms để được tính điểm tốc độ cơ bản
    const rawRemainingMs = runtime.questionEndsAt - serverNow;
    const timeRemainingMs = Math.max(1000, rawRemainingMs);

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

    // Gom nhóm phát sự kiện (coalesced 60ms) để khi >15-200 người chơi bình luận cùng lúc không làm nghẽn mạng / đơ UI
    this.scheduleCoalescedBroadcast(runtime, {
      playerAnswered: {
        playerId: playerRecord.id,
        nickname: event.user.nickname,
        username: event.user.username,
      },
      roomState: true,
    });

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
        const playerRecord = this.getOrUpsertSessionPlayer(runtime, event.user);
        if (matched.rewardType !== 'ELIMINATE_WRONG' && matched.rewardType !== 'NONE') {
          giftPoints = this.db.addGiftPoints(
            runtime.sessionId,
            playerRecord.id,
            matched.rewardPoints ?? 100
          );
          runtime.leaderboard = this.db.getSessionLeaderboard(runtime.sessionId);
          this.scheduleCoalescedBroadcast(runtime, {
            leaderboardUpdated: true,
            roomState: true,
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
      if (!runtime.eliminatedOptions.includes(sharedHintEliminated)) {
        runtime.eliminatedOptions.push(sharedHintEliminated);
      }
      this.scheduleCoalescedBroadcast(runtime, { roomState: true });
    }

    return animationPayload;
  }

  /**
   * Xử lý sự kiện Thả Tim (LIKE) từ TikTok LIVE:
   * 1. Tích lũy đủ 500 tim/lần khi QUESTION: loại trừ 1 đáp án sai
   * 2. Tích lũy đủ 1000 tim khi QUESTION: loại tiếp đáp án sai thứ 2 (chế độ 50/50) và x2 ĐIỂM SỐ câu hiện tại
   * 3. Khi đang chuyển câu (ANSWER_REVEAL / LEADERBOARD):
   *    - 500 tim: Bỏ qua đếm ngược chờ đợi, chuyển sang câu hỏi tiếp theo ngay lập tức!
   *    - 1000 tim: Bật cờ CÂU HỎI VÀNG (x2 Điểm) cho câu kế tiếp!
   * 4. Khi đang ở sảnh chờ (WAITING_ROOM):
   *    - 500 tim: Kích hoạt đếm ngược bắt đầu trận đấu luôn!
   */
  public handleLikeEvent(event: GameEvent) {
    const runtime = this.getOrCreateRuntime(event.roomId);
    const likeCount = Math.max(1, Number(event.payload.likeCount || 1));

    runtime.totalLikesReceived += likeCount;
    runtime.heartCountPhase += likeCount;

    // Throttle emitting like.progress (tối đa 1 lần mỗi 400ms) để UI mượt mà không nghẽn socket
    const now = Date.now();
    if (!runtime.lastLikeProgressBroadcastAt || now - runtime.lastLikeProgressBroadcastAt >= 400) {
      runtime.lastLikeProgressBroadcastAt = now;
      this.realtime.emitToRoom(runtime.roomCode, 'like.progress', {
        current: runtime.heartCountPhase,
        target: 500,
        total: runtime.totalLikesReceived,
        phase: runtime.phase,
      });
    }

    // --- KỊCH BẢN 1: SẢNH CHỜ (WAITING_ROOM / COUNTDOWN) ---
    // 500 tim: Kích hoạt bắt đầu trận đấu luôn!
    if ((runtime.status === 'WAITING' || runtime.phase === 'WAITING_ROOM') && runtime.heartCountPhase >= 500) {
      runtime.heartCountPhase -= 500;
      this.realtime.emitToRoom(runtime.roomCode, 'like.milestone', {
        type: 'START_MATCH',
        message: '💖 ĐẠT 500 TIM TÍCH LŨY! BẮT ĐẦU TRẬN ĐẤU NGAY LẬP TỨC!',
        totalLikes: runtime.totalLikesReceived,
      });
      this.pushRecentEvent(runtime, {
        id: event.id,
        type: 'LIKE',
        nickname: event.user.nickname,
        username: event.user.username,
        summary: 'thả tim đạt mốc 500 - Kích hoạt bắt đầu trận đấu!',
      });
      try {
        this.startMatch(runtime.roomCode);
      } catch (err: any) {
        this.logger.warn(`Failed to auto-start match on 500 likes: ${err?.message}`);
      }
      return { action: 'START_MATCH_ON_500_LIKES' };
    }

    // --- KỊCH BẢN 2: ĐANG TRONG CÂU HỎI (QUESTION & isQuestionOpen) ---
    // 500 tim lần 1: Loại 1 đáp án sai (trừ 500 tim, số dư còn lại tiếp tục dồn)
    // 500 tim lần 2: Loại tiếp đáp án sai thứ 2 (chế độ 50/50) VÀ x2 Điểm câu hiện tại!
    if (runtime.status === 'PLAYING' && runtime.phase === 'QUESTION' && runtime.isQuestionOpen) {
      const q = runtime.questions[runtime.currentQuestionIndex];
      if (q) {
        // Mốc 1: Chưa loại đáp án nào và tim >= 500 -> Loại 1 đáp án sai, trừ 500 tim
        if (runtime.heartCountPhase >= 500 && runtime.eliminatedOptions.length < 1) {
          const availableWrong = (['A', 'B', 'C', 'D'] as OptionLabel[]).filter(
            (opt) => opt !== q.correctOption && !runtime.eliminatedOptions.includes(opt)
          );
          if (availableWrong.length > 0) {
            const firstEliminated = availableWrong[Math.floor(Math.random() * availableWrong.length)];
            runtime.eliminatedOptions.push(firstEliminated);
            runtime.eliminatedHintOption = firstEliminated;
            runtime.heartCountPhase -= 500;

            this.realtime.emitToRoom(runtime.roomCode, 'like.milestone', {
              type: 'ELIMINATE_WRONG',
              message: `💖 ĐẠT 500 TIM! ĐÃ LOẠI TRỪ ĐÁP ÁN SAI: [ ${firstEliminated} ]!`,
              eliminated: firstEliminated,
              eliminatedOptions: runtime.eliminatedOptions,
              totalLikes: runtime.totalLikesReceived,
            });

            this.pushRecentEvent(runtime, {
              id: event.id,
              type: 'LIKE',
              nickname: event.user.nickname,
              username: event.user.username,
              summary: `thả tim đạt mốc 500 - Đã loại trừ đáp án sai ${firstEliminated}!`,
            });

            this.scheduleCoalescedBroadcast(runtime, { roomState: true });
            return { action: 'ELIMINATE_1_WRONG_ON_500_LIKES', eliminated: firstEliminated };
          }
        }

        // Mốc 2: Đã loại 1 đáp án và tim lại tích lũy đủ tiếp 500 tim nữa -> Loại đáp án thứ 2 (50/50) & x2 điểm
        if (runtime.heartCountPhase >= 500 && runtime.eliminatedOptions.length === 1) {
          const availableWrong = (['A', 'B', 'C', 'D'] as OptionLabel[]).filter(
            (opt) => opt !== q.correctOption && !runtime.eliminatedOptions.includes(opt)
          );
          if (availableWrong.length > 0) {
            const secondEliminated = availableWrong[Math.floor(Math.random() * availableWrong.length)];
            runtime.eliminatedOptions.push(secondEliminated);
            runtime.eliminatedHintOption = secondEliminated;
            runtime.isDoublePoints = true;
            runtime.heartCountPhase -= 500;

            this.realtime.emitToRoom(runtime.roomCode, 'like.milestone', {
              type: '50_50_DOUBLE',
              message: '🔥 ĐẠT TIẾP 500 TIM! CHẾ ĐỘ 50/50 & NHÂN ĐÔI ĐIỂM SỐ KÍCH HOẠT!',
              eliminatedOptions: runtime.eliminatedOptions,
              isDoublePoints: true,
              totalLikes: runtime.totalLikesReceived,
            });

            this.pushRecentEvent(runtime, {
              id: event.id,
              type: 'LIKE',
              nickname: event.user.nickname,
              username: event.user.username,
              summary: `thả tim tích lũy đủ - Kích hoạt 50/50 (loại ${runtime.eliminatedOptions.join(', ')}) & x2 điểm!`,
            });

            this.scheduleCoalescedBroadcast(runtime, { roomState: true });
            return { action: 'ACTIVATE_50_50_DOUBLE' };
          }
        }
      }
    }

    // --- KỊCH BẢN 3: ĐANG CHUYỂN CÂU (ANSWER_REVEAL / LEADERBOARD) ---
    // 500 tim: Bỏ qua đếm ngược chờ đợi, chuyển sang câu hỏi tiếp theo ngay lập tức!
    // 1000 tim: Kích hoạt CÂU HỎI VÀNG (x2 Điểm) cho câu kế tiếp!
    if (runtime.status === 'PLAYING' && (runtime.phase === 'ANSWER_REVEAL' || runtime.phase === 'LEADERBOARD')) {
      if (runtime.heartCountPhase >= 500) {
        if (runtime.phaseTimeout) {
          clearTimeout(runtime.phaseTimeout);
          runtime.phaseTimeout = undefined;
        }

        const isGolden = runtime.heartCountPhase >= 1000;
        if (isGolden) {
          runtime.goldenQuestionActive = true;
          runtime.heartCountPhase -= 1000;
        } else {
          runtime.heartCountPhase -= 500;
        }

        this.realtime.emitToRoom(runtime.roomCode, 'like.milestone', {
          type: 'SKIP_TRANSITION',
          message: isGolden
            ? '✨ ĐẠT 1.000 TIM! CHUYỂN CÂU NGAY & KÍCH HOẠT CÂU HỎI VÀNG (x2 ĐIỂM)!'
            : '⚡ ĐẠT 500 TIM! BỎ QUA CHỜ ĐỢI, VÀO CÂU KẾ TIẾP NGAY LẬP TỨC!',
          goldenQuestion: isGolden,
          totalLikes: runtime.totalLikesReceived,
        });

        this.pushRecentEvent(runtime, {
          id: event.id,
          type: 'LIKE',
          nickname: event.user.nickname,
          username: event.user.username,
          summary: isGolden
            ? 'thả tim đạt 1.000 - Chuyển câu tức thì & bật CÂU HỎI VÀNG (x2 điểm)!'
            : 'thả tim đạt 500 - Bỏ qua thời gian chờ, vào câu tiếp theo!',
        });

        this.nextStep(runtime.roomCode);
        return { action: 'SKIP_TRANSITION_ON_LIKES', goldenQuestion: isGolden };
      }
    }

    return { action: 'LIKE_ACCUMULATED', current: runtime.heartCountPhase };
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
        this.getOrUpsertSessionPlayer(runtime, bot);
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
            this.getOrUpsertSessionPlayer(runtime, bot);
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

      this.scheduleCoalescedBroadcast(runtime, { roomState: true });
    }, 3000);

    return {
      enabled: true,
      playerCount: runtime.playersMap.size,
      minPlayers: runtime.autoCrowdMin,
      maxPlayers: runtime.autoCrowdMax,
    };
  }
}
