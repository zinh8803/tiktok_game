import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { GameEvent, OptionLabel, SessionQuestionSnapshot } from '../common/types';

/**
 * =====================================================================
 * KÉO CO TRI THỨC (Knowledge Tug of War)
 * ---------------------------------------------------------------------
 * Lấy cảm hứng từ các game tương tác "Team Battle / Tug of War" đang
 * thịnh hành trên TikTok LIVE: người xem chia làm 2 đội, bình luận để
 * góp sức kéo dây, tặng quà để kích hoạt kỹ năng đặc biệt.
 *
 * - Miễn phí: comment "1"/"đỏ" hoặc "2"/"xanh" để vào đội,
 *   trả lời A/B/C/D đúng để kéo dây, spam "kéo" để tiếp sức.
 * - Tặng quà: kích hoạt kỹ năng theo giá trị xu (tiếp sức, nhân đôi,
 *   đóng băng đối thủ, siêu bão + gợi ý 50:50).
 *
 * Vị trí dây: -100 (Đội Đỏ thắng) ... 0 ... +100 (Đội Xanh thắng)
 * =====================================================================
 */

export type TugTeam = 'RED' | 'BLUE';
export type TugStatus = 'IDLE' | 'LOBBY' | 'QUESTION' | 'REVEAL' | 'FINISHED';

interface TugPlayer {
  userId: string;
  nickname: string;
  username: string;
  avatarUrl?: string;
  team: TugTeam;
  contribution: number;
  correctCount: number;
  giftCoins: number;
  lastSpamAt: number;
}

interface TugEffectState {
  doubleUntilQuestion: number; // nhân đôi lực kéo câu trả lời đúng tới hết câu index này
  frozenUntil: number; // timestamp đóng băng
}

interface TugRuntime {
  roomCode: string;
  status: TugStatus;
  rope: number;
  questionIndex: number;
  questions: SessionQuestionSnapshot[];
  questionStartedAt: number;
  questionEndsAt: number;
  revealEndsAt: number;
  answers: Map<string, { option: OptionLabel; at: number }>;
  players: Map<string, TugPlayer>;
  effects: Record<TugTeam, TugEffectState>;
  eliminatedOptions: OptionLabel[];
  lastReveal: null | {
    correctOption: OptionLabel;
    explanation: string;
    redCorrect: number;
    blueCorrect: number;
    redPull: number;
    bluePull: number;
    delta: number;
  };
  winner: TugTeam | 'DRAW' | null;
  config: {
    questionCount: number;
    timePerQuestion: number;
    revealSeconds: number;
  };
  timers: NodeJS.Timeout[];
  lastBroadcastAt: number;
  pendingBroadcast: NodeJS.Timeout | null;
  totalGiftCoins: number;
}

export const TUG_GIFT_TIERS = [
  {
    key: 'BOOST',
    minCoins: 1,
    maxCoins: 9,
    icon: '🌹',
    name: 'Tiếp Sức',
    example: 'Hoa hồng, TikTok, GG (1–9 xu)',
    description: 'Kéo ngay +2 lực mỗi xu cho đội của bạn (tối đa +15/lần).',
  },
  {
    key: 'DOUBLE',
    minCoins: 10,
    maxCoins: 98,
    icon: '⚡',
    name: 'Nhân Đôi x2',
    example: 'Kẹo bông, Nước hoa mini… (10–98 xu)',
    description: '+8 lực kéo & nhân đôi lực của mọi câu trả lời đúng của đội trong câu này và câu kế tiếp.',
  },
  {
    key: 'FREEZE',
    minCoins: 99,
    maxCoins: 499,
    icon: '❄️',
    name: 'Đóng Băng Đối Thủ',
    example: 'Mũ cún, Nước hoa, Donut… (99–499 xu)',
    description: '+12 lực kéo & đóng băng đội bạn 10 giây (không thể tiếp sức, câu đúng chỉ tính 50%).',
  },
  {
    key: 'STORM',
    minCoins: 500,
    maxCoins: Number.MAX_SAFE_INTEGER,
    icon: '🌪️',
    name: 'Siêu Bão Tri Thức',
    example: 'Thiên hà, Sư tử, Xe hơi… (500+ xu)',
    description: 'Kéo cực mạnh +30 & mở gợi ý 50:50 loại bỏ 2 đáp án sai cho cả phòng.',
  },
];

@Injectable()
export class TugOfWarService {
  private readonly logger = new Logger(TugOfWarService.name);
  private readonly rooms = new Map<string, TugRuntime>();

  constructor(
    private readonly db: DatabaseService,
    private readonly gateway: RealtimeGateway
  ) {}

  // ===================================================================
  // STATE
  // ===================================================================

  private getRuntime(roomCode: string): TugRuntime {
    const code = (roomCode || 'KB2026').toUpperCase();
    let rt = this.rooms.get(code);
    if (!rt) {
      rt = {
        roomCode: code,
        status: 'IDLE',
        rope: 0,
        questionIndex: -1,
        questions: [],
        questionStartedAt: 0,
        questionEndsAt: 0,
        revealEndsAt: 0,
        answers: new Map(),
        players: new Map(),
        effects: {
          RED: { doubleUntilQuestion: -1, frozenUntil: 0 },
          BLUE: { doubleUntilQuestion: -1, frozenUntil: 0 },
        },
        eliminatedOptions: [],
        lastReveal: null,
        winner: null,
        config: { questionCount: 15, timePerQuestion: 15, revealSeconds: 5 },
        timers: [],
        lastBroadcastAt: 0,
        pendingBroadcast: null,
        totalGiftCoins: 0,
      };
      this.rooms.set(code, rt);
    }
    return rt;
  }

  /** Game kéo co có đang chiếm quyền xử lý bình luận/quà của phòng này không */
  public isActive(roomCode: string): boolean {
    const rt = this.rooms.get((roomCode || '').toUpperCase());
    return !!rt && rt.status !== 'IDLE';
  }

  public getGiftTiers() {
    return TUG_GIFT_TIERS.map((t) => ({
      ...t,
      maxCoins: t.maxCoins === Number.MAX_SAFE_INTEGER ? null : t.maxCoins,
    }));
  }

  public getPublicState(roomCode: string) {
    const rt = this.getRuntime(roomCode);
    const now = Date.now();
    const q = rt.questions[rt.questionIndex];
    const players = Array.from(rt.players.values());
    const red = players.filter((p) => p.team === 'RED');
    const blue = players.filter((p) => p.team === 'BLUE');
    const top = (list: TugPlayer[]) =>
      [...list]
        .sort((a, b) => b.contribution - a.contribution)
        .slice(0, 5)
        .map((p) => ({
          userId: p.userId,
          nickname: p.nickname,
          avatarUrl: p.avatarUrl,
          contribution: Math.round(p.contribution * 10) / 10,
          correctCount: p.correctCount,
          giftCoins: p.giftCoins,
        }));
    const members = (list: TugPlayer[]) =>
      [...list]
        .sort((a, b) => b.contribution - a.contribution)
        .slice(0, 60)
        .map((p) => ({
          userId: p.userId,
          nickname: p.nickname,
          avatarUrl: p.avatarUrl,
          contribution: Math.round(p.contribution * 10) / 10,
        }));
    const mvp = [...players].sort((a, b) => b.contribution - a.contribution)[0];

    const showAnswer = rt.status === 'REVEAL' || rt.status === 'FINISHED';
    return {
      roomCode: rt.roomCode,
      status: rt.status,
      rope: Math.round(rt.rope * 10) / 10,
      serverNow: now,
      config: rt.config,
      questionIndex: rt.questionIndex,
      totalQuestions: rt.questions.length || rt.config.questionCount,
      question: q
        ? {
            index: rt.questionIndex,
            content: q.content,
            options: q.options,
            difficulty: q.difficulty,
            categoryName: q.categoryName,
            startedAt: rt.questionStartedAt,
            endsAt: rt.questionEndsAt,
            correctOption: showAnswer ? q.correctOption : undefined,
          }
        : null,
      eliminatedOptions: rt.eliminatedOptions,
      revealEndsAt: rt.revealEndsAt,
      lastReveal: showAnswer ? rt.lastReveal : null,
      answeredCount: rt.answers.size,
      teams: {
        RED: {
          count: red.length,
          contribution: Math.round(red.reduce((s, p) => s + p.contribution, 0)),
          doubleActive: rt.effects.RED.doubleUntilQuestion >= rt.questionIndex && rt.questionIndex >= 0,
          frozenUntil: rt.effects.RED.frozenUntil > now ? rt.effects.RED.frozenUntil : 0,
          top: top(red),
          members: members(red),
        },
        BLUE: {
          count: blue.length,
          contribution: Math.round(blue.reduce((s, p) => s + p.contribution, 0)),
          doubleActive: rt.effects.BLUE.doubleUntilQuestion >= rt.questionIndex && rt.questionIndex >= 0,
          frozenUntil: rt.effects.BLUE.frozenUntil > now ? rt.effects.BLUE.frozenUntil : 0,
          top: top(blue),
          members: members(blue),
        },
      },
      mvp: mvp
        ? {
            nickname: mvp.nickname,
            avatarUrl: mvp.avatarUrl,
            team: mvp.team,
            contribution: Math.round(mvp.contribution * 10) / 10,
          }
        : null,
      winner: rt.winner,
      totalGiftCoins: rt.totalGiftCoins,
      giftTiers: this.getGiftTiers(),
    };
  }

  private broadcast(rt: TugRuntime, immediate = false) {
    const now = Date.now();
    const send = () => {
      rt.lastBroadcastAt = Date.now();
      rt.pendingBroadcast = null;
      this.gateway.emitToRoom(rt.roomCode, 'tug.state', this.getPublicState(rt.roomCode));
    };
    if (immediate || now - rt.lastBroadcastAt > 180) {
      if (rt.pendingBroadcast) {
        clearTimeout(rt.pendingBroadcast);
        rt.pendingBroadcast = null;
      }
      send();
      return;
    }
    if (!rt.pendingBroadcast) {
      rt.pendingBroadcast = setTimeout(send, 180);
    }
  }

  private emitEffect(rt: TugRuntime, effect: Record<string, any>) {
    this.gateway.emitToRoom(rt.roomCode, 'tug.effect', { ...effect, at: Date.now() });
  }

  private clearTimers(rt: TugRuntime) {
    rt.timers.forEach((t) => clearTimeout(t));
    rt.timers = [];
  }

  // ===================================================================
  // CONTROL
  // ===================================================================

  public updateConfig(
    roomCode: string,
    cfg: Partial<{ questionCount: number; timePerQuestion: number; revealSeconds: number }>
  ) {
    const rt = this.getRuntime(roomCode);
    rt.config = {
      questionCount: Math.max(3, Math.min(100, Number(cfg.questionCount ?? rt.config.questionCount))),
      timePerQuestion: Math.max(8, Math.min(60, Number(cfg.timePerQuestion ?? rt.config.timePerQuestion))),
      revealSeconds: Math.max(3, Math.min(15, Number(cfg.revealSeconds ?? rt.config.revealSeconds))),
    };
    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode);
  }

  /** Mở sảnh chờ: người xem bắt đầu chọn đội (game kéo co chiếm quyền xử lý bình luận) */
  public openLobby(roomCode: string) {
    const rt = this.getRuntime(roomCode);
    this.clearTimers(rt);
    rt.status = 'LOBBY';
    rt.rope = 0;
    rt.questionIndex = -1;
    rt.questions = [];
    rt.answers.clear();
    rt.players.clear();
    rt.eliminatedOptions = [];
    rt.lastReveal = null;
    rt.winner = null;
    rt.totalGiftCoins = 0;
    rt.effects = {
      RED: { doubleUntilQuestion: -1, frozenUntil: 0 },
      BLUE: { doubleUntilQuestion: -1, frozenUntil: 0 },
    };
    this.broadcast(rt, true);
    this.emitEffect(rt, { kind: 'SYSTEM', message: 'Sảnh chờ đã mở! Comment 1 (Đỏ) hoặc 2 (Xanh) để vào đội!' });
    return this.getPublicState(rt.roomCode);
  }

  public start(roomCode: string) {
    const rt = this.getRuntime(roomCode);
    if (rt.status === 'IDLE' || rt.status === 'FINISHED') {
      // Giữ nguyên người chơi nếu vừa kết thúc trận trước (đấu lại nhanh)
      const keepPlayers = rt.status === 'FINISHED' ? Array.from(rt.players.values()) : [];
      this.openLobby(roomCode);
      keepPlayers.forEach((p) =>
        rt.players.set(p.userId, { ...p, contribution: 0, correctCount: 0, giftCoins: 0, lastSpamAt: 0 })
      );
    }
    this.clearTimers(rt);
    rt.questions = this.db.selectQuestionsForSession({
      roomId: `tug-${rt.roomCode}`,
      difficulty: 'ALL',
      questionCount: rt.config.questionCount,
      timePerQuestion: rt.config.timePerQuestion,
    });
    if (!rt.questions.length) {
      throw new Error('Ngân hàng chưa có câu hỏi PUBLISHED nào để chơi Kéo Co Tri Thức.');
    }
    rt.rope = 0;
    rt.winner = null;
    rt.questionIndex = -1;
    this.emitEffect(rt, { kind: 'SYSTEM', message: '🔔 TRẬN KÉO CO BẮT ĐẦU! Trả lời đúng để kéo dây về đội mình!' });
    rt.timers.push(setTimeout(() => this.nextQuestion(rt.roomCode), 2500));
    rt.status = 'REVEAL';
    rt.revealEndsAt = Date.now() + 2500;
    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode);
  }

  public nextQuestion(roomCode: string) {
    const rt = this.getRuntime(roomCode);
    if (rt.status === 'IDLE' || rt.status === 'LOBBY' || rt.status === 'FINISHED') {
      return this.getPublicState(rt.roomCode);
    }
    if (rt.status === 'QUESTION') {
      // Bỏ qua đếm ngược -> công bố luôn
      return this.reveal(roomCode);
    }
    this.clearTimers(rt);
    const nextIdx = rt.questionIndex + 1;
    if (nextIdx >= rt.questions.length) {
      return this.finish(roomCode);
    }
    rt.questionIndex = nextIdx;
    rt.answers.clear();
    rt.eliminatedOptions = [];
    rt.lastReveal = null;
    rt.status = 'QUESTION';
    rt.questionStartedAt = Date.now();
    rt.questionEndsAt = rt.questionStartedAt + rt.config.timePerQuestion * 1000;
    rt.timers.push(setTimeout(() => this.reveal(rt.roomCode), rt.config.timePerQuestion * 1000));
    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode);
  }

  public reveal(roomCode: string) {
    const rt = this.getRuntime(roomCode);
    if (rt.status !== 'QUESTION') return this.getPublicState(rt.roomCode);
    this.clearTimers(rt);
    const q = rt.questions[rt.questionIndex];
    const now = Date.now();
    const duration = Math.max(1, rt.questionEndsAt - rt.questionStartedAt);

    let redPull = 0;
    let bluePull = 0;
    let redCorrect = 0;
    let blueCorrect = 0;

    rt.answers.forEach((ans, userId) => {
      const player = rt.players.get(userId);
      if (!player || ans.option !== q.correctOption) return;
      const remainRatio = Math.max(0, Math.min(1, (rt.questionEndsAt - ans.at) / duration));
      let pull = 4 + remainRatio * 3; // nhanh hơn kéo mạnh hơn
      const eff = rt.effects[player.team];
      if (eff.doubleUntilQuestion >= rt.questionIndex) pull *= 2;
      if (eff.frozenUntil > ans.at) pull *= 0.5;
      player.contribution += pull;
      player.correctCount += 1;
      if (player.team === 'RED') {
        redPull += pull;
        redCorrect += 1;
      } else {
        bluePull += pull;
        blueCorrect += 1;
      }
    });

    // Chênh lệch lực kéo, giới hạn mỗi câu để trận đấu không kết thúc quá nhanh
    const rawDelta = bluePull - redPull;
    const delta = Math.max(-35, Math.min(35, rawDelta));
    rt.rope = Math.max(-100, Math.min(100, rt.rope + delta));

    rt.lastReveal = {
      correctOption: q.correctOption,
      explanation: q.explanation,
      redCorrect,
      blueCorrect,
      redPull: Math.round(redPull * 10) / 10,
      bluePull: Math.round(bluePull * 10) / 10,
      delta: Math.round(delta * 10) / 10,
    };
    rt.status = 'REVEAL';
    rt.revealEndsAt = now + rt.config.revealSeconds * 1000;
    this.broadcast(rt, true);

    if (Math.abs(rt.rope) >= 100) {
      rt.timers.push(setTimeout(() => this.finish(rt.roomCode), 2500));
    } else {
      rt.timers.push(setTimeout(() => this.nextQuestion(rt.roomCode), rt.config.revealSeconds * 1000));
    }
    return this.getPublicState(rt.roomCode);
  }

  public finish(roomCode: string) {
    const rt = this.getRuntime(roomCode);
    if (rt.status === 'IDLE') return this.getPublicState(rt.roomCode);
    this.clearTimers(rt);
    rt.status = 'FINISHED';
    if (rt.rope <= -0.5) rt.winner = 'RED';
    else if (rt.rope >= 0.5) rt.winner = 'BLUE';
    else rt.winner = 'DRAW';
    this.broadcast(rt, true);
    this.emitEffect(rt, {
      kind: 'WINNER',
      team: rt.winner,
      message:
        rt.winner === 'DRAW'
          ? '🤝 Hai đội hòa nhau!'
          : `🏆 ĐỘI ${rt.winner === 'RED' ? 'ĐỎ' : 'XANH'} CHIẾN THẮNG!`,
    });
    return this.getPublicState(rt.roomCode);
  }

  /** Đóng game kéo co, trả quyền xử lý bình luận về cho game Trắc nghiệm */
  public stop(roomCode: string) {
    const rt = this.getRuntime(roomCode);
    this.clearTimers(rt);
    rt.status = 'IDLE';
    rt.rope = 0;
    rt.questionIndex = -1;
    rt.questions = [];
    rt.answers.clear();
    rt.players.clear();
    rt.winner = null;
    rt.lastReveal = null;
    rt.eliminatedOptions = [];
    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode);
  }

  // ===================================================================
  // LIVE EVENTS
  // ===================================================================

  private parseTeamCommand(content: string): TugTeam | null {
    const c = content.trim().toLowerCase();
    if (/^(1|#1|đỏ|do|red|đội đỏ|doi do|team đỏ|team do|team 1)$/.test(c)) return 'RED';
    if (/^(2|#2|xanh|blue|đội xanh|doi xanh|team xanh|team 2)$/.test(c)) return 'BLUE';
    return null;
  }

  private isPullSpam(content: string): boolean {
    return /^(kéo+|keo+|k+|go+|kéo đi|keo di|cố lên|co len|💪+)[!\s]*$/i.test(content.trim());
  }

  private ensurePlayer(rt: TugRuntime, event: GameEvent, preferred?: TugTeam | null): TugPlayer {
    let p = rt.players.get(event.user.id);
    if (p) {
      if (event.user.avatarUrl && !p.avatarUrl) p.avatarUrl = event.user.avatarUrl;
      return p;
    }
    let team = preferred || null;
    if (!team) {
      let red = 0;
      let blue = 0;
      rt.players.forEach((pl) => (pl.team === 'RED' ? red++ : blue++));
      team = red <= blue ? 'RED' : 'BLUE';
    }
    p = {
      userId: event.user.id,
      nickname: event.user.nickname || event.user.username,
      username: event.user.username,
      avatarUrl: event.user.avatarUrl,
      team,
      contribution: 0,
      correctCount: 0,
      giftCoins: 0,
      lastSpamAt: 0,
    };
    rt.players.set(p.userId, p);
    this.emitEffect(rt, {
      kind: 'JOIN',
      team,
      nickname: p.nickname,
      avatarUrl: p.avatarUrl,
      message: `${p.nickname} gia nhập Đội ${team === 'RED' ? 'Đỏ' : 'Xanh'}!`,
    });
    return p;
  }

  private applyLivePull(rt: TugRuntime, team: TugTeam, amount: number) {
    const dir = team === 'RED' ? -1 : 1;
    rt.rope = Math.max(-100, Math.min(100, rt.rope + dir * amount));
    if (Math.abs(rt.rope) >= 100 && (rt.status === 'QUESTION' || rt.status === 'REVEAL')) {
      this.clearTimers(rt);
      rt.timers.push(setTimeout(() => this.finish(rt.roomCode), 1200));
    }
  }

  public handleComment(event: GameEvent, answer: OptionLabel | null) {
    const rt = this.getRuntime(event.roomId);
    const content = String(event.payload.content || '');
    const teamCmd = this.parseTeamCommand(content);

    if (teamCmd) {
      const existed = rt.players.has(event.user.id);
      const p = this.ensurePlayer(rt, event, teamCmd);
      this.broadcast(rt);
      return { action: existed ? 'TUG_ALREADY_IN_TEAM' : 'TUG_JOINED', team: p.team };
    }

    if (rt.status === 'QUESTION' && answer) {
      const p = this.ensurePlayer(rt, event);
      if (!rt.answers.has(p.userId)) {
        rt.answers.set(p.userId, { option: answer, at: event.receivedAt || Date.now() });
        this.broadcast(rt);
        return { action: 'TUG_ANSWER_RECORDED', team: p.team, answer };
      }
      return { action: 'TUG_ANSWER_DUPLICATE' };
    }

    if ((rt.status === 'QUESTION' || rt.status === 'REVEAL') && this.isPullSpam(content)) {
      const p = this.ensurePlayer(rt, event);
      const now = Date.now();
      if (now - p.lastSpamAt < 1500) return { action: 'TUG_SPAM_COOLDOWN' };
      if (rt.effects[p.team].frozenUntil > now) return { action: 'TUG_FROZEN' };
      p.lastSpamAt = now;
      p.contribution += 0.5;
      this.applyLivePull(rt, p.team, 0.5);
      this.broadcast(rt);
      return { action: 'TUG_SPAM_PULL', team: p.team };
    }

    if (rt.status === 'LOBBY' && answer) {
      // Trả lời khi chưa bắt đầu -> chỉ gán đội
      this.ensurePlayer(rt, event);
      this.broadcast(rt);
    }
    return { action: 'TUG_IGNORED' };
  }

  public handleGift(event: GameEvent) {
    const rt = this.getRuntime(event.roomId);
    const coins = Math.max(1, Number(event.payload.diamondCount || 1)) * Math.max(1, Number(event.payload.repeatCount || 1));
    const p = this.ensurePlayer(rt, event);
    const now = Date.now();
    const team = p.team;
    const enemy: TugTeam = team === 'RED' ? 'BLUE' : 'RED';
    const tier = TUG_GIFT_TIERS.find((t) => coins >= t.minCoins && coins <= t.maxCoins) || TUG_GIFT_TIERS[0];
    const playing = rt.status === 'QUESTION' || rt.status === 'REVEAL';
    p.giftCoins += coins;
    rt.totalGiftCoins += coins;

    let pull = 0;
    let extra = '';
    if (tier.key === 'BOOST') {
      pull = Math.min(15, coins * 2);
    } else if (tier.key === 'DOUBLE') {
      pull = 8;
      const target = rt.questionIndex < 0 ? 1 : rt.questionIndex + 1;
      rt.effects[team].doubleUntilQuestion = Math.max(rt.effects[team].doubleUntilQuestion, target);
      extra = 'Lực trả lời đúng x2 trong 2 câu!';
    } else if (tier.key === 'FREEZE') {
      pull = 12;
      rt.effects[enemy].frozenUntil = Math.max(rt.effects[enemy].frozenUntil, now) + 10000;
      extra = `Đội ${enemy === 'RED' ? 'Đỏ' : 'Xanh'} bị đóng băng 10 giây!`;
    } else {
      pull = 30;
      if (rt.status === 'QUESTION') {
        const q = rt.questions[rt.questionIndex];
        const wrong = (['A', 'B', 'C', 'D'] as OptionLabel[]).filter(
          (l) => l !== q.correctOption && !rt.eliminatedOptions.includes(l)
        );
        const shuffled = wrong.sort(() => Math.random() - 0.5);
        rt.eliminatedOptions = [...rt.eliminatedOptions, ...shuffled.slice(0, 2)].slice(0, 2);
        extra = 'Mở gợi ý 50:50 cho cả phòng!';
      } else {
        extra = 'Siêu kéo +30!';
      }
    }

    if (playing) {
      p.contribution += pull;
      this.applyLivePull(rt, team, pull);
    }

    this.emitEffect(rt, {
      kind: 'GIFT',
      tier: tier.key,
      icon: tier.icon,
      tierName: tier.name,
      team,
      nickname: p.nickname,
      avatarUrl: p.avatarUrl,
      giftName: event.payload.giftName || 'Quà tặng',
      coins,
      pull: playing ? pull : 0,
      message: `${p.nickname} tặng ${event.payload.giftName || 'quà'} → ${tier.icon} ${tier.name}${
        playing ? ` (+${pull} lực kéo)` : ''
      }${extra ? ' · ' + extra : ''}`,
    });
    this.broadcast(rt, true);
    return { action: 'TUG_GIFT', tier: tier.key, team, pull };
  }

  // ===================================================================
  // SIMULATOR (Kiểm thử không cần LIVE thật)
  // ===================================================================

  private simCounter = 0;

  public simulate(
    roomCode: string,
    kind: 'JOIN_RED' | 'JOIN_BLUE' | 'CROWD' | 'ANSWER_WAVE' | 'SPAM' | 'GIFT',
    opts: { coins?: number; team?: TugTeam; count?: number } = {}
  ) {
    const rt = this.getRuntime(roomCode);
    const names = [
      'Minh Anh 🌸', 'Hoàng Long ⚡', 'Thảo Vy 🎀', 'Quốc Bảo 🏆', 'Khánh Linh ✨', 'Đức Huy 🔥',
      'Ngọc Hân 💎', 'Tuấn Kiệt 🚀', 'Bảo Trâm 🌙', 'Gia Hưng 🎯', 'Mai Phương 🍀', 'Trọng Nhân 🐉',
    ];
    const mkEvent = (i: number, content: string): GameEvent => {
      const idx = i % names.length;
      return {
        id: `tug-sim-${Date.now()}-${++this.simCounter}`,
        roomId: rt.roomCode,
        type: 'COMMENT',
        user: {
          id: `tug-sim-user-${idx}-${Math.floor(i / names.length)}`,
          username: `viewer_${idx}_${Math.floor(i / names.length)}`,
          nickname: names[idx] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ''),
          avatarUrl: `https://api.dicebear.com/7.x/thumbs/svg?seed=tug${idx}${Math.floor(i / names.length)}`,
        },
        payload: { content },
        receivedAt: Date.now(),
      };
    };

    if (kind === 'JOIN_RED' || kind === 'JOIN_BLUE') {
      const n = opts.count || 3;
      const base = rt.players.size;
      for (let i = 0; i < n; i++) this.handleComment(mkEvent(base + i, kind === 'JOIN_RED' ? '1' : '2'), null);
    } else if (kind === 'CROWD') {
      const n = opts.count || 16;
      const base = rt.players.size;
      for (let i = 0; i < n; i++) this.handleComment(mkEvent(base + i, i % 2 === 0 ? '1' : '2'), null);
    } else if (kind === 'ANSWER_WAVE') {
      const q = rt.questions[rt.questionIndex];
      if (rt.status === 'QUESTION' && q) {
        Array.from(rt.players.values()).forEach((p, i) => {
          const correct = Math.random() < 0.6;
          const opt = correct
            ? q.correctOption
            : (['A', 'B', 'C', 'D'] as OptionLabel[]).filter((l) => l !== q.correctOption)[i % 3];
          const ev = mkEvent(i, opt);
          ev.user = { id: p.userId, username: p.username, nickname: p.nickname, avatarUrl: p.avatarUrl };
          ev.receivedAt = Date.now() - Math.floor(Math.random() * 3000);
          this.handleComment(ev, opt);
        });
      }
    } else if (kind === 'SPAM') {
      Array.from(rt.players.values()).forEach((p, i) => {
        const ev = mkEvent(i, 'kéo');
        ev.user = { id: p.userId, username: p.username, nickname: p.nickname, avatarUrl: p.avatarUrl };
        this.handleComment(ev, null);
      });
    } else if (kind === 'GIFT') {
      const coins = opts.coins || 1;
      const candidates = Array.from(rt.players.values()).filter((p) => !opts.team || p.team === opts.team);
      const picked = candidates[Math.floor(Math.random() * candidates.length)];
      const giftNames: Record<string, string> = { '1': 'Hoa Hồng', '30': 'Donut', '199': 'Mũ Cún', '1000': 'Thiên Hà' };
      const ev = mkEvent(rt.players.size, '');
      if (picked) {
        ev.user = { id: picked.userId, username: picked.username, nickname: picked.nickname, avatarUrl: picked.avatarUrl };
      }
      ev.type = 'GIFT';
      ev.payload = { giftName: giftNames[String(coins)] || 'Quà tặng', diamondCount: coins, repeatCount: 1 };
      this.handleGift(ev);
    }
    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode);
  }
}
