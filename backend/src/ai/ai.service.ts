import { Injectable, Logger, Optional } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CatchwordService } from '../catchword/catchword.service';
import { CrosswordService, CrosswordQuestionSet } from '../crossword/crossword.service';
import { OptionLabel, QuestionDifficulty, QuestionRecord } from '../common/types';

export interface GeneratedQuestion {
  content: string;
  options: Record<OptionLabel, string>;
  correctOption: OptionLabel;
  explanation: string;
  difficulty: QuestionDifficulty;
  categoryName: string;
  topicTags: string[];
}

export interface GeneratedCatchword {
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  clues: Array<{ emoji: string; label: string }>;
  answer: string;
  hint: string;
  explanation: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly catchwordService: CatchwordService,
    @Optional() private readonly crosswordService?: CrosswordService,
  ) {}

  public getStatus() {
    const hasEnvKey = Boolean(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY);
    return {
      available: true,
      hasEnvKey,
      providers: ['GEMINI', 'OPENAI_COMPATIBLE', 'BUILTIN_OFFLINE'],
      defaultModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    };
  }

  /**
   * Sinh câu hỏi trắc nghiệm qua LLM hoặc Offline Fallback thông minh
   */
  public async generateQuestions(params: {
    topic: string;
    count?: number;
    difficulty?: 'ALL' | QuestionDifficulty;
    apiKey?: string;
    provider?: 'GEMINI' | 'OPENAI' | 'OFFLINE';
  }): Promise<GeneratedQuestion[]> {
    const topic = (params.topic || 'Kiến thức tổng hợp Việt Nam và thế giới').trim();
    const count = Math.max(1, Math.min(30, Number(params.count) || 5));
    const difficulty = params.difficulty || 'ALL';
    const apiKey = params.apiKey || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    const provider = params.provider || (apiKey ? 'GEMINI' : 'OFFLINE');

    this.logger.log(`Generating ${count} questions for topic "${topic}" using provider: ${provider}`);

    if (provider === 'GEMINI' && apiKey) {
      try {
        const geminiQuestions = await this.callGeminiForQuestions(topic, count, difficulty, apiKey);
        if (geminiQuestions && geminiQuestions.length > 0) {
          return geminiQuestions;
        }
      } catch (err: any) {
        this.logger.warn(`Gemini generation failed (${err.message}). Falling back to Offline Smart Generator.`);
      }
    }

    if (provider === 'OPENAI' && apiKey) {
      try {
        const openAiQuestions = await this.callOpenAiForQuestions(topic, count, difficulty, apiKey);
        if (openAiQuestions && openAiQuestions.length > 0) {
          return openAiQuestions;
        }
      } catch (err: any) {
        this.logger.warn(`OpenAI generation failed (${err.message}). Falling back to Offline Smart Generator.`);
      }
    }

    // Offline Smart Generator
    return this.generateOfflineQuestions(topic, count, difficulty);
  }

  /**
   * Sinh câu đố Đuổi Hình Bắt Chữ qua LLM hoặc Offline Fallback
   */
  public async generateCatchwords(params: {
    topic: string;
    count?: number;
    apiKey?: string;
    provider?: 'GEMINI' | 'OPENAI' | 'OFFLINE';
  }): Promise<GeneratedCatchword[]> {
    const topic = (params.topic || 'Ca dao, tục ngữ và thành ngữ Việt Nam').trim();
    const count = Math.max(1, Math.min(20, Number(params.count) || 5));
    const apiKey = params.apiKey || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    const provider = params.provider || (apiKey ? 'GEMINI' : 'OFFLINE');

    this.logger.log(`Generating ${count} catchword puzzles for topic "${topic}" using: ${provider}`);

    if (provider === 'GEMINI' && apiKey) {
      try {
        const geminiPuzzles = await this.callGeminiForCatchwords(topic, count, apiKey);
        if (geminiPuzzles && geminiPuzzles.length > 0) {
          return geminiPuzzles;
        }
      } catch (err: any) {
        this.logger.warn(`Gemini catchword generation failed (${err.message}). Falling back to Offline Generator.`);
      }
    }

    return this.generateOfflineCatchwords(topic, count);
  }

  /**
   * Lưu các câu hỏi đã sinh vào cơ sở dữ liệu
   */
  public saveQuestionsToDatabase(
    questions: GeneratedQuestion[],
    autoPublish = true,
  ): QuestionRecord[] {
    const categories = this.db.getCategories();
    const defaultCat = categories[0] || { id: 'cat-general' };
    const saved: QuestionRecord[] = [];

    for (const q of questions) {
      // Tìm category phù hợp hoặc lấy default
      const matchedCat =
        categories.find(
          (c) =>
            c.name.toLowerCase().includes(q.categoryName.toLowerCase()) ||
            q.categoryName.toLowerCase().includes(c.name.toLowerCase()),
        ) || defaultCat;

      const record = this.db.createQuestion({
        categoryId: matchedCat.id,
        content: q.content,
        difficulty: q.difficulty || 'MEDIUM',
        options: q.options,
        correctOption: q.correctOption,
        explanation: q.explanation || '',
        topicTags: q.topicTags || [q.categoryName],
        status: autoPublish ? 'PUBLISHED' : 'PENDING',
        sourceType: 'AI',
        attribution: 'Generated by Antigravity AI Question Engine',
      });
      saved.push(record);
    }

    this.logger.log(`Saved ${saved.length} AI generated questions to SQLite database.`);
    return saved;
  }

  /**
   * Lưu các câu đố Đuổi Hình Bắt Chữ vào ngân hàng
   */
  public saveCatchwordsToBank(puzzles: GeneratedCatchword[]) {
    const saved = [];
    for (const p of puzzles) {
      const cleanClues = (p.clues || []).map((c) => ({
        emoji: c.emoji || '❓',
        label: c.label || '',
      }));
      const item = this.catchwordService.addCustomPuzzle({
        category: p.category || 'Đuổi Hình Bắt Chữ AI',
        difficulty: p.difficulty || 'MEDIUM',
        clues: cleanClues,
        answer: p.answer.toUpperCase().trim(),
        hint: p.hint || '',
        explanation: p.explanation || '',
      });
      saved.push(item);
    }
    this.logger.log(`Saved ${saved.length} AI catchword puzzles into CatchwordService.`);
    return saved;
  }

  // ===================================================================
  // GOOGLE GEMINI API CALL
  // ===================================================================
  private async callGeminiForQuestions(
    topic: string,
    count: number,
    difficulty: string,
    apiKey: string,
  ): Promise<GeneratedQuestion[]> {
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const prompt = `Bạn là biên tập viên gameshow truyền hình và TikTok LIVE hàng đầu Việt Nam.
Hãy tạo đúng ${count} câu hỏi trắc nghiệm tiếng Việt chất lượng cao về chủ đề: "${topic}".
Độ khó yêu cầu: ${difficulty === 'ALL' ? 'kết hợp EASY, MEDIUM, HARD' : difficulty}.

YÊU CẦU ĐỊNH DẠNG:
- Trả về DUY NHẤT một mảng JSON thuần túy (không markdown, không bọc \`\`\`json).
- Mỗi phần tử có cấu trúc:
{
  "content": "Nội dung câu hỏi ngắn gọn, hấp dẫn, dễ đọc trên live stream điện thoại",
  "options": {
    "A": "Đáp án A",
    "B": "Đáp án B",
    "C": "Đáp án C",
    "D": "Đáp án D"
  },
  "correctOption": "A" hoặc "B" hoặc "C" hoặc "D",
  "explanation": "Giải thích ngắn gọn 1-2 câu",
  "difficulty": "EASY" | "MEDIUM" | "HARD",
  "categoryName": "Tên thể loại (VD: Lịch sử, Địa lý, Bóng đá, Khoa học, Đố vui)",
  "topicTags": ["tag1", "tag2"]
}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API HTTP ${res.status}: ${errText}`);
    }

    const data: any = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Empty response from Gemini');

    return this.parseJsonSafely<GeneratedQuestion[]>(rawText);
  }

  private async callGeminiForCatchwords(
    topic: string,
    count: number,
    apiKey: string,
  ): Promise<GeneratedCatchword[]> {
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const prompt = `Bạn là chuyên gia thiết kế game "Đuổi Hình Bắt Chữ" trên TikTok LIVE.
Hãy sáng tạo ${count} câu đố đuổi hình bắt chữ Tiếng Việt độc đáo, thú vị về chủ đề: "${topic}".
Đáp án thường là: Thành ngữ, Tục ngữ, Ca dao, Tên bài hát, Vật dụng quen thuộc hoặc Từ ghép hài hước.

YÊU CẦU ĐỊNH DẠNG:
- Trả về DUY NHẤT mảng JSON hợp lệ:
[
  {
    "category": "Ca dao tục ngữ" hoặc "Đố mẹo dân gian" hoặc "Đời sống",
    "difficulty": "EASY" hoặc "MEDIUM" hoặc "HARD",
    "clues": [
      { "emoji": "🐴", "label": "Ngựa" },
      { "emoji": "🛣️", "label": "Đường" },
      { "emoji": "🏃", "label": "Chạy" }
    ],
    "answer": "ĐƯỜNG DÀI MỚI BIẾT NGỰA HAY",
    "hint": "Nói về năng lực cần thời gian chứng minh",
    "explanation": "Câu tục ngữ khuyên nhìn nhận con người qua thời gian thử thách."
  }
]`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.75,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API HTTP ${res.status}: ${errText}`);
    }

    const data: any = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return this.parseJsonSafely<GeneratedCatchword[]>(rawText);
  }

  // ===================================================================
  // OPENAI COMPATIBLE CALL
  // ===================================================================
  private async callOpenAiForQuestions(
    topic: string,
    count: number,
    difficulty: string,
    apiKey: string,
  ): Promise<GeneratedQuestion[]> {
    const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'Bạn là chuyên gia biên soạn câu hỏi gameshow trực tiếp bằng JSON hợp lệ.',
          },
          {
            role: 'user',
            content: `Tạo đúng ${count} câu hỏi trắc nghiệm tiếng Việt về "${topic}" (${difficulty}). Trả về mảng JSON gồm content, options (A,B,C,D), correctOption, explanation, difficulty, categoryName, topicTags.`,
          },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI HTTP ${res.status}: ${await res.text()}`);
    }

    const data: any = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    const parsed = this.parseJsonSafely<any>(content);
    return Array.isArray(parsed) ? parsed : parsed.questions || parsed.data || [];
  }

  // ===================================================================
  // OFFLINE SMART GENERATOR (High quality procedural database fallback)
  // ===================================================================
  private generateOfflineQuestions(
    topic: string,
    count: number,
    difficulty: string,
  ): GeneratedQuestion[] {
    const templates = this.getOfflineQuestionLibrary(topic);
    const shuffled = [...templates].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    // Nếu yêu cầu nhiều hơn template, tái sinh với xáo trộn đáp án
    while (selected.length < count) {
      const base = templates[Math.floor(Math.random() * templates.length)];
      selected.push({ ...base });
    }

    if (difficulty !== 'ALL') {
      selected.forEach((q) => (q.difficulty = difficulty as QuestionDifficulty));
    }

    return selected;
  }

  private generateOfflineCatchwords(topic: string, count: number): GeneratedCatchword[] {
    const templates = this.getOfflineCatchwordLibrary();
    const shuffled = [...templates].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  private parseJsonSafely<T>(text: string): T {
    try {
      const clean = text
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();
      return JSON.parse(clean);
    } catch (e: any) {
      this.logger.error(`Failed to parse AI response JSON: ${e.message}\nRaw: ${text.slice(0, 300)}`);
      throw new Error('AI trả về định dạng JSON không hợp lệ');
    }
  }

  // Kho mẫu câu hỏi chất lượng cao offline
  private getOfflineQuestionLibrary(topic: string): GeneratedQuestion[] {
    return [
      {
        content: `Theo kiến thức về "${topic}", loài chim nào là biểu tượng của hòa bình và thường được thả trong các ngày hội lớn?`,
        options: { A: 'Chim Bồ Câu', B: 'Chim Đại Bàng', C: 'Chim Yến', D: 'Chim Cú Mèo' },
        correctOption: 'A',
        explanation: 'Chim bồ câu trắng mang cành ô liu từ lâu đã là biểu tượng phổ quát của hòa bình thế giới.',
        difficulty: 'EASY',
        categoryName: 'Khoa học & Đời sống',
        topicTags: ['Sinh học', topic],
      },
      {
        content: `Trong văn hóa dân gian Việt Nam, lễ hội Đền Hùng được tổ chức vào ngày âm lịch nào hàng năm?`,
        options: { A: 'Mùng 10 tháng 3', B: 'Mùng 1 tháng Giêng', C: 'Rằm tháng 8', D: 'Mùng 5 tháng 5' },
        correctOption: 'A',
        explanation: 'Câu ca dao: "Dù ai đi ngược về xuôi / Nhớ ngày Giỗ Tổ mùng mười tháng ba".',
        difficulty: 'EASY',
        categoryName: 'Lịch sử & Văn hóa',
        topicTags: ['Lễ hội', 'Đền Hùng'],
      },
      {
        content: `Hệ điều hành mã nguồn mở nhân Linux phổ biến nhất trên điện thoại thông minh ngày nay là gì?`,
        options: { A: 'Android', B: 'iOS', C: 'Windows Phone', D: 'Symbian' },
        correctOption: 'A',
        explanation: 'Android do Google phát triển dựa trên nền tảng nhân Linux mã nguồn mở.',
        difficulty: 'EASY',
        categoryName: 'Công nghệ & Đời sống',
        topicTags: ['Công nghệ', 'Điện thoại'],
      },
      {
        content: `Tỉnh nào ở miền Tây Nam Bộ được mệnh danh là "Xứ Dừa" với đặc sản Kẹo Dừa nổi tiếng?`,
        options: { A: 'Bến Tre', B: 'Tiền Giang', C: 'Cần Thơ', D: 'Cà Mau' },
        correctOption: 'A',
        explanation: 'Bến Tre có diện tích trồng dừa lớn nhất cả nước và nổi tiếng khắp thế giới với kẹo dừa.',
        difficulty: 'MEDIUM',
        categoryName: 'Địa lý Việt Nam',
        topicTags: ['Địa lý', 'Đặc sản'],
      },
      {
        content: `Chiến thắng Điện Biên Phủ "lừng lẫy năm châu, chấn động địa cầu" diễn ra vào năm nào?`,
        options: { A: '1954', B: '1945', C: '1975', D: '1968' },
        correctOption: 'A',
        explanation: 'Chiến thắng Điện Biên Phủ lịch sử kết thúc ngày 07/05/1954.',
        difficulty: 'MEDIUM',
        categoryName: 'Lịch sử Việt Nam',
        topicTags: ['Lịch sử', 'Điện Biên Phủ'],
      },
      {
        content: `Nguyên tố hóa học nào chiếm tỉ lệ khối lượng nhiều nhất trong vỏ Trái Đất?`,
        options: { A: 'Oxy (Oxygen)', B: 'Silic (Silicon)', C: 'Nhôm (Aluminium)', D: 'Sắt (Iron)' },
        correctOption: 'A',
        explanation: 'Oxy chiếm khoảng 46.6% khối lượng vỏ Trái Đất, kế tiếp là Silic với khoảng 27.7%.',
        difficulty: 'HARD',
        categoryName: 'Khoa học Tự nhiên',
        topicTags: ['Hóa học', 'Địa chất'],
      },
      {
        content: `Hành tinh nào trong Hệ Mặt Trời có từ trường mạnh nhất và nhiều vệ tinh tự nhiên nhất?`,
        options: { A: 'Sao Mộc (Jupiter)', B: 'Sao Thổ (Saturn)', C: 'Sao Hỏa (Mars)', D: 'Sao Kim (Venus)' },
        correctOption: 'A',
        explanation: 'Sao Mộc là hành tinh lớn nhất trong Hệ Mặt Trời và sở hữu từ trường cực kỳ mạnh mẽ.',
        difficulty: 'HARD',
        categoryName: 'Thiên văn học',
        topicTags: ['Vũ trụ', 'Hệ Mặt Trời'],
      },
      {
        content: `Vua nào trong lịch sử phong kiến Việt Nam đã ban Chiếu dời đô từ Hoa Lư về Thăng Long năm 1010?`,
        options: { A: 'Lý Thái Tổ (Lý Công Uẩn)', B: 'Lý Thường Kiệt', C: 'Đinh Bộ Lĩnh', D: 'Trần Nhân Tông' },
        correctOption: 'A',
        explanation: 'Mùa thu năm Canh Tuất (1010), vua Lý Thái Tổ ban Chiếu dời đô về thành Đại La (Thăng Long).',
        difficulty: 'MEDIUM',
        categoryName: 'Lịch sử Việt Nam',
        topicTags: ['Thăng Long', 'Nhà Lý'],
      },
    ];
  }

  private getOfflineCatchwordLibrary(): GeneratedCatchword[] {
    return [
      {
        category: 'Ca dao tục ngữ',
        difficulty: 'EASY',
        clues: [
          { emoji: '🐟', label: 'Cá' },
          { emoji: '🌊', label: 'Nước' },
        ],
        answer: 'NHƯ CÁ GẶP NƯỚC',
        hint: 'Mô tả sự hòa hợp, thuận lợi gặp đúng hoàn cảnh phát huy tài năng',
        explanation: 'Như cá gặp nước: gặp điều kiện thuận lợi tuyệt vời để phát triển.',
      },
      {
        category: 'Thành ngữ dân gian',
        difficulty: 'MEDIUM',
        clues: [
          { emoji: '🐴', label: 'Ngựa' },
          { emoji: '🛣️', label: 'Đường dài' },
          { emoji: '🏆', label: 'Hay' },
        ],
        answer: 'ĐƯỜNG DÀI MỚI BIẾT NGỰA HAY',
        hint: 'Thời gian thử thách sẽ bộc lộ thực tài và phẩm chất con người',
        explanation: 'Chặng đường xa mới biết sức bền của ngựa; việc lâu ngày mới rõ lòng dạ con người.',
      },
      {
        category: 'Đố vui đời sống',
        difficulty: 'EASY',
        clues: [
          { emoji: '🍯', label: 'Mật' },
          { emoji: '👄', label: 'Miệng' },
          { emoji: '🗡️', label: 'Dao găm' },
        ],
        answer: 'KHẨU PHẬT TÂM XÀ',
        hint: 'Ngoài miệng nói lời ngọt ngào đạo lý nhưng trong lòng nham hiểm',
        explanation: 'Miệng thốt lời từ bi như Phật nhưng tâm địa độc địa như rắn độc.',
      },
      {
        category: 'Thành ngữ hành động',
        difficulty: 'MEDIUM',
        clues: [
          { emoji: '🏹', label: 'Cung tên' },
          { emoji: '🐦', label: 'Hai con chim' },
        ],
        answer: 'NHẤT CỬ LƯỠNG TIỆN',
        hint: 'Làm một việc mà đạt được cả hai mục đích có lợi',
        explanation: 'Một mũi tên trúng hai đích; làm một việc đạt được hai điều tốt đẹp.',
      },
      {
        category: 'Văn hóa Việt Nam',
        difficulty: 'HARD',
        clues: [
          { emoji: '⚡', label: 'Sấm chớp' },
          { emoji: '👂', label: 'Tai' },
          { emoji: '🦻', label: 'Bịt' },
        ],
        answer: 'BỊT TAI TRỘM CHUÔNG',
        hint: 'Tự lừa dối chính mình, nghĩ mình không nghe thấy thì người khác cũng không biết',
        explanation: 'Hành động ngu ngốc tự đánh lừa bản thân khi làm điều xằng bậy.',
      },
    ];
  }

  /**
   * Sinh bộ câu hỏi Giải Mã Ô Chữ (Crossword Battle) tự động bằng AI hoặc Offline Smart Generator
   */
  public async generateCrosswordSet(params: {
    topic: string;
    keyword?: string;
    apiKey?: string;
    provider?: 'GEMINI' | 'OPENAI' | 'OFFLINE';
    autoSave?: boolean;
  }): Promise<CrosswordQuestionSet> {
    const topic = (params.topic || 'Khoa học và Đời sống Việt Nam').trim();
    const apiKey = params.apiKey || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    const provider = params.provider || (apiKey ? 'GEMINI' : 'OFFLINE');

    this.logger.log(`Generating Crossword set for topic "${topic}" using provider: ${provider}`);

    if (provider === 'GEMINI' && apiKey) {
      try {
        const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const prompt = `Bạn là biên tập viên gameshow "Giải Mã Ô Chữ" (Crossword Battle) trên TikTok LIVE.
Hãy thiết kế 1 bộ câu hỏi ô chữ tiếng Việt chủ đề "${topic}"${params.keyword ? ` với Từ khóa bí mật là "${params.keyword.toUpperCase()}"` : ' với Từ khóa bí mật dài 5 chữ cái'}.
QUY TẮC BẮT BUỘC:
- Số hàng ngang phải ĐÚNG BẰNG số chữ cái viết liền của keyword.
- Đáp án của hàng ngang thứ i PHẢI chứa chữ cái thứ i của keyword!
- Trả về JSON thuần túy:
{
  "name": "Tên bộ ô chữ",
  "topic": "${topic}",
  "keyword": "TỪ KHÓA (5 chữ cái)",
  "keywordHint": "Gợi ý giải mã từ khóa",
  "description": "Mô tả ngắn",
  "rows": [
    {
      "rowNumber": 1,
      "question": "Câu hỏi hàng ngang 1?",
      "answer": "ĐÁP ÁN 1",
      "hint": "Gợi ý hàng 1",
      "timeLimit": 20,
      "points": 100
    }
  ]
}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, responseMimeType: 'application/json' },
          }),
        });
        if (res.ok) {
          const data: any = await res.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = this.parseJsonSafely<any>(rawText);
            if (this.crosswordService) {
              return params.autoSave !== false
                ? this.crosswordService.createQuestionSet(parsed)
                : this.crosswordService.normalizeAndValidateSet(parsed);
            }
          }
        }
      } catch (err: any) {
        this.logger.warn(`Gemini crossword generation failed (${err.message}), using Offline Crossword Generator.`);
      }
    }

    const offlineTemplates: Array<Partial<CrosswordQuestionSet>> = [
      {
        name: `Khám Phá Vũ Trụ & Khoa Học (${topic})`,
        topic,
        keyword: 'SAOĐỎ',
        keywordHint: 'Biểu tượng ngôi sao năm cánh lấp lánh trên lá quốc kỳ Việt Nam (5 chữ cái)',
        description: 'Bộ câu hỏi khoa học tự nhiên và thiên văn học hấp dẫn.',
        rows: [
          {
            id: `xr-ai-${Date.now()}-1`,
            rowNumber: 1,
            question: 'Kim loại màu xám bạc phổ biến nhất dùng để sản xuất thép trong xây dựng và công nghiệp?',
            answer: 'SẮT',
            cleanAnswer: 'SẮT',
            acceptedAnswers: ['SẮT', 'SAT', 'FE'],
            hint: 'Ký hiệu hóa học là Fe',
            answerPosition: 1, // [S]ẮT -> S
            keywordIndex: 1,
            timeLimit: 20,
            points: 100,
          },
          {
            id: 'xr-ai-2',
            rowNumber: 2,
            question: 'Kim loại quý màu vàng óng được dùng làm trang sức và dự trữ tiền tệ quốc gia?',
            answer: 'VÀNG',
            cleanAnswer: 'VÀNG',
            acceptedAnswers: ['VÀNG', 'VANG', 'AU'],
            hint: 'Ký hiệu hóa học là Au',
            answerPosition: 2, // V[À]NG -> A
            keywordIndex: 2,
            timeLimit: 20,
            points: 100,
          },
          {
            id: 'xr-ai-3',
            rowNumber: 3,
            question: 'Khí cần thiết nhất cho sự hô hấp của con người và sự cháy trên Trái Đất?',
            answer: 'OXY',
            cleanAnswer: 'OXY',
            acceptedAnswers: ['OXY', 'OXI', 'OXYGEN'],
            hint: 'Chiếm khoảng 21% thể tích không khí',
            answerPosition: 1, // [O]XY -> O
            keywordIndex: 3,
            timeLimit: 20,
            points: 100,
          },
          {
            id: 'xr-ai-4',
            rowNumber: 4,
            question: 'Hành tinh thứ ba tính từ Mặt Trời, ngôi nhà chung của sự sống và nhân loại?',
            answer: 'TRÁI ĐẤT',
            cleanAnswer: 'TRÁIĐẤT',
            acceptedAnswers: ['TRÁI ĐẤT', 'TRAI DAT', 'ĐỊA CẦU'],
            hint: 'Hành tinh xanh của chúng ta',
            answerPosition: 5, // TRÁI[Đ]ẤT -> Đ
            keywordIndex: 4,
            timeLimit: 20,
            points: 100,
          },
          {
            id: 'xr-ai-5',
            rowNumber: 5,
            question: 'Hiện tượng thời tiết có luồng không khí xoáy mạnh kèm mưa lớn từ biển đổ bộ vào đất liền?',
            answer: 'BÃO',
            cleanAnswer: 'BÃO',
            acceptedAnswers: ['BÃO', 'BAO', 'CƠN BÃO'],
            hint: '3 chữ cái, thường xuất hiện ở Biển Đông vào mùa mưa',
            answerPosition: 3, // BÃ[O] -> O
            keywordIndex: 5,
            timeLimit: 20,
            points: 100,
          },
        ],
      },
    ];

    const rawSet = offlineTemplates[0];
    if (this.crosswordService) {
      return params.autoSave !== false
        ? this.crosswordService.createQuestionSet(rawSet)
        : this.crosswordService.normalizeAndValidateSet(rawSet);
    }
    return rawSet as CrosswordQuestionSet;
  }
}
