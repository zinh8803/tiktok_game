export type RoomStatus =
  | 'WAITING'
  | 'STARTING'
  | 'PLAYING'
  | 'PAUSED'
  | 'FINISHED'
  | 'CANCELLED';

export type QuestionStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'ARCHIVED';

export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type OptionLabel = 'A' | 'B' | 'C' | 'D';

export type TikTokConnectionState =
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'RECONNECTING'
  | 'ERROR';

export type GiftEffectType =
  | 'FIREWORKS'
  | 'STAGE_LIGHTS'
  | 'CHEER_BANNER'
  | 'SHARED_HINT'
  | 'CONFETTI_SHOWER';

export type GiftRewardType = 'POINTS' | 'ELIMINATE_WRONG' | 'NONE';

/**
 * Định dạng sự kiện nội bộ chuẩn hóa (Mục 5.2)
 * Tách biệt hoàn toàn Game Engine khỏi thư viện tiktok-live-connector
 */
export interface GameEvent {
  id: string;
  roomId: string;
  type: 'COMMENT' | 'GIFT' | 'JOIN' | 'LIKE' | 'SHARE';
  user: {
    id: string;
    username: string;
    nickname: string;
    avatarUrl?: string;
  };
  payload: {
    content?: string;
    giftId?: string;
    giftName?: string;
    repeatCount?: number;
    diamondCount?: number;
  };
  receivedAt: number;
}

export interface QuestionOption {
  id: string;
  questionId: string;
  label: OptionLabel;
  content: string;
  isCorrect: boolean;
}

export interface QuestionSource {
  id: string;
  questionId: string;
  sourceType: 'OPEN_TRIVIA_DB' | 'WIKIDATA' | 'WIKIPEDIA' | 'AI' | 'MANUAL';
  sourceUrl?: string;
  license?: string;
  attribution?: string;
}

export interface QuestionRecord {
  id: string;
  categoryId: string;
  categoryName?: string;
  content: string;
  difficulty: QuestionDifficulty;
  questionType: 'MULTIPLE_CHOICE';
  language: string;
  explanation: string;
  topicTags: string[];
  status: QuestionStatus;
  options: QuestionOption[];
  source?: QuestionSource;
  createdBy?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Snapshot câu hỏi lưu trong game_sessions (Mục 4.5 & Mục 9)
 * Giúp chỉnh sửa ngân hàng câu hỏi không ảnh hưởng trận đang diễn ra
 */
export interface SessionQuestionSnapshot {
  questionId: string;
  index: number;
  categoryName: string;
  difficulty: QuestionDifficulty;
  content: string;
  options: Record<OptionLabel, string>;
  correctOption: OptionLabel; // Chỉ tồn tại trên Backend, tuyệt đối không gửi trong question.started
  explanation: string;
  sourceAttribution?: string;
  timeLimit: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  tiktokUserId: string;
  username: string;
  nickname: string;
  avatarUrl?: string;
  totalScore: number;
  correctCount: number;
  answeredCount: number;
  currentStreak: number;
  bestStreak: number;
  lastQuestionDelta?: number;
}
