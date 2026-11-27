import { Injectable, Logger, Optional } from '@nestjs/common';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { DatabaseService } from '../database/database.service';
import { GameEvent } from '../common/types';
import { generateBulkCrosswordQuestionSets } from './crossword-bank';

/**
 * =====================================================================
 * GIẢI MÃ Ô CHỮ — CROSSWORD BATTLE (Hybrid + Progressive + Everyone)
 * ---------------------------------------------------------------------
 * Đặc tả nghiệp vụ đầy đủ từ new-game-feature.md:
 * 1. Cấu trúc ván chơi:
 *    - N hàng ngang (mặc định 5–10 hàng) + 1 Từ khóa bí mật (Keyword).
 *    - Mỗi hàng ngang có 1 câu hỏi, đáp án chính, danh sách đáp án thay thế,
 *      gợi ý (hint), vị trí ký tự đặc biệt (answerPosition, 1-based) tương ứng
 *      với 1 ký tự trong Từ khóa bí mật.
 * 2. Hai trạng thái độc lập (Section 6 & 15.3):
 *    - Trạng thái ván chơi (GameStatus):
 *      IDLE | WAITING | READY | QUESTION_ACTIVE | QUESTION_REVEAL | KEYWORD_ACTIVE | PAUSED | FINISHED
 *    - Trạng thái từng hàng ngang (RowStatus):
 *      LOCKED | ACTIVE | SOLVED | REVEALED | SKIPPED
 * 3. Đoán từ khóa bí mật BẤT CỨ LÚC NÀO (Section 2.4, 5, 8.1, 15.1):
 *    - Người xem có thể bình luận cú pháp "KEYWORD <từ khóa>" (hoặc "TK <từ khóa>",
 *      "TỪ KHÓA <từ khóa>", "KEY <từ khóa>") ở bất kỳ thời điểm nào khi ván đang diễn ra,
 *      hoặc bình luận trực tiếp từ khóa khi đang ở vòng giải mã cuối (KEYWORD_ACTIVE).
 *    - Atomic claim winner: chỉ duy nhất 1 người đầu tiên đoán đúng từ khóa giành
 *      điểm thưởng lớn (+500đ) và kết thúc ván.
 *    - Có cooldown đoán từ khóa (mặc định 5s/người) để chống spam đoán mò.
 * 4. Tính điểm & Bảng xếp hạng (Section 3):
 *    - Trả lời đúng hàng ngang đầu tiên: +100 điểm.
 *    - Trả lời đúng hàng ngang tiếp theo (trước khi hàng đóng): +20 điểm.
 *    - Giải mã đúng từ khóa bí mật: +500 điểm.
 *    - Mỗi người chỉ được cộng điểm 1 lần cho mỗi hàng ngang.
 *    - Hai bảng xếp hạng: Trong ván (matchLeaderboard) và Phiên LIVE (sessionLeaderboard).
 * 5. Bảo mật dữ liệu (Section 10.2 & 15.4):
 *    - Tuyệt đối không gửi đáp án của hàng ngang chưa mở hoặc từ khóa bí mật
 *      xuống client LIVE Overlay.
 * =====================================================================
 */

export type CrosswordGameStatus =
  | 'IDLE'
  | 'WAITING'
  | 'READY'
  | 'QUESTION_ACTIVE'
  | 'QUESTION_REVEAL'
  | 'KEYWORD_ACTIVE'
  | 'PAUSED'
  | 'FINISHED';

export type CrosswordRowStatus = 'LOCKED' | 'ACTIVE' | 'SOLVED' | 'REVEALED' | 'SKIPPED';

export interface CrosswordRowConfig {
  id: string;
  rowNumber: number;
  question: string;
  answer: string; // Đáp án hiển thị (ví dụ: "HÀ NỘI" hoặc "PHP")
  cleanAnswer: string; // Đáp án viết liền không khoảng trắng để dựng ô chữ (ví dụ: "HÀNỘI" hoặc "PHP")
  acceptedAnswers: string[];
  hint: string;
  answerPosition: number; // Vị trí ký tự đặc biệt (1-based trên cleanAnswer)
  keywordIndex: number; // Vị trí ký tự tương ứng trên từ khóa bí mật (1-based)
  timeLimit: number;
  points: number;
}

export interface CrosswordQuestionSet {
  id: string;
  name: string;
  topic: string;
  keyword: string; // Từ khóa hiển thị (ví dụ: "VIỆT NAM" hoặc "LARAVEL")
  cleanKeyword: string; // Từ khóa viết liền không khoảng trắng (ví dụ: "VIỆTNAM" hoặc "LARAVEL")
  keywordHint: string;
  description: string;
  status: 'PUBLISHED' | 'DRAFT';
  rows: CrosswordRowConfig[];
  createdAt: string;
}

export interface CrosswordRowSolver {
  userId: string;
  username: string;
  nickname: string;
  avatarUrl?: string;
  order: number;
  points: number;
  answeredAt: number;
  elapsedMs: number;
}

export interface CrosswordRowRuntime extends CrosswordRowConfig {
  status: CrosswordRowStatus;
  hintUnlocked: boolean;
  startedAt: number;
  endsAt: number;
  firstSolver: CrosswordRowSolver | null;
  solvers: CrosswordRowSolver[];
  solvedUserIds: Set<string>;
}

export interface CrosswordPlayer {
  userId: string;
  username: string;
  nickname: string;
  avatarUrl?: string;
  matchScore: number;
  sessionScore: number;
  rowsSolved: number;
  firstRowCount: number;
  keywordSolved: boolean;
  joinedAt: number;
}

export interface CrosswordKeywordAttempt {
  id: string;
  userId: string;
  nickname: string;
  avatarUrl?: string;
  guess: string;
  isCorrect: boolean;
  at: number;
}

export interface CrosswordConfig {
  timePerRow: number; // Mặc định 20s
  keywordFinalTime: number; // Mặc định 60s
  firstRowPoints: number; // Mặc định 100
  subsequentRowPoints: number; // Mặc định 20
  keywordPoints: number; // Mặc định 500
  keywordCooldownSec: number; // Mặc định 5s
  allowHints: boolean;
  autoRevealRowOnFirstCorrect: boolean; // Nếu bật sẽ tự mở hàng sau khi có người đúng đầu tiên (hoặc chờ hết giờ để người sau kiếm +20đ)
}

interface CrosswordRuntime {
  roomCode: string;
  gameId: string;
  status: CrosswordGameStatus;
  statusBeforePause: CrosswordGameStatus | null;
  remainingMsOnPause: number;
  questionSetId: string;
  questionSetName: string;
  topic: string;
  keyword: string;
  cleanKeyword: string;
  keywordHint: string;
  keywordHintUnlocked: boolean;
  rows: CrosswordRowRuntime[];
  currentRowNumber: number | null;
  revealedKeywordPositions: Set<number>; // 1-based positions on cleanKeyword
  keywordWinner: {
    userId: string;
    username: string;
    nickname: string;
    avatarUrl?: string;
    pointsEarned: number;
    solvedAt: number;
  } | null;
  keywordStartedAt: number;
  keywordEndsAt: number;
  keywordCooldowns: Map<string, number>; // userId -> lastAttemptTimestamp
  recentKeywordAttempts: CrosswordKeywordAttempt[];
  players: Map<string, CrosswordPlayer>;
  config: CrosswordConfig;
  startedAt: number;
  finishedAt: number;
  timers: NodeJS.Timeout[];
  lastBroadcastAt: number;
  pendingBroadcast: NodeJS.Timeout | null;
}

export const DEFAULT_CROSSWORD_SETS: CrosswordQuestionSet[] = [
  {
    id: 'xword-set-tech-01',
    name: 'Công Nghệ & Lập Trình Web',
    topic: 'Công nghệ thông tin',
    keyword: 'PARAS',
    cleanKeyword: 'PARAS',
    keywordHint: 'Từ khóa 5 chữ cái được ghép từ ký tự vàng của 5 công nghệ Backend kinh điển',
    description: 'Bộ ô chữ mẫu chuẩn theo đặc tả kỹ thuật: PHP, API, REDIS, CACHE, MYSQL.',
    status: 'PUBLISHED',
    createdAt: '2026-11-20T08:00:00.000Z',
    rows: [
      {
        id: 'xr-tech-1',
        rowNumber: 1,
        question: 'Ngôn ngữ lập trình phổ biến dùng để phát triển web backend, nổi tiếng với framework Laravel?',
        answer: 'PHP',
        cleanAnswer: 'PHP',
        acceptedAnswers: ['PHP', 'PHP8'],
        hint: 'Ngôn ngữ kịch bản phía server có biểu tượng chú voi màu xanh tím',
        answerPosition: 1, // [P]HP -> P
        keywordIndex: 1,
        timeLimit: 20,
        points: 100,
      },
      {
        id: 'xr-tech-2',
        rowNumber: 2,
        question: 'Viết tắt 3 chữ cái của Giao diện lập trình ứng dụng giúp Frontend và Backend giao tiếp với nhau?',
        answer: 'API',
        cleanAnswer: 'API',
        acceptedAnswers: ['API', 'REST API'],
        hint: 'Application Programming Interface',
        answerPosition: 1, // [A]PI -> A
        keywordIndex: 2,
        timeLimit: 20,
        points: 100,
      },
      {
        id: 'xr-tech-3',
        rowNumber: 3,
        question: 'Hệ quản trị cơ sở dữ liệu lưu trữ trên bộ nhớ RAM cực nhanh, thường dùng làm Cache và Pub/Sub?',
        answer: 'REDIS',
        cleanAnswer: 'REDIS',
        acceptedAnswers: ['REDIS'],
        hint: 'Logo hình khối màu đỏ, bắt đầu bằng chữ R',
        answerPosition: 1, // [R]EDIS -> R
        keywordIndex: 3,
        timeLimit: 20,
        points: 100,
      },
      {
        id: 'xr-tech-4',
        rowNumber: 4,
        question: 'Kỹ thuật lưu trữ dữ liệu tạm thời để tăng tốc độ phản hồi và giảm tải cho Database gọi là gì?',
        answer: 'CACHE',
        cleanAnswer: 'CACHE',
        acceptedAnswers: ['CACHE', 'CACHING'],
        hint: 'Từ tiếng Anh 5 chữ cái bắt đầu bằng chữ C',
        answerPosition: 2, // C[A]CHE -> A
        keywordIndex: 4,
        timeLimit: 20,
        points: 100,
      },
      {
        id: 'xr-tech-5',
        rowNumber: 5,
        question: 'Hệ quản trị cơ sở dữ liệu quan hệ (RDBMS) mã nguồn mở phổ biến nhất thế giới có biểu tượng cá heo?',
        answer: 'MYSQL',
        cleanAnswer: 'MYSQL',
        acceptedAnswers: ['MYSQL', 'MY SQL'],
        hint: '5 chữ cái, ghép từ MY và SQL',
        answerPosition: 3, // MY[S]QL -> S
        keywordIndex: 5,
        timeLimit: 20,
        points: 100,
      },
    ],
  },
  {
    id: 'xword-set-vn-01',
    name: 'Tự Hào Đất Nước Việt Nam',
    topic: 'Địa lý & Lịch sử Việt Nam',
    keyword: 'HÀNỘI',
    cleanKeyword: 'HÀNỘI',
    keywordHint: 'Thủ đô ngàn năm văn hiến, trái tim của cả nước (5 chữ cái)',
    description: 'Khám phá địa danh, di sản và biểu tượng văn hóa Việt Nam để tìm ra từ khóa Thủ đô.',
    status: 'PUBLISHED',
    createdAt: '2026-11-20T09:00:00.000Z',
    rows: [
      {
        id: 'xr-vn-1',
        rowNumber: 1,
        question: 'Vịnh biển kỳ quan thiên nhiên thế giới thuộc tỉnh Quảng Ninh với hàng nghìn đảo đá vôi?',
        answer: 'HẠ LONG',
        cleanAnswer: 'HẠLONG',
        acceptedAnswers: ['HẠ LONG', 'HA LONG', 'VỊNH HẠ LONG', 'VINH HA LONG'],
        hint: 'Nơi rồng đáp xuống theo truyền thuyết',
        answerPosition: 1, // [H]ẠLONG -> H
        keywordIndex: 1,
        timeLimit: 20,
        points: 100,
      },
      {
        id: 'xr-vn-2',
        rowNumber: 2,
        question: 'Thành phố biển miền Trung nổi tiếng với Cầu Rồng phun lửa và Bà Nà Hills?',
        answer: 'ĐÀ NẴNG',
        cleanAnswer: 'ĐÀNẴNG',
        acceptedAnswers: ['ĐÀ NẴNG', 'DA NANG'],
        hint: 'Thành phố đáng sống bên dòng sông Hàn',
        answerPosition: 2, // Đ[À]NẴNG -> À
        keywordIndex: 2,
        timeLimit: 20,
        points: 100,
      },
      {
        id: 'xr-vn-3',
        rowNumber: 3,
        question: 'Đỉnh núi cao 3.143m ở Lào Cai được mệnh danh là "Nóc nhà Đông Dương"?',
        answer: 'FANSIPAN',
        cleanAnswer: 'FANSIPAN',
        acceptedAnswers: ['FANSIPAN', 'PHAN XI PĂNG', 'PHANXIPANG'],
        hint: 'Nằm trên dãy Hoàng Liên Sơn, gần thị xã Sa Pa',
        answerPosition: 3, // FA[N]SIPAN -> N
        keywordIndex: 3,
        timeLimit: 20,
        points: 100,
      },
      {
        id: 'xr-vn-4',
        rowNumber: 4,
        question: 'Phố cổ nổi tiếng ở Quảng Nam lung linh đèn lồng bên dòng sông Hoài?',
        answer: 'HỘI AN',
        cleanAnswer: 'HỘIAN',
        acceptedAnswers: ['HỘI AN', 'HOI AN', 'PHỐ CỔ HỘI AN'],
        hint: 'Di sản văn hóa thế giới có Chùa Cầu',
        answerPosition: 2, // H[Ộ]IAN -> Ộ
        keywordIndex: 4,
        timeLimit: 20,
        points: 100,
      },
      {
        id: 'xr-vn-5',
        rowNumber: 5,
        question: 'Quần đảo tiền tiêu thiêng liêng của Tổ quốc thuộc tỉnh Khánh Hòa?',
        answer: 'TRƯỜNG SA',
        cleanAnswer: 'TRƯỜNGSA',
        acceptedAnswers: ['TRƯỜNG SA', 'TRUONG SA'],
        hint: 'Cùng với Hoàng Sa là hai quần đảo máu thịt của Việt Nam',
        answerPosition: 1, // Lưu ý: chữ cuối của HÀ NỘI là I -> đổi câu 5 có chữ I!
        keywordIndex: 5,
        timeLimit: 20,
        points: 100,
      },
    ],
  },
  {
    id: 'xword-set-food-01',
    name: 'Tinh Hoa Ẩm Thực Việt',
    topic: 'Ẩm thực & Văn hóa',
    keyword: 'PHỞBÒ',
    cleanKeyword: 'PHỞBÒ',
    keywordHint: 'Món ăn quốc hồn quốc túy của Việt Nam nổi tiếng khắp thế giới (5 chữ cái)',
    description: 'Giải mã 5 món đặc sản trứ danh ba miền để mở khóa từ khóa ẩm thực Việt Nam.',
    status: 'PUBLISHED',
    createdAt: '2026-11-20T10:00:00.000Z',
    rows: [
      {
        id: 'xr-food-1',
        rowNumber: 1,
        question: 'Thức uống truyền thống pha bằng dụng cụ nhỏ giọt nhôm hoặc inox của người Việt mỗi buổi sáng?',
        answer: 'CÀ PHÊ',
        cleanAnswer: 'CÀPHÊ',
        acceptedAnswers: ['CÀ PHÊ', 'CA PHE', 'CAFE'],
        hint: 'Thủ phủ của loại hạt này ở Buôn Ma Thuột, Đắk Lắk',
        answerPosition: 3, // CÀ[P]HÊ -> P
        keywordIndex: 1,
        timeLimit: 20,
        points: 100,
      },
      {
        id: 'xr-food-2',
        rowNumber: 2,
        question: 'Món ăn đường phố Việt Nam lọt Top ngon nhất thế giới với lớp vỏ giòn rụm kẹp thịt, pate, rau thơm?',
        answer: 'BÁNH MÌ',
        cleanAnswer: 'BÁNHMÌ',
        acceptedAnswers: ['BÁNH MÌ', 'BANH MI'],
        hint: '6 chữ cái, món ăn sáng quen thuộc của mọi người Việt',
        answerPosition: 4, // BÁN[H]MÌ -> H
        keywordIndex: 2,
        timeLimit: 20,
        points: 100,
      },
      {
        id: 'xr-food-3',
        rowNumber: 3,
        question: 'Món ăn truyền thống của Hà Nội gồm bún ăn kèm thịt nướng than hoa và nước mắm chua ngọt?',
        answer: 'BÚN CHẢ',
        cleanAnswer: 'BÚNCHẢ',
        acceptedAnswers: ['BÚN CHẢ', 'BUN CHA'],
        hint: 'Món ăn Tổng thống Obama từng thưởng thức khi đến Hà Nội',
        answerPosition: 4, // Đổi câu có chữ Ở
        keywordIndex: 3,
        timeLimit: 20,
        points: 100,
      },
      {
        id: 'xr-food-4',
        rowNumber: 4,
        question: 'Loại bánh vuông vức màu xanh gói bằng lá dong không thể thiếu trong dịp Tết Nguyên Đán?',
        answer: 'BÁNH CHƯNG',
        cleanAnswer: 'BÁNHCHƯNG',
        acceptedAnswers: ['BÁNH CHƯNG', 'BANH CHUNG'],
        hint: 'Tượng trưng cho Đất trong truyền thuyết Lang Liêu',
        answerPosition: 1, // [B]ÁNHCHƯNG -> B
        keywordIndex: 4,
        timeLimit: 20,
        points: 100,
      },
      {
        id: 'xr-food-5',
        rowNumber: 5,
        question: 'Món cuốn thanh mát của miền Nam gồm tôm, thịt, bún, rau sống cuộn trong bánh tráng mỏng?',
        answer: 'GỎI CUỐN',
        cleanAnswer: 'GỎICUỐN',
        acceptedAnswers: ['GỎI CUỐN', 'GOI CUON'],
        hint: 'Chấm cùng tương đen hoặc mắm nêm, bắt đầu bằng chữ GỎI',
        answerPosition: 2, // G[Ỏ]ICUỐN -> O
        keywordIndex: 5,
        timeLimit: 20,
        points: 100,
      },
    ],
  },
];

// Chuẩn hóa lại hàng 5 của bộ VN và hàng 3 của bộ Food để khớp tuyệt đối 100% ký tự giao nhau
DEFAULT_CROSSWORD_SETS[1].rows[4] = {
  id: 'xr-vn-5',
  rowNumber: 5,
  question: 'Hòn đảo lớn nhất Việt Nam thuộc tỉnh Kiên Giang, được mệnh danh là Đảo Ngọc?',
  answer: 'PHÚ QUỐC',
  cleanAnswer: 'ĐẢO',
  acceptedAnswers: ['ĐẢO', 'HẢI ĐẢO', 'BIỂN ĐẢO'],
  hint: 'Vùng đất được bao quanh bốn bề là nước biển',
  answerPosition: 1,
  keywordIndex: 5,
  timeLimit: 20,
  points: 100,
};
// Sửa câu 5 của bộ HÀ NỘI (chữ thứ 5 là I):
DEFAULT_CROSSWORD_SETS[1].rows[4] = {
  id: 'xr-vn-5',
  rowNumber: 5,
  question: 'Tên gọi chung của vùng đất Nam Bộ nổi tiếng với chợ nổi và những vườn cây trái trĩu quả?',
  answer: 'MIỀN TÂY',
  cleanAnswer: 'MIỀNTÂY',
  acceptedAnswers: ['MIỀN TÂY', 'MIEN TAY'],
  hint: 'Gồm 13 tỉnh thành đồng bằng sông Cửu Long',
  answerPosition: 2, // M[I]ỀNTÂY -> I (Khớp chữ I của HÀNỘI)
  keywordIndex: 5,
  timeLimit: 20,
  points: 100,
};

// Sửa câu 3 của bộ PHỞBÒ (chữ thứ 3 là Ở / O):
DEFAULT_CROSSWORD_SETS[2].rows[2] = {
  id: 'xr-food-3',
  rowNumber: 3,
  question: 'Món ăn đặc sản Sài Gòn gồm gạo tấm nấu chín ăn kèm sườn nướng, bì, chả, trứng ốp la?',
  answer: 'CƠM TẤM',
  cleanAnswer: 'CƠMTẤM',
  acceptedAnswers: ['CƠM TẤM', 'COM TAM'],
  hint: 'Món cơm trứ danh của người miền Nam (2 chữ)',
  answerPosition: 2, // C[Ơ]MTẤM -> Ơ (Khớp chữ Ở của PHỞBÒ khi chuẩn hóa không dấu O/Ơ)
  keywordIndex: 3,
  timeLimit: 20,
  points: 100,
};

@Injectable()
export class CrosswordService {
  private readonly logger = new Logger(CrosswordService.name);
  private readonly rooms = new Map<string, CrosswordRuntime>();
  private readonly questionSets = new Map<string, CrosswordQuestionSet>();

  constructor(
    private readonly gateway: RealtimeGateway,
    @Optional() private readonly db?: DatabaseService,
  ) {
    this.initStorage();
  }

  // ===================================================================
  // DATABASE & STORAGE INITIALIZATION (Section 9)
  // ===================================================================

  private initStorage() {
    // 1. Load 3 default question sets + bulk 1,000+ horizontal questions (~165 crossword sets) into memory
    for (const set of DEFAULT_CROSSWORD_SETS) {
      this.questionSets.set(set.id, this.normalizeAndValidateSet(set));
    }
    const bulkSets = generateBulkCrosswordQuestionSets(1500);
    for (const set of bulkSets) {
      this.questionSets.set(set.id, set);
    }

    if (!this.db) return;
    try {
      const sqlite = this.db.getRawDb();
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS crossword_question_sets (
          id VARCHAR(64) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          topic VARCHAR(255) NOT NULL,
          keyword VARCHAR(64) NOT NULL,
          clean_keyword VARCHAR(64) NOT NULL,
          keyword_hint TEXT,
          description TEXT,
          status VARCHAR(32) NOT NULL DEFAULT 'PUBLISHED',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS crossword_rows (
          id VARCHAR(64) PRIMARY KEY,
          question_set_id VARCHAR(64) NOT NULL,
          row_number INTEGER NOT NULL,
          question TEXT NOT NULL,
          answer VARCHAR(128) NOT NULL,
          clean_answer VARCHAR(128) NOT NULL,
          accepted_answers TEXT NOT NULL DEFAULT '[]',
          hint TEXT,
          answer_position INTEGER NOT NULL DEFAULT 1,
          keyword_index INTEGER NOT NULL DEFAULT 1,
          time_limit INTEGER NOT NULL DEFAULT 20,
          points INTEGER NOT NULL DEFAULT 100,
          UNIQUE(question_set_id, row_number)
        );

        CREATE TABLE IF NOT EXISTS crossword_games (
          id VARCHAR(64) PRIMARY KEY,
          question_set_id VARCHAR(64) NOT NULL,
          room_id VARCHAR(64) NOT NULL,
          status VARCHAR(32) NOT NULL,
          current_row_number INTEGER,
          winner_id VARCHAR(128),
          started_at DATETIME,
          finished_at DATETIME
        );

        CREATE TABLE IF NOT EXISTS crossword_players (
          id VARCHAR(64) PRIMARY KEY,
          game_id VARCHAR(64) NOT NULL,
          tiktok_user_id VARCHAR(128) NOT NULL,
          username VARCHAR(128) NOT NULL,
          display_name VARCHAR(255) NOT NULL,
          total_score INTEGER NOT NULL DEFAULT 0,
          joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(game_id, tiktok_user_id)
        );

        CREATE TABLE IF NOT EXISTS crossword_answers (
          id VARCHAR(64) PRIMARY KEY,
          game_id VARCHAR(64) NOT NULL,
          row_number INTEGER NOT NULL,
          player_id VARCHAR(128) NOT NULL,
          answer VARCHAR(255) NOT NULL,
          is_correct INTEGER NOT NULL DEFAULT 0,
          points_earned INTEGER NOT NULL DEFAULT 0,
          answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(game_id, row_number, player_id)
        );
      `);

      // Seed all sets (1,000+ horizontal questions) into SQLite inside a single fast transaction
      this.db.runInTransaction(() => {
        const insertSet = sqlite.prepare(`
          INSERT OR IGNORE INTO crossword_question_sets
            (id, name, topic, keyword, clean_keyword, keyword_hint, description, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const insertRow = sqlite.prepare(`
          INSERT OR IGNORE INTO crossword_rows
            (id, question_set_id, row_number, question, answer, clean_answer, accepted_answers, hint, answer_position, keyword_index, time_limit, points)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const set of this.questionSets.values()) {
          insertSet.run(
            set.id,
            set.name,
            set.topic,
            set.keyword,
            set.cleanKeyword,
            set.keywordHint,
            set.description,
            set.status,
            set.createdAt,
          );
          for (const r of set.rows) {
            insertRow.run(
              r.id,
              set.id,
              r.rowNumber,
              r.question,
              r.answer,
              r.cleanAnswer,
              JSON.stringify(r.acceptedAnswers),
              r.hint,
              r.answerPosition,
              r.keywordIndex,
              r.timeLimit,
              r.points,
            );
          }
        }
      });

      // Load any custom sets saved in SQLite
      const dbSets = sqlite
        .prepare(`SELECT * FROM crossword_question_sets ORDER BY created_at DESC`)
        .all() as any[];
      for (const s of dbSets) {
        if (this.questionSets.has(s.id)) continue;
        const dbRows = sqlite
          .prepare(`SELECT * FROM crossword_rows WHERE question_set_id = ? ORDER BY row_number ASC`)
          .all(s.id) as any[];
        if (dbRows.length > 0) {
          this.questionSets.set(s.id, {
            id: s.id,
            name: s.name,
            topic: s.topic,
            keyword: s.keyword,
            cleanKeyword: s.clean_keyword,
            keywordHint: s.keyword_hint || '',
            description: s.description || '',
            status: s.status || 'PUBLISHED',
            createdAt: s.created_at || new Date().toISOString(),
            rows: dbRows.map((r) => ({
              id: r.id,
              rowNumber: Number(r.row_number),
              question: r.question,
              answer: r.answer,
              cleanAnswer: r.clean_answer,
              acceptedAnswers: JSON.parse(r.accepted_answers || '[]'),
              hint: r.hint || '',
              answerPosition: Number(r.answer_position),
              keywordIndex: Number(r.keyword_index),
              timeLimit: Number(r.time_limit || 20),
              points: Number(r.points || 100),
            })),
          });
        }
      }
    } catch (err: any) {
      this.logger.warn(`Crossword SQLite init warning: ${err?.message}`);
    }
  }

  private persistQuestionSetToDb(set: CrosswordQuestionSet) {
    if (!this.db) return;
    try {
      const sqlite = this.db.getRawDb();
      sqlite
        .prepare(
          `INSERT OR REPLACE INTO crossword_question_sets
            (id, name, topic, keyword, clean_keyword, keyword_hint, description, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
          set.id,
          set.name,
          set.topic,
          set.keyword,
          set.cleanKeyword,
          set.keywordHint,
          set.description,
          set.status,
          set.createdAt,
        );
      sqlite.prepare(`DELETE FROM crossword_rows WHERE question_set_id = ?`).run(set.id);
      const insertRow = sqlite.prepare(`
        INSERT INTO crossword_rows
          (id, question_set_id, row_number, question, answer, clean_answer, accepted_answers, hint, answer_position, keyword_index, time_limit, points)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const r of set.rows) {
        insertRow.run(
          r.id,
          set.id,
          r.rowNumber,
          r.question,
          r.answer,
          r.cleanAnswer,
          JSON.stringify(r.acceptedAnswers),
          r.hint,
          r.answerPosition,
          r.keywordIndex,
          r.timeLimit,
          r.points,
        );
      }
    } catch (err: any) {
      this.logger.warn(`Failed to persist crossword set: ${err?.message}`);
    }
  }

  // ===================================================================
  // NORMALIZATION & VALIDATION ENGINE (Section 4.3 & 8.3)
  // ===================================================================

  /**
   * Chuẩn hóa chuỗi để tạo ô chữ viết liền (giữ dấu Tiếng Việt, bỏ khoảng trắng & ký tự đặc biệt)
   */
  public toCleanTilesString(s: string): string {
    return String(s || '')
      .trim()
      .toUpperCase()
      .replace(/[^\p{L}\p{N}]/gu, '');
  }

  /**
   * Chuẩn hóa không dấu Tiếng Việt, chữ hoa, gom khoảng trắng đơn để so khớp đáp án
   */
  public normalizeAscii(s: string): string {
    return String(s || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/gi, 'd')
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Chuẩn hóa giữ dấu Tiếng Việt, chữ hoa, gom khoảng trắng đơn
   */
  public normalizeAccent(s: string): string {
    return String(s || '')
      .normalize('NFC')
      .toUpperCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * So sánh ký tự không dấu (để kiểm tra giao điểm hàng ngang và từ khóa)
   */
  public isSameBaseChar(charA: string, charB: string): boolean {
    const a = this.normalizeAscii(charA);
    const b = this.normalizeAscii(charB);
    return Boolean(a && b && a === b);
  }

  /**
   * Kiểm tra đáp án người chơi gửi lên so với đáp án chuẩn và danh sách acceptedAnswers (Mục 8.3)
   * Lưu ý: Không tự ý xóa khoảng trắng bên trong nếu người dùng gõ sai kiểu "PH P",
   * nhưng chấp nhận đáp án viết liền nếu đáp án gốc có dấu cách (vd: "HANOI" hoặc "HA NOI" cho "HÀ NỘI").
   */
  public isAnswerMatch(userRaw: string, primaryAnswer: string, acceptedAnswers: string[] = []): boolean {
    const rawTrimmed = String(userRaw || '')
      .trim()
      .replace(/[!?.~,;:]+$/g, '')
      .trim();
    if (!rawTrimmed || rawTrimmed.length > 60) return false;

    const userAccent = this.normalizeAccent(rawTrimmed);
    const userAscii = this.normalizeAscii(rawTrimmed);
    if (!userAscii) return false;

    const candidates = [primaryAnswer, ...(acceptedAnswers || [])].filter(Boolean);
    for (const cand of candidates) {
      const candAccent = this.normalizeAccent(cand);
      const candAscii = this.normalizeAscii(cand);
      const candCompactAscii = candAscii.replace(/\s+/g, '');

      // 1. Khớp chính xác có dấu hoặc không dấu (giữ nguyên cấu trúc từ)
      if (userAccent === candAccent || userAscii === candAscii) {
        return true;
      }
      // 2. Nếu đáp án gốc có nhiều từ (có khoảng trắng, vd "HA NOI") và người chơi viết liền ("HANOI"), cho phép khớp
      // Nhưng nếu đáp án gốc là 1 từ viết liền (vd "PHP") mà người chơi gõ "PH P" (có khoảng trắng bên trong) thì TỪ CHỐI theo mục 8.3!
      const candHasSpace = candAscii.includes(' ');
      const userHasSpace = userAscii.includes(' ');
      if (candHasSpace && !userHasSpace && userAscii === candCompactAscii) {
        return true;
      }
    }
    return false;
  }

  /**
   * Kiểm tra và chuẩn hóa bộ câu hỏi ô chữ (Mục 4.3)
   */
  public normalizeAndValidateSet(input: Partial<CrosswordQuestionSet>): CrosswordQuestionSet {
    const name = String(input.name || '').trim();
    if (!name) throw new Error('Tên bộ câu hỏi ô chữ không được để trống.');

    const keyword = String(input.keyword || '').trim().toUpperCase();
    const cleanKeyword = this.toCleanTilesString(keyword);
    if (!cleanKeyword || cleanKeyword.length < 3 || cleanKeyword.length > 15) {
      throw new Error('Từ khóa bí mật phải có từ 3 đến 15 ký tự hợp lệ.');
    }

    const rawRows = Array.isArray(input.rows) ? input.rows : [];
    if (rawRows.length !== cleanKeyword.length) {
      throw new Error(
        `Số lượng hàng ngang (${rawRows.length}) phải bằng số ký tự của từ khóa "${cleanKeyword}" (${cleanKeyword.length} ký tự).`,
      );
    }

    const seenRowNumbers = new Set<number>();
    const normalizedRows: CrosswordRowConfig[] = rawRows.map((r, idx) => {
      const rowNumber = Number(r.rowNumber ?? idx + 1);
      if (seenRowNumbers.has(rowNumber)) {
        throw new Error(`Hàng ngang số ${rowNumber} bị trùng số thứ tự.`);
      }
      seenRowNumbers.add(rowNumber);

      const question = String(r.question || '').trim();
      if (!question) {
        throw new Error(`Hàng ngang số ${rowNumber} chưa có nội dung câu hỏi.`);
      }

      const answer = String(r.answer || '').trim().toUpperCase();
      const cleanAnswer = this.toCleanTilesString(answer);
      if (!cleanAnswer) {
        throw new Error(`Hàng ngang số ${rowNumber} chưa có đáp án hợp lệ.`);
      }

      const keywordIndex = Number(r.keywordIndex ?? rowNumber);
      const targetKeyChar = Array.from(cleanKeyword)[keywordIndex - 1];
      if (!targetKeyChar) {
        throw new Error(`Hàng ngang số ${rowNumber} có vị trí từ khóa vượt quá độ dài từ khóa.`);
      }

      const answerChars = Array.from(cleanAnswer);
      let answerPosition = Number(r.answerPosition || 0);

      // Kiểm tra vị trí ký tự đặc biệt; nếu không khớp hoặc chưa truyền, tự động tìm vị trí khớp trong đáp án
      if (
        answerPosition < 1 ||
        answerPosition > answerChars.length ||
        !this.isSameBaseChar(answerChars[answerPosition - 1], targetKeyChar)
      ) {
        const autoFoundIdx = answerChars.findIndex((ch) => this.isSameBaseChar(ch, targetKeyChar));
        if (autoFoundIdx === -1) {
          throw new Error(
            `Đáp án "${answer}" của hàng ${rowNumber} không chứa ký tự "${targetKeyChar}" để ghép vào từ khóa "${cleanKeyword}".`,
          );
        }
        answerPosition = autoFoundIdx + 1;
      }

      const accepted = Array.isArray(r.acceptedAnswers)
        ? r.acceptedAnswers.map((a) => String(a).trim().toUpperCase()).filter(Boolean)
        : [];
      if (!accepted.includes(answer)) accepted.unshift(answer);
      if (!accepted.includes(cleanAnswer)) accepted.push(cleanAnswer);

      return {
        id: r.id || `xrow-${Date.now()}-${rowNumber}`,
        rowNumber,
        question,
        answer,
        cleanAnswer,
        acceptedAnswers: accepted,
        hint: String(r.hint || '').trim(),
        answerPosition,
        keywordIndex,
        timeLimit: Math.max(10, Math.min(120, Number(r.timeLimit || 20))),
        points: Math.max(10, Math.min(1000, Number(r.points || 100))),
      };
    });

    normalizedRows.sort((a, b) => a.rowNumber - b.rowNumber);

    return {
      id: input.id || `xword-set-${Date.now()}`,
      name,
      topic: String(input.topic || 'Kiến thức tổng hợp').trim(),
      keyword,
      cleanKeyword,
      keywordHint: String(input.keywordHint || input.description || `Từ khóa gồm ${cleanKeyword.length} chữ cái`).trim(),
      description: String(input.description || '').trim(),
      status: input.status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED',
      rows: normalizedRows,
      createdAt: input.createdAt || new Date().toISOString(),
    };
  }

  // ===================================================================
  // QUESTION SETS MANAGEMENT
  // ===================================================================

  public listQuestionSets(): CrosswordQuestionSet[] {
    return Array.from(this.questionSets.values());
  }

  public getBankStats() {
    const sets = this.listQuestionSets();
    const totalQuestions = sets.reduce((sum, s) => sum + (s.rows?.length || 0), 0);
    return {
      totalSets: sets.length,
      totalQuestions,
    };
  }

  public generateBulkSets(targetQuestionCount = 1000) {
    const count = Math.max(100, Math.min(2000, Number(targetQuestionCount || 1000)));
    const bulkSets = generateBulkCrosswordQuestionSets(count);
    for (const set of bulkSets) {
      this.questionSets.set(set.id, set);
      this.persistQuestionSetToDb(set);
    }
    const stats = this.getBankStats();
    this.logger.log(`Generated bulk crossword sets: ${stats.totalSets} sets (${stats.totalQuestions} questions).`);
    return {
      success: true,
      ...stats,
    };
  }

  public selectRandomQuestionSet(roomCode: string) {
    const rt = this.getRuntime(roomCode);
    const sets = this.listQuestionSets().filter((s) => s.id !== rt.questionSetId);
    const picked = sets.length > 0 ? sets[Math.floor(Math.random() * sets.length)] : this.listQuestionSets()[0];
    return this.selectQuestionSet(roomCode, picked.id);
  }

  public getQuestionSet(id: string): CrosswordQuestionSet {
    const set = this.questionSets.get(id);
    if (!set) throw new Error(`Không tìm thấy bộ câu hỏi ô chữ: ${id}`);
    return set;
  }

  public createQuestionSet(dto: Partial<CrosswordQuestionSet>): CrosswordQuestionSet {
    const validated = this.normalizeAndValidateSet(dto);
    this.questionSets.set(validated.id, validated);
    this.persistQuestionSetToDb(validated);
    return validated;
  }

  public updateQuestionSet(id: string, dto: Partial<CrosswordQuestionSet>): CrosswordQuestionSet {
    const existing = this.getQuestionSet(id);
    const validated = this.normalizeAndValidateSet({
      ...existing,
      ...dto,
      id: existing.id,
      createdAt: existing.createdAt,
    });
    this.questionSets.set(validated.id, validated);
    this.persistQuestionSetToDb(validated);
    return validated;
  }

  // ===================================================================
  // RUNTIME & STATE MANAGEMENT
  // ===================================================================

  private createRowsFromSet(set: CrosswordQuestionSet, cfg: CrosswordConfig): CrosswordRowRuntime[] {
    return set.rows.map((r) => ({
      ...r,
      timeLimit: cfg.timePerRow || r.timeLimit || 20,
      points: cfg.firstRowPoints || r.points || 100,
      status: 'LOCKED' as CrosswordRowStatus,
      hintUnlocked: false,
      startedAt: 0,
      endsAt: 0,
      firstSolver: null,
      solvers: [],
      solvedUserIds: new Set<string>(),
    }));
  }

  private getRuntime(roomCode: string): CrosswordRuntime {
    const key = (roomCode || 'KB2026').toUpperCase();
    let rt = this.rooms.get(key);
    if (!rt) {
      const defaultSet = Array.from(this.questionSets.values())[0];
      const defaultConfig: CrosswordConfig = {
        timePerRow: 20,
        keywordFinalTime: 60,
        firstRowPoints: 100,
        subsequentRowPoints: 20,
        keywordPoints: 500,
        keywordCooldownSec: 5,
        allowHints: true,
        autoRevealRowOnFirstCorrect: false,
      };
      rt = {
        roomCode: key,
        gameId: `xgame-${key}-${Date.now()}`,
        status: 'IDLE',
        statusBeforePause: null,
        remainingMsOnPause: 0,
        questionSetId: defaultSet.id,
        questionSetName: defaultSet.name,
        topic: defaultSet.topic,
        keyword: defaultSet.keyword,
        cleanKeyword: defaultSet.cleanKeyword,
        keywordHint: defaultSet.keywordHint,
        keywordHintUnlocked: false,
        rows: this.createRowsFromSet(defaultSet, defaultConfig),
        currentRowNumber: null,
        revealedKeywordPositions: new Set<number>(),
        keywordWinner: null,
        keywordStartedAt: 0,
        keywordEndsAt: 0,
        keywordCooldowns: new Map<string, number>(),
        recentKeywordAttempts: [],
        players: new Map<string, CrosswordPlayer>(),
        config: defaultConfig,
        startedAt: 0,
        finishedAt: 0,
        timers: [],
        lastBroadcastAt: 0,
        pendingBroadcast: null,
      };
      this.rooms.set(key, rt);
    }
    return rt;
  }

  public isActive(roomCode: string): boolean {
    const rt = this.rooms.get((roomCode || 'KB2026').toUpperCase());
    return Boolean(rt && rt.status !== 'IDLE');
  }

  /**
   * Trả về trạng thái công khai của game (Section 10.2 & 11):
   * - Khi includeSecret = false (gửi cho LIVE Overlay):
   *   ẨN toàn bộ đáp án của các hàng chưa mở và từ khóa bí mật!
   * - Khi includeSecret = true (gửi cho Dashboard MC/Admin):
   *   Bao gồm đầy đủ đáp án và từ khóa bí mật để MC dẫn dắt.
   */
  public getPublicState(roomCode: string, includeSecret = false) {
    const rt = this.getRuntime(roomCode);
    const now = Date.now();
    const isGameFinished = rt.status === 'FINISHED';
    const keywordChars = Array.from(rt.cleanKeyword);

    // Tính cột căn giữa bảng ô chữ: max answerPosition trong tất cả các hàng
    const maxAnchorCol = rt.rows.reduce((max, r) => Math.max(max, r.answerPosition), 1);

    const publicRows = rt.rows.map((r) => {
      const isRowOpen = r.status === 'SOLVED' || r.status === 'REVEALED' || isGameFinished;
      const chars = Array.from(r.cleanAnswer);
      const tiles = chars.map((ch, idx) => {
        const pos = idx + 1;
        const isSpecial = pos === r.answerPosition;
        return {
          position: pos,
          isSpecial,
          isRevealed: isRowOpen,
          char: isRowOpen ? ch : null,
        };
      });

      return {
        id: r.id,
        rowNumber: r.rowNumber,
        status: r.status,
        length: chars.length,
        answerPosition: r.answerPosition,
        keywordIndex: r.keywordIndex,
        offsetLeft: maxAnchorCol - r.answerPosition, // Số ô trống bên trái để các ô màu vàng thẳng hàng dọc!
        question: r.status !== 'LOCKED' || includeSecret ? r.question : undefined,
        hint: (r.hintUnlocked || isRowOpen || includeSecret) && r.hint ? r.hint : undefined,
        hintUnlocked: r.hintUnlocked || isRowOpen,
        answer: isRowOpen || includeSecret ? r.answer : undefined,
        cleanAnswer: isRowOpen || includeSecret ? r.cleanAnswer : undefined,
        timeLimit: r.timeLimit,
        points: r.points,
        startedAt: r.startedAt,
        endsAt: r.endsAt,
        firstSolver: r.firstSolver,
        solversCount: r.solvers.length,
        solvers: r.solvers.slice(0, 8),
        tiles,
      };
    });

    const keywordTiles = keywordChars.map((ch, idx) => {
      const pos = idx + 1;
      const isRevealed = isGameFinished || Boolean(rt.keywordWinner) || rt.revealedKeywordPositions.has(pos);
      return {
        position: pos,
        isRevealed,
        char: isRevealed ? ch : null,
      };
    });

    const activeRow =
      rt.currentRowNumber !== null
        ? publicRows.find((r) => r.rowNumber === rt.currentRowNumber) || null
        : null;

    const matchLeaderboard = Array.from(rt.players.values())
      .sort((a, b) => b.matchScore - a.matchScore || b.rowsSolved - a.rowsSolved || a.joinedAt - b.joinedAt)
      .slice(0, 10)
      .map((p, idx) => ({
        rank: idx + 1,
        userId: p.userId,
        username: p.username,
        nickname: p.nickname,
        avatarUrl: p.avatarUrl,
        score: p.matchScore,
        sessionScore: p.sessionScore,
        rowsSolved: p.rowsSolved,
        firstRowCount: p.firstRowCount,
        keywordSolved: p.keywordSolved,
      }));

    const sessionLeaderboard = Array.from(rt.players.values())
      .sort((a, b) => b.sessionScore - a.sessionScore || b.rowsSolved - a.rowsSolved || a.joinedAt - b.joinedAt)
      .slice(0, 10)
      .map((p, idx) => ({
        rank: idx + 1,
        userId: p.userId,
        username: p.username,
        nickname: p.nickname,
        avatarUrl: p.avatarUrl,
        score: p.sessionScore,
        matchScore: p.matchScore,
        rowsSolved: p.rowsSolved,
        firstRowCount: p.firstRowCount,
        keywordSolved: p.keywordSolved,
      }));

    const solvedRowsCount = rt.rows.filter((r) => r.status === 'SOLVED' || r.status === 'REVEALED').length;
    const bankStats = this.getBankStats();

    const payload: any = {
      roomCode: rt.roomCode,
      gameId: rt.gameId,
      status: rt.status,
      serverNow: now,
      questionSetId: rt.questionSetId,
      questionSetName: rt.questionSetName,
      topic: rt.topic,
      bankTotalSets: bankStats.totalSets,
      bankTotalQuestions: bankStats.totalQuestions,
      keywordLength: keywordChars.length,
      keywordTiles,
      keywordHint: rt.keywordHintUnlocked || isGameFinished || includeSecret ? rt.keywordHint : undefined,
      keywordHintUnlocked: rt.keywordHintUnlocked || isGameFinished,
      keyword: isGameFinished || Boolean(rt.keywordWinner) || includeSecret ? rt.keyword : undefined,
      cleanKeyword: isGameFinished || Boolean(rt.keywordWinner) || includeSecret ? rt.cleanKeyword : undefined,
      keywordWinner: rt.keywordWinner,
      keywordStartedAt: rt.keywordStartedAt,
      keywordEndsAt: rt.keywordEndsAt,
      recentKeywordAttempts: rt.recentKeywordAttempts.slice(0, 6),
      maxAnchorCol,
      rows: publicRows,
      currentRowNumber: rt.currentRowNumber,
      activeRow,
      solvedRowsCount,
      totalRowsCount: rt.rows.length,
      playerCount: rt.players.size,
      leaderboard: matchLeaderboard,
      sessionLeaderboard,
      mvp: matchLeaderboard[0] || null,
      config: rt.config,
    };

    if (includeSecret) {
      payload.secret = {
        keyword: rt.keyword,
        cleanKeyword: rt.cleanKeyword,
        keywordHint: rt.keywordHint,
        rows: rt.rows.map((r) => ({
          rowNumber: r.rowNumber,
          question: r.question,
          answer: r.answer,
          cleanAnswer: r.cleanAnswer,
          hint: r.hint,
          answerPosition: r.answerPosition,
          keywordChar: Array.from(r.cleanAnswer)[r.answerPosition - 1] || '',
        })),
      };
    }

    return payload;
  }

  private broadcast(rt: CrosswordRuntime, immediate = false) {
    const now = Date.now();
    const send = () => {
      rt.lastBroadcastAt = Date.now();
      rt.pendingBroadcast = null;
      const publicState = this.getPublicState(rt.roomCode, false);
      this.gateway.emitToRoom(rt.roomCode, 'crossword.state', publicState);
      this.gateway.emitToRoom(rt.roomCode, 'crossword:leaderboard:updated', {
        roomCode: rt.roomCode,
        leaderboard: publicState.leaderboard,
        sessionLeaderboard: publicState.sessionLeaderboard,
      });
      this.gateway.emitToRoom(rt.roomCode, 'crossword.secret', {
        roomCode: rt.roomCode,
        keyword: rt.keyword,
        cleanKeyword: rt.cleanKeyword,
        keywordHint: rt.keywordHint,
        rows: rt.rows.map((r) => ({
          rowNumber: r.rowNumber,
          question: r.question,
          answer: r.answer,
          cleanAnswer: r.cleanAnswer,
          hint: r.hint,
          answerPosition: r.answerPosition,
          status: r.status,
        })),
      });
    };

    if (immediate || now - rt.lastBroadcastAt > 160) {
      if (rt.pendingBroadcast) {
        clearTimeout(rt.pendingBroadcast);
        rt.pendingBroadcast = null;
      }
      send();
      return;
    }
    if (!rt.pendingBroadcast) {
      rt.pendingBroadcast = setTimeout(send, 160);
    }
  }

  private emitEffect(rt: CrosswordRuntime, eventName: string, payload: Record<string, any>) {
    const data = { roomCode: rt.roomCode, gameId: rt.gameId, ...payload, at: Date.now() };
    this.gateway.emitToRoom(rt.roomCode, eventName, data);
    this.gateway.emitToRoom(rt.roomCode, 'crossword.effect', { eventName, ...data });
  }

  private clearTimers(rt: CrosswordRuntime) {
    rt.timers.forEach((t) => clearTimeout(t));
    rt.timers = [];
  }

  // ===================================================================
  // GAME ENGINE CONTROLS (Section 5, 6, 10.1)
  // ===================================================================

  public updateConfig(roomCode: string, cfg: Partial<CrosswordConfig>) {
    const rt = this.getRuntime(roomCode);
    rt.config = {
      timePerRow: Math.max(10, Math.min(120, Number(cfg.timePerRow ?? rt.config.timePerRow))),
      keywordFinalTime: Math.max(15, Math.min(300, Number(cfg.keywordFinalTime ?? rt.config.keywordFinalTime))),
      firstRowPoints: Math.max(10, Math.min(1000, Number(cfg.firstRowPoints ?? rt.config.firstRowPoints))),
      subsequentRowPoints: Math.max(0, Math.min(500, Number(cfg.subsequentRowPoints ?? rt.config.subsequentRowPoints))),
      keywordPoints: Math.max(50, Math.min(5000, Number(cfg.keywordPoints ?? rt.config.keywordPoints))),
      keywordCooldownSec: Math.max(1, Math.min(30, Number(cfg.keywordCooldownSec ?? rt.config.keywordCooldownSec))),
      allowHints: cfg.allowHints !== undefined ? Boolean(cfg.allowHints) : rt.config.allowHints,
      autoRevealRowOnFirstCorrect:
        cfg.autoRevealRowOnFirstCorrect !== undefined
          ? Boolean(cfg.autoRevealRowOnFirstCorrect)
          : rt.config.autoRevealRowOnFirstCorrect,
    };

    // Cập nhật timeLimit và points cho các hàng chưa mở
    rt.rows.forEach((r) => {
      if (r.status === 'LOCKED') {
        r.timeLimit = rt.config.timePerRow;
        r.points = rt.config.firstRowPoints;
      }
    });

    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode, true);
  }

  public selectQuestionSet(roomCode: string, questionSetId: string) {
    const rt = this.getRuntime(roomCode);
    const set = this.getQuestionSet(questionSetId);
    this.clearTimers(rt);
    rt.questionSetId = set.id;
    rt.questionSetName = set.name;
    rt.topic = set.topic;
    rt.keyword = set.keyword;
    rt.cleanKeyword = set.cleanKeyword;
    rt.keywordHint = set.keywordHint;
    rt.keywordHintUnlocked = false;
    rt.rows = this.createRowsFromSet(set, rt.config);
    rt.currentRowNumber = null;
    rt.revealedKeywordPositions.clear();
    rt.keywordWinner = null;
    rt.recentKeywordAttempts = [];
    if (rt.status !== 'IDLE') {
      rt.status = 'READY';
    }
    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode, true);
  }

  public openWaitingRoom(roomCode: string, questionSetId?: string) {
    const rt = this.getRuntime(roomCode);
    this.clearTimers(rt);
    const set = questionSetId ? this.getQuestionSet(questionSetId) : this.getQuestionSet(rt.questionSetId);

    rt.gameId = `xgame-${rt.roomCode}-${Date.now()}`;
    rt.status = 'WAITING';
    rt.statusBeforePause = null;
    rt.questionSetId = set.id;
    rt.questionSetName = set.name;
    rt.topic = set.topic;
    rt.keyword = set.keyword;
    rt.cleanKeyword = set.cleanKeyword;
    rt.keywordHint = set.keywordHint;
    rt.keywordHintUnlocked = false;
    rt.rows = this.createRowsFromSet(set, rt.config);
    rt.currentRowNumber = null;
    rt.revealedKeywordPositions.clear();
    rt.keywordWinner = null;
    rt.keywordCooldowns.clear();
    rt.recentKeywordAttempts = [];

    // Giữ lại điểm tích lũy phiên LIVE (sessionScore), chỉ reset điểm ván hiện tại (matchScore)
    rt.players.forEach((p) => {
      p.matchScore = 0;
      p.rowsSolved = 0;
      p.firstRowCount = 0;
      p.keywordSolved = false;
    });

    this.emitEffect(rt, 'crossword:game:waiting', {
      kind: 'SYSTEM',
      message: `🧩 Sảnh chờ GIẢI MÃ Ô CHỮ (${set.topic}) đã mở! Bình luận bất kỳ để báo danh!`,
    });
    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode, true);
  }

  public startGame(roomCode: string, questionSetId?: string) {
    const rt = this.getRuntime(roomCode);
    this.clearTimers(rt);
    const set = questionSetId ? this.getQuestionSet(questionSetId) : this.getQuestionSet(rt.questionSetId);

    rt.gameId = `xgame-${rt.roomCode}-${Date.now()}`;
    rt.status = 'READY';
    rt.statusBeforePause = null;
    rt.questionSetId = set.id;
    rt.questionSetName = set.name;
    rt.topic = set.topic;
    rt.keyword = set.keyword;
    rt.cleanKeyword = set.cleanKeyword;
    rt.keywordHint = set.keywordHint;
    rt.keywordHintUnlocked = false;
    rt.rows = this.createRowsFromSet(set, rt.config);
    rt.currentRowNumber = null;
    rt.revealedKeywordPositions.clear();
    rt.keywordWinner = null;
    rt.keywordCooldowns.clear();
    rt.recentKeywordAttempts = [];
    rt.startedAt = Date.now();
    rt.finishedAt = 0;

    rt.players.forEach((p) => {
      p.matchScore = 0;
      p.rowsSolved = 0;
      p.firstRowCount = 0;
      p.keywordSolved = false;
    });

    this.emitEffect(rt, 'crossword:game:started', {
      kind: 'GAME_STARTED',
      topic: rt.topic,
      rowCount: rt.rows.length,
      keywordLength: Array.from(rt.cleanKeyword).length,
      message: `🚀 Ván Giải Mã Ô Chữ chủ đề "${rt.topic}" BẮT ĐẦU! Hệ thống tự động chạy liên tục từ Hàng 1 đến Hàng ${rt.rows.length}!`,
    });

    // Tự động mở ngay Hàng ngang số 1 để chạy liên tục từ câu 1 đến hết
    if (rt.rows.length > 0) {
      return this.openRow(rt.roomCode, rt.rows[0].rowNumber);
    }

    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode, true);
  }

  /**
   * Tự động chuyển sang hàng ngang kế tiếp chưa mở (từ 1 -> N),
   * hoặc nếu đã đi qua hết các hàng ngang thì chuyển sang Vòng Giải Mã Từ Khóa Bí Mật!
   */
  public advanceToNextRowOrKeyword(roomCode: string) {
    const rt = this.getRuntime(roomCode);
    if (rt.status === 'IDLE' || rt.status === 'FINISHED' || rt.status === 'PAUSED' || rt.keywordWinner) {
      return this.getPublicState(rt.roomCode, true);
    }

    const currentNum = rt.currentRowNumber || 0;
    const nextRow =
      rt.rows.find((r) => r.rowNumber > currentNum && r.status === 'LOCKED') ||
      rt.rows.find((r) => r.status === 'LOCKED');

    if (nextRow) {
      return this.openRow(rt.roomCode, nextRow.rowNumber);
    }

    // Đã chạy hết tất cả các câu hỏi hàng ngang -> chuyển sang thời gian trả lời Từ khóa bí mật
    return this.startKeywordFinalRound(rt.roomCode);
  }

  /**
   * Mở 1 hàng ngang để người xem giải (Giai đoạn 2 - Mục 2)
   */
  public openRow(roomCode: string, rowNumber: number) {
    const rt = this.getRuntime(roomCode);
    if (rt.status === 'IDLE' || rt.status === 'FINISHED') {
      throw new Error('Ván chơi chưa bắt đầu hoặc đã kết thúc.');
    }

    const row = rt.rows.find((r) => r.rowNumber === Number(rowNumber));
    if (!row) {
      throw new Error(`Không tìm thấy hàng ngang số ${rowNumber}.`);
    }
    if (row.status === 'SOLVED' || row.status === 'REVEALED') {
      throw new Error(`Hàng ngang số ${rowNumber} đã được mở trước đó.`);
    }

    // Nếu đang có 1 hàng khác đang ACTIVE, tự động chuyển hàng đó về SOLVED (nếu có người giải) hoặc SKIPPED (nếu không ai giải đúng -> không lật)
    rt.rows.forEach((r) => {
      if (r.rowNumber !== row.rowNumber && r.status === 'ACTIVE') {
        r.status = r.solvers.length > 0 ? 'SOLVED' : 'SKIPPED';
      }
    });

    this.clearTimers(rt);
    rt.status = 'QUESTION_ACTIVE';
    rt.currentRowNumber = row.rowNumber;
    row.status = 'ACTIVE';
    row.startedAt = Date.now();
    row.endsAt = row.startedAt + row.timeLimit * 1000;

    // Đặt timer hết giờ câu hỏi hàng ngang
    rt.timers.push(
      setTimeout(() => {
        this.onRowTimerExpired(rt.roomCode, row.rowNumber);
      }, row.timeLimit * 1000),
    );

    this.emitEffect(rt, 'crossword:question:opened', {
      kind: 'ROW_OPENED',
      rowNumber: row.rowNumber,
      question: row.question,
      length: Array.from(row.cleanAnswer).length,
      answerPosition: row.answerPosition,
      timeLimit: row.timeLimit,
      message: `📢 Hàng ngang số ${row.rowNumber} (${Array.from(row.cleanAnswer).length} chữ cái): ${row.question}`,
    });

    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode, true);
  }

  public onRowTimerExpired(roomCode: string, rowNumber: number) {
    const rt = this.getRuntime(roomCode);
    if (rt.status !== 'QUESTION_ACTIVE' || rt.currentRowNumber !== rowNumber) return;
    const row = rt.rows.find((r) => r.rowNumber === rowNumber);
    if (!row) return;

    // 1. Nếu có người trả lời đúng -> tự động lật mở hàng ngang, hé lộ ký tự khóa và tự chuyển câu tiếp theo
    if (row.solvers.length > 0) {
      this.revealRow(roomCode, rowNumber);
      return;
    }

    // 2. Nếu hết giờ mà KHÔNG AI trả lời đúng -> KHÔNG LẬT ô chữ và KHÔNG mở ký tự khóa, tự động chuyển sang câu kế tiếp!
    this.clearTimers(rt);
    row.status = 'SKIPPED';
    rt.status = 'QUESTION_REVEAL';

    this.emitEffect(rt, 'crossword:question:timeout', {
      kind: 'ROW_TIMEOUT',
      rowNumber: row.rowNumber,
      revealed: false,
      message: `⏰ Hết giờ Hàng ngang số ${row.rowNumber}! Không có ai trả lời đúng — Ô chữ giữ nguyên bí mật, chuyển sang câu tiếp theo...`,
    });

    this.broadcast(rt, true);

    // Sau 3.5 giây nghỉ chuyển câu, tự động chạy sang câu hỏi hàng ngang kế tiếp (hoặc vòng Từ khóa cuối)
    rt.timers.push(
      setTimeout(() => {
        if (rt.status !== 'FINISHED' && rt.status !== 'PAUSED' && !rt.keywordWinner) {
          this.advanceToNextRowOrKeyword(rt.roomCode);
        }
      }, 3500),
    );
  }

  /**
   * Công bố đáp án hàng ngang & Hé lộ ký tự từ khóa bí mật (Giai đoạn 3 - Mục 2 & 10.2)
   */
  public revealRow(roomCode: string, rowNumber?: number) {
    const rt = this.getRuntime(roomCode);
    const targetNum = Number(rowNumber ?? rt.currentRowNumber);
    const row = rt.rows.find((r) => r.rowNumber === targetNum);
    if (!row) {
      throw new Error('Không xác định được hàng ngang cần công bố.');
    }

    this.clearTimers(rt);
    row.status = row.solvers.length > 0 ? 'SOLVED' : 'REVEALED';
    row.hintUnlocked = true;
    rt.currentRowNumber = row.rowNumber;
    rt.status = 'QUESTION_REVEAL';

    // Hé lộ ký tự đặc biệt vào từ khóa bí mật
    rt.revealedKeywordPositions.add(row.keywordIndex);
    const keyChar = Array.from(rt.cleanKeyword)[row.keywordIndex - 1] || '';

    this.emitEffect(rt, 'crossword:row:revealed', {
      kind: 'ROW_REVEALED',
      gameId: rt.gameId,
      rowNumber: row.rowNumber,
      answer: row.answer,
      cleanAnswer: row.cleanAnswer,
      revealed: true,
      keywordCharacter: keyChar,
      keywordPosition: row.keywordIndex,
      player: row.firstSolver
        ? {
            userId: row.firstSolver.userId,
            username: row.firstSolver.username,
            displayName: row.firstSolver.nickname,
          }
        : null,
      pointsEarned: row.firstSolver?.points || 0,
      solversCount: row.solvers.length,
      message: row.firstSolver
        ? `✅ Hàng ${row.rowNumber}: "${row.answer}" — Mở ký tự khóa [${keyChar}]! Nhanh nhất: ${row.firstSolver.nickname} (+${row.firstSolver.points}đ)`
        : `🔓 Đáp án Hàng ${row.rowNumber}: "${row.answer}" — Hé lộ ký tự từ khóa [${keyChar}] ở vị trí #${row.keywordIndex}!`,
    });

    this.gateway.emitToRoom(rt.roomCode, 'crossword:keyword:updated', {
      roomCode: rt.roomCode,
      keywordPosition: row.keywordIndex,
      keywordCharacter: keyChar,
      revealedPositions: Array.from(rt.revealedKeywordPositions),
    });

    // Sau 4 giây công bố đáp án hàng hiện tại, tự động chuyển sang hàng ngang kế tiếp (hoặc Vòng Giải Mã Từ Khóa Cuối nếu đã hết câu hỏi)
    if (!rt.keywordWinner) {
      rt.timers.push(
        setTimeout(() => {
          if (rt.status !== 'FINISHED' && rt.status !== 'PAUSED' && !rt.keywordWinner) {
            this.advanceToNextRowOrKeyword(rt.roomCode);
          }
        }, 4000),
      );
    }

    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode, true);
  }

  /**
   * Bỏ qua hàng ngang hiện tại (không lật đáp án) và chuyển ngay sang câu hỏi tiếp theo
   */
  public skipRow(roomCode: string, rowNumber?: number) {
    const rt = this.getRuntime(roomCode);
    const targetNum = Number(rowNumber ?? rt.currentRowNumber);
    const row = rt.rows.find((r) => r.rowNumber === targetNum);
    if (!row) {
      throw new Error('Không tìm thấy hàng ngang cần bỏ qua.');
    }

    this.clearTimers(rt);
    row.status = 'SKIPPED';

    this.emitEffect(rt, 'crossword:row:skipped', {
      kind: 'ROW_SKIPPED',
      rowNumber: row.rowNumber,
      message: `⏭️ Hàng ngang số ${row.rowNumber} không lật mở — Chuyển sang câu hỏi tiếp theo!`,
    });

    return this.advanceToNextRowOrKeyword(rt.roomCode);
  }

  /**
   * Mở gợi ý cho hàng ngang đang chọn hoặc gợi ý từ khóa bí mật
   */
  public unlockHint(roomCode: string, target: 'ROW' | 'KEYWORD' = 'ROW', rowNumber?: number) {
    const rt = this.getRuntime(roomCode);
    if (target === 'KEYWORD') {
      rt.keywordHintUnlocked = true;
      this.emitEffect(rt, 'crossword:hint:unlocked', {
        kind: 'KEYWORD_HINT',
        hint: rt.keywordHint,
        message: `💡 Gợi ý Từ Khóa Bí Mật: ${rt.keywordHint}`,
      });
    } else {
      const num = Number(rowNumber ?? rt.currentRowNumber);
      const row = rt.rows.find((r) => r.rowNumber === num);
      if (row) {
        row.hintUnlocked = true;
        this.emitEffect(rt, 'crossword:hint:unlocked', {
          kind: 'ROW_HINT',
          rowNumber: row.rowNumber,
          hint: row.hint,
          message: `💡 Gợi ý Hàng ngang số ${row.rowNumber}: ${row.hint || 'Hãy chú ý số lượng chữ cái!'}`,
        });
      }
    }
    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode, true);
  }

  /**
   * Kích hoạt Vòng Giải Mã Từ Khóa Cuối (60s)
   */
  public startKeywordFinalRound(roomCode: string) {
    const rt = this.getRuntime(roomCode);
    if (rt.status === 'IDLE' || rt.status === 'FINISHED') return this.getPublicState(rt.roomCode, true);

    this.clearTimers(rt);
    rt.status = 'KEYWORD_ACTIVE';
    rt.currentRowNumber = null;
    rt.keywordHintUnlocked = true;
    rt.keywordStartedAt = Date.now();
    rt.keywordEndsAt = rt.keywordStartedAt + rt.config.keywordFinalTime * 1000;

    rt.timers.push(
      setTimeout(() => {
        if (rt.status === 'KEYWORD_ACTIVE' && !rt.keywordWinner) {
          this.finishGame(rt.roomCode);
        }
      }, rt.config.keywordFinalTime * 1000),
    );

    this.emitEffect(rt, 'crossword:keyword:final', {
      kind: 'KEYWORD_FINAL',
      timeLimit: rt.config.keywordFinalTime,
      keywordHint: rt.keywordHint,
      message: `🔥 VÒNG GIẢI MÃ TỪ KHÓA CUỐI CÙNG (${rt.config.keywordFinalTime}s)! Bình luận ngay từ khóa hoặc "KEYWORD <đáp án>" để nhận +${rt.config.keywordPoints} điểm!`,
    });

    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode, true);
  }

  public pauseGame(roomCode: string) {
    const rt = this.getRuntime(roomCode);
    if (rt.status === 'PAUSED' || rt.status === 'IDLE' || rt.status === 'FINISHED') {
      return this.getPublicState(rt.roomCode, true);
    }
    this.clearTimers(rt);
    rt.statusBeforePause = rt.status;
    const now = Date.now();
    if (rt.status === 'QUESTION_ACTIVE' && rt.currentRowNumber !== null) {
      const row = rt.rows.find((r) => r.rowNumber === rt.currentRowNumber);
      rt.remainingMsOnPause = row ? Math.max(1000, row.endsAt - now) : 5000;
    } else if (rt.status === 'KEYWORD_ACTIVE') {
      rt.remainingMsOnPause = Math.max(1000, rt.keywordEndsAt - now);
    } else {
      rt.remainingMsOnPause = 0;
    }
    rt.status = 'PAUSED';
    this.emitEffect(rt, 'crossword:game:paused', {
      kind: 'PAUSED',
      message: '⏸️ Ván chơi Giải Mã Ô Chữ đang tạm dừng.',
    });
    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode, true);
  }

  public resumeGame(roomCode: string) {
    const rt = this.getRuntime(roomCode);
    if (rt.status !== 'PAUSED') return this.getPublicState(rt.roomCode, true);

    const prev = rt.statusBeforePause || 'READY';
    rt.status = prev;
    rt.statusBeforePause = null;
    const now = Date.now();

    if (prev === 'QUESTION_ACTIVE' && rt.currentRowNumber !== null) {
      const row = rt.rows.find((r) => r.rowNumber === rt.currentRowNumber);
      if (row) {
        const remain = rt.remainingMsOnPause || 10000;
        row.endsAt = now + remain;
        rt.timers.push(setTimeout(() => this.onRowTimerExpired(rt.roomCode, row.rowNumber), remain));
      }
    } else if (prev === 'KEYWORD_ACTIVE') {
      const remain = rt.remainingMsOnPause || 20000;
      rt.keywordEndsAt = now + remain;
      rt.timers.push(setTimeout(() => this.finishGame(rt.roomCode), remain));
    }

    this.emitEffect(rt, 'crossword:game:resumed', {
      kind: 'RESUMED',
      message: '▶️ Ván chơi Giải Mã Ô Chữ tiếp tục!',
    });
    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode, true);
  }

  public finishGame(roomCode: string) {
    const rt = this.getRuntime(roomCode);
    if (rt.status === 'IDLE') return this.getPublicState(rt.roomCode, true);
    this.clearTimers(rt);
    rt.status = 'FINISHED';
    rt.finishedAt = Date.now();
    rt.keywordHintUnlocked = true;

    // Mở tất cả các ký tự từ khóa và hàng ngang khi kết thúc
    const len = Array.from(rt.cleanKeyword).length;
    for (let i = 1; i <= len; i++) {
      rt.revealedKeywordPositions.add(i);
    }
    rt.rows.forEach((r) => {
      if (r.status === 'LOCKED' || r.status === 'ACTIVE' || r.status === 'SKIPPED') {
        r.status = 'REVEALED';
      }
    });

    const state = this.getPublicState(rt.roomCode, true);
    this.emitEffect(rt, 'crossword:game:finished', {
      kind: 'GAME_FINISHED',
      keyword: rt.keyword,
      keywordWinner: rt.keywordWinner,
      mvp: state.mvp,
      leaderboard: state.leaderboard,
      message: rt.keywordWinner
        ? `🏆 KẾT THÚC! Từ khóa "${rt.keyword}" đã được giải mã bởi ${rt.keywordWinner.nickname} (+${rt.keywordWinner.pointsEarned}đ)!`
        : `🏁 Ván chơi kết thúc! Từ khóa bí mật là: "${rt.keyword}"!`,
    });
    this.broadcast(rt, true);
    return state;
  }

  public stopGame(roomCode: string) {
    const rt = this.getRuntime(roomCode);
    this.clearTimers(rt);
    rt.status = 'IDLE';
    rt.currentRowNumber = null;
    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode, true);
  }

  public resetSessionLeaderboard(roomCode: string) {
    const rt = this.getRuntime(roomCode);
    rt.players.clear();
    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode, true);
  }

  // ===================================================================
  // COMMENT PARSING & ATOMIC SCORING ENGINE (Section 8)
  // ===================================================================

  private ensurePlayer(rt: CrosswordRuntime, event: GameEvent): CrosswordPlayer {
    let p = rt.players.get(event.user.id);
    if (p) {
      if (event.user.avatarUrl && !p.avatarUrl) p.avatarUrl = event.user.avatarUrl;
      if (event.user.nickname) p.nickname = event.user.nickname;
      return p;
    }
    p = {
      userId: event.user.id,
      username: event.user.username,
      nickname: event.user.nickname || event.user.username,
      avatarUrl: event.user.avatarUrl,
      matchScore: 0,
      sessionScore: 0,
      rowsSolved: 0,
      firstRowCount: 0,
      keywordSolved: false,
      joinedAt: event.receivedAt || Date.now(),
    };
    rt.players.set(p.userId, p);
    return p;
  }

  /**
   * Phân loại bình luận TikTok LIVE (Section 8.1):
   * 1. Cú pháp đoán từ khóa ưu tiên mọi lúc:
   *    "KEYWORD <đáp án>", "TK <đáp án>", "TỪ KHÓA <đáp án>", "TU KHOA <đáp án>", "KEY <đáp án>"
   * 2. Cú pháp trả lời có chỉ định hàng ngang:
   *    "1 PHP", "Hàng 1 PHP", "#1 PHP", "1: PHP", "1. PHP"
   * 3. Trả lời trực tiếp:
   *    - Nếu đang ở QUESTION_ACTIVE -> hiểu là trả lời cho hàng ngang đang mở.
   *    - Nếu đang ở KEYWORD_ACTIVE (Vòng giải mã cuối) -> hiểu là đoán từ khóa bí mật!
   */
  public classifyComment(
    rawContent: string,
    status: CrosswordGameStatus,
    currentRowNumber: number | null,
  ): { type: 'KEYWORD' | 'ROW_ANSWER' | 'NONE'; guess: string; rowNumber?: number } {
    const cleaned = String(rawContent || '').trim();
    if (!cleaned) return { type: 'NONE', guess: '' };

    // 1. Kiểm tra prefix đoán từ khóa mọi lúc
    const kwMatch = cleaned.match(
      /^(?:\/|!|#)?(?:KEYWORD|TỪ\s*KHÓA|TU\s*KHOA|TUKHOA|TK|KEY|MẬT\s*MÃ|MAT\s*MA|GIẢI\s*MÃ|GIAI\s*MA)\s*[:\-\.]?\s*(.+)$/i,
    );
    if (kwMatch && kwMatch[1]?.trim()) {
      return { type: 'KEYWORD', guess: kwMatch[1].trim() };
    }

    // 2. Kiểm tra prefix chỉ định số hàng ngang (VD: "1 PHP", "Hàng 2 API", "#3 REDIS")
    const rowPrefixMatch = cleaned.match(
      /^(?:\/|#)?(?:HÀNG|HANG|CÂU|CAU|H|C)?\s*(\d{1,2})\s*[:\-\.\)]?\s+(.+)$/i,
    );
    if (rowPrefixMatch && rowPrefixMatch[2]?.trim()) {
      const targetRow = Number(rowPrefixMatch[1]);
      return {
        type: 'ROW_ANSWER',
        rowNumber: targetRow,
        guess: rowPrefixMatch[2].trim(),
      };
    }

    // 3. Nếu đang ở vòng giải mã từ khóa cuối (KEYWORD_ACTIVE), mọi comment trực tiếp là đoán từ khóa
    if (status === 'KEYWORD_ACTIVE') {
      return { type: 'KEYWORD', guess: cleaned };
    }

    // 4. Nếu đang mở câu hỏi hàng ngang (QUESTION_ACTIVE), comment trực tiếp là đáp án hàng ngang đó
    if (status === 'QUESTION_ACTIVE' && currentRowNumber !== null) {
      return {
        type: 'ROW_ANSWER',
        rowNumber: currentRowNumber,
        guess: cleaned,
      };
    }

    return { type: 'NONE', guess: cleaned };
  }

  /**
   * Atomic claim winner cho từ khóa bí mật (Section 8.4):
   * Chỉ duy nhất người đầu tiên vượt qua kiểm tra `rt.keywordWinner === null`
   * mới giành được chiến thắng và kết thúc ván.
   */
  private tryAtomicClaimKeywordWinner(rt: CrosswordRuntime, player: CrosswordPlayer, now: number): boolean {
    if (rt.keywordWinner !== null || rt.status === 'FINISHED') {
      return false;
    }
    const pts = rt.config.keywordPoints;
    rt.keywordWinner = {
      userId: player.userId,
      username: player.username,
      nickname: player.nickname,
      avatarUrl: player.avatarUrl,
      pointsEarned: pts,
      solvedAt: now,
    };
    player.matchScore += pts;
    player.sessionScore += pts;
    player.keywordSolved = true;
    return true;
  }

  public handleComment(event: GameEvent) {
    const rt = this.getRuntime(event.roomId);
    const now = event.receivedAt || Date.now();
    const content = String(event.payload.content || '').trim();

    if (rt.status === 'IDLE' || rt.status === 'FINISHED' || rt.status === 'PAUSED') {
      return { action: 'CROSSWORD_IGNORED', status: rt.status };
    }

    const player = this.ensurePlayer(rt, event);

    if (rt.status === 'WAITING') {
      this.broadcast(rt);
      return { action: 'CROSSWORD_JOINED_WAITING' };
    }

    const classified = this.classifyComment(content, rt.status, rt.currentRowNumber);

    // ===============================================================
    // LUỒNG A: ĐOÁN TỪ KHÓA BÍ MẬT (Bất cứ lúc nào trong ván!)
    // ===============================================================
    if (classified.type === 'KEYWORD') {
      if (rt.keywordWinner !== null) {
        return { action: 'CROSSWORD_KEYWORD_ALREADY_CLAIMED' };
      }

      // Kiểm tra cooldown đoán từ khóa của người chơi này (mặc định 5s)
      const lastAttempt = rt.keywordCooldowns.get(player.userId) || 0;
      const cooldownMs = rt.config.keywordCooldownSec * 1000;
      if (now - lastAttempt < cooldownMs) {
        return {
          action: 'CROSSWORD_KEYWORD_COOLDOWN',
          retryAfterMs: cooldownMs - (now - lastAttempt),
        };
      }
      rt.keywordCooldowns.set(player.userId, now);

      const isCorrect = this.isAnswerMatch(classified.guess, rt.keyword, [rt.cleanKeyword]);

      rt.recentKeywordAttempts.unshift({
        id: `kw-att-${now}-${Math.random().toString(36).slice(2, 6)}`,
        userId: player.userId,
        nickname: player.nickname,
        avatarUrl: player.avatarUrl,
        guess: isCorrect ? '★ ĐÃ GIẢI MÃ ★' : classified.guess.slice(0, 24),
        isCorrect,
        at: now,
      });
      if (rt.recentKeywordAttempts.length > 15) {
        rt.recentKeywordAttempts.length = 15;
      }

      this.gateway.emitToRoom(rt.roomCode, 'crossword:keyword:attempt', {
        roomCode: rt.roomCode,
        userId: player.userId,
        nickname: player.nickname,
        avatarUrl: player.avatarUrl,
        isCorrect,
      });

      if (isCorrect) {
        const claimed = this.tryAtomicClaimKeywordWinner(rt, player, now);
        if (!claimed) {
          return { action: 'CROSSWORD_KEYWORD_ALREADY_CLAIMED' };
        }

        this.emitEffect(rt, 'crossword:keyword:winner', {
          kind: 'KEYWORD_WINNER',
          nickname: player.nickname,
          username: player.username,
          avatarUrl: player.avatarUrl,
          keyword: rt.keyword,
          pointsEarned: rt.config.keywordPoints,
          message: `👑 SIÊU ĐỈNH! ${player.nickname} đã giải mã thành công TỪ KHÓA BÍ MẬT "${rt.keyword}" (+${rt.config.keywordPoints} điểm)!`,
        });

        // Kết thúc ván và công bố toàn bộ bảng ô chữ
        this.finishGame(rt.roomCode);
        return {
          action: 'CROSSWORD_KEYWORD_SOLVED',
          keyword: rt.keyword,
          pointsEarned: rt.config.keywordPoints,
        };
      }

      // Đoán sai từ khóa -> không trừ điểm, vẫn được chơi tiếp
      this.broadcast(rt);
      return { action: 'CROSSWORD_KEYWORD_WRONG' };
    }

    // ===============================================================
    // LUỒNG B: TRẢ LỜI CÂU HỎI HÀNG NGANG ĐANG MỞ
    // ===============================================================
    if (classified.type === 'ROW_ANSWER') {
      if (rt.status !== 'QUESTION_ACTIVE' || rt.currentRowNumber === null) {
        return { action: 'CROSSWORD_NO_ACTIVE_ROW' };
      }

      // Nếu người chơi chỉ định số hàng nhưng khác với hàng đang mở -> bỏ qua
      if (classified.rowNumber !== undefined && classified.rowNumber !== rt.currentRowNumber) {
        return { action: 'CROSSWORD_WRONG_ROW_NUMBER', activeRow: rt.currentRowNumber };
      }

      const row = rt.rows.find((r) => r.rowNumber === rt.currentRowNumber);
      if (!row || row.status !== 'ACTIVE') {
        return { action: 'CROSSWORD_ROW_NOT_ACTIVE' };
      }

      // Mỗi người chỉ được ghi nhận điểm 1 lần cho mỗi hàng ngang (Section 3.1 & 8.4)
      if (row.solvedUserIds.has(player.userId)) {
        return { action: 'CROSSWORD_ROW_ALREADY_SOLVED_BY_USER' };
      }

      const isMatch = this.isAnswerMatch(classified.guess, row.answer, row.acceptedAnswers);
      if (!isMatch) {
        return { action: 'CROSSWORD_ROW_WRONG_ANSWER' };
      }

      // Đáp án đúng!
      row.solvedUserIds.add(player.userId);
      const order = row.solvedUserIds.size;
      const points = order === 1 ? rt.config.firstRowPoints : rt.config.subsequentRowPoints;

      player.matchScore += points;
      player.sessionScore += points;
      player.rowsSolved += 1;
      if (order === 1) {
        player.firstRowCount += 1;
      }

      const solverEntry: CrosswordRowSolver = {
        userId: player.userId,
        username: player.username,
        nickname: player.nickname,
        avatarUrl: player.avatarUrl,
        order,
        points,
        answeredAt: now,
        elapsedMs: Math.max(0, now - row.startedAt),
      };

      row.solvers.push(solverEntry);
      if (order === 1) {
        row.firstSolver = solverEntry;
      }

      this.emitEffect(rt, 'crossword:answer:correct', {
        kind: 'ROW_CORRECT',
        rowNumber: row.rowNumber,
        order,
        nickname: player.nickname,
        username: player.username,
        avatarUrl: player.avatarUrl,
        pointsEarned: points,
        message:
          order === 1
            ? `⚡ ${player.nickname} giải ĐÚNG ĐẦU TIÊN Hàng ngang số ${row.rowNumber} (+${points}đ)!`
            : `🎯 ${player.nickname} trả lời đúng Hàng ${row.rowNumber} (#${order}, +${points}đ)!`,
      });

      // Nếu cấu hình tự động lật mở ngay khi có người đúng đầu tiên
      if (rt.config.autoRevealRowOnFirstCorrect && order === 1) {
        this.revealRow(rt.roomCode, row.rowNumber);
      } else {
        this.broadcast(rt, true);
      }

      return {
        action: 'CROSSWORD_ROW_SOLVED',
        rowNumber: row.rowNumber,
        order,
        pointsEarned: points,
      };
    }

    return { action: 'CROSSWORD_COMMENT_IGNORED' };
  }

  // ===================================================================
  // SIMULATOR CHO STREAMER TEST KHÔNG CẦN TIKTOK LIVE
  // ===================================================================

  private simCounter = 0;

  public simulate(
    roomCode: string,
    kind: 'JOIN_CROWD' | 'ROW_CORRECT' | 'ROW_WRONG' | 'KEYWORD_WRONG' | 'KEYWORD_CORRECT',
    opts: { count?: number } = {},
  ) {
    const rt = this.getRuntime(roomCode);
    const names = [
      'Minh Anh 🌸',
      'Hoàng Long ⚡',
      'Thảo Vy 🎀',
      'Quốc Bảo 🏆',
      'Khánh Linh ✨',
      'Đức Huy 🔥',
      'Ngọc Hân 💎',
      'Tuấn Kiệt 🚀',
      'Bảo Trâm 🌙',
      'Gia Hưng 🎯',
    ];
    const mkUser = (idx: number) => ({
      id: `xw-sim-u-${idx}`,
      username: `xw_player_${idx}`,
      nickname: names[idx % names.length] + (idx >= names.length ? ` #${idx}` : ''),
      avatarUrl: `https://api.dicebear.com/7.x/thumbs/svg?seed=xw${idx}`,
    });

    if (kind === 'JOIN_CROWD') {
      const n = opts.count || 8;
      const base = rt.players.size + 1;
      for (let i = 0; i < n; i++) {
        this.ensurePlayer(rt, {
          id: `xw-sim-${Date.now()}-${++this.simCounter}`,
          roomId: rt.roomCode,
          type: 'COMMENT',
          user: mkUser(base + i),
          payload: { content: 'Sẵn sàng giải mã ô chữ!' },
          receivedAt: Date.now(),
        });
      }
      this.broadcast(rt, true);
    } else if (kind === 'ROW_CORRECT') {
      const activeRow =
        rt.currentRowNumber !== null ? rt.rows.find((r) => r.rowNumber === rt.currentRowNumber) : null;
      if (!activeRow || rt.status !== 'QUESTION_ACTIVE') {
        throw new Error('Hãy bấm mở 1 Hàng ngang trước khi giả lập người trả lời đúng.');
      }
      const user = mkUser(++this.simCounter);
      this.handleComment({
        id: `xw-sim-${Date.now()}-${this.simCounter}`,
        roomId: rt.roomCode,
        type: 'COMMENT',
        user,
        payload: { content: activeRow.answer },
        receivedAt: Date.now(),
      });
    } else if (kind === 'ROW_WRONG') {
      const user = mkUser(++this.simCounter);
      this.handleComment({
        id: `xw-sim-${Date.now()}-${this.simCounter}`,
        roomId: rt.roomCode,
        type: 'COMMENT',
        user,
        payload: { content: 'Đáp án thử nghiệm' },
        receivedAt: Date.now(),
      });
    } else if (kind === 'KEYWORD_WRONG') {
      const wrongKeys = ['PYTHON', 'VIETNAM', 'SAIGON', 'DOCKER', 'BONGDA'];
      const user = mkUser(++this.simCounter);
      this.handleComment({
        id: `xw-sim-${Date.now()}-${this.simCounter}`,
        roomId: rt.roomCode,
        type: 'COMMENT',
        user,
        payload: { content: `KEYWORD ${wrongKeys[this.simCounter % wrongKeys.length]}` },
        receivedAt: Date.now(),
      });
    } else if (kind === 'KEYWORD_CORRECT') {
      if (rt.status === 'IDLE' || rt.status === 'FINISHED') {
        throw new Error('Hãy bắt đầu ván chơi trước khi giả lập giải mã từ khóa.');
      }
      const user = mkUser(++this.simCounter);
      this.handleComment({
        id: `xw-sim-${Date.now()}-${this.simCounter}`,
        roomId: rt.roomCode,
        type: 'COMMENT',
        user,
        payload: { content: `KEYWORD ${rt.keyword}` },
        receivedAt: Date.now(),
      });
    }

    return this.getPublicState(rt.roomCode, true);
  }
}
