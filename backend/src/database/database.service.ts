import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
// Built-in Node.js SQLite module (Node 22.5+ / Node 24+)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DatabaseSync } = require('node:sqlite') as {
  DatabaseSync: new (path: string) => {
    exec(sql: string): void;
    prepare(sql: string): {
      run(...params: any[]): any;
      get(...params: any[]): any;
      all(...params: any[]): any[];
    };
  };
};
type SqliteDatabase = InstanceType<typeof DatabaseSync>;
import { SEED_CATEGORIES, SEED_GIFTS, SEED_QUESTIONS } from './seed-data';
import {
  LeaderboardEntry,
  OptionLabel,
  QuestionDifficulty,
  QuestionRatioSettings,
  QuestionRecord,
  QuestionStatus,
  RoomStatus,
  SessionQuestionSnapshot,
} from '../common/types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private db!: SqliteDatabase;
  private readonly dbPath: string;
  private readonly roomConfigCache = new Map<string, any>();

  constructor() {
    const backendRoot = path.resolve(__dirname, '../..');
    const dataDir = path.join(backendRoot, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const envPath = process.env.SQLITE_PATH;
    this.dbPath = envPath
      ? path.resolve(backendRoot, envPath)
      : path.join(dataDir, 'knowledge_battle.sqlite');
  }

  onModuleInit() {
    this.initDatabase();
  }

  public initDatabase() {
    if (this.db) return;
    this.db = new DatabaseSync(this.dbPath);
    this.db.exec('PRAGMA journal_mode = WAL;');
    this.db.exec('PRAGMA synchronous = NORMAL;');
    this.db.exec('PRAGMA temp_store = MEMORY;');
    this.db.exec('PRAGMA cache_size = -32000;');
    this.db.exec('PRAGMA busy_timeout = 5000;');
    this.db.exec('PRAGMA foreign_keys = ON;');

    const primarySchemaPath = path.join(__dirname, 'mysql-init.sql');
    const fallbackSchemaPath = path.join(__dirname, '../../src/database/mysql-init.sql');
    const schemaPath = fs.existsSync(primarySchemaPath) ? primarySchemaPath : fallbackSchemaPath;
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    this.db.exec(schemaSql);
    this.ensureGiftRewardColumns();
    this.ensurePerformanceIndexes();
    this.ensureSystemSettingsTable();

    this.seedIfEmpty();
    this.logger.log(`SQLite Database initialized at ${this.dbPath}`);
  }

  private ensurePerformanceIndexes() {
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_game_players_session_user
        ON game_players(session_id, tiktok_user_id);
      CREATE INDEX IF NOT EXISTS idx_game_players_session_score
        ON game_players(session_id, total_score DESC, correct_count DESC, joined_at ASC);
      CREATE INDEX IF NOT EXISTS idx_game_results_session_question
        ON game_results(session_id, question_id);
      CREATE INDEX IF NOT EXISTS idx_game_results_lookup
        ON game_results(session_id, question_id, player_id);
    `);
  }

  private ensureGiftRewardColumns() {
    const columns = this.db
      .prepare(`PRAGMA table_info(gift_mappings)`)
      .all() as Array<{ name: string }>;
    const columnNames = new Set(columns.map((column) => column.name));
    if (!columnNames.has('reward_type')) {
      this.db.exec(
        `ALTER TABLE gift_mappings ADD COLUMN reward_type VARCHAR(32) NOT NULL DEFAULT 'POINTS'`
      );
    }
    if (!columnNames.has('reward_points')) {
      this.db.exec(
        `ALTER TABLE gift_mappings ADD COLUMN reward_points INTEGER NOT NULL DEFAULT 100`
      );
    }
    // Preserve the old SHARED_HINT meaning after upgrading an existing database.
    this.db
      .prepare(
        `UPDATE gift_mappings
         SET reward_type = 'ELIMINATE_WRONG', reward_points = 0
         WHERE effect_type = 'SHARED_HINT' AND reward_type = 'POINTS'`
      )
      .run();
  }

  private ensureSystemSettingsTable() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS system_settings (
        key VARCHAR(64) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    const existing = this.db
      .prepare(`SELECT value FROM system_settings WHERE key = 'question_ratio'`)
      .get() as { value: string } | undefined;

    if (!existing) {
      const defaultRatio: QuestionRatioSettings = {
        easyPercent: 40,
        mediumPercent: 40,
        hardPercent: 20,
        progressionOrder: 'PROGRESSIVE',
      };
      this.db
        .prepare(`INSERT OR REPLACE INTO system_settings (key, value) VALUES ('question_ratio', ?)`)
        .run(JSON.stringify(defaultRatio));
    }
  }

  public getQuestionRatioConfig(): QuestionRatioSettings {
    try {
      const row = this.db
        .prepare(`SELECT value FROM system_settings WHERE key = 'question_ratio'`)
        .get() as { value: string } | undefined;
      if (row?.value) {
        const parsed = JSON.parse(row.value);
        return {
          easyPercent: Number(parsed.easyPercent) || 40,
          mediumPercent: Number(parsed.mediumPercent) || 40,
          hardPercent: Number(parsed.hardPercent) || 20,
          progressionOrder: parsed.progressionOrder === 'SHUFFLED' ? 'SHUFFLED' : 'PROGRESSIVE',
        };
      }
    } catch {
      // ignore
    }
    return {
      easyPercent: 40,
      mediumPercent: 40,
      hardPercent: 20,
      progressionOrder: 'PROGRESSIVE',
    };
  }

  public setQuestionRatioConfig(config: Partial<QuestionRatioSettings>): QuestionRatioSettings {
    const current = this.getQuestionRatioConfig();
    let easy = Math.max(0, Math.min(100, Math.round(Number(config.easyPercent ?? current.easyPercent))));
    let medium = Math.max(0, Math.min(100, Math.round(Number(config.mediumPercent ?? current.mediumPercent))));
    let hard = Math.max(0, Math.min(100, Math.round(Number(config.hardPercent ?? current.hardPercent))));
    const order = config.progressionOrder === 'SHUFFLED' ? 'SHUFFLED' : 'PROGRESSIVE';

    if (easy + medium + hard === 0) {
      easy = 40;
      medium = 40;
      hard = 20;
    }

    const updated: QuestionRatioSettings = {
      easyPercent: easy,
      mediumPercent: medium,
      hardPercent: hard,
      progressionOrder: order,
    };

    this.db
      .prepare(`INSERT OR REPLACE INTO system_settings (key, value, updated_at) VALUES ('question_ratio', ?, CURRENT_TIMESTAMP)`)
      .run(JSON.stringify(updated));

    return updated;
  }

  public runInTransaction<T>(fn: () => T): T {
    this.db.exec('BEGIN IMMEDIATE TRANSACTION');
    try {
      const result = fn();
      this.db.exec('COMMIT');
      return result;
    } catch (err) {
      this.db.exec('ROLLBACK');
      throw err;
    }
  }

  private seedIfEmpty() {
    const countRow = this.db
      .prepare('SELECT COUNT(*) as cnt FROM question_categories')
      .get() as { cnt: number };

    const isFirstSeed = !countRow || countRow.cnt === 0;
    if (isFirstSeed) {
      this.logger.log('Seeding default Vietnamese Knowledge Battle data...');
    }

    this.runInTransaction(() => {
      // 1. Seed Users (Admin, Editor, Streamer)
      const insertUser = this.db.prepare(
        `INSERT OR IGNORE INTO users (id, username, display_name, role, tiktok_username) VALUES (?, ?, ?, ?, ?)`
      );
      insertUser.run('usr-admin', 'admin', 'Quản trị viên Hệ thống', 'ADMIN', null);
      insertUser.run('usr-editor', 'editor', 'Biên tập viên Nội dung', 'EDITOR', null);
      insertUser.run('usr-streamer', 'streamer01', 'MC Streamer', 'STREAMER', 'vinhnq_live');

      // 2. Seed Game definition
      this.db
        .prepare(
          `INSERT OR IGNORE INTO games (id, code, name, description, is_active) VALUES (?, ?, ?, ?, 1)`
        )
        .run(
          'game-kb',
          'KNOWLEDGE_BATTLE',
          'Knowledge Battle - Đấu Trường Tri Thức',
          'Trò chơi đố vui tương tác trực tiếp trên TikTok LIVE (4 lựa chọn A/B/C/D)'
        );

      // 3. Seed Categories (luôn đồng bộ thêm danh mục mới nếu chưa có)
      const insertCat = this.db.prepare(
        `INSERT OR IGNORE INTO question_categories (id, slug, name, description, icon) VALUES (?, ?, ?, ?, ?)`
      );
      for (const cat of SEED_CATEGORIES) {
        insertCat.run(cat.id, cat.slug, cat.name, cat.description, cat.icon);
      }

      // 4. Seed Questions, Options, Sources, Reviews (luôn đồng bộ thêm câu hỏi mới vào DB hiện có)
      const insertQ = this.db.prepare(`
        INSERT OR IGNORE INTO questions (
          id, category_id, content, difficulty, question_type, language,
          explanation, topic_tags, status, created_by, approved_by
        ) VALUES (?, ?, ?, ?, 'MULTIPLE_CHOICE', 'vi', ?, ?, ?, 'usr-admin', ?)
      `);
      const insertOpt = this.db.prepare(`
        INSERT OR IGNORE INTO question_options (id, question_id, label, content, is_correct)
        VALUES (?, ?, ?, ?, ?)
      `);
      const insertSrc = this.db.prepare(`
        INSERT OR IGNORE INTO question_sources (id, question_id, source_type, source_url, license, attribution)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const insertRev = this.db.prepare(`
        INSERT OR IGNORE INTO question_reviews (id, question_id, reviewer_id, previous_status, new_status, notes)
        VALUES (?, ?, 'usr-editor', ?, ?, ?)
      `);

      for (const q of SEED_QUESTIONS) {
        const approvedBy = q.status === 'PUBLISHED' ? 'usr-editor' : null;
        insertQ.run(
          q.id,
          q.categoryId,
          q.content,
          q.difficulty,
          q.explanation,
          JSON.stringify(q.topicTags),
          q.status,
          approvedBy
        );

        (['A', 'B', 'C', 'D'] as OptionLabel[]).forEach((label) => {
          insertOpt.run(
            `${q.id}-opt-${label}`,
            q.id,
            label,
            q.options[label],
            q.correctOption === label ? 1 : 0
          );
        });

        insertSrc.run(
          `${q.id}-src`,
          q.id,
          q.sourceType,
          q.sourceUrl,
          q.license,
          q.attribution
        );

        if (q.status === 'PUBLISHED') {
          insertRev.run(
            `${q.id}-rev`,
            q.id,
            'PENDING',
            'PUBLISHED',
            'Đã kiểm chứng dữ kiện, nguồn tham khảo và giấy phép hợp lệ.'
          );
        }
      }

      // 5. Seed Default Quiz Set
      this.db
        .prepare(
          `INSERT OR IGNORE INTO quiz_sets (id, title, description, language, created_by) VALUES (?, ?, ?, 'vi', 'usr-admin')`
        )
        .run(
          'set-vietnam-general',
          'Bộ Đấu Trường Tri Thức Tổng Hợp (Tiếng Việt)',
          'Bộ câu hỏi chọn lọc đa chủ đề cho phiên livestream Knowledge Battle.'
        );

      const insertSetQ = this.db.prepare(
        `INSERT OR IGNORE INTO quiz_set_questions (id, quiz_set_id, question_id, sort_order) VALUES (?, ?, ?, ?)`
      );
      SEED_QUESTIONS.filter((q) => q.status === 'PUBLISHED').forEach((q, idx) => {
        insertSetQ.run(`sq-${idx + 1}`, 'set-vietnam-general', q.id, idx + 1);
      });

      insertSetQ.run(`sq-extra`, 'set-vietnam-general', SEED_QUESTIONS[0].id, 1);

      // Nâng thời gian mặc định mỗi câu lên 25s nếu đang ở mức 15s cũ để bù độ trễ video TikTok LIVE (6-10s)
      this.db
        .prepare(
          `UPDATE room_configs SET time_per_question = 25, reveal_duration = 8 WHERE room_id = 'room-default' AND time_per_question <= 15`
        )
        .run();

      if (!isFirstSeed) {
        return;
      }

      // 6. Seed Gift Mappings
      const insertGift = this.db.prepare(`
        INSERT OR IGNORE INTO gift_mappings
          (id, gift_id, gift_name, effect_type, reward_type, reward_points, display_message, duration_ms, icon, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
      `);
      for (const g of SEED_GIFTS) {
        insertGift.run(
          g.id,
          g.giftId,
          g.giftName,
          g.effectType,
          g.rewardType,
          g.rewardPoints,
          g.displayMessage,
          g.durationMs,
          g.icon
        );
      }

      // 7. Seed Default Room & Room Config
      this.db
        .prepare(
          `INSERT OR IGNORE INTO rooms (id, room_code, title, streamer_id, tiktok_username, status)
           VALUES ('room-default', 'KB2026', 'Đấu Trường Tri Thức - Phiên LIVE Chính', 'usr-streamer', 'vinhnq_live', 'WAITING')`
        )
        .run();

      this.db
        .prepare(
          `INSERT OR IGNORE INTO room_configs (room_id, category_id, difficulty, question_count, time_per_question, auto_advance, reveal_duration)
           VALUES ('room-default', NULL, 'ALL', 10, 25, 1, 8)`
        )
        .run();
    });
  }

  // =====================================================================
  // QUESTION BANK & CATEGORIES CRUD + APPROVAL WORKFLOW (Mục 4)
  // =====================================================================

  public getCategories() {
    return this.db
      .prepare(
        `SELECT c.*,
          (SELECT COUNT(*) FROM questions q WHERE q.category_id = c.id AND q.status = 'PUBLISHED') as publishedCount,
          (SELECT COUNT(*) FROM questions q WHERE q.category_id = c.id) as totalCount
         FROM question_categories c
         ORDER BY c.name ASC`
      )
      .all();
  }

  public createCategory(data: { name: string; slug?: string; description?: string; icon?: string }) {
    const id = `cat-${uuidv4().slice(0, 8)}`;
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    this.db
      .prepare(
        `INSERT INTO question_categories (id, slug, name, description, icon) VALUES (?, ?, ?, ?, ?)`
      )
      .run(id, slug, data.name, data.description || '', data.icon || 'book-open');
    return this.db.prepare(`SELECT * FROM question_categories WHERE id = ?`).get(id);
  }

  public getQuestions(filters?: {
    categoryId?: string;
    difficulty?: string;
    status?: string;
    search?: string;
  }): QuestionRecord[] {
    const conditions: string[] = [];
    const params: any[] = [];

    if (filters?.categoryId && filters.categoryId !== 'ALL') {
      conditions.push('q.category_id = ?');
      params.push(filters.categoryId);
    }
    if (filters?.difficulty && filters.difficulty !== 'ALL') {
      conditions.push('q.difficulty = ?');
      params.push(filters.difficulty);
    }
    if (filters?.status && filters.status !== 'ALL') {
      conditions.push('q.status = ?');
      params.push(filters.status);
    }
    if (filters?.search) {
      conditions.push('(q.content LIKE ? OR q.explanation LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const rows = this.db
      .prepare(
        `SELECT q.*, c.name as category_name
         FROM questions q
         LEFT JOIN question_categories c ON c.id = q.category_id
         ${whereClause}
         ORDER BY q.updated_at DESC, q.id ASC`
      )
      .all(...params) as any[];

    return rows.map((row) => this.hydrateQuestion(row));
  }

  public getQuestionById(id: string): QuestionRecord | null {
    const row = this.db
      .prepare(
        `SELECT q.*, c.name as category_name
         FROM questions q
         LEFT JOIN question_categories c ON c.id = q.category_id
         WHERE q.id = ?`
      )
      .get(id) as any;
    if (!row) return null;
    return this.hydrateQuestion(row);
  }

  public cleanOptionContent(text: string): string {
    if (!text) return '';
    const cleaned = text.replace(/\s*[\(\[][^\)\]]*[\)\]]/g, '').trim();
    return cleaned.length > 0 ? cleaned : text.trim();
  }

  private hydrateQuestion(row: any): QuestionRecord {
    const options = this.db
      .prepare(`SELECT * FROM question_options WHERE question_id = ? ORDER BY label ASC`)
      .all(row.id) as any[];
    const source = this.db
      .prepare(`SELECT * FROM question_sources WHERE question_id = ? LIMIT 1`)
      .get(row.id) as any;

    let tags: string[] = [];
    try {
      tags = row.topic_tags ? JSON.parse(row.topic_tags) : [];
    } catch {
      tags = [];
    }

    return {
      id: row.id,
      categoryId: row.category_id,
      categoryName: row.category_name,
      content: row.content,
      difficulty: row.difficulty as QuestionDifficulty,
      questionType: 'MULTIPLE_CHOICE',
      language: row.language || 'vi',
      explanation: row.explanation || '',
      topicTags: tags,
      status: row.status as QuestionStatus,
      options: options.map((o) => ({
        id: o.id,
        questionId: o.question_id,
        label: o.label as OptionLabel,
        content: this.cleanOptionContent(o.content),
        isCorrect: Boolean(o.is_correct),
      })),
      source: source
        ? {
            id: source.id,
            questionId: source.question_id,
            sourceType: source.source_type,
            sourceUrl: source.source_url,
            license: source.license,
            attribution: source.attribution,
          }
        : undefined,
      createdBy: row.created_by,
      approvedBy: row.approved_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  public createQuestion(dto: {
    categoryId: string;
    content: string;
    difficulty: QuestionDifficulty;
    options: Record<OptionLabel, string>;
    correctOption: OptionLabel;
    explanation: string;
    topicTags?: string[];
    status?: QuestionStatus;
    sourceType?: 'OPEN_TRIVIA_DB' | 'WIKIDATA' | 'WIKIPEDIA' | 'AI' | 'MANUAL';
    sourceUrl?: string;
    license?: string;
    attribution?: string;
  }): QuestionRecord {
    const id = `q-${uuidv4().slice(0, 8)}`;
    const status: QuestionStatus = dto.status || 'PENDING';

    this.runInTransaction(() => {
      this.db
        .prepare(
          `INSERT INTO questions (
            id, category_id, content, difficulty, question_type, language,
            explanation, topic_tags, status, created_by, approved_by
          ) VALUES (?, ?, ?, ?, 'MULTIPLE_CHOICE', 'vi', ?, ?, ?, 'usr-admin', ?)`
        )
        .run(
          id,
          dto.categoryId,
          dto.content.trim(),
          dto.difficulty || 'MEDIUM',
          dto.explanation || '',
          JSON.stringify(dto.topicTags || []),
          status,
          status === 'PUBLISHED' ? 'usr-editor' : null
        );

      const insertOpt = this.db.prepare(
        `INSERT INTO question_options (id, question_id, label, content, is_correct) VALUES (?, ?, ?, ?, ?)`
      );
      (['A', 'B', 'C', 'D'] as OptionLabel[]).forEach((label) => {
        insertOpt.run(
          `${id}-opt-${label}`,
          id,
          label,
          this.cleanOptionContent(dto.options[label] || ''),
          dto.correctOption === label ? 1 : 0
        );
      });

      this.db
        .prepare(
          `INSERT INTO question_sources (id, question_id, source_type, source_url, license, attribution)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .run(
          `${id}-src`,
          id,
          dto.sourceType || 'MANUAL',
          dto.sourceUrl || '',
          dto.license || 'CC BY-SA 4.0',
          dto.attribution || 'Biên tập viên nội bộ'
        );
    });

    return this.getQuestionById(id)!;
  }

  public updateQuestion(
    id: string,
    dto: Partial<{
      categoryId: string;
      content: string;
      difficulty: QuestionDifficulty;
      options: Record<OptionLabel, string>;
      correctOption: OptionLabel;
      explanation: string;
      topicTags: string[];
      status: QuestionStatus;
      sourceType: string;
      sourceUrl: string;
      license: string;
      attribution: string;
    }>
  ): QuestionRecord | null {
    const existing = this.getQuestionById(id);
    if (!existing) return null;

    this.runInTransaction(() => {
      this.db
        .prepare(
          `UPDATE questions
           SET category_id = ?, content = ?, difficulty = ?, explanation = ?, topic_tags = ?, status = ?, updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`
        )
        .run(
          dto.categoryId ?? existing.categoryId,
          dto.content ?? existing.content,
          dto.difficulty ?? existing.difficulty,
          dto.explanation ?? existing.explanation,
          JSON.stringify(dto.topicTags ?? existing.topicTags),
          dto.status ?? existing.status,
          id
        );

      if (dto.options || dto.correctOption) {
        const currentCorrect =
          dto.correctOption ||
          existing.options.find((o) => o.isCorrect)?.label ||
          'A';
        const updateOpt = this.db.prepare(
          `UPDATE question_options SET content = ?, is_correct = ? WHERE question_id = ? AND label = ?`
        );
        (['A', 'B', 'C', 'D'] as OptionLabel[]).forEach((label) => {
          const currentOpt = existing.options.find((o) => o.label === label);
          const content = dto.options?.[label] ?? currentOpt?.content ?? '';
          updateOpt.run(content, currentCorrect === label ? 1 : 0, id, label);
        });
      }

      if (dto.sourceType || dto.sourceUrl || dto.license || dto.attribution) {
        this.db
          .prepare(
            `UPDATE question_sources
             SET source_type = ?, source_url = ?, license = ?, attribution = ?
             WHERE question_id = ?`
          )
          .run(
            dto.sourceType ?? existing.source?.sourceType ?? 'MANUAL',
            dto.sourceUrl ?? existing.source?.sourceUrl ?? '',
            dto.license ?? existing.source?.license ?? '',
            dto.attribution ?? existing.source?.attribution ?? '',
            id
          );
      }
    });

    return this.getQuestionById(id);
  }

  public reviewQuestion(
    id: string,
    newStatus: QuestionStatus,
    notes?: string,
    reviewerId = 'usr-editor'
  ): QuestionRecord | null {
    const existing = this.getQuestionById(id);
    if (!existing) return null;

    this.runInTransaction(() => {
      this.db
        .prepare(
          `UPDATE questions SET status = ?, approved_by = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
        )
        .run(
          newStatus,
          newStatus === 'PUBLISHED' || newStatus === 'APPROVED' ? reviewerId : existing.approvedBy,
          id
        );

      this.db
        .prepare(
          `INSERT INTO question_reviews (id, question_id, reviewer_id, previous_status, new_status, notes)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .run(
          `rev-${uuidv4().slice(0, 8)}`,
          id,
          reviewerId,
          existing.status,
          newStatus,
          notes || `Chuyển trạng thái từ ${existing.status} sang ${newStatus}`
        );
    });

    return this.getQuestionById(id);
  }

  public getQuestionReviews(questionId?: string) {
    if (questionId) {
      return this.db
        .prepare(`SELECT * FROM question_reviews WHERE question_id = ? ORDER BY reviewed_at DESC`)
        .all(questionId);
    }
    return this.db
      .prepare(
        `SELECT r.*, q.content as question_content
         FROM question_reviews r
         LEFT JOIN questions q ON q.id = r.question_id
         ORDER BY r.reviewed_at DESC LIMIT 50`
      )
      .all();
  }

  /**
   * Chọn câu hỏi PUBLISHED cho trận đấu theo cấu hình phòng (Mục 4.5)
   * Tỉ lệ phân bổ độ khó khi chọn Hỗn hợp (ALL): 40% Dễ - 40% Trung bình - 20% Khó
   * Ví dụ:
   *  - 10 câu: 4 Dễ, 4 TB, 2 Khó
   *  - 20 câu: 8 Dễ, 8 TB, 4 Khó
   *  - 30 câu: 12 Dễ, 12 TB, 6 Khó
   *  - 40 câu: 16 Dễ, 16 TB, 8 Khó
   * Sắp xếp theo thứ tự lũy tiến hấp dẫn: Dễ (khởi động) -> Trung bình (tăng tốc) -> Khó (về đích).
   * Hạn chế lặp câu hỏi qua lịch sử các trận gần nhất và xáo trộn vị trí đáp án.
   */
  public selectQuestionsForSession(config: {
    categoryId?: string | null;
    difficulty?: string;
    questionCount: number;
    timePerQuestion: number;
    roomId: string;
  }): SessionQuestionSnapshot[] {
    // 1. Lấy lịch sử sử dụng câu hỏi của phòng để chống lặp
    const recentSessions = this.db
      .prepare(
        `SELECT questions_snapshot FROM game_sessions
         WHERE room_id = ? OR room_id = 'room-default'
         ORDER BY started_at DESC LIMIT 300`
      )
      .all(config.roomId) as Array<{ questions_snapshot: string }>;

    // Map questionId -> chỉ số phiên gần nhất (0: trận vừa chơi xong, càng lớn càng chơi lâu rồi)
    const lastUsedSessionIndex = new Map<string, number>();
    recentSessions.forEach((s, sIdx) => {
      try {
        const parsed = JSON.parse(s.questions_snapshot || '[]');
        for (const item of parsed) {
          if (item?.questionId && !lastUsedSessionIndex.has(item.questionId)) {
            lastUsedSessionIndex.set(item.questionId, sIdx);
          }
        }
      } catch {
        // ignore invalid snapshot json
      }
    });

    const shuffle = <T>(arr: T[]): T[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    // Helper sắp xếp ưu tiên: câu chưa từng chơi lên đầu (được xáo trộn), tiếp theo là câu chơi lâu nhất
    const prioritizeByUsage = (pool: any[]): any[] => {
      const neverUsed: any[] = [];
      const usedGroupedByAge = new Map<number, any[]>();
      for (const r of pool) {
        const sIdx = lastUsedSessionIndex.get(r.id);
        if (sIdx === undefined) {
          neverUsed.push(r);
        } else {
          const list = usedGroupedByAge.get(sIdx) || [];
          list.push(r);
          usedGroupedByAge.set(sIdx, list);
        }
      }
      const sortedAges = Array.from(usedGroupedByAge.keys()).sort((a, b) => b - a);
      const sortedUsedPool: any[] = [];
      for (const age of sortedAges) {
        sortedUsedPool.push(...shuffle(usedGroupedByAge.get(age) || []));
      }
      return [...shuffle(neverUsed), ...sortedUsedPool];
    };

    const isRunAll = !config.questionCount || config.questionCount <= 0 || config.questionCount >= 9999;
    const isSpecificDifficulty = !!(config.difficulty && config.difficulty !== 'ALL');

    let selected: any[] = [];

    if (isSpecificDifficulty) {
      // 2A. Streamer chọn 1 độ khó cụ thể (EASY, MEDIUM, hoặc HARD)
      const conditions = [`q.status = 'PUBLISHED'`, `q.difficulty = ?`];
      const params: any[] = [config.difficulty];
      if (config.categoryId && config.categoryId !== 'ALL') {
        conditions.push(`q.category_id = ?`);
        params.push(config.categoryId);
      }

      let rows = this.db
        .prepare(
          `SELECT q.*, c.name as category_name
           FROM questions q
           LEFT JOIN question_categories c ON c.id = q.category_id
           WHERE ${conditions.join(' AND ')}`
        )
        .all(...params) as any[];

      // Fallback nếu không đủ câu trong danh mục đó
      if (rows.length === 0 || (!isRunAll && rows.length < config.questionCount)) {
        const existingIds = new Set(rows.map((r) => r.id));
        const fallbackRows = this.db
          .prepare(
            `SELECT q.*, c.name as category_name
             FROM questions q
             LEFT JOIN question_categories c ON c.id = q.category_id
             WHERE q.status = 'PUBLISHED' AND q.difficulty = ?`
          )
          .all(config.difficulty) as any[];
        for (const fb of fallbackRows) {
          if (!existingIds.has(fb.id)) {
            rows.push(fb);
          }
        }
      }

      const prioritized = prioritizeByUsage(rows);
      selected = isRunAll ? (prioritized.length ? prioritized : rows) : prioritized.slice(0, Math.max(1, config.questionCount));
    } else {
      // 2B. Hỗn hợp (ALL): Phân bổ tỉ lệ chuẩn 4 Dễ (40%) - 4 Trung bình (40%) - 2 Khó (20%)
      const conditions = [`q.status = 'PUBLISHED'`];
      const params: any[] = [];
      if (config.categoryId && config.categoryId !== 'ALL') {
        conditions.push(`q.category_id = ?`);
        params.push(config.categoryId);
      }

      const catRows = this.db
        .prepare(
          `SELECT q.*, c.name as category_name
           FROM questions q
           LEFT JOIN question_categories c ON c.id = q.category_id
           WHERE ${conditions.join(' AND ')}`
        )
        .all(...params) as any[];

      let easyPool = catRows.filter((r) => r.difficulty === 'EASY');
      let mediumPool = catRows.filter((r) => r.difficulty === 'MEDIUM');
      let hardPool = catRows.filter((r) => r.difficulty === 'HARD');

      const ratio = this.getQuestionRatioConfig();

      if (isRunAll) {
        // Chạy toàn bộ ngân hàng câu hỏi: sắp xếp theo cấu hình Admin (lũy tiến hoặc ngẫu nhiên)
        const ordEasy = prioritizeByUsage(easyPool);
        const ordMedium = prioritizeByUsage(mediumPool);
        const ordHard = prioritizeByUsage(hardPool);
        const combined = [...ordEasy, ...ordMedium, ...ordHard];
        selected = ratio.progressionOrder === 'SHUFFLED' ? shuffle(combined) : combined;
      } else {
        const total = Math.max(1, config.questionCount);
        const sumPct = ratio.easyPercent + ratio.mediumPercent + ratio.hardPercent || 100;
        const targetEasy = Math.round(total * (ratio.easyPercent / sumPct));
        const targetMedium = Math.round(total * (ratio.mediumPercent / sumPct));
        const targetHard = Math.max(0, total - targetEasy - targetMedium);

        // Fallback mở rộng ngân hàng nếu danh mục hiện tại thiếu câu ở bất kỳ độ khó nào
        const checkAndEnrichPool = (pool: any[], diff: string, targetCount: number) => {
          if (pool.length < targetCount) {
            const existingIds = new Set(pool.map((r) => r.id));
            const globalFallback = this.db
              .prepare(
                `SELECT q.*, c.name as category_name
                 FROM questions q
                 LEFT JOIN question_categories c ON c.id = q.category_id
                 WHERE q.status = 'PUBLISHED' AND q.difficulty = ?`
              )
              .all(diff) as any[];
            for (const fb of globalFallback) {
              if (!existingIds.has(fb.id)) {
                pool.push(fb);
                existingIds.add(fb.id);
              }
            }
          }
          return pool;
        };

        easyPool = checkAndEnrichPool(easyPool, 'EASY', targetEasy);
        mediumPool = checkAndEnrichPool(mediumPool, 'MEDIUM', targetMedium);
        hardPool = checkAndEnrichPool(hardPool, 'HARD', targetHard);

        const orderedEasy = prioritizeByUsage(easyPool);
        const orderedMedium = prioritizeByUsage(mediumPool);
        const orderedHard = prioritizeByUsage(hardPool);

        const pickedEasy = orderedEasy.slice(0, targetEasy);
        const pickedMedium = orderedMedium.slice(0, targetMedium);
        const pickedHard = orderedHard.slice(0, targetHard);

        // Xếp theo tiến trình kịch tính chuẩn: Dễ (khởi động) -> Trung bình (tăng tốc) -> Khó (về đích)
        const combined = [...pickedEasy, ...pickedMedium, ...pickedHard];
        const pickedIds = new Set(combined.map((r) => r.id));

        // Nếu một nhóm bị thiếu số lượng cần thiết, bổ sung từ các câu dư ở nhóm khác
        if (combined.length < total) {
          const leftovers = [
            ...orderedEasy.slice(targetEasy),
            ...orderedMedium.slice(targetMedium),
            ...orderedHard.slice(targetHard),
          ];
          for (const item of leftovers) {
            if (combined.length >= total) break;
            if (!pickedIds.has(item.id)) {
              combined.push(item);
              pickedIds.add(item.id);
            }
          }
        }

        // Nếu vẫn chưa đủ (ví dụ tổng câu PUBLISHED trong hệ thống nhỏ hơn total), lấy bất kỳ câu nào còn lại
        if (combined.length < total) {
          const allPublished = this.db
            .prepare(
              `SELECT q.*, c.name as category_name
               FROM questions q
               LEFT JOIN question_categories c ON c.id = q.category_id
               WHERE q.status = 'PUBLISHED'`
            )
            .all() as any[];
          for (const item of prioritizeByUsage(allPublished)) {
            if (combined.length >= total) break;
            if (!pickedIds.has(item.id)) {
              combined.push(item);
              pickedIds.add(item.id);
            }
          }
        }

        selected = ratio.progressionOrder === 'SHUFFLED' ? shuffle(combined) : combined;
      }
    }
    const labels: OptionLabel[] = ['A', 'B', 'C', 'D'];

    return selected.map((row, idx) => {
      const hydrated = this.hydrateQuestion(row);
      // Xáo trộn vị trí 4 đáp án A/B/C/D trong mỗi trận để người chơi không đoán mò theo vị trí cố định
      const shuffledOptions = shuffle([...hydrated.options]);
      const optionsMap: Record<OptionLabel, string> = {
        A: '',
        B: '',
        C: '',
        D: '',
      };
      let correctOption: OptionLabel = 'A';
      shuffledOptions.forEach((opt, optIdx) => {
        const assignedLabel = labels[optIdx] || opt.label;
        optionsMap[assignedLabel] = this.cleanOptionContent(opt.content);
        if (opt.isCorrect) {
          correctOption = assignedLabel;
        }
      });
      return {
        questionId: hydrated.id,
        index: idx,
        categoryName: hydrated.categoryName || 'Tổng hợp',
        difficulty: hydrated.difficulty,
        content: hydrated.content,
        options: optionsMap,
        correctOption,
        explanation: hydrated.explanation,
        sourceAttribution: hydrated.source?.attribution
          ? `${hydrated.source.attribution} (${hydrated.source.license || 'CC'})`
          : undefined,
        timeLimit: config.timePerQuestion,
      };
    });
  }

  /**
   * Tự động sinh và bổ sung bộ câu hỏi ngẫu nhiên đa chủ đề vào Ngân hàng câu hỏi
   */
  public generateRandomQuestions(
    count = 10,
    targetStatus: QuestionStatus = 'PUBLISHED'
  ): QuestionRecord[] {
    const existingContents = new Set(
      (this.db.prepare(`SELECT content FROM questions`).all() as Array<{ content: string }>).map(
        (r) => r.content.trim().toLowerCase()
      )
    );

    const curatedRandomPool: Array<{
      categoryId: string;
      content: string;
      difficulty: QuestionDifficulty;
      correctAnswer: string;
      wrongAnswers: [string, string, string];
      explanation: string;
      topicTags: string[];
      sourceType: 'WIKIPEDIA' | 'WIKIDATA' | 'OPEN_TRIVIA_DB' | 'AI';
      attribution: string;
    }> = [
      {
        categoryId: 'cat-geo',
        content: 'Vịnh Hạ Long thuộc tỉnh nào của Việt Nam?',
        difficulty: 'EASY',
        correctAnswer: 'Quảng Ninh',
        wrongAnswers: ['Hải Phòng', 'Ninh Bình', 'Thanh Hóa'],
        explanation: 'Vịnh Hạ Long nằm ở tỉnh Quảng Ninh, nhiều lần được UNESCO công nhận là Di sản Thiên nhiên Thế giới.',
        topicTags: ['Di sản', 'Quảng Ninh'],
        sourceType: 'WIKIDATA',
        attribution: 'Wikidata - Ha Long Bay',
      },
      {
        categoryId: 'cat-geo',
        content: 'Cầu Rồng phun lửa và phun nước cuối tuần là biểu tượng du lịch của thành phố nào?',
        difficulty: 'EASY',
        correctAnswer: 'Đà Nẵng',
        wrongAnswers: ['Nha Trang', 'Quy Nhơn', 'Vũng Tàu'],
        explanation: 'Cầu Rồng bắc qua sông Hàn là công trình biểu tượng nổi tiếng của thành phố Đà Nẵng.',
        topicTags: ['Đà Nẵng', 'Du lịch'],
        sourceType: 'WIKIPEDIA',
        attribution: 'Wikipedia - Cầu Rồng',
      },
      {
        categoryId: 'cat-geo',
        content: 'Cao nguyên đá Đồng Văn — Công viên địa chất toàn cầu UNESCO đầu tiên của Việt Nam — thuộc tỉnh nào?',
        difficulty: 'MEDIUM',
        correctAnswer: 'Hà Giang',
        wrongAnswers: ['Cao Bằng', 'Lào Cai', 'Yên Bái'],
        explanation: 'Cao nguyên đá Đồng Văn nằm ở cực Bắc tỉnh Hà Giang, được UNESCO công nhận năm 2010.',
        topicTags: ['Hà Giang', 'UNESCO'],
        sourceType: 'WIKIPEDIA',
        attribution: 'Wikipedia - Cao nguyên đá Đồng Văn',
      },
      {
        categoryId: 'cat-geo',
        content: 'Chợ nổi Cái Răng là nét văn hóa sông nước đặc trưng của thành phố nào ở miền Tây?',
        difficulty: 'EASY',
        correctAnswer: 'Cần Thơ',
        wrongAnswers: ['Cà Mau', 'Sóc Trăng', 'An Giang'],
        explanation: 'Chợ nổi Cái Răng trên sông Cần Thơ là Di sản văn hóa phi vật thể quốc gia nổi tiếng tại TP. Cần Thơ.',
        topicTags: ['Miền Tây', 'Cần Thơ'],
        sourceType: 'WIKIPEDIA',
        attribution: 'Wikipedia - Chợ nổi Cái Răng',
      },
      {
        categoryId: 'cat-geo',
        content: 'Đại dương nào có diện tích lớn nhất và sâu nhất trên Trái Đất?',
        difficulty: 'EASY',
        correctAnswer: 'Thái Bình Dương',
        wrongAnswers: ['Đại Tây Dương', 'Ấn Độ Dương', 'Bắc Băng Dương'],
        explanation: 'Thái Bình Dương chiếm khoảng 1/3 diện tích bề mặt Trái Đất và có rãnh Mariana sâu nhất thế giới.',
        topicTags: ['Đại dương', 'Địa lý thế giới'],
        sourceType: 'OPEN_TRIVIA_DB',
        attribution: 'Open Trivia DB - Geography',
      },
      {
        categoryId: 'cat-his',
        content: 'Vị vua nào đã đặt quốc hiệu nước ta là "Đại Cồ Việt" vào năm 968 sau khi dẹp loạn 12 sứ quân?',
        difficulty: 'MEDIUM',
        correctAnswer: 'Đinh Tiên Hoàng (Đinh Bộ Lĩnh)',
        wrongAnswers: ['Lê Đại Hành', 'Lý Thái Tổ', 'Trần Thái Tông'],
        explanation: 'Năm 968, Đinh Bộ Lĩnh lên ngôi hoàng đế (Đinh Tiên Hoàng), đặt quốc hiệu là Đại Cồ Việt và đóng đô ở Hoa Lư.',
        topicTags: ['Nhà Đinh', 'Hoa Lư'],
        sourceType: 'WIKIPEDIA',
        attribution: 'Wikipedia - Đinh Tiên Hoàng',
      },
      {
        categoryId: 'cat-his',
        content: 'Bài thơ thần "Nam quốc sơn hà" thường được tương truyền vang lên trên phòng tuyến sông Như Nguyệt gắn với danh tướng nào?',
        difficulty: 'EASY',
        correctAnswer: 'Lý Thường Kiệt',
        wrongAnswers: ['Phạm Ngũ Lão', 'Yết Kiêu', 'Nguyễn Tri Phương'],
        explanation: 'Lý Thường Kiệt chỉ huy kháng chiến chống Tống năm 1077 trên phòng tuyến sông Như Nguyệt.',
        topicTags: ['Nhà Lý', 'Lịch sử'],
        sourceType: 'WIKIPEDIA',
        attribution: 'Wikipedia - Nam quốc sơn hà',
      },
      {
        categoryId: 'cat-his',
        content: 'Nữ tướng nào của phong trào Tây Sơn nổi tiếng với đội tượng binh (voi chiến) thiện chiến?',
        difficulty: 'MEDIUM',
        correctAnswer: 'Đô đốc Bùi Thị Xuân',
        wrongAnswers: ['Bà Triệu', 'Nguyên phi Ỷ Lan', 'Công chúa Ngọc Hân'],
        explanation: 'Đô đốc Bùi Thị Xuân là nữ tướng kiệt xuất của triều Tây Sơn, trực tiếp chỉ huy đội voi chiến.',
        topicTags: ['Tây Sơn', 'Nữ tướng'],
        sourceType: 'WIKIPEDIA',
        attribution: 'Wikipedia - Bùi Thị Xuân',
      },
      {
        categoryId: 'cat-sci',
        content: 'Công thức hóa học phổ biến của muối ăn hàng ngày là gì?',
        difficulty: 'EASY',
        correctAnswer: 'NaCl (Natri clorua)',
        wrongAnswers: ['H2O', 'CaCO3', 'NaOH'],
        explanation: 'Muối ăn có thành phần chính là Natri clorua (NaCl).',
        topicTags: ['Hóa học', 'Đời sống'],
        sourceType: 'WIKIDATA',
        attribution: 'Wikidata - Sodium chloride',
      },
      {
        categoryId: 'cat-sci',
        content: 'Loài động vật nào lớn nhất từng được biết đến còn sống trên Trái Đất hiện nay?',
        difficulty: 'EASY',
        correctAnswer: 'Cá voi xanh',
        wrongAnswers: ['Voi châu Phi', 'Cá mập trắng', 'Hươu cao cổ'],
        explanation: 'Cá voi xanh có thể dài tới gần 30m và nặng hơn 150 tấn, là loài động vật lớn nhất hành tinh.',
        topicTags: ['Sinh học', 'Động vật'],
        sourceType: 'OPEN_TRIVIA_DB',
        attribution: 'Open Trivia DB - Nature',
      },
      {
        categoryId: 'cat-sci',
        content: 'Nhiệt kế y tế truyền thống hoặc nhiệt độ thời tiết tại Việt Nam thường đo theo thang nhiệt độ nào?',
        difficulty: 'EASY',
        correctAnswer: 'Độ C (Celsius)',
        wrongAnswers: ['Độ F (Fahrenheit)', 'Độ Rankine', 'Độ Richter'],
        explanation: 'Thang nhiệt độ Celsius (°C) do nhà thiên văn học Anders Celsius đề xuất được sử dụng chính thức tại Việt Nam.',
        topicTags: ['Vật lý', 'Đo lường'],
        sourceType: 'WIKIDATA',
        attribution: 'Wikidata - Celsius',
      },
      {
        categoryId: 'cat-tech',
        content: 'Công nghệ kết nối không dây tầm ngắn thường dùng để kết nối tai nghe không dây với điện thoại là gì?',
        difficulty: 'EASY',
        correctAnswer: 'Bluetooth',
        wrongAnswers: ['Cáp quang', 'VGA', 'HDMI'],
        explanation: 'Bluetooth là chuẩn truyền thông không dây tầm ngắn phổ biến cho tai nghe, loa, chuột và bàn phím.',
        topicTags: ['Thiết bị số', 'Không dây'],
        sourceType: 'WIKIDATA',
        attribution: 'Wikidata - Bluetooth',
      },
      {
        categoryId: 'cat-tech',
        content: 'Hệ điều hành di động mã nguồn mở phổ biến nhất thế giới do Google phát triển có biểu tượng chú robot màu xanh lá là gì?',
        difficulty: 'EASY',
        correctAnswer: 'Android',
        wrongAnswers: ['iOS', 'Symbian', 'BlackBerry OS'],
        explanation: 'Android là hệ điều hành di động phổ biến nhất thế giới hiện nay.',
        topicTags: ['Điện thoại', 'Hệ điều hành'],
        sourceType: 'WIKIDATA',
        attribution: 'Wikidata - Android',
      },
      {
        categoryId: 'cat-sport',
        content: 'Trên bàn cờ vua tiêu chuẩn có tổng cộng bao nhiêu ô vuông đen và trắng?',
        difficulty: 'EASY',
        correctAnswer: '64 ô vuông (8x8)',
        wrongAnswers: ['49 ô vuông (7x7)', '81 ô vuông (9x9)', '100 ô vuông (10x10)'],
        explanation: 'Bàn cờ vua quốc tế gồm 8 hàng ngang và 8 cột dọc, tạo thành 64 ô vuông xen kẽ sáng tối.',
        topicTags: ['Cờ vua', 'Trí tuệ'],
        sourceType: 'OPEN_TRIVIA_DB',
        attribution: 'Open Trivia DB - Board Games',
      },
      {
        categoryId: 'cat-sport',
        content: 'Ca khúc "Tiến quân ca" — Quốc ca của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam — do nhạc sĩ nào sáng tác?',
        difficulty: 'EASY',
        correctAnswer: 'Nhạc sĩ Văn Cao',
        wrongAnswers: ['Nhạc sĩ Lưu Hữu Phước', 'Nhạc sĩ Đỗ Nhuận', 'Nhạc sĩ Phong Nhã'],
        explanation: 'Nhạc sĩ Văn Cao sáng tác bài "Tiến quân ca" vào cuối năm 1944 và được chọn làm Quốc ca Việt Nam từ năm 1946.',
        topicTags: ['Âm nhạc', 'Quốc ca'],
        sourceType: 'WIKIPEDIA',
        attribution: 'Wikipedia - Tiến quân ca',
      },
      {
        categoryId: 'cat-life',
        content: 'Món "Phở" truyền thống của Việt Nam sử dụng nguyên liệu bánh phở được làm từ loại hạt nào?',
        difficulty: 'EASY',
        correctAnswer: 'Hạt gạo tẻ',
        wrongAnswers: ['Hạt lúa mì', 'Đậu xanh', 'Hạt ngô'],
        explanation: 'Bánh phở truyền thống Việt Nam được tráng mỏng từ bột gạo tẻ xay nước.',
        topicTags: ['Ẩm thực', 'Phở Việt Nam'],
        sourceType: 'WIKIPEDIA',
        attribution: 'Wikipedia - Phở',
      },
      {
        categoryId: 'cat-life',
        content: 'Làng nghề truyền thống Bát Tràng ở ven sông Hồng (Hà Nội) nổi tiếng cả nước với sản phẩm thủ công nào?',
        difficulty: 'EASY',
        correctAnswer: 'Gốm sứ',
        wrongAnswers: ['Đúc đồng', 'Dệt đũi', 'Chạm bạc'],
        explanation: 'Làng gốm Bát Tràng (huyện Gia Lâm, Hà Nội) có lịch sử hàng trăm năm làm nghề gốm sứ cổ truyền.',
        topicTags: ['Làng nghề', 'Hà Nội'],
        sourceType: 'WIKIPEDIA',
        attribution: 'Wikipedia - Gốm Bát Tràng',
      },
      {
        categoryId: 'cat-life',
        content: 'Loại nón truyền thống có chóp nhọn được chằm từ lá cọ, lá nón gắn liền với hình ảnh người phụ nữ Việt Nam là gì?',
        difficulty: 'EASY',
        correctAnswer: 'Nón lá',
        wrongAnswers: ['Mũ phớt', 'Mũ nồi', 'Nón cối'],
        explanation: 'Nón lá cùng với tà áo dài là biểu tượng văn hóa truyền thống dịu dàng của phụ nữ Việt Nam.',
        topicTags: ['Văn hóa', 'Truyền thống'],
        sourceType: 'WIKIPEDIA',
        attribution: 'Wikipedia - Nón lá',
      },
    ];

    // Bổ sung các danh lam thắng cảnh & đặc sản 63 tỉnh thành Việt Nam
    const provinceSpecialties = [
      { province: 'Bến Tre', trait: 'Xứ Dừa và Kẹo dừa', wrongs: ['Xứ Nhãn lồng', 'Xứ Vải thiều', 'Xứ Chè Tân Cương'] },
      { province: 'Thái Nguyên', trait: 'Đệ nhất danh trà (Chè Tân Cương)', wrongs: ['Kẹo cu đơ', 'Mè xửng', 'Bánh pía'] },
      { province: 'Hưng Yên', trait: 'Nhãn lồng tiến vua', wrongs: ['Thanh long ruột đỏ', 'Sầu riêng Cái Mơn', 'Cam Cao Phong'] },
      { province: 'Sóc Trăng', trait: 'Bánh Pía sầu riêng trứng muối', wrongs: ['Bánh gai Tứ Trụ', 'Bánh cáy Làng Nguyễn', 'Cốm Làng Vòng'] },
      { province: 'Thái Bình', trait: 'Bánh cáy Làng Nguyễn', wrongs: ['Nem chua Thanh Hóa', 'Chả mực Hạ Long', 'Bánh tráng phơi sương'] },
      { province: 'Tây Ninh', trait: 'Bánh tráng phơi sương & Muối tôm', wrongs: ['Bún cá Nha Trang', 'Mì Quảng', 'Cao lầu Hội An'] },
      { province: 'Quảng Nam', trait: 'Mì Quảng và Cao lầu Hội An', wrongs: ['Bún chả Hà Nội', 'Bánh đa cua Hải Phòng', 'Hủ tiếu Mỹ Tho'] },
      { province: 'Hải Phòng', trait: 'Bánh đa cua và Hoa phượng đỏ', wrongs: ['Cơm hến', 'Bún mắm', 'Phở khô hai tô'] },
      { province: 'An Giang', trait: 'Miếu Bà Chúa Xứ Núi Sam & Rừng tràm Trà Sư', wrongs: ['Chợ nổi Cái Răng', 'Cồn Phụng', 'Chùa Dơi'] },
      { province: 'Kiên Giang', trait: 'Đảo ngọc Phú Quốc & Quần đảo Nam Du', wrongs: ['Cù lao Ré', 'Hòn Khô', 'Bình Ba'] },
      { province: 'Lâm Đồng', trait: 'Thành phố ngàn hoa Đà Lạt & Hồ Xuân Hương', wrongs: ['Bà Nà Hills', 'Fansipan', 'Tràng An'] },
      { province: 'Thừa Thiên Huế', trait: 'Cố đô Huế, Sông Hương & Chùa Thiên Mụ', wrongs: ['Phố cổ Hội An', 'Cố đô Hoa Lư', 'Hoàng thành Thăng Long'] },
      { province: 'Ninh Bình', trait: 'Quần thể danh thắng Tràng An & Tam Cốc Bích Động', wrongs: ['Động Phong Nha', 'Vịnh Lan Hạ', 'Đảo Cát Bà'] },
      { province: 'Phú Yên', trait: 'Gành Đá Đĩa độc đáo & Xứ hoa vàng trên cỏ xanh', wrongs: ['Mũi Né', 'Kỳ Co', 'Gành Son'] },
      { province: 'Đắk Lắk', trait: 'Thủ phủ cà phê Buôn Ma Thuột & Hồ Lắk', wrongs: ['Hồ Tơ Nưng', 'Núi Langbiang', 'Thác Datanla'] },
      { province: 'Bình Định', trait: 'Miền đất võ Tây Sơn & Bánh ít lá gai', wrongs: ['Bánh đậu xanh', 'Nem nướng Ninh Hòa', 'Kẹo sìu dâu'] },
      { province: 'Cà Mau', trait: 'Mũi Cà Mau — Cực Nam Tổ quốc & Rừng U Minh Hạ', wrongs: ['Mũi Sa Vĩ', 'Mũi Điện', 'Đèo Hải Vân'] },
      { province: 'Quảng Bình', trait: 'Vườn quốc gia Phong Nha - Kẻ Bàng & Hang Sơn Đoòng', wrongs: ['Động Hương Tích', 'Hang Đầu Gỗ', 'Động Ngườm Ngao'] },
      { province: 'Khánh Hòa', trait: 'Thành phố biển Nha Trang & Đảo Yến Hòn Nội', wrongs: ['Bãi Dài Phú Quốc', 'Biển Cửa Lò', 'Bãi Cháy'] },
      { province: 'Bà Rịa - Vũng Tàu', trait: 'Tượng Chúa Kytô Vua Núi Nhỏ & Bãi Trước, Bãi Sau', wrongs: ['Bán đảo Sơn Trà', 'Mũi Kê Gà', 'Hòn Rơm'] },
      { province: 'Đồng Tháp', trait: 'Xứ sở Sen hồng & Vườn quốc gia Tràm Chim', wrongs: ['Rừng U Minh Thượng', 'Vườn quốc gia Cúc Phương', 'Vườn quốc gia Cát Tiên'] },
      { province: 'Bắc Giang', trait: 'Vùng đất Vải thiều Lục Ngạn nức tiếng', wrongs: ['Vải thiều Thanh Hà', 'Xoài cát Hòa Lộc', 'Bưởi Năm Roi'] },
      { province: 'Hải Dương', trait: 'Đặc sản Bánh đậu xanh truyền thống thơm bùi', wrongs: ['Kẹo mè xửng', 'Kẹo cu đơ', 'Bánh cốm Hà Nội'] },
      { province: 'Hà Tĩnh', trait: 'Kẹo cu đơ Hà Tĩnh & Khu di tích Ngã ba Đồng Lộc', wrongs: ['Bánh cáy', 'Bánh gai', 'Bánh pía'] },
      { province: 'Nghệ An', trait: 'Làng Sen quê Bác & Bãi biển Cửa Lò', wrongs: ['Làng gốm Bát Tràng', 'Làng lụa Vạn Phúc', 'Làng đá Non Nước'] },
      { province: 'Thanh Hóa', trait: 'Di sản thế giới Thành nhà Hồ & Nem chua Thanh Hóa', wrongs: ['Kinh thành Huế', 'Hoàng thành Thăng Long', 'Thành Cổ Loa'] },
      { province: 'Cao Bằng', trait: 'Thác Bản Giốc hùng vĩ trên biên giới', wrongs: ['Thác Dambri', 'Thác Pongour', 'Thác Datanla'] },
      { province: 'Bắc Kạn', trait: 'Hồ Ba Bể — Hồ nước ngọt tự nhiên lớn nhất miền Bắc', wrongs: ['Hồ Tây', 'Hồ Núi Cốc', 'Hồ Thác Bà'] },
      { province: 'Điện Biên', trait: 'Chiến trường Điện Biên Phủ "Lừng lẫy năm châu" (1954)', wrongs: ['Chiến dịch Việt Bắc', 'Chiến dịch Biên giới', 'Chiến dịch Tây Nguyên'] },
      { province: 'Yên Bái', trait: 'Di tích quốc gia Ruộng bậc thang Mù Cang Chải', wrongs: ['Ruộng bậc thang Hoàng Su Phì', 'Sa Pa', 'Pù Luông'] },
    ];

    for (const item of provinceSpecialties) {
      curatedRandomPool.push({
        categoryId: 'cat-geo',
        content: `Khi nhắc đến tỉnh/thành phố ${item.province}, đâu là đặc sản hoặc danh lam biểu tượng nổi tiếng nhất?`,
        difficulty: 'EASY',
        correctAnswer: item.trait,
        wrongAnswers: item.wrongs as [string, string, string],
        explanation: `${item.province} nổi tiếng cả nước với biểu tượng / đặc sản: ${item.trait}.`,
        topicTags: ['Địa lý Việt Nam', item.province],
        sourceType: 'WIKIPEDIA',
        attribution: `Wikipedia Tiếng Việt - Văn hóa & Địa danh ${item.province}`,
      });
    }

    // Bổ sung kho câu hỏi đố vui dân gian & ca dao tục ngữ (hoàn toàn phi tính toán)
    const folkTriviaPool = [
      {
        content: 'Đố vui mẹo: "Con gì đập thì sống, không đập thì chết?"',
        correct: 'Con tim',
        wrongs: ['Con muỗi', 'Con ruồi', 'Con rắn'],
        exp: 'Quả tim đập liên tục để duy trì sự sống, tim ngừng đập nghĩa là chết.',
        cat: 'cat-life',
      },
      {
        content: 'Đố vui: "Cái gì đen khi mua, đỏ khi dùng và xám xịt khi vứt đi?"',
        correct: 'Than củi',
        wrongs: ['Chiếc lốp xe', 'Bao diêm', 'Nồi gang'],
        exp: 'Than củi lúc mua có màu đen, khi đốt cháy đỏ rực, sau khi tàn chỉ còn tro xám.',
        cat: 'cat-life',
      },
      {
        content: 'Đố vui: "Hoa gì không có cành, không có lá mà nở rực rỡ nhất trong đêm Giao thừa?"',
        correct: 'Hoa pháo bông (Pháo hoa)',
        wrongs: ['Hoa mai vàng', 'Hoa đào đỏ', 'Hoa quỳnh trắng'],
        exp: 'Pháo hoa bung nở rực rỡ trên bầu trời đêm Giao thừa mừng năm mới.',
        cat: 'cat-life',
      },
      {
        content: 'Đố vui: "Con gì sinh ra đã được mang quân hàm, đi đâu cũng được gọi là tướng?"',
        correct: 'Con cờ Tướng',
        wrongs: ['Con cua biển', 'Con chuồn chuồn', 'Con tôm hùm'],
        exp: 'Trong bàn cờ tướng, quân Tướng sinh ra đã mang tên là Tướng.',
        cat: 'cat-life',
      },
      {
        content: 'Đố vui: "Cây gì không cành không lá, người đi qua lại phải đứng nhìn chờ nở hoa?"',
        correct: 'Cột đèn giao thông',
        wrongs: ['Cây cột điện', 'Cây nêu ngày Tết', 'Cây cột cờ'],
        exp: 'Cột đèn giao thông bật đèn đỏ/xanh/vàng báo hiệu cho người tham gia giao thông.',
        cat: 'cat-life',
      },
      {
        content: 'Đố vui: "Cái gì chứa nhiều biển, nhiều sông, nhiều núi nhưng không hề có giọt nước hay hòn đá nào?"',
        correct: 'Tấm bản đồ',
        wrongs: ['Cuốn từ điển', 'Quả địa cầu rỗng', 'Bức tranh phong cảnh'],
        exp: 'Bản đồ vẽ tất cả sông núi biển cả trên giấy nhưng không chứa nước thật.',
        cat: 'cat-life',
      },
      {
        content: 'Đố vui: "Con gì có thể cuốn trôi cả thân cây cổ thụ nhưng lại không nhấc nổi hòn sỏi nhỏ?"',
        correct: 'Dòng sông',
        wrongs: ['Con gió bão', 'Con sóng biển', 'Con trâu mộng'],
        exp: 'Dòng sông cuồn cuộn cuốn trôi cây gỗ trôi nổi, nhưng sỏi đá chìm dưới đáy sông không nâng nổi.',
        cat: 'cat-life',
      },
      {
        content: 'Hoàn thành câu tục ngữ: "Bán anh em xa, mua..." gì?',
        correct: 'Láng giềng gần',
        wrongs: ['Bạn bè thân', 'Tình làng nghĩa xóm', 'Người quen cũ'],
        exp: 'Tục ngữ "Bán anh em xa, mua láng giềng gần" khuyên giữ gìn quan hệ tốt đẹp với hàng xóm.',
        cat: 'cat-his',
      },
      {
        content: 'Hoàn thành câu ca dao: "Bầu ơi thương lấy bí cùng, tuy rằng khác giống nhưng..." gì?',
        correct: 'Chung một giàn',
        wrongs: ['Cùng một mâm', 'Chung một nhà', 'Chung một lòng'],
        exp: 'Ca dao nhắc nhở tinh thần đoàn kết, tương thân tương ái giữa đồng bào.',
        cat: 'cat-his',
      },
      {
        content: 'Hoàn thành câu ca dao: "Nhiễu điều phủ lấy giá gương, người trong một nước phải..." gì?',
        correct: 'Thương nhau cùng',
        wrongs: ['Giúp nhau cùng', 'Yêu nhau cùng', 'Bảo bọc nhau'],
        exp: 'Câu ca dao dạy về lòng nhân ái, tình đoàn kết yêu thương đồng bào.',
        cat: 'cat-his',
      },
      {
        content: 'Đố kiến thức: Kim loại duy nhất tồn tại ở thể lỏng trong điều kiện nhiệt độ phòng là gì?',
        correct: 'Thủy ngân (Hg)',
        wrongs: ['Chì (Pb)', 'Nhôm (Al)', 'Thiếc (Sn)'],
        exp: 'Thủy ngân là kim loại có nhiệt độ nóng chảy thấp (-38,83 °C), ở thể lỏng ở nhiệt độ thường.',
        cat: 'cat-sci',
      },
      {
        content: 'Đố kiến thức: Hành tinh nào trong Hệ Mặt Trời được mệnh danh là "Hành tinh Đỏ"?',
        correct: 'Sao Hỏa (Mars)',
        wrongs: ['Sao Kim (Venus)', 'Sao Thủy (Mercury)', 'Sao Mộc (Jupiter)'],
        exp: 'Sao Hỏa có bề mặt chứa nhiều oxit sắt (rỉ sét) tạo nên màu đỏ cam đặc trưng.',
        cat: 'cat-sci',
      },
      {
        content: 'Đố kiến thức: Khí nào chiếm thể tích lớn nhất (khoảng 78%) trong bầu khí quyển Trái Đất?',
        correct: 'Khí Nitơ (N2)',
        wrongs: ['Khí Oxy (O2)', 'Khí Carbonic (CO2)', 'Khí Heli (He)'],
        exp: 'Khí quyển Trái Đất gồm khoảng 78% Nitơ, 21% Oxy và 1% các khí khác.',
        cat: 'cat-sci',
      },
      {
        content: 'Đố kiến thức: Loài chim nhỏ bé duy nhất trên thế giới có khả năng bay lùi là gì?',
        correct: 'Chim ruồi (Hummingbird)',
        wrongs: ['Chim sẻ', 'Chim yến', 'Chim bói cá'],
        exp: 'Cấu tạo khớp cánh linh hoạt giúp chim ruồi có thể bay đứng yên và bay lùi trong không trung.',
        cat: 'cat-sci',
      },
      {
        content: 'Đố kiến thức: Vitamin nào được cơ thể con người tự tổng hợp hiệu quả nhất khi tắm nắng sáng sớm?',
        correct: 'Vitamin D',
        wrongs: ['Vitamin A', 'Vitamin C', 'Vitamin B12'],
        exp: 'Ánh nắng mặt trời kích thích da tổng hợp Vitamin D tự nhiên rất tốt cho xương.',
        cat: 'cat-sci',
      },
    ];

    for (const item of folkTriviaPool) {
      curatedRandomPool.push({
        categoryId: item.cat,
        content: item.content,
        difficulty: 'EASY',
        correctAnswer: item.correct,
        wrongAnswers: item.wrongs as [string, string, string],
        explanation: item.exp,
        topicTags: ['Đố vui kiến thức', 'Đời sống'],
        sourceType: 'WIKIPEDIA',
        attribution: 'Kho tàng tri thức & Văn hóa dân gian Việt Nam',
      });
    }

    // Lọc CHẶT CHẼ các câu chưa từng có trong DB (CHỐNG TRÙNG LẶP 100%)
    const availablePool = curatedRandomPool.filter(
      (item) => !existingContents.has(item.content.trim().toLowerCase())
    );

    // Nếu đã nạp hết toàn bộ câu hỏi trong kho mẫu có sẵn, trả về rỗng để không bao giờ chèn trùng lặp!
    if (availablePool.length === 0) {
      return [];
    }

    // Xáo trộn pool trước khi lấy
    for (let i = availablePool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availablePool[i], availablePool[j]] = [availablePool[j], availablePool[i]];
    }

    const picked = availablePool.slice(0, Math.min(count, availablePool.length));
    const labels: OptionLabel[] = ['A', 'B', 'C', 'D'];
    const created: QuestionRecord[] = [];

    for (const item of picked) {
      // Xáo trộn vị trí đáp án đúng vào A, B, C hoặc D
      const allAnswers = [
        { text: item.correctAnswer, isCorrect: true },
        { text: item.wrongAnswers[0], isCorrect: false },
        { text: item.wrongAnswers[1], isCorrect: false },
        { text: item.wrongAnswers[2], isCorrect: false },
      ];
      for (let i = allAnswers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
      }

      const options: Record<OptionLabel, string> = { A: '', B: '', C: '', D: '' };
      let correctOption: OptionLabel = 'A';
      allAnswers.forEach((ansObj, idx) => {
        const label = labels[idx];
        options[label] = ansObj.text;
        if (ansObj.isCorrect) correctOption = label;
      });

      const q = this.createQuestion({
        categoryId: item.categoryId,
        content: item.content,
        difficulty: item.difficulty,
        options,
        correctOption,
        explanation: item.explanation,
        topicTags: item.topicTags,
        status: targetStatus,
        sourceType: item.sourceType,
        license: 'CC BY-SA 4.0',
        attribution: item.attribution,
      });
      created.push(q);
    }

    return created;
  }

  // =====================================================================
  // ROOMS, SESSIONS, PLAYERS, RESULTS & ANTI-CHEAT AUDIT (Mục 3 & Mục 9)
  // =====================================================================

  public getRoomWithConfig(roomIdOrCode: string) {
    const cached = this.roomConfigCache.get(roomIdOrCode);
    if (cached) {
      return cached;
    }

    const room = this.db
      .prepare(`SELECT * FROM rooms WHERE id = ? OR room_code = ? LIMIT 1`)
      .get(roomIdOrCode, roomIdOrCode) as any;
    if (!room) return null;

    const config = this.db
      .prepare(`SELECT * FROM room_configs WHERE room_id = ?`)
      .get(room.id) as any;

    const result = {
      id: room.id,
      roomCode: room.room_code,
      title: room.title,
      streamerId: room.streamer_id,
      tiktokUsername: room.tiktok_username,
      status: room.status as RoomStatus,
      config: {
        categoryId: config?.category_id || 'ALL',
        difficulty: config?.difficulty || 'ALL',
        questionCount: config?.question_count ?? 10,
        timePerQuestion: config?.time_per_question ?? 15,
        autoAdvance: Boolean(config?.auto_advance ?? 1),
        revealDuration: config?.reveal_duration ?? 6,
      },
    };

    this.roomConfigCache.set(room.id, result);
    this.roomConfigCache.set(room.room_code, result);
    return result;
  }

  public updateRoomConfig(
    roomIdOrCode: string,
    dto: Partial<{
      title: string;
      tiktokUsername: string;
      categoryId: string | null;
      difficulty: string;
      questionCount: number;
      timePerQuestion: number;
      autoAdvance: boolean;
      revealDuration: number;
    }>
  ) {
    const room = this.getRoomWithConfig(roomIdOrCode);
    if (!room) return null;

    this.runInTransaction(() => {
      if (dto.title !== undefined || dto.tiktokUsername !== undefined) {
        this.db
          .prepare(
            `UPDATE rooms SET title = ?, tiktok_username = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
          )
          .run(
            dto.title ?? room.title,
            dto.tiktokUsername ?? room.tiktokUsername,
            room.id
          );
      }

      this.db
        .prepare(
          `UPDATE room_configs
           SET category_id = ?, difficulty = ?, question_count = ?, time_per_question = ?, auto_advance = ?, reveal_duration = ?
           WHERE room_id = ?`
        )
        .run(
          dto.categoryId === 'ALL' ? null : (dto.categoryId ?? (room.config.categoryId === 'ALL' ? null : room.config.categoryId)),
          dto.difficulty ?? room.config.difficulty,
          dto.questionCount ?? room.config.questionCount,
          dto.timePerQuestion ?? room.config.timePerQuestion,
          dto.autoAdvance !== undefined ? (dto.autoAdvance ? 1 : 0) : (room.config.autoAdvance ? 1 : 0),
          dto.revealDuration ?? room.config.revealDuration,
          room.id
        );
    });

    this.roomConfigCache.clear();
    return this.getRoomWithConfig(room.id);
  }

  public updateRoomStatus(roomId: string, status: RoomStatus) {
    this.db
      .prepare(`UPDATE rooms SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
      .run(status, roomId);
    this.roomConfigCache.clear();
  }

  public createGameSession(roomId: string, snapshots: SessionQuestionSnapshot[]) {
    const sessionId = `ses-${uuidv4().slice(0, 8)}`;
    this.db
      .prepare(
        `INSERT INTO game_sessions (id, room_id, game_id, status, current_question_index, questions_snapshot, started_at)
         VALUES (?, ?, 'KNOWLEDGE_BATTLE', 'PLAYING', -1, ?, CURRENT_TIMESTAMP)`
      )
      .run(sessionId, roomId, JSON.stringify(snapshots));
    return sessionId;
  }

  public updateSessionProgress(sessionId: string, questionIndex: number, status: string) {
    const finishedClause = status === 'FINISHED' ? ', finished_at = CURRENT_TIMESTAMP' : '';
    this.db
      .prepare(
        `UPDATE game_sessions SET current_question_index = ?, status = ? ${finishedClause} WHERE id = ?`
      )
      .run(questionIndex, status, sessionId);
  }

  public upsertPlayer(
    sessionId: string,
    user: { id: string; username: string; nickname: string; avatarUrl?: string }
  ): { id: string; tiktokUserId: string; username: string; nickname: string } {
    const existing = this.db
      .prepare(`SELECT * FROM game_players WHERE session_id = ? AND tiktok_user_id = ?`)
      .get(sessionId, user.id) as any;

    if (existing) {
      // Cập nhật nickname hoặc avatar_url mới nhất nếu người chơi có ảnh đại diện mới
      if (
        existing.nickname !== user.nickname ||
        existing.username !== user.username ||
        (user.avatarUrl && user.avatarUrl !== existing.avatar_url)
      ) {
        this.db
          .prepare(`UPDATE game_players SET username = ?, nickname = ?, avatar_url = ? WHERE id = ?`)
          .run(user.username, user.nickname, user.avatarUrl || existing.avatar_url, existing.id);
      }
      return {
        id: existing.id,
        tiktokUserId: existing.tiktok_user_id,
        username: user.username,
        nickname: user.nickname,
      };
    }

    const playerId = `plr-${uuidv4().slice(0, 8)}`;
    this.db
      .prepare(
        `INSERT INTO game_players (id, session_id, tiktok_user_id, username, nickname, avatar_url)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(playerId, sessionId, user.id, user.username, user.nickname, user.avatarUrl || null);

    return {
      id: playerId,
      tiktokUserId: user.id,
      username: user.username,
      nickname: user.nickname,
    };
  }

  /**
   * Ghi nhận câu trả lời của người chơi cho câu hỏi hiện tại (Mục 3.2 & 3.3 & 9)
   * - Ghi nhận tất cả người chơi khác nhau trả lời trong cùng câu hỏi.
   * - Nếu cùng 1 người chơi gửi lặp ngay lập tức (< 1.5s) thì chặn spam.
   * - Nếu người chơi gửi lại đáp án mới sau >= 1.5s khi câu hỏi vẫn đang mở (ví dụ bình luận trước bị trễ từ câu cũ sang), cập nhật sang đáp án mới.
   */
  public recordFirstAnswer(params: {
    sessionId: string;
    questionId: string;
    playerId: string;
    tiktokUserId: string;
    selectedOption: OptionLabel;
    receivedAt: number;
    timeRemainingMs: number;
  }): { accepted: boolean; updatedExisting?: boolean; reason?: string } {
    const existing = this.db
      .prepare(
        `SELECT id, received_at FROM game_results WHERE session_id = ? AND question_id = ? AND player_id = ?`
      )
      .get(params.sessionId, params.questionId, params.playerId) as
      | { id: string; received_at: number }
      | undefined;

    if (existing) {
      const elapsedSincePrevious = params.receivedAt - Number(existing.received_at || 0);
      if (elapsedSincePrevious < 1500) {
        return { accepted: false, reason: 'ALREADY_ANSWERED' };
      }
      this.db
        .prepare(
          `UPDATE game_results
           SET selected_option = ?, time_remaining_ms = ?, received_at = ?
           WHERE id = ?`
        )
        .run(
          params.selectedOption,
          Math.max(0, Math.round(params.timeRemainingMs)),
          params.receivedAt,
          existing.id
        );
      return { accepted: true, updatedExisting: true };
    }

    try {
      this.db
        .prepare(
          `INSERT INTO game_results (
            id, session_id, question_id, player_id, tiktok_user_id,
            selected_option, is_correct, base_points, speed_bonus, total_points,
            time_remaining_ms, received_at
          ) VALUES (?, ?, ?, ?, ?, ?, 0, 0, 0, 0, ?, ?)`
        )
        .run(
          `res-${uuidv4().slice(0, 8)}`,
          params.sessionId,
          params.questionId,
          params.playerId,
          params.tiktokUserId,
          params.selectedOption,
          Math.max(0, Math.round(params.timeRemainingMs)),
          params.receivedAt
        );
      return { accepted: true, updatedExisting: false };
    } catch {
      return { accepted: false, reason: 'UNIQUE_CONSTRAINT' };
    }
  }

  /**
   * Ghi nhận và chấm điểm ngay cho người chơi có bình luận đến trễ vài giây do độ trễ sóng video TikTok LIVE
   * (khi màn hình đang ở ANSWER_REVEAL hoặc LEADERBOARD của chính câu hỏi đó và người chơi này chưa được tính câu trả lời)
   */
  public recordAndGradeLateStreamAnswer(params: {
    sessionId: string;
    questionId: string;
    playerId: string;
    tiktokUserId: string;
    selectedOption: OptionLabel;
    correctOption: OptionLabel;
    receivedAt: number;
  }): {
    accepted: boolean;
    summary?: ReturnType<DatabaseService['getQuestionGradeSummary']>;
  } {
    const existing = this.db
      .prepare(
        `SELECT id FROM game_results WHERE session_id = ? AND question_id = ? AND player_id = ?`
      )
      .get(params.sessionId, params.questionId, params.playerId);

    if (existing) {
      return { accepted: false };
    }

    return this.runInTransaction(() => {
      const isCorrect = params.selectedOption === params.correctOption;
      const basePoints = isCorrect ? 100 : 0;
      const speedBonus = isCorrect ? 10 : 0;
      const totalPoints = basePoints + speedBonus;

      this.db
        .prepare(
          `INSERT INTO game_results (
            id, session_id, question_id, player_id, tiktok_user_id,
            selected_option, is_correct, base_points, speed_bonus, total_points,
            time_remaining_ms, received_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1500, ?)`
        )
        .run(
          `res-${uuidv4().slice(0, 8)}`,
          params.sessionId,
          params.questionId,
          params.playerId,
          params.tiktokUserId,
          params.selectedOption,
          isCorrect ? 1 : 0,
          basePoints,
          speedBonus,
          totalPoints,
          params.receivedAt
        );

      const playerRow = this.db
        .prepare(`SELECT current_streak, best_streak FROM game_players WHERE id = ?`)
        .get(params.playerId) as { current_streak: number; best_streak: number } | undefined;

      const newStreak = isCorrect ? (playerRow?.current_streak || 0) + 1 : 0;
      const newBestStreak = Math.max(playerRow?.best_streak || 0, newStreak);

      this.db
        .prepare(
          `UPDATE game_players
           SET total_score = total_score + ?,
               correct_count = correct_count + ?,
               answered_count = answered_count + 1,
               current_streak = ?,
               best_streak = ?
           WHERE id = ?`
        )
        .run(totalPoints, isCorrect ? 1 : 0, newStreak, newBestStreak, params.playerId);

      return {
        accepted: true,
        summary: this.getQuestionGradeSummary(params.sessionId, params.questionId),
      };
    });
  }

  public getQuestionGradeSummary(sessionId: string, questionId: string) {
    const results = this.db
      .prepare(
        `SELECT r.*, p.nickname, p.username, p.avatar_url
         FROM game_results r
         JOIN game_players p ON p.id = r.player_id
         WHERE r.session_id = ? AND r.question_id = ?
         ORDER BY r.received_at ASC`
      )
      .all(sessionId, questionId) as any[];

    const optionCounts: Record<OptionLabel, number> = { A: 0, B: 0, C: 0, D: 0 };
    let correctPlayersCount = 0;
    const fastestPlayers: Array<{
      playerId: string;
      nickname: string;
      username: string;
      avatarUrl?: string;
      selectedOption: OptionLabel;
      isCorrect: boolean;
      points: number;
      speedBonus: number;
    }> = [];
    const allAnswers: Array<{
      playerId: string;
      nickname: string;
      username: string;
      avatarUrl?: string;
      selectedOption: OptionLabel;
      isCorrect: boolean;
      points: number;
    }> = [];

    for (const row of results) {
      const opt = row.selected_option as OptionLabel;
      if (optionCounts[opt] !== undefined) {
        optionCounts[opt]++;
      }
      const isCorrect = Boolean(row.is_correct);
      const totalPoints = Number(row.total_points || 0);
      const speedBonus = Number(row.speed_bonus || 0);

      allAnswers.push({
        playerId: row.player_id,
        nickname: row.nickname,
        username: row.username,
        avatarUrl: row.avatar_url || undefined,
        selectedOption: opt,
        isCorrect,
        points: totalPoints,
      });

      if (isCorrect) {
        correctPlayersCount++;
        fastestPlayers.push({
          playerId: row.player_id,
          nickname: row.nickname,
          username: row.username,
          avatarUrl: row.avatar_url || undefined,
          selectedOption: opt,
          isCorrect: true,
          points: totalPoints,
          speedBonus,
        });
      }
    }

    return {
      optionCounts,
      correctPlayersCount,
      totalAnswersCount: results.length,
      fastestPlayers,
      allAnswers,
    };
  }

  /**
   * Đóng câu hỏi và chấm điểm trong 1 Transaction duy nhất (Mục 3.2 & Mục 9)
   * Công thức thưởng tốc độ: Bonus = floor(50 * TimeRemaining / TimeLimit)
   * Tổng điểm câu hỏi = 100 + Bonus nếu đúng; nếu sai hoặc quá giờ thì 0
   */
  public gradeQuestionInTransaction(params: {
    sessionId: string;
    questionId: string;
    correctOption: OptionLabel;
    timeLimitSec: number;
  }) {
    return this.runInTransaction(() => {
      const results = this.db
        .prepare(
          `SELECT r.*, p.nickname, p.username, p.current_streak, p.best_streak
           FROM game_results r
           JOIN game_players p ON p.id = r.player_id
           WHERE r.session_id = ? AND r.question_id = ?
           ORDER BY r.received_at ASC`
        )
        .all(params.sessionId, params.questionId) as any[];

      const timeLimitMs = Math.max(1000, params.timeLimitSec * 1000);

      const updateResultStmt = this.db.prepare(
        `UPDATE game_results
         SET is_correct = ?, base_points = ?, speed_bonus = ?, total_points = ?
         WHERE id = ?`
      );
      const updatePlayerStmt = this.db.prepare(
        `UPDATE game_players
         SET total_score = total_score + ?,
             correct_count = correct_count + ?,
             answered_count = answered_count + 1,
             current_streak = ?,
             best_streak = ?
         WHERE id = ?`
      );

      for (const row of results) {
        const opt = row.selected_option as OptionLabel;
        const isCorrect = opt === params.correctOption;
        const basePoints = isCorrect ? 100 : 0;
        const ratio = Math.min(1, Math.max(0, row.time_remaining_ms / timeLimitMs));
        const speedBonus = isCorrect ? Math.max(5, Math.floor(50 * ratio)) : 0;
        const totalPoints = basePoints + speedBonus;

        updateResultStmt.run(isCorrect ? 1 : 0, basePoints, speedBonus, totalPoints, row.id);

        const newStreak = isCorrect ? (row.current_streak || 0) + 1 : 0;
        const newBestStreak = Math.max(row.best_streak || 0, newStreak);

        updatePlayerStmt.run(
          totalPoints,
          isCorrect ? 1 : 0,
          newStreak,
          newBestStreak,
          row.player_id
        );
      }

      return this.getQuestionGradeSummary(params.sessionId, params.questionId);
    });
  }

  public getSessionLeaderboard(sessionId: string, lastQuestionId?: string): LeaderboardEntry[] {
    const rows = this.db
      .prepare(
        `SELECT p.*, r.total_points as last_delta
         FROM game_players p
         LEFT JOIN game_results r
           ON r.session_id = p.session_id
          AND r.player_id = p.id
          AND r.question_id = ?
         WHERE p.session_id = ?
         ORDER BY p.total_score DESC, p.correct_count DESC, p.joined_at ASC`
      )
      .all(lastQuestionId || '', sessionId) as any[];

    return rows.map((row, idx) => ({
      rank: idx + 1,
      playerId: row.id,
      tiktokUserId: row.tiktok_user_id,
      username: row.username,
      nickname: row.nickname,
      avatarUrl: row.avatar_url || undefined,
      totalScore: row.total_score,
      correctCount: row.correct_count,
      answeredCount: row.answered_count,
      currentStreak: row.current_streak,
      bestStreak: row.best_streak,
      lastQuestionDelta: row.last_delta ?? 0,
    }));
  }

  public addGiftPoints(sessionId: string, playerId: string, points = 100) {
    if (!Number.isInteger(points) || points <= 0) {
      throw new Error(`Gift points must be a positive integer: ${points}`);
    }

    const result = this.db
      .prepare(`UPDATE game_players SET total_score = total_score + ? WHERE session_id = ? AND id = ?`)
      .run(points, sessionId, playerId) as { changes?: number };

    if (!result?.changes) {
      throw new Error(`Player ${playerId} not found in session ${sessionId}`);
    }

    return points;
  }

  // =====================================================================
  // LIVE EVENTS DEDUPLICATION & GIFT MAPPINGS (Mục 3.3, 3.4, 5.2, 9)
  // =====================================================================

  public recordLiveEventIfUnique(event: {
    id: string;
    roomId: string;
    type: string;
    userId: string;
    username: string;
    nickname: string;
    payload: any;
    receivedAt: number;
  }): boolean {
    try {
      const res = this.db
        .prepare(
          `INSERT OR IGNORE INTO live_events (id, room_id, event_type, tiktok_user_id, username, nickname, payload_json, received_at, processed)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`
        )
        .run(
          event.id,
          event.roomId,
          event.type,
          event.userId,
          event.username,
          event.nickname,
          JSON.stringify(event.payload || {}),
          event.receivedAt
        ) as { changes?: number };
      return Boolean(res && res.changes && res.changes > 0);
    } catch {
      return false;
    }
  }

  public getGiftMappings() {
    return this.db
      .prepare(`SELECT * FROM gift_mappings ORDER BY gift_name ASC`)
      .all()
      .map((row: any) => ({
        id: row.id,
        giftId: row.gift_id,
        giftName: row.gift_name,
        effectType: row.effect_type,
        displayMessage: row.display_message,
        durationMs: row.duration_ms,
        icon: row.icon,
        rewardType: row.reward_type || 'POINTS',
        rewardPoints: row.reward_points ?? 100,
        isActive: Boolean(row.is_active),
      }));
  }

  public upsertGiftMapping(dto: {
    id?: string;
    giftId: string;
    giftName: string;
    effectType: string;
    rewardType?: string;
    rewardPoints?: number;
    displayMessage: string;
    durationMs?: number;
    icon?: string;
    isActive?: boolean;
  }) {
    const rewardType = dto.rewardType || 'POINTS';
    if (
      ![
        'POINTS',
        'ELIMINATE_WRONG',
        'POINTS_AND_ELIMINATE',
        'ADD_TIME',
        'NONE',
      ].includes(rewardType)
    ) {
      throw new Error(`Unsupported gift reward type: ${rewardType}`);
    }
    const needsNumericValue =
      rewardType === 'POINTS' ||
      rewardType === 'POINTS_AND_ELIMINATE' ||
      rewardType === 'ADD_TIME';
    const defaultVal = rewardType === 'ADD_TIME' ? 10 : 100;
    const rewardPoints = needsNumericValue
      ? Number(dto.rewardPoints ?? defaultVal)
      : 0;
    if (
      needsNumericValue &&
      (!Number.isInteger(rewardPoints) || rewardPoints <= 0)
    ) {
      throw new Error(
        `Giá trị điểm/thời gian thưởng phải là số nguyên dương: ${rewardPoints}`
      );
    }

    const isActiveInt = dto.isActive === undefined ? 1 : dto.isActive ? 1 : 0;
    const durationMs = Number(dto.durationMs) || 4000;
    const icon = (dto.icon || '🎁').trim();
    const giftIdClean = String(dto.giftId || '').trim();
    const giftNameClean = String(dto.giftName || '').trim();
    const displayMessageClean = String(
      dto.displayMessage || 'đã gửi quà tặng cổ vũ toàn trường quay!'
    ).trim();

    if (dto.id) {
      const existingById = this.db
        .prepare(`SELECT id FROM gift_mappings WHERE id = ?`)
        .get(dto.id) as { id: string } | undefined;
      if (existingById) {
        // Kiểm tra nếu đổi sang gift_id đã tồn tại ở bản ghi khác thì xóa bản ghi trùng trước
        this.db
          .prepare(`DELETE FROM gift_mappings WHERE gift_id = ? AND id != ?`)
          .run(giftIdClean, dto.id);

        this.db
          .prepare(
            `UPDATE gift_mappings
             SET gift_id = ?,
                 gift_name = ?,
                 effect_type = ?,
                 reward_type = ?,
                 reward_points = ?,
                 display_message = ?,
                 duration_ms = ?,
                 icon = ?,
                 is_active = ?
             WHERE id = ?`
          )
          .run(
            giftIdClean,
            giftNameClean,
            dto.effectType || 'FIREWORKS',
            rewardType,
            rewardPoints,
            displayMessageClean,
            durationMs,
            icon,
            isActiveInt,
            dto.id
          );
        return this.getGiftMappings();
      }
    }

    const id = dto.id || `gift-${uuidv4().slice(0, 8)}`;
    this.db
      .prepare(
        `INSERT INTO gift_mappings (id, gift_id, gift_name, effect_type, reward_type, reward_points, display_message, duration_ms, icon, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(gift_id) DO UPDATE SET
           gift_name = excluded.gift_name,
           effect_type = excluded.effect_type,
           reward_type = excluded.reward_type,
           reward_points = excluded.reward_points,
           display_message = excluded.display_message,
           duration_ms = excluded.duration_ms,
           icon = excluded.icon,
           is_active = excluded.is_active`
      )
      .run(
        id,
        giftIdClean,
        giftNameClean,
        dto.effectType || 'FIREWORKS',
        rewardType,
        rewardPoints,
        displayMessageClean,
        durationMs,
        icon,
        isActiveInt
      );
    return this.getGiftMappings();
  }

  public toggleGiftMapping(id: string, isActive: boolean) {
    this.db
      .prepare(`UPDATE gift_mappings SET is_active = ? WHERE id = ?`)
      .run(isActive ? 1 : 0, id);
    return this.getGiftMappings();
  }

  public deleteGiftMapping(id: string) {
    this.db.prepare(`DELETE FROM gift_mappings WHERE id = ?`).run(id);
    return this.getGiftMappings();
  }

  public getQuizSets() {
    const sets = this.db
      .prepare(`SELECT * FROM quiz_sets ORDER BY created_at DESC`)
      .all() as any[];
    return sets.map((s) => {
      const countRow = this.db
        .prepare(`SELECT COUNT(*) as cnt FROM quiz_set_questions WHERE quiz_set_id = ?`)
        .get(s.id) as { cnt: number };
      return {
        id: s.id,
        title: s.title,
        description: s.description,
        language: s.language,
        questionCount: countRow?.cnt ?? 0,
        createdAt: s.created_at,
      };
    });
  }

  public getSystemStats() {
    const publishedQ = (
      this.db
        .prepare(`SELECT COUNT(*) as cnt FROM questions WHERE status = 'PUBLISHED'`)
        .get() as any
    )?.cnt;
    const pendingQ = (
      this.db
        .prepare(`SELECT COUNT(*) as cnt FROM questions WHERE status IN ('PENDING', 'DRAFT')`)
        .get() as any
    )?.cnt;
    const totalSessions = (
      this.db.prepare(`SELECT COUNT(*) as cnt FROM game_sessions`).get() as any
    )?.cnt;
    const totalPlayers = (
      this.db.prepare(`SELECT COUNT(*) as cnt FROM game_players`).get() as any
    )?.cnt;
    const totalEvents = (
      this.db.prepare(`SELECT COUNT(*) as cnt FROM live_events`).get() as any
    )?.cnt;

    return {
      publishedQuestions: publishedQ || 0,
      pendingQuestions: pendingQ || 0,
      totalSessions: totalSessions || 0,
      totalPlayers: totalPlayers || 0,
      totalEvents: totalEvents || 0,
    };
  }
}
