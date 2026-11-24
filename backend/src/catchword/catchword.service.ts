import { Injectable, Logger } from '@nestjs/common';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { GameEvent } from '../common/types';

/**
 * =====================================================================
 * ĐUỔI HÌNH BẮT CHỮ LIVE (Catchword / Picture Word-Guessing Game)
 * ---------------------------------------------------------------------
 * Game tương tác tri thức & ngôn ngữ tiếng Việt cho TikTok LIVE:
 * - Người xem nhìn tổ hợp hình ảnh / gợi ý thị giác + ô chữ ẩn để đoán
 *   từ ghép, thành ngữ, địa danh, ẩm thực hoặc khái niệm khoa học.
 * - Miễn phí (0 xu):
 *   + Comment bất kỳ để tham gia bảng xếp hạng.
 *   + Comment đáp án (có dấu hoặc không dấu) để đoán đúng & ghi điểm tốc độ.
 *   + Comment "mở" / "gợi ý" / "hint": cứ mỗi 5 lượt vote cộng đồng sẽ
 *     tự động mở 1 ô chữ cái bí mật.
 * - Tặng quà (4 mốc kỹ năng):
 *   + 1–9 xu (🌹 Mở 1 Ô Chữ): Mở ngay 1 chữ cái +50 điểm.
 *   + 10–98 xu (💡 Gợi Ý Vàng & +10s): Mở gợi ý nghĩa +10s suy nghĩ +150 điểm.
 *   + 99–499 xu (⚡ Nhân Đôi Điểm x2): Kích hoạt x2 điểm 2 câu + mở 2 chữ +400 điểm.
 *   + 500+ xu (👑 Siêu Phá Đảo): Mở 50% chữ còn ẩn + mở gợi ý +1200 điểm.
 * =====================================================================
 */

export type CatchwordStatus = 'IDLE' | 'LOBBY' | 'QUESTION' | 'REVEAL' | 'FINISHED';
export type CatchwordDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface CatchwordClue {
  emoji: string;
  label: string;
}

export interface CatchwordPuzzle {
  id: string;
  category: string;
  difficulty: CatchwordDifficulty;
  clues: CatchwordClue[];
  answer: string;
  hint: string;
  explanation: string;
}

interface CatchwordPlayer {
  userId: string;
  username: string;
  nickname: string;
  avatarUrl?: string;
  score: number;
  solvedCount: number;
  fastestCount: number;
  giftCoins: number;
}

interface CatchwordSolverEntry {
  userId: string;
  nickname: string;
  avatarUrl?: string;
  order: number;
  points: number;
  elapsedMs: number;
}

interface CatchwordRuntime {
  roomCode: string;
  status: CatchwordStatus;
  puzzleIndex: number;
  puzzles: CatchwordPuzzle[];
  questionStartedAt: number;
  questionEndsAt: number;
  revealEndsAt: number;
  revealedIndices: number[];
  hintUnlocked: boolean;
  doubleUntilIndex: number;
  freeHintVotes: number;
  votedHintUsers: Set<string>;
  solvedUsers: Set<string>;
  solvers: CatchwordSolverEntry[];
  players: Map<string, CatchwordPlayer>;
  totalGiftCoins: number;
  config: {
    puzzleCount: number;
    timePerPuzzle: number;
    revealSeconds: number;
    autoRevealAfterSolvers: number;
    autoLoop?: boolean;
  };
  autoRevealScheduled: boolean;
  timers: NodeJS.Timeout[];
  lastBroadcastAt: number;
  pendingBroadcast: NodeJS.Timeout | null;
}

export const CATCHWORD_GIFT_TIERS = [
  {
    key: 'LETTER',
    minCoins: 1,
    maxCoins: 9,
    icon: '🌹',
    name: 'Mở 1 Ô Chữ',
    example: 'Hoa hồng, TikTok, GG (1–9 xu)',
    points: 50,
    description: 'Lật mở ngay 1 chữ cái bí mật bất kỳ và cộng +50 điểm cho người tặng.',
  },
  {
    key: 'HINT_TIME',
    minCoins: 10,
    maxCoins: 98,
    icon: '💡',
    name: 'Gợi Ý Vàng & +10s',
    example: 'Kẹo bông, Donut mini… (10–98 xu)',
    points: 150,
    description: 'Mở khóa gợi ý ý nghĩa từ khóa, cộng thêm +10 giây suy nghĩ & +150 điểm.',
  },
  {
    key: 'DOUBLE',
    minCoins: 99,
    maxCoins: 499,
    icon: '⚡',
    name: 'Nhân Đôi Điểm x2',
    example: 'Mũ cún, Nước hoa… (99–499 xu)',
    points: 400,
    description: 'Kích hoạt x2 điểm giải đố câu này & câu sau, mở 2 chữ cái & +400 điểm.',
  },
  {
    key: 'SUPER_REVEAL',
    minCoins: 500,
    maxCoins: Number.MAX_SAFE_INTEGER,
    icon: '👑',
    name: 'Siêu Phá Đảo',
    example: 'Thiên hà, Sư tử, Xe hơi… (500+ xu)',
    points: 1200,
    description: 'Mở tới 50% số ô chữ còn ẩn + mở gợi ý nghĩa & cộng +1200 điểm.',
  },
];

export const DEFAULT_PUZZLES: CatchwordPuzzle[] = [
  // === Từ ghép thú vị ===
  {
    id: 'cw-01',
    category: 'Từ ghép thú vị',
    difficulty: 'EASY',
    clues: [
      { emoji: '🐟', label: 'Cá' },
      { emoji: '🐴', label: 'Ngựa' },
    ],
    answer: 'CÁ NGỰA',
    hint: 'Sinh vật biển nhỏ bé có phần đầu giống loài ngựa',
    explanation: 'Cá ngựa (Hải mã) là loài cá biển đặc biệt, con đực mang túi ấp trứng.',
  },
  {
    id: 'cw-02',
    category: 'Từ ghép thú vị',
    difficulty: 'EASY',
    clues: [
      { emoji: '🐆', label: 'Con báo' },
      { emoji: '☀️', label: 'Thức dậy' },
    ],
    answer: 'BÁO THỨC',
    hint: 'Chức năng trên đồng hồ hoặc điện thoại gọi bạn dậy mỗi sáng',
    explanation: 'Ghép "Báo" (con báo) + "Thức" (thức dậy) = Báo thức.',
  },
  {
    id: 'cw-03',
    category: 'Từ ghép thú vị',
    difficulty: 'EASY',
    clues: [
      { emoji: '☀️', label: 'Mặt trời' },
      { emoji: '🌻', label: 'Hoa' },
    ],
    answer: 'HƯỚNG DƯƠNG',
    hint: 'Loài hoa vàng rực luôn quay về phía ánh nắng',
    explanation: 'Hoa hướng dương luôn hướng về phía Mặt Trời (Dương = mặt trời).',
  },
  {
    id: 'cw-04',
    category: 'Từ ghép thú vị',
    difficulty: 'EASY',
    clues: [
      { emoji: '🐝', label: 'Ong' },
      { emoji: '👑', label: 'Vua / Chúa' },
    ],
    answer: 'ONG CHÚA',
    hint: 'Cá thể lớn nhất và đẻ trứng duy nhất trong đàn ong',
    explanation: 'Ong chúa là trung tâm sinh sản quyết định sự tồn vong của cả tổ ong.',
  },
  {
    id: 'cw-05',
    category: 'Từ ghép thú vị',
    difficulty: 'EASY',
    clues: [
      { emoji: '🐴', label: 'Ngựa' },
      { emoji: '🦓', label: 'Vằn' },
    ],
    answer: 'NGỰA VẰN',
    hint: 'Loài động vật châu Phi có bộ lông sọc đen trắng',
    explanation: 'Mỗi con ngựa vằn có hoa văn sọc đen trắng độc nhất như vân tay.',
  },
  {
    id: 'cw-06',
    category: 'Từ ghép thú vị',
    difficulty: 'EASY',
    clues: [
      { emoji: '🐘', label: 'Voi' },
      { emoji: '🦷', label: 'Ngà' },
    ],
    answer: 'NGÀ VOI',
    hint: 'Bộ phận trắng quý giá mọc dài từ hàm trên của voi',
    explanation: 'Ngà voi thực chất là cặp răng cửa mọc dài phát triển liên tục.',
  },
  {
    id: 'cw-07',
    category: 'Từ ghép thú vị',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '👀', label: 'Mắt' },
      { emoji: '🐯', label: 'Hổ' },
    ],
    answer: 'MẮT HỔ',
    hint: 'Một loại đá quý phong thủy màu vàng nâu óng ánh',
    explanation: 'Đá mắt hổ có hiệu ứng ánh lụa giống con ngươi của loài hổ.',
  },
  {
    id: 'cw-08',
    category: 'Từ ghép thú vị',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '✋', label: 'Tay' },
      { emoji: '💼', label: 'Áo / Túi' },
    ],
    answer: 'TAY TRONG',
    hint: 'Chỉ người nội bộ ngầm hỗ trợ từ bên trong',
    explanation: '"Tay trong" là người cùng phe hoặc gián điệp hỗ trợ từ nội bộ.',
  },
  {
    id: 'cw-09',
    category: 'Từ ghép thú vị',
    difficulty: 'EASY',
    clues: [
      { emoji: '👑', label: 'Vua' },
      { emoji: '🦁', label: 'Chúa sơn lâm' },
    ],
    answer: 'CHÚA SƠN LÂM',
    hint: 'Danh hiệu oai phong của loài thú thống trị rừng xanh',
    explanation: 'Trong văn hóa Việt Nam, hổ thường được tôn xưng là Chúa Sơn Lâm.',
  },
  {
    id: 'cw-10',
    category: 'Từ ghép thú vị',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '💧', label: 'Giọt nước' },
      { emoji: '🌊', label: 'Tràn' },
      { emoji: '🥛', label: 'Ly' },
    ],
    answer: 'GIỌT NƯỚC TRÀN LY',
    hint: 'Chỉ giới hạn chịu đựng cuối cùng trước khi bùng nổ (4 chữ)',
    explanation: 'Một giọt nước cuối cùng làm ly nước đầy tràn ra ngoài.',
  },
  // === Thành ngữ - Tục ngữ ===
  {
    id: 'cw-11',
    category: 'Thành ngữ - Tục ngữ',
    difficulty: 'EASY',
    clues: [
      { emoji: '🥚', label: 'Trứng' },
      { emoji: '⚔️', label: 'Chọi' },
      { emoji: '🪨', label: 'Đá' },
    ],
    answer: 'TRỨNG CHỌI ĐÁ',
    hint: 'Thành ngữ chỉ kẻ yếu liều lĩnh đối đầu với thế lực quá mạnh',
    explanation: 'Lấy trứng chọi đá: cuộc đối đầu không cân sức, phần thua rõ rệt.',
  },
  {
    id: 'cw-12',
    category: 'Thành ngữ - Tục ngữ',
    difficulty: 'EASY',
    clues: [
      { emoji: '🐸', label: 'Ếch' },
      { emoji: '🪑', label: 'Ngồi' },
      { emoji: '🕳️', label: 'Đáy giếng' },
    ],
    answer: 'ẾCH NGỒI ĐÁY GIẾNG',
    hint: 'Thành ngữ chê người hiểu biết hạn hẹp nhưng hay tự phụ',
    explanation: 'Ếch ngồi đáy giếng chỉ nhìn thấy bầu trời nhỏ bằng cái vung.',
  },
  {
    id: 'cw-13',
    category: 'Thành ngữ - Tục ngữ',
    difficulty: 'EASY',
    clues: [
      { emoji: '🐃', label: 'Trâu' },
      { emoji: '🎸', label: 'Đàn' },
      { emoji: '👂', label: 'Tai' },
    ],
    answer: 'ĐÀN GẢY TAI TRÂU',
    hint: 'Thành ngữ chỉ việc nói điều hay với người không hiểu gì',
    explanation: 'Đàn gảy tai trâu: công sức giải thích vô ích vì đối phương không tiếp thu.',
  },
  {
    id: 'cw-14',
    category: 'Thành ngữ - Tục ngữ',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '💦', label: 'Nước' },
      { emoji: '🦆', label: 'Đầu vịt' },
    ],
    answer: 'NƯỚC ĐỔ ĐẦU VỊT',
    hint: 'Khuyên nhủ mãi nhưng không thấm vào đâu',
    explanation: 'Lông vịt có lớp dầu không thấm nước, ví như lời khuyên trôi tuột đi.',
  },
  {
    id: 'cw-15',
    category: 'Thành ngữ - Tục ngữ',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '🪵', label: 'Củi / Gỗ' },
      { emoji: '🐘', label: 'Voi' },
      { emoji: '🦯', label: 'Sờ' },
    ],
    answer: 'THẦY BÓI XEM VOI',
    hint: 'Câu chuyện nhìn nhận phiến diện một bộ phận mà đánh giá toàn thể',
    explanation: 'Thầy bói xem voi mỗi người sờ một bộ phận rồi tranh cãi hình thù con voi.',
  },
  {
    id: 'cw-16',
    category: 'Thành ngữ - Tục ngữ',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '🐔', label: 'Gà' },
      { emoji: '🏠', label: 'Nhà' },
      { emoji: '🥊', label: 'Đá nhau' },
    ],
    answer: 'GÀ CÙNG MỘT MẸ',
    hint: '4 chữ nhắc nhở anh em cùng nhà phải biết yêu thương nhau',
    explanation: 'Ca dao: "Khôn ngoan đối đáp người ngoài / Gà cùng một mẹ chớ hoài đá nhau".',
  },
  {
    id: 'cw-17',
    category: 'Thành ngữ - Tục ngữ',
    difficulty: 'HARD',
    clues: [
      { emoji: '🌧️', label: 'Mưa' },
      { emoji: '🌬️', label: 'Gió' },
      { emoji: '🤝', label: 'Hòa thuận' },
    ],
    answer: 'MƯA THUẬN GIÓ HÒA',
    hint: 'Thời tiết lý tưởng cho mùa màng bội thu, cuộc sống yên vui',
    explanation: 'Mưa thuận gió hòa là ước vọng cổ truyền của cư dân nông nghiệp lúa nước.',
  },
  {
    id: 'cw-18',
    category: 'Thành ngữ - Tục ngữ',
    difficulty: 'HARD',
    clues: [
      { emoji: '🌊', label: 'Sóng' },
      { emoji: '🎍', label: 'Tre' },
      { emoji: '🌱', label: 'Măng' },
    ],
    answer: 'TRE GIÀ MĂNG MỌC',
    hint: 'Quy luật thế hệ sau kế tiếp và phát huy thành quả thế hệ trước',
    explanation: 'Tre già măng mọc: biểu tượng cho sự kế thừa liên tục qua các thế hệ.',
  },
  {
    id: 'cw-19',
    category: 'Thành ngữ - Tục ngữ',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '1️⃣', label: 'Một' },
      { emoji: '🌲', label: 'Cây' },
      { emoji: '⛰️', label: 'Núi non' },
    ],
    answer: 'MỘT CÂY LÀM CHẲNG NÊN NON',
    hint: '6 chữ ca ngợi sức mạnh của tinh thần đoàn kết',
    explanation: 'Ca dao: "Một cây làm chẳng nên non / Ba cây chụm lại nên hòn núi cao".',
  },
  // === Địa danh Việt Nam ===
  {
    id: 'cw-20',
    category: 'Địa danh Việt Nam',
    difficulty: 'EASY',
    clues: [
      { emoji: '🌉', label: 'Cầu' },
      { emoji: '🐉', label: 'Rồng' },
    ],
    answer: 'CẦU RỒNG',
    hint: 'Cây cầu nổi tiếng biết phun lửa và phun nước ở Đà Nẵng',
    explanation: 'Cầu Rồng bắc qua sông Hàn (Đà Nẵng), khánh thành năm 2013.',
  },
  {
    id: 'cw-21',
    category: 'Địa danh Việt Nam',
    difficulty: 'EASY',
    clues: [
      { emoji: '🏞️', label: 'Hồ' },
      { emoji: '🗡️', label: 'Gươm' },
    ],
    answer: 'HỒ GƯƠM',
    hint: 'Hồ nước biểu tượng nằm giữa trung tâm Thủ đô Hà Nội',
    explanation: 'Hồ Gươm (Hồ Hoàn Kiếm) gắn với truyền thuyết vua Lê Lợi trả gươm thần.',
  },
  {
    id: 'cw-22',
    category: 'Địa danh Việt Nam',
    difficulty: 'EASY',
    clues: [
      { emoji: '🐉', label: 'Rồng' },
      { emoji: '⬇️', label: 'Hạ xuống' },
    ],
    answer: 'HẠ LONG',
    hint: 'Kỳ quan thiên nhiên thế giới nổi tiếng ở Quảng Ninh',
    explanation: 'Vịnh Hạ Long nghĩa là vùng vịnh nơi rồng đáp xuống giúp dân đánh giặc.',
  },
  {
    id: 'cw-23',
    category: 'Địa danh Việt Nam',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '⛰️', label: 'Núi' },
      { emoji: '👵', label: 'Bà' },
      { emoji: '🖤', label: 'Đen' },
    ],
    answer: 'NÚI BÀ ĐEN',
    hint: 'Ngọn núi cao nhất Nam Bộ nằm ở tỉnh Tây Ninh',
    explanation: 'Núi Bà Đen cao 986 m, được mệnh danh là "Nóc nhà Nam Bộ".',
  },
  {
    id: 'cw-24',
    category: 'Địa danh Việt Nam',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '🏝️', label: 'Đảo' },
      { emoji: '💎', label: 'Ngọc' },
    ],
    answer: 'PHÚ QUỐC',
    hint: 'Hòn đảo lớn nhất Việt Nam được mệnh danh là Đảo Ngọc',
    explanation: 'Phú Quốc thuộc tỉnh Kiên Giang là thành phố đảo đầu tiên của Việt Nam.',
  },
  {
    id: 'cw-25',
    category: 'Địa danh Việt Nam',
    difficulty: 'HARD',
    clues: [
      { emoji: '🌸', label: 'Hoa' },
      { emoji: '🏯', label: 'Kinh đô / Lư' },
    ],
    answer: 'HOA LƯ',
    hint: 'Cố đô đầu tiên của nhà nước phong kiến tập quyền Việt Nam ở Ninh Bình',
    explanation: 'Kinh đô Hoa Lư được Đinh Tiên Hoàng chọn làm kinh đô Đại Cồ Việt năm 968.',
  },
  // === Ẩm thực & Đời sống ===
  {
    id: 'cw-26',
    category: 'Ẩm thực & Đời sống',
    difficulty: 'EASY',
    clues: [
      { emoji: '🥖', label: 'Bánh mì' },
      { emoji: '🔥', label: 'Nóng / Que' },
    ],
    answer: 'BÁNH MÌ QUE',
    hint: 'Đặc sản đường phố trứ danh của Hải Phòng, nhỏ dài giòn rụm',
    explanation: 'Bánh mì que (bánh mì cay) Hải Phòng nổi tiếng với nhân pate và chí chương.',
  },
  {
    id: 'cw-27',
    category: 'Ẩm thực & Đời sống',
    difficulty: 'EASY',
    clues: [
      { emoji: '☕', label: 'Cà phê' },
      { emoji: '🥛', label: 'Sữa' },
      { emoji: '🧊', label: 'Đá' },
    ],
    answer: 'CÀ PHÊ SỮA ĐÁ',
    hint: 'Thức uống quốc dân của người Việt được thế giới yêu thích',
    explanation: 'Cà phê phin đậm đà hòa quyện sữa đặc có đường và đá lạnh.',
  },
  {
    id: 'cw-28',
    category: 'Ẩm thực & Đời sống',
    difficulty: 'EASY',
    clues: [
      { emoji: '🥟', label: 'Bánh' },
      { emoji: '🌙', label: 'Trung thu / Trăng' },
    ],
    answer: 'BÁNH TRUNG THU',
    hint: 'Món bánh truyền thống ngày rằm tháng Tám âm lịch',
    explanation: 'Bánh nướng, bánh dẻo hình tròn tượng trưng cho trăng rằm và sự sum vầy.',
  },
  {
    id: 'cw-29',
    category: 'Ẩm thực & Đời sống',
    difficulty: 'EASY',
    clues: [
      { emoji: '🍜', label: 'Bún' },
      { emoji: '🐂', label: 'Bò' },
      { emoji: '🏯', label: 'Huế' },
    ],
    answer: 'BÚN BÒ HUẾ',
    hint: 'Đặc sản nổi tiếng đất cố đô với nước dùng sả ruốc đậm vị',
    explanation: 'Bún bò Huế mang hương vị đặc trưng của mắm ruốc, sả và ớt sa tế.',
  },
  {
    id: 'cw-30',
    category: 'Ẩm thực & Đời sống',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '🌾', label: 'Cốm' },
      { emoji: '🍃', label: 'Lá sen / Mùa thu' },
    ],
    answer: 'CỐM LÀNG VÒNG',
    hint: 'Thức quà thanh tao gắn với mùa thu Hà Nội',
    explanation: 'Cốm Vòng làm từ lúa nếp non, gói trong lá sen thơm dịu.',
  },
  {
    id: 'cw-31',
    category: 'Ẩm thực & Đời sống',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '🍵', label: 'Trà' },
      { emoji: '🍋', label: 'Chanh' },
    ],
    answer: 'TRÀ CHANH',
    hint: 'Thức uống vỉa hè bình dân gắn liền giới trẻ ("... chém gió")',
    explanation: 'Văn hóa "trà chanh chém gió" là nét sinh hoạt đặc trưng quanh Nhà Thờ Lớn Hà Nội.',
  },
  // === Khoa học & Tự nhiên ===
  {
    id: 'cw-32',
    category: 'Khoa học & Tự nhiên',
    difficulty: 'EASY',
    clues: [
      { emoji: '🌈', label: 'Cầu vồng' },
      { emoji: '7️⃣', label: '7 sắc' },
    ],
    answer: 'CẦU VỒNG',
    hint: 'Hiện tượng tán sắc ánh sáng qua giọt nước mưa trên bầu trời',
    explanation: 'Cầu vồng có 7 dải màu cơ bản từ đỏ đến tím nhờ khúc xạ và phản xạ ánh sáng.',
  },
  {
    id: 'cw-33',
    category: 'Khoa học & Tự nhiên',
    difficulty: 'EASY',
    clues: [
      { emoji: '🕳️', label: 'Hố' },
      { emoji: '⬛', label: 'Đen' },
    ],
    answer: 'HỐ ĐEN',
    hint: 'Vùng không-thời gian có lực hấp dẫn mạnh đến mức ánh sáng không thoát ra được',
    explanation: 'Hố đen (Black Hole) hình thành khi các ngôi sao siêu lớn suy sụp hấp dẫn.',
  },
  {
    id: 'cw-34',
    category: 'Khoa học & Tự nhiên',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '☀️', label: 'Mặt trời' },
      { emoji: '🌑', label: 'Che khuất' },
    ],
    answer: 'NHẬT THỰC',
    hint: 'Hiện tượng Mặt Trăng đi vào giữa Trái Đất và Mặt Trời',
    explanation: 'Khi Nhật thực toàn phần, bầu trời ban ngày tối sầm lại trong vài phút.',
  },
  {
    id: 'cw-35',
    category: 'Khoa học & Tự nhiên',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '🌙', label: 'Mặt trăng' },
      { emoji: '🔴', label: 'Máu / Đỏ' },
    ],
    answer: 'NGUYỆT THỰC',
    hint: 'Hiện tượng Trái Đất che ánh nắng chiếu tới Mặt Trăng ("Trăng máu")',
    explanation: 'Nguyệt thực xảy ra vào đêm trăng tròn khi Trái Đất nằm giữa Mặt Trời và Mặt Trăng.',
  },
  {
    id: 'cw-36',
    category: 'Khoa học & Tự nhiên',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '⚡', label: 'Điện / Sét' },
      { emoji: '☔', label: 'Cột thu' },
    ],
    answer: 'CỘT THU LÔI',
    hint: 'Thiết bị kim loại trên nóc nhà cao tầng giúp dẫn sét xuống đất an toàn',
    explanation: 'Benjamin Franklin phát minh cột thu lôi vào thế kỷ 18.',
  },
  {
    id: 'cw-37',
    category: 'Khoa học & Tự nhiên',
    difficulty: 'HARD',
    clues: [
      { emoji: '🌿', label: 'Lá xanh' },
      { emoji: '☀️', label: 'Ánh nắng' },
      { emoji: '🫧', label: 'Oxy' },
    ],
    answer: 'QUANG HỢP',
    hint: 'Quá trình thực vật dùng ánh sáng chuyển hóa CO2 và nước thành đường & oxy',
    explanation: 'Quang hợp diễn ra ở lục lạp chứa diệp lục, nuôi sống gần như toàn bộ sinh quyển.',
  },
  {
    id: 'cw-38',
    category: 'Từ ghép thú vị',
    difficulty: 'HARD',
    clues: [
      { emoji: '⏱️', label: 'Thời gian' },
      { emoji: '💸', label: 'Vàng bạc / Tiền' },
    ],
    answer: 'THỜI GIAN LÀ VÀNG BẠC',
    hint: '5 chữ nhắc nhở phải biết quý trọng từng giây phút',
    explanation: 'Câu nói nổi tiếng nhấn mạnh giá trị vô giá của thời gian.',
  },
  // === Thành ngữ & Tục ngữ dân gian ===
  {
    id: 'cw-39',
    category: 'Thành ngữ dân gian',
    difficulty: 'EASY',
    clues: [
      { emoji: '💧', label: 'Uống nước' },
      { emoji: '🏞️', label: 'Nhớ nguồn' },
    ],
    answer: 'UỐNG NƯỚC NHỚ NGUỒN',
    hint: 'Đạo lý biết ơn nguồn cội, tổ tiên của dân tộc Việt',
    explanation: 'Truyền thống tri ân người đi trước đã tạo dựng thành quả cho thế hệ sau.',
  },
  {
    id: 'cw-40',
    category: 'Thành ngữ dân gian',
    difficulty: 'EASY',
    clues: [
      { emoji: '🍎', label: 'Ăn quả' },
      { emoji: '🌳', label: 'Trồng cây' },
    ],
    answer: 'ĂN QUẢ NHỚ KẺ TRỒNG CÂY',
    hint: 'Lời khuyên luôn ghi nhớ công ơn người giúp đỡ mình',
    explanation: 'Thành ngữ răn dạy lòng biết ơn đối với người có công nuôi dưỡng, gầy dựng.',
  },
  {
    id: 'cw-41',
    category: 'Thành ngữ dân gian',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '🍃', label: 'Lá lành' },
      { emoji: '🍂', label: 'Lá rách' },
    ],
    answer: 'LÁ LÀNH ĐÙM LÁ RÁCH',
    hint: 'Tinh thần tương thân tương ái, cưu mang đùm bọc lẫn nhau',
    explanation: 'Biểu tượng của lòng nhân ái, sẻ chia khi đồng bào gặp hoạn nạn khó khăn.',
  },
  {
    id: 'cw-42',
    category: 'Thành ngữ dân gian',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '🌊', label: 'Nước chảy' },
      { emoji: '🪨', label: 'Đá mòn' },
    ],
    answer: 'NƯỚC CHẢY ĐÁ MÒN',
    hint: 'Sự kiên trì, bền bỉ qua năm tháng sẽ làm nên kỳ tích',
    explanation: 'Ý chí bền bỉ dù việc khó đến đâu thì cuối cùng cũng sẽ thành công.',
  },
  {
    id: 'cw-43',
    category: 'Thành ngữ dân gian',
    difficulty: 'HARD',
    clues: [
      { emoji: '🗡️', label: 'Mài sắt' },
      { emoji: '🪡', label: 'Nên kim' },
    ],
    answer: 'CÓ CÔNG MÀI SẮT CÓ NGÀY NÊN KIM',
    hint: 'Chỉ cần nhẫn nại rèn luyện thì nhất định có ngày thành tài',
    explanation: 'Bài học về lòng kiên trì và nghị lực vượt khó.',
  },
  {
    id: 'cw-44',
    category: 'Thành ngữ dân gian',
    difficulty: 'EASY',
    clues: [
      { emoji: '🐱', label: 'Mèo' },
      { emoji: '🐭', label: 'Chuột' },
    ],
    answer: 'MÈO BẮT CHUỘT',
    hint: 'Hình ảnh quen thuộc trong nhà, một loài bắt một loài',
    explanation: 'Bản năng tự nhiên của mèo trong việc săn bắt chuột bảo vệ mùa màng.',
  },
  {
    id: 'cw-45',
    category: 'Thành ngữ dân gian',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '🧗', label: 'Khó khăn' },
      { emoji: '💡', label: 'Khôn ngoan' },
    ],
    answer: 'CÁI KHÓ LÓ CÁI KHÔN',
    hint: 'Trong hoàn cảnh ngặt nghèo con người lại nảy ra giải pháp sáng tạo',
    explanation: 'Nghịch cảnh thúc đẩy trí thông minh và khả năng thích ứng của con người.',
  },
  // === Ẩm thực & Đời sống quen thuộc ===
  {
    id: 'cw-46',
    category: 'Ẩm thực & Đời sống',
    difficulty: 'EASY',
    clues: [
      { emoji: '🍜', label: 'Bát phở' },
      { emoji: '🐂', label: 'Con bò' },
    ],
    answer: 'PHỞ BÒ',
    hint: 'Món ăn quốc hồn quốc túy của Việt Nam với nước dùng thơm mùi quế hồi',
    explanation: 'Phở bò Hà Nội và Nam Định là hai phong cách phở nổi tiếng bậc nhất.',
  },
  {
    id: 'cw-47',
    category: 'Ẩm thực & Đời sống',
    difficulty: 'EASY',
    clues: [
      { emoji: '🎋', label: 'Lá dong' },
      { emoji: '🟩', label: 'Bánh vuông' },
      { emoji: '🥩', label: 'Thịt đỗ' },
    ],
    answer: 'BÁNH CHƯNG',
    hint: 'Món bánh vuông truyền thống không thể thiếu trong ngày Tết cổ truyền',
    explanation: 'Bánh chưng hình vuông tượng trưng cho Đất theo truyền thuyết Lang Liêu.',
  },
  {
    id: 'cw-48',
    category: 'Ẩm thực & Đời sống',
    difficulty: 'EASY',
    clues: [
      { emoji: '🧋', label: 'Trà sữa' },
      { emoji: '⚫', label: 'Trân châu' },
    ],
    answer: 'TRÀ SỮA TRÂN CHÂU',
    hint: 'Thức uống gây sốt của giới trẻ với các hạt dai ngon',
    explanation: 'Trà sữa kết hợp các viên bột năng caramen giòn dai hấp dẫn.',
  },
  {
    id: 'cw-49',
    category: 'Ẩm thực & Đời sống',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '🍚', label: 'Cơm' },
      { emoji: '🪵', label: 'Ống tre' },
    ],
    answer: 'CƠM LAM',
    hint: 'Đặc sản vùng cao nấu gạo nếp trong ống tre nứa thơm lừng',
    explanation: 'Cơm lam là nét văn hóa ẩm thực độc đáo của đồng bào vùng Tây Bắc và Tây Nguyên.',
  },
  {
    id: 'cw-50',
    category: 'Ẩm thực & Đời sống',
    difficulty: 'EASY',
    clues: [
      { emoji: '🐟', label: 'Cá' },
      { emoji: '🏺', label: 'Nước cốt' },
    ],
    answer: 'NƯỚC MẮM',
    hint: 'Gia vị truyền thống đậm đà trong bữa cơm của mọi gia đình Việt',
    explanation: 'Nước mắm ủ từ cá cơm tươi và muối biển nguyên chất.',
  },
  // === Vật dụng & Công nghệ ===
  {
    id: 'cw-51',
    category: 'Vật dụng đời sống',
    difficulty: 'EASY',
    clues: [
      { emoji: '🚲', label: 'Xe đạp' },
      { emoji: '⚡', label: 'Điện' },
    ],
    answer: 'XE ĐẠP ĐIỆN',
    hint: 'Phương tiện 2 bánh chạy bằng ắc quy rất phổ biến với học sinh',
    explanation: 'Xe đạp điện thân thiện với môi trường và tiện dụng khi di chuyển gần.',
  },
  {
    id: 'cw-52',
    category: 'Vật dụng đời sống',
    difficulty: 'EASY',
    clues: [
      { emoji: '📱', label: 'Điện thoại' },
      { emoji: '🧠', label: 'Thông minh' },
    ],
    answer: 'ĐIỆN THOẠI THÔNG MINH',
    hint: 'Vật bất ly thân hiện đại có màn hình cảm ứng kết nối Internet',
    explanation: 'Smartphone kết hợp máy tính cầm tay và các tính năng liên lạc tiện lợi.',
  },
  {
    id: 'cw-53',
    category: 'Vật dụng đời sống',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '🎧', label: 'Tai nghe' },
      { emoji: '📶', label: 'Không dây' },
    ],
    answer: 'TAI NGHE KHÔNG DÂY',
    hint: 'Thiết bị nghe nhạc Bluetooth gọn nhẹ đeo vào tai',
    explanation: 'Tai nghe True Wireless (TWS) mang lại sự tiện nghi không vướng víu dây cáp.',
  },
  {
    id: 'cw-54',
    category: 'Vật dụng đời sống',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '⏳', label: 'Đồng hồ' },
      { emoji: '🏖️', label: 'Cát' },
    ],
    answer: 'ĐỒNG HỒ CÁT',
    hint: 'Dụng cụ đo thời gian cổ xưa bằng các hạt cát chảy qua eo hẹp',
    explanation: 'Đồng hồ cát đo thời gian dựa vào lượng cát chảy từ bầu trên xuống bầu dưới.',
  },
  {
    id: 'cw-55',
    category: 'Vật dụng đời sống',
    difficulty: 'HARD',
    clues: [
      { emoji: '🪜', label: 'Thang' },
      { emoji: '🏢', label: 'Máy / Tòa nhà' },
    ],
    answer: 'CẦU THANG MÁY',
    hint: 'Thiết bị vận chuyển người lên xuống giữa các tầng trong tòa nhà cao tầng',
    explanation: 'Thang máy giúp việc di chuyển trong các tòa cao ốc nhanh chóng và dễ dàng.',
  },
  // === Địa danh & Danh lam thắng cảnh ===
  {
    id: 'cw-56',
    category: 'Địa danh Việt Nam',
    difficulty: 'EASY',
    clues: [
      { emoji: '🐢', label: 'Rùa thần' },
      { emoji: '🗡️', label: 'Thanh gươm' },
    ],
    answer: 'HỒ GƯƠM',
    hint: 'Hồ Hoàn Kiếm giữa lòng thủ đô Hà Nội gắn với truyền thuyết trả gươm báu',
    explanation: 'Lê Lợi sau khi đánh thắng giặc Minh đã hoàn trả thanh gươm thần cho Rùa Vàng tại đây.',
  },
  {
    id: 'cw-57',
    category: 'Địa danh Việt Nam',
    difficulty: 'EASY',
    clues: [
      { emoji: '🏖️', label: 'Bãi biển' },
      { emoji: '🌊', label: 'Thành phố biển Khánh Hòa' },
    ],
    answer: 'NHA TRANG',
    hint: 'Thành phố biển xinh đẹp với bãi cát dài và cáp treo vượt biển nổi tiếng',
    explanation: 'Vịnh Nha Trang được công nhận là một trong những vịnh biển đẹp nhất thế giới.',
  },
  {
    id: 'cw-58',
    category: 'Địa danh Việt Nam',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '🌸', label: 'Thành phố hoa' },
      { emoji: '🌲', label: 'Rừng thông' },
      { emoji: '🥶', label: 'Sương mù' },
    ],
    answer: 'ĐÀ LẠT',
    hint: 'Thành phố ngàn hoa xứ sở sương mù trên cao nguyên Lâm Viên',
    explanation: 'Đà Lạt nổi tiếng với khí hậu mát mẻ quanh năm và phong cảnh lãng mạn.',
  },
  {
    id: 'cw-59',
    category: 'Địa danh Việt Nam',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '🏔️', label: 'Dãy núi' },
      { emoji: '❄️', label: 'Băng tuyết / Fansipan' },
    ],
    answer: 'SA PA',
    hint: 'Thị xã vùng cao Lào Cai nơi có đỉnh Fansipan nóc nhà Đông Dương',
    explanation: 'Sa Pa thu hút khách du lịch với ruộng bậc thang kỳ vĩ và mùa đông tuyết rơi.',
  },
  {
    id: 'cw-60',
    category: 'Địa danh Việt Nam',
    difficulty: 'EASY',
    clues: [
      { emoji: '⚓', label: 'Vũng / Mỏ neo' },
      { emoji: '⛵', label: 'Con tàu' },
    ],
    answer: 'VŨNG TÀU',
    hint: 'Thành phố biển Đông Nam Bộ có tượng Chúa Kito và ngọn hải đăng cổ',
    explanation: 'Vũng Tàu là điểm đến nghỉ dưỡng biển hàng đầu của người dân miền Nam.',
  },
  // === Tự nhiên & Động thực vật ===
  {
    id: 'cw-61',
    category: 'Khoa học & Tự nhiên',
    difficulty: 'EASY',
    clues: [
      { emoji: '🌻', label: 'Hoa vàng' },
      { emoji: '☀️', label: 'Mặt trời' },
    ],
    answer: 'HOA HƯỚNG DƯƠNG',
    hint: 'Loài hoa luôn hướng về phía ánh sáng mặt trời',
    explanation: 'Hoa hướng dương có tính hướng nhật động trong giai đoạn phát triển.',
  },
  {
    id: 'cw-62',
    category: 'Khoa học & Tự nhiên',
    difficulty: 'EASY',
    clues: [
      { emoji: '⭐', label: 'Ngôi sao' },
      { emoji: '🌠', label: 'Vệt sáng băng qua' },
    ],
    answer: 'SAO BĂNG',
    hint: 'Vệt sáng vụt qua trên bầu trời đêm khi các thiên thạch cọ xát bầu khí quyển',
    explanation: 'Người ta thường ước một điều may mắn khi nhìn thấy vệt sao băng.',
  },
  {
    id: 'cw-63',
    category: 'Khoa học & Tự nhiên',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '🌋', label: 'Ngọn núi' },
      { emoji: '🔥', label: 'Dung nham' },
    ],
    answer: 'NÚI LỬA',
    hint: 'Miệng núi phun trào dung nham đỏ rực từ lòng đất',
    explanation: 'Núi lửa hình thành do sự dịch chuyển của các mảng kiến tạo lớp vỏ Trái Đất.',
  },
  {
    id: 'cw-64',
    category: 'Khoa học & Tự nhiên',
    difficulty: 'HARD',
    clues: [
      { emoji: '🌊', label: 'Sóng lớn' },
      { emoji: '💥', label: 'Động đất ngầm' },
    ],
    answer: 'SÓNG THẦN',
    hint: 'Cơn sóng khổng lồ từ đại dương gây ra bởi động đất dưới đáy biển',
    explanation: 'Sóng thần (Tsunami) di chuyển với tốc độ hàng trăm km/h trên đại dương.',
  },
  {
    id: 'cw-65',
    category: 'Động vật kỳ thú',
    difficulty: 'EASY',
    clues: [
      { emoji: '🦚', label: 'Chim xòe đuôi' },
      { emoji: '👑', label: 'Lộng lẫy' },
    ],
    answer: 'CON CÔNG',
    hint: 'Loài chim có bộ lông đuôi xòe tròn như chiếc quạt sặc sỡ',
    explanation: 'Công đực xòe đuôi rực rỡ để quyến rũ bạn tình trong mùa sinh sản.',
  },
  {
    id: 'cw-66',
    category: 'Động vật kỳ thú',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '🕊️', label: 'Chim bay' },
      { emoji: '🌸', label: 'Báo hiệu mùa xuân' },
    ],
    answer: 'CHIM ÉN',
    hint: 'Cánh chim chao lượn báo hiệu mùa xuân về trên mọi nẻo đường',
    explanation: 'Cánh én mùa xuân là biểu tượng của sự may mắn, ấm áp và khởi đầu mới.',
  },
  {
    id: 'cw-67',
    category: 'Từ ghép thú vị',
    difficulty: 'EASY',
    clues: [
      { emoji: '🛡️', label: 'Bảo vệ' },
      { emoji: '🏥', label: 'Y tế sức khỏe' },
    ],
    answer: 'BẢO HIỂM Y TẾ',
    hint: 'Chính sách an sinh xã hội giúp hỗ trợ chi phí khám chữa bệnh',
    explanation: 'Bảo hiểm y tế giúp chia sẻ rủi ro tài chính khi người dân đau ốm, bệnh tật.',
  },
  {
    id: 'cw-68',
    category: 'Từ ghép thú vị',
    difficulty: 'MEDIUM',
    clues: [
      { emoji: '⚽', label: 'Bóng đá' },
      { emoji: '🥅', label: 'Khung thành' },
    ],
    answer: 'THỦ MÔN',
    hint: 'Người gác đền trấn giữ khung thành trong môn thể thao vua',
    explanation: 'Thủ môn là cầu thủ duy nhất được dùng tay chơi bóng trong vòng cấm địa.',
  },
  {
    id: 'cw-69',
    category: 'Từ ghép thú vị',
    difficulty: 'HARD',
    clues: [
      { emoji: '🎓', label: 'Mũ tốt nghiệp' },
      { emoji: '📜', label: 'Bằng cấp cao nhất' },
    ],
    answer: 'TIẾN SĨ',
    hint: 'Học vị cao nhất trong hệ thống giáo dục đại học',
    explanation: 'Người bảo vệ thành công luận án tiến sĩ được công nhận học vị Tiến sĩ.',
  },
  {
    id: 'cw-70',
    category: 'Từ ghép thú vị',
    difficulty: 'EASY',
    clues: [
      { emoji: '🚒', label: 'Xe cứu hỏa' },
      { emoji: '🧯', label: 'Dập lửa' },
    ],
    answer: 'CỨU HỎA',
    hint: 'Lực lượng dũng cảm xông pha dập tắt các đám cháy cứu nạn',
    explanation: 'Lính cứu hỏa luôn túc trực 24/7 để bảo vệ an toàn tính mạng cho người dân.',
  },
];

@Injectable()
export class CatchwordService {
  private readonly logger = new Logger(CatchwordService.name);
  private readonly rooms = new Map<string, CatchwordRuntime>();
  private readonly customPuzzles: CatchwordPuzzle[] = [];

  constructor(private readonly gateway: RealtimeGateway) {}

  // ===================================================================
  // HELPERS
  // ===================================================================

  public normalizeVi(raw?: string): string {
    if (!raw) return '';
    return raw
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đð]/g, 'd')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  private isMatchAnswer(comment: string, canonicalAnswer: string): boolean {
    const normC = this.normalizeVi(comment);
    const normA = this.normalizeVi(canonicalAnswer);
    if (!normC || !normA) return false;
    if (normC === normA) return true;
    if (` ${normC} `.includes(` ${normA} `)) return true;
    // Cho phép gõ dính không dấu cách trên chat LIVE (vd: "cangua")
    const compactA = normA.replace(/\s+/g, '');
    if (compactA.length >= 4 && normC === compactA) return true;
    return false;
  }

  private isFreeHintVote(comment: string): boolean {
    return /^(\/|!)?(mở+|mo+|mở\s*chữ|mo\s*chu|gợi\s*ý|goi\s*y|hint)(\s*[!?.])*$/i.test(
      comment.trim()
    );
  }

  private countAnswerLetters(answer: string): number {
    return answer.replace(/\s+/g, '').length;
  }

  private getMaskedTiles(answer: string, revealedIndices: number[], showFull: boolean) {
    const revealedSet = new Set(revealedIndices);
    const words = answer.trim().replace(/\s+/g, ' ').split(' ');
    let idx = 0;
    return words.map((w) => {
      const tiles: Array<{ index: number; char: string; isRevealed: boolean }> = [];
      for (const ch of Array.from(w)) {
        const isRevealed = showFull || revealedSet.has(idx);
        tiles.push({
          index: idx,
          char: isRevealed ? ch : '',
          isRevealed,
        });
        idx++;
      }
      return tiles;
    });
  }

  private revealRandomLetters(rt: CatchwordRuntime, count: number): number {
    const q = rt.puzzles[rt.puzzleIndex];
    if (!q || count <= 0) return 0;
    const total = this.countAnswerLetters(q.answer);
    const revealedSet = new Set(rt.revealedIndices);
    const hidden: number[] = [];
    for (let i = 0; i < total; i++) {
      if (!revealedSet.has(i)) hidden.push(i);
    }
    if (!hidden.length) return 0;
    for (let i = hidden.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [hidden[i], hidden[j]] = [hidden[j], hidden[i]];
    }
    const picked = hidden.slice(0, count);
    rt.revealedIndices = [...rt.revealedIndices, ...picked];
    return picked.length;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  private getRuntime(roomCode: string): CatchwordRuntime {
    const code = (roomCode || 'KB2026').toUpperCase();
    let rt = this.rooms.get(code);
    if (!rt) {
      rt = {
        roomCode: code,
        status: 'IDLE',
        puzzleIndex: -1,
        puzzles: [],
        questionStartedAt: 0,
        questionEndsAt: 0,
        revealEndsAt: 0,
        revealedIndices: [],
        hintUnlocked: false,
        doubleUntilIndex: -1,
        freeHintVotes: 0,
        votedHintUsers: new Set(),
        solvedUsers: new Set(),
        solvers: [],
        players: new Map(),
        totalGiftCoins: 0,
        config: {
          puzzleCount: 10,
          timePerPuzzle: 30,
          revealSeconds: 6,
          autoRevealAfterSolvers: 5,
          autoLoop: true,
        },
        autoRevealScheduled: false,
        timers: [],
        lastBroadcastAt: 0,
        pendingBroadcast: null,
      };
      this.rooms.set(code, rt);
    }
    return rt;
  }

  // ===================================================================
  // PUBLIC STATE & CONFIG
  // ===================================================================

  public isActive(roomCode: string): boolean {
    const rt = this.rooms.get((roomCode || '').toUpperCase());
    return !!rt && rt.status !== 'IDLE';
  }

  public getGiftTiers() {
    return CATCHWORD_GIFT_TIERS.map((t) => ({
      ...t,
      maxCoins: t.maxCoins === Number.MAX_SAFE_INTEGER ? null : t.maxCoins,
    }));
  }

  public listPuzzles(): CatchwordPuzzle[] {
    return [...this.customPuzzles, ...DEFAULT_PUZZLES];
  }

  public addCustomPuzzle(dto: {
    category?: string;
    difficulty?: CatchwordDifficulty;
    clues: CatchwordClue[];
    answer: string;
    hint?: string;
    explanation?: string;
  }): CatchwordPuzzle {
    const answer = String(dto.answer || '').trim().toUpperCase();
    if (!answer || answer.replace(/\s+/g, '').length < 2) {
      throw new Error('Đáp án câu đố phải có ít nhất 2 ký tự.');
    }
    const clues = (Array.isArray(dto.clues) ? dto.clues : []).filter((c) => c && (c.emoji || c.label));
    if (clues.length === 0) {
      throw new Error('Cần ít nhất 1 gợi ý hình ảnh/emoji.');
    }
    const puzzle: CatchwordPuzzle = {
      id: `cw-custom-${Date.now()}`,
      category: String(dto.category || 'Tự tạo').trim(),
      difficulty: dto.difficulty && ['EASY', 'MEDIUM', 'HARD'].includes(dto.difficulty) ? dto.difficulty : 'MEDIUM',
      clues: clues.map((c) => ({ emoji: String(c.emoji || '❓').trim(), label: String(c.label || '').trim() })),
      answer,
      hint: String(dto.hint || 'Đoán từ ghép tiếng Việt từ các hình ảnh trên').trim(),
      explanation: String(dto.explanation || `Đáp án chính xác là "${answer}".`).trim(),
    };
    this.customPuzzles.unshift(puzzle);
    return puzzle;
  }

  public getPublicState(roomCode: string, includeSecret = false) {
    const rt = this.getRuntime(roomCode);
    const now = Date.now();
    const q = rt.puzzles[rt.puzzleIndex];
    const showAnswer = rt.status === 'REVEAL' || rt.status === 'FINISHED';
    const leaderboard = Array.from(rt.players.values())
      .sort((a, b) => b.score - a.score || b.solvedCount - a.solvedCount)
      .slice(0, 10)
      .map((p, idx) => ({
        rank: idx + 1,
        userId: p.userId,
        nickname: p.nickname,
        avatarUrl: p.avatarUrl,
        score: p.score,
        solvedCount: p.solvedCount,
        fastestCount: p.fastestCount,
        giftCoins: p.giftCoins,
      }));
    const mvp = leaderboard[0] || null;

    const payload: any = {
      roomCode: rt.roomCode,
      status: rt.status,
      serverNow: now,
      config: rt.config,
      puzzleIndex: rt.puzzleIndex,
      totalPuzzles: rt.puzzles.length || rt.config.puzzleCount,
      puzzleBankSize: this.listPuzzles().length,
      playerCount: rt.players.size,
      totalGiftCoins: rt.totalGiftCoins,
      doubleActive: rt.doubleUntilIndex >= rt.puzzleIndex && rt.puzzleIndex >= 0,
      freeHintVotes: rt.freeHintVotes,
      freeHintProgress: rt.freeHintVotes % 5,
      solvers: rt.solvers.slice(-8),
      solvedCount: rt.solvers.length,
      leaderboard,
      mvp,
      giftTiers: this.getGiftTiers(),
      puzzle: q
        ? {
            id: q.id,
            index: rt.puzzleIndex,
            category: q.category,
            difficulty: q.difficulty,
            clues: q.clues,
            startedAt: rt.questionStartedAt,
            endsAt: rt.questionEndsAt,
            revealEndsAt: rt.revealEndsAt,
            wordGroups: this.getMaskedTiles(q.answer, rt.revealedIndices, showAnswer),
            letterCount: this.countAnswerLetters(q.answer),
            hint: showAnswer || rt.hintUnlocked ? q.hint : undefined,
            hintUnlocked: rt.hintUnlocked || showAnswer,
            answer: showAnswer ? q.answer : undefined,
            explanation: showAnswer ? q.explanation : undefined,
          }
        : null,
    };

    if (includeSecret && q) {
      payload.secret = {
        answer: q.answer,
        hint: q.hint,
        explanation: q.explanation,
      };
    }

    return payload;
  }

  private broadcast(rt: CatchwordRuntime, immediate = false) {
    const now = Date.now();
    const send = () => {
      rt.lastBroadcastAt = Date.now();
      rt.pendingBroadcast = null;
      this.gateway.emitToRoom(rt.roomCode, 'catchword.state', this.getPublicState(rt.roomCode, false));
      const q = rt.puzzles[rt.puzzleIndex];
      if (q) {
        this.gateway.emitToRoom(rt.roomCode, 'catchword.secret', {
          roomCode: rt.roomCode,
          puzzleIndex: rt.puzzleIndex,
          answer: q.answer,
          hint: q.hint,
          explanation: q.explanation,
        });
      }
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

  private emitEffect(rt: CatchwordRuntime, effect: Record<string, any>) {
    this.gateway.emitToRoom(rt.roomCode, 'catchword.effect', { ...effect, at: Date.now() });
  }

  private clearTimers(rt: CatchwordRuntime) {
    rt.timers.forEach((t) => clearTimeout(t));
    rt.timers = [];
  }

  private scheduleQuestionEndTimer(rt: CatchwordRuntime) {
    this.clearTimers(rt);
    const delayMs = Math.max(500, rt.questionEndsAt - Date.now());
    rt.timers.push(setTimeout(() => this.reveal(rt.roomCode), delayMs));
  }

  // ===================================================================
  // CONTROLS
  // ===================================================================

  public updateConfig(
    roomCode: string,
    cfg: Partial<{
      puzzleCount: number;
      timePerPuzzle: number;
      revealSeconds: number;
      autoRevealAfterSolvers: number;
      autoLoop: boolean;
    }>
  ) {
    const rt = this.getRuntime(roomCode);
    rt.config = {
      puzzleCount: Math.max(3, Math.min(35, Number(cfg.puzzleCount ?? rt.config.puzzleCount))),
      timePerPuzzle: Math.max(10, Math.min(90, Number(cfg.timePerPuzzle ?? rt.config.timePerPuzzle))),
      revealSeconds: Math.max(3, Math.min(15, Number(cfg.revealSeconds ?? rt.config.revealSeconds))),
      autoRevealAfterSolvers: Math.max(
        1,
        Math.min(50, Number(cfg.autoRevealAfterSolvers ?? rt.config.autoRevealAfterSolvers))
      ),
      autoLoop: cfg.autoLoop !== undefined ? Boolean(cfg.autoLoop) : (rt.config.autoLoop ?? true),
    };
    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode, true);
  }

  public openLobby(roomCode: string) {
    const rt = this.getRuntime(roomCode);
    this.clearTimers(rt);
    rt.status = 'LOBBY';
    rt.puzzleIndex = -1;
    rt.puzzles = [];
    rt.revealedIndices = [];
    rt.hintUnlocked = false;
    rt.doubleUntilIndex = -1;
    rt.freeHintVotes = 0;
    rt.votedHintUsers.clear();
    rt.solvedUsers.clear();
    rt.solvers = [];
    rt.players.clear();
    rt.totalGiftCoins = 0;
    rt.autoRevealScheduled = false;
    this.broadcast(rt, true);
    this.emitEffect(rt, {
      kind: 'SYSTEM',
      message: '🖼️ Sảnh chờ Đuổi Hình Bắt Chữ đã mở! Comment bất kỳ để sẵn sàng!',
    });
    return this.getPublicState(rt.roomCode, true);
  }

  public start(roomCode: string) {
    const rt = this.getRuntime(roomCode);
    if (rt.status === 'IDLE' || rt.status === 'FINISHED') {
      const keep = rt.status === 'FINISHED' ? Array.from(rt.players.values()) : [];
      this.openLobby(roomCode);
      keep.forEach((p) =>
        rt.players.set(p.userId, { ...p, score: 0, solvedCount: 0, fastestCount: 0, giftCoins: 0 })
      );
    }
    this.clearTimers(rt);

    // Xáo trộn ngẫu nhiên toàn bộ câu hỏi (bao gồm câu tự tạo & câu mặc định) bằng Fisher-Yates
    const pool = this.shuffleArray([...this.customPuzzles, ...DEFAULT_PUZZLES]);
    rt.puzzles = pool.slice(0, Math.min(pool.length, rt.config.puzzleCount));
    rt.puzzleIndex = -1;
    rt.doubleUntilIndex = -1;
    rt.status = 'REVEAL';
    rt.revealEndsAt = Date.now() + 2000;
    this.emitEffect(rt, {
      kind: 'SYSTEM',
      message: '🔔 ĐUỔI HÌNH BẮT CHỮ BẮT ĐẦU! Nhìn hình đoán chữ thật nhanh!',
    });
    rt.timers.push(setTimeout(() => this.nextPuzzle(rt.roomCode), 2000));
    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode, true);
  }

  public nextPuzzle(roomCode: string) {
    const rt = this.getRuntime(roomCode);
    if (rt.status === 'IDLE' || rt.status === 'LOBBY' || rt.status === 'FINISHED') {
      return this.getPublicState(rt.roomCode, true);
    }
    if (rt.status === 'QUESTION') {
      return this.reveal(roomCode);
    }
    this.clearTimers(rt);
    const nextIdx = rt.puzzleIndex + 1;
    if (nextIdx >= rt.puzzles.length) {
      return this.finish(roomCode);
    }
    rt.puzzleIndex = nextIdx;
    rt.revealedIndices = [];
    rt.hintUnlocked = false;
    rt.freeHintVotes = 0;
    rt.votedHintUsers.clear();
    rt.solvedUsers.clear();
    rt.solvers = [];
    rt.autoRevealScheduled = false;
    rt.status = 'QUESTION';
    rt.questionStartedAt = Date.now();
    rt.questionEndsAt = rt.questionStartedAt + rt.config.timePerPuzzle * 1000;
    this.scheduleQuestionEndTimer(rt);
    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode, true);
  }

  public revealLetterManual(roomCode: string, count = 1) {
    const rt = this.getRuntime(roomCode);
    if (rt.status !== 'QUESTION') return this.getPublicState(rt.roomCode, true);
    const opened = this.revealRandomLetters(rt, count);
    if (opened > 0) {
      this.emitEffect(rt, {
        kind: 'HINT',
        message: `🔤 Host vừa lật mở ${opened} ô chữ bí mật!`,
      });
      this.broadcast(rt, true);
    }
    return this.getPublicState(rt.roomCode, true);
  }

  public unlockHintManual(roomCode: string) {
    const rt = this.getRuntime(roomCode);
    if (rt.status !== 'QUESTION') return this.getPublicState(rt.roomCode, true);
    rt.hintUnlocked = true;
    this.emitEffect(rt, {
      kind: 'HINT',
      message: '💡 Host vừa mở khóa Gợi Ý Nghĩa Từ Khóa!',
    });
    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode, true);
  }

  public reveal(roomCode: string) {
    const rt = this.getRuntime(roomCode);
    if (rt.status !== 'QUESTION') return this.getPublicState(rt.roomCode, true);
    this.clearTimers(rt);
    const q = rt.puzzles[rt.puzzleIndex];
    rt.status = 'REVEAL';
    rt.hintUnlocked = true;
    rt.revealEndsAt = Date.now() + rt.config.revealSeconds * 1000;
    this.emitEffect(rt, {
      kind: 'REVEAL',
      message: `✅ Đáp án: ${q.answer} (${rt.solvers.length} người giải đúng)`,
    });
    rt.timers.push(setTimeout(() => this.nextPuzzle(rt.roomCode), rt.config.revealSeconds * 1000));
    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode, true);
  }

  public finish(roomCode: string) {
    const rt = this.getRuntime(roomCode);
    if (rt.status === 'IDLE') return this.getPublicState(rt.roomCode, true);
    this.clearTimers(rt);
    rt.status = 'FINISHED';
    const state = this.getPublicState(rt.roomCode, true);
    this.broadcast(rt, true);
    this.emitEffect(rt, {
      kind: 'WINNER',
      mvp: state.mvp,
      message: state.mvp
        ? `🏆 Vua Đuổi Hình Bắt Chữ: ${state.mvp.nickname} (${state.mvp.score}đ)!`
        : '🏁 Trận Đuổi Hình Bắt Chữ đã kết thúc!',
    });

    // Tự động lặp lại ván mới với bộ câu hỏi ngẫu nhiên mới nếu bật autoLoop
    if (rt.config.autoLoop !== false) {
      this.emitEffect(rt, {
        kind: 'SYSTEM',
        message: '⏳ Bàn mới với bộ câu hỏi ngẫu nhiên sẽ tự động bắt đầu sau 6 giây...',
      });
      rt.timers.push(
        setTimeout(() => {
          this.start(rt.roomCode);
        }, 6000)
      );
    }

    return state;
  }

  public stop(roomCode: string) {
    const rt = this.getRuntime(roomCode);
    this.clearTimers(rt);
    rt.status = 'IDLE';
    rt.puzzleIndex = -1;
    rt.puzzles = [];
    rt.revealedIndices = [];
    rt.hintUnlocked = false;
    rt.doubleUntilIndex = -1;
    rt.freeHintVotes = 0;
    rt.votedHintUsers.clear();
    rt.solvedUsers.clear();
    rt.solvers = [];
    rt.players.clear();
    rt.autoRevealScheduled = false;
    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode, true);
  }

  // ===================================================================
  // LIVE EVENTS
  // ===================================================================

  private ensurePlayer(rt: CatchwordRuntime, event: GameEvent): CatchwordPlayer {
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
      score: 0,
      solvedCount: 0,
      fastestCount: 0,
      giftCoins: 0,
    };
    rt.players.set(p.userId, p);
    return p;
  }

  public handleComment(event: GameEvent) {
    const rt = this.getRuntime(event.roomId);
    const p = this.ensurePlayer(rt, event);
    const content = String(event.payload.content || '').trim();

    if (rt.status === 'LOBBY') {
      this.broadcast(rt);
      return { action: 'CATCHWORD_JOINED' };
    }

    if (rt.status !== 'QUESTION') {
      return { action: 'CATCHWORD_IGNORED' };
    }

    const q = rt.puzzles[rt.puzzleIndex];
    if (!q) return { action: 'CATCHWORD_IGNORED' };

    // 1. Vote "mở" chữ miễn phí
    if (this.isFreeHintVote(content)) {
      if (rt.votedHintUsers.has(p.userId)) {
        return { action: 'CATCHWORD_VOTE_ALREADY_COUNTED' };
      }
      rt.votedHintUsers.add(p.userId);
      rt.freeHintVotes += 1;
      let revealed = false;
      if (rt.freeHintVotes % 5 === 0) {
        const opened = this.revealRandomLetters(rt, 1);
        revealed = opened > 0;
        if (revealed) {
          this.emitEffect(rt, {
            kind: 'FREE_HINT_UNLOCKED',
            nickname: p.nickname,
            avatarUrl: p.avatarUrl,
            message: `🔓 Đủ 5 lượt vote "mở" miễn phí (${p.nickname} chốt) → Lật mở 1 ô chữ!`,
          });
        }
      }
      this.broadcast(rt, revealed);
      return {
        action: revealed ? 'CATCHWORD_FREE_HINT_REVEALED' : 'CATCHWORD_FREE_HINT_VOTED',
        freeHintVotes: rt.freeHintVotes,
      };
    }

    // 2. So khớp đáp án tiếng Việt (có dấu hoặc không dấu)
    if (this.isMatchAnswer(content, q.answer)) {
      if (rt.solvedUsers.has(p.userId)) {
        return { action: 'CATCHWORD_ALREADY_SOLVED' };
      }
      const now = event.receivedAt || Date.now();
      rt.solvedUsers.add(p.userId);
      const order = rt.solvedUsers.size;
      const duration = Math.max(1, rt.questionEndsAt - rt.questionStartedAt);
      const remainRatio = Math.max(0, Math.min(1, (rt.questionEndsAt - now) / duration));
      const basePts = order === 1 ? 150 : order <= 3 ? 120 : Math.round(80 + remainRatio * 20);
      const mul = rt.doubleUntilIndex >= rt.puzzleIndex ? 2 : 1;
      const points = basePts * mul;

      p.score += points;
      p.solvedCount += 1;
      if (order === 1) p.fastestCount += 1;

      rt.solvers.push({
        userId: p.userId,
        nickname: p.nickname,
        avatarUrl: p.avatarUrl,
        order,
        points,
        elapsedMs: Math.max(0, now - rt.questionStartedAt),
      });

      this.emitEffect(rt, {
        kind: 'SOLVED',
        nickname: p.nickname,
        avatarUrl: p.avatarUrl,
        order,
        points,
        message:
          order === 1
            ? `⚡ ${p.nickname} đoán ĐÚNG ĐẦU TIÊN (+${points}đ)!`
            : `🎯 ${p.nickname} đoán đúng (#${order}, +${points}đ)!`,
      });

      if (rt.solvedUsers.size >= rt.config.autoRevealAfterSolvers && !rt.autoRevealScheduled) {
        rt.autoRevealScheduled = true;
        this.clearTimers(rt);
        rt.timers.push(setTimeout(() => this.reveal(rt.roomCode), 1200));
      } else if (order === 1 && !rt.autoRevealScheduled) {
        // Có người đầu tiên giải đúng -> ân hạn 3.5s cho các comment gửi cùng lúc, sau đó tự động sang câu tiếp theo
        rt.autoRevealScheduled = true;
        this.clearTimers(rt);
        rt.timers.push(setTimeout(() => this.reveal(rt.roomCode), 3500));
      }

      this.broadcast(rt, true);
      return { action: 'CATCHWORD_SOLVED', order, points };
    }

    // Đoán chưa đúng -> ghi nhận đã vào bảng xếp hạng
    this.broadcast(rt);
    return { action: 'CATCHWORD_WRONG_GUESS' };
  }

  public handleGift(event: GameEvent) {
    const rt = this.getRuntime(event.roomId);
    const p = this.ensurePlayer(rt, event);
    const coins =
      Math.max(1, Number(event.payload.diamondCount || 1)) *
      Math.max(1, Number(event.payload.repeatCount || 1));
    const tier =
      CATCHWORD_GIFT_TIERS.find((t) => coins >= t.minCoins && coins <= t.maxCoins) ||
      CATCHWORD_GIFT_TIERS[0];

    p.giftCoins += coins;
    p.score += tier.points;
    rt.totalGiftCoins += coins;

    let extra = '';
    if (tier.key === 'LETTER') {
      const opened = rt.status === 'QUESTION' ? this.revealRandomLetters(rt, 1) : 0;
      extra = opened ? 'Đã lật mở 1 ô chữ!' : 'Chưa mở ô hỏi — cộng +50đ!';
    } else if (tier.key === 'HINT_TIME') {
      if (rt.status === 'QUESTION') {
        rt.hintUnlocked = true;
        rt.questionEndsAt += 10000;
        if (!rt.autoRevealScheduled) {
          this.scheduleQuestionEndTimer(rt);
        }
        extra = 'Đã mở Gợi Ý Nghĩa & +10s suy nghĩ!';
      } else {
        extra = 'Cộng +150đ!';
      }
    } else if (tier.key === 'DOUBLE') {
      const target = (rt.puzzleIndex < 0 ? 0 : rt.puzzleIndex) + 1;
      rt.doubleUntilIndex = Math.max(rt.doubleUntilIndex, target);
      const opened = rt.status === 'QUESTION' ? this.revealRandomLetters(rt, 2) : 0;
      extra = `Kích hoạt x2 điểm 2 câu${opened ? ` & mở ${opened} ô chữ` : ''}!`;
    } else {
      if (rt.status === 'QUESTION') {
        const q = rt.puzzles[rt.puzzleIndex];
        const remaining = q ? Math.max(0, this.countAnswerLetters(q.answer) - rt.revealedIndices.length) : 0;
        const toReveal = Math.max(1, Math.ceil(remaining * 0.5));
        const opened = this.revealRandomLetters(rt, toReveal);
        rt.hintUnlocked = true;
        extra = `Mở ${opened} ô chữ + Gợi Ý Nghĩa!`;
      } else {
        extra = 'Siêu Phá Đảo +1200đ!';
      }
    }

    this.emitEffect(rt, {
      kind: 'GIFT',
      tier: tier.key,
      icon: tier.icon,
      tierName: tier.name,
      nickname: p.nickname,
      avatarUrl: p.avatarUrl,
      giftName: event.payload.giftName || 'Quà tặng',
      coins,
      points: tier.points,
      message: `${p.nickname} tặng ${event.payload.giftName || 'quà'} → ${tier.icon} ${tier.name} (+${tier.points}đ) · ${extra}`,
    });
    this.broadcast(rt, true);
    return { action: 'CATCHWORD_GIFT', tier: tier.key, points: tier.points };
  }

  // ===================================================================
  // SIMULATOR
  // ===================================================================

  private simCounter = 0;

  public simulate(
    roomCode: string,
    kind: 'JOIN_CROWD' | 'WRONG_GUESS' | 'CORRECT_GUESS' | 'VOTE_HINT' | 'GIFT',
    opts: { coins?: number; count?: number } = {}
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
      'Mai Phương 🍀',
      'Trọng Nhân 🐉',
    ];
    const mkUser = (idx: number) => ({
      id: `cw-sim-user-${idx}`,
      username: `cw_viewer_${idx}`,
      nickname: names[idx % names.length] + (idx >= names.length ? ` ${Math.floor(idx / names.length) + 1}` : ''),
      avatarUrl: `https://api.dicebear.com/7.x/thumbs/svg?seed=cw${idx}`,
    });

    if (kind === 'JOIN_CROWD') {
      const n = opts.count || 10;
      const base = rt.players.size;
      for (let i = 0; i < n; i++) {
        this.handleComment({
          id: `cw-sim-${Date.now()}-${++this.simCounter}`,
          roomId: rt.roomCode,
          type: 'COMMENT',
          user: mkUser(base + i),
          payload: { content: 'xin chao' },
          receivedAt: Date.now(),
        });
      }
    } else if (kind === 'WRONG_GUESS') {
      const guesses = ['con meo', 'troi mua', 'hoa hong', 'khong biet nua'];
      const idx = Math.floor(Math.random() * Math.max(10, rt.players.size));
      this.handleComment({
        id: `cw-sim-${Date.now()}-${++this.simCounter}`,
        roomId: rt.roomCode,
        type: 'COMMENT',
        user: mkUser(idx),
        payload: { content: guesses[this.simCounter % guesses.length] },
        receivedAt: Date.now(),
      });
    } else if (kind === 'CORRECT_GUESS') {
      const q = rt.puzzles[rt.puzzleIndex];
      if (rt.status === 'QUESTION' && q) {
        const unsolved = Array.from(rt.players.values()).find((p) => !rt.solvedUsers.has(p.userId));
        const user = unsolved
          ? { id: unsolved.userId, username: unsolved.username, nickname: unsolved.nickname, avatarUrl: unsolved.avatarUrl }
          : mkUser(rt.players.size + ++this.simCounter);
        this.handleComment({
          id: `cw-sim-${Date.now()}-${++this.simCounter}`,
          roomId: rt.roomCode,
          type: 'COMMENT',
          user,
          payload: { content: this.normalizeVi(q.answer) },
          receivedAt: Date.now(),
        });
      }
    } else if (kind === 'VOTE_HINT') {
      const count = opts.count || 5;
      const start = rt.players.size + ++this.simCounter;
      for (let i = 0; i < count; i++) {
        this.handleComment({
          id: `cw-sim-${Date.now()}-${++this.simCounter}`,
          roomId: rt.roomCode,
          type: 'COMMENT',
          user: mkUser(start + i),
          payload: { content: 'mở' },
          receivedAt: Date.now(),
        });
      }
    } else if (kind === 'GIFT') {
      const coins = opts.coins || 1;
      const existing = Array.from(rt.players.values());
      const picked = existing.length
        ? existing[Math.floor(Math.random() * existing.length)]
        : null;
      const giftNames: Record<string, string> = {
        '1': 'Hoa Hồng',
        '30': 'Donut',
        '199': 'Mũ Cún',
        '1000': 'Thiên Hà',
      };
      this.handleGift({
        id: `cw-sim-${Date.now()}-${++this.simCounter}`,
        roomId: rt.roomCode,
        type: 'GIFT',
        user: picked
          ? { id: picked.userId, username: picked.username, nickname: picked.nickname, avatarUrl: picked.avatarUrl }
          : mkUser(rt.players.size + 1),
        payload: {
          giftName: giftNames[String(coins)] || 'Quà tặng',
          diamondCount: coins,
          repeatCount: 1,
        },
        receivedAt: Date.now(),
      });
    }

    this.broadcast(rt, true);
    return this.getPublicState(rt.roomCode, true);
  }
}
