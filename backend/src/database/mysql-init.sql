-- =====================================================================
-- KNOWLEDGE BATTLE - DATABASE SCHEMA (Mục 9 Tài liệu Đặc tả Nghiệp vụ)
-- =====================================================================

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(150) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'STREAMER', -- 'ADMIN' | 'EDITOR' | 'STREAMER'
  tiktok_username VARCHAR(100),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS question_categories (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  icon VARCHAR(64) DEFAULT 'book-open',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
  id VARCHAR(64) PRIMARY KEY,
  category_id VARCHAR(64) NOT NULL,
  content TEXT NOT NULL,
  difficulty VARCHAR(32) NOT NULL DEFAULT 'MEDIUM', -- 'EASY' | 'MEDIUM' | 'HARD'
  question_type VARCHAR(32) NOT NULL DEFAULT 'MULTIPLE_CHOICE',
  language VARCHAR(16) NOT NULL DEFAULT 'vi',
  explanation TEXT,
  topic_tags TEXT, -- JSON array of tags
  status VARCHAR(32) NOT NULL DEFAULT 'DRAFT', -- 'DRAFT' | 'PENDING' | 'APPROVED' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED'
  created_by VARCHAR(64),
  approved_by VARCHAR(64),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES question_categories(id)
);

CREATE TABLE IF NOT EXISTS question_options (
  id VARCHAR(64) PRIMARY KEY,
  question_id VARCHAR(64) NOT NULL,
  label VARCHAR(8) NOT NULL, -- 'A' | 'B' | 'C' | 'D'
  content TEXT NOT NULL,
  is_correct INTEGER NOT NULL DEFAULT 0, -- Chỉ lưu và truy cập phía server khi chấm điểm
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS question_sources (
  id VARCHAR(64) PRIMARY KEY,
  question_id VARCHAR(64) NOT NULL,
  source_type VARCHAR(64) NOT NULL, -- 'OPEN_TRIVIA_DB' | 'WIKIDATA' | 'WIKIPEDIA' | 'AI' | 'MANUAL'
  source_url TEXT,
  license VARCHAR(120), -- e.g. 'CC BY-SA 4.0', 'CC0'
  attribution TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS question_reviews (
  id VARCHAR(64) PRIMARY KEY,
  question_id VARCHAR(64) NOT NULL,
  reviewer_id VARCHAR(64),
  previous_status VARCHAR(32) NOT NULL,
  new_status VARCHAR(32) NOT NULL,
  notes TEXT,
  reviewed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_sets (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  language VARCHAR(16) NOT NULL DEFAULT 'vi',
  created_by VARCHAR(64),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_set_questions (
  id VARCHAR(64) PRIMARY KEY,
  quiz_set_id VARCHAR(64) NOT NULL,
  question_id VARCHAR(64) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(quiz_set_id, question_id),
  FOREIGN KEY (quiz_set_id) REFERENCES quiz_sets(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS games (
  id VARCHAR(64) PRIMARY KEY,
  code VARCHAR(64) NOT NULL UNIQUE, -- 'KNOWLEDGE_BATTLE'
  name VARCHAR(150) NOT NULL,
  description TEXT,
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS rooms (
  id VARCHAR(64) PRIMARY KEY,
  room_code VARCHAR(32) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  streamer_id VARCHAR(64),
  tiktok_username VARCHAR(100),
  status VARCHAR(32) NOT NULL DEFAULT 'WAITING', -- 'WAITING' | 'STARTING' | 'PLAYING' | 'PAUSED' | 'FINISHED' | 'CANCELLED'
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS room_configs (
  room_id VARCHAR(64) PRIMARY KEY,
  category_id VARCHAR(64), -- NULL = Tất cả danh mục
  difficulty VARCHAR(32) DEFAULT 'ALL', -- 'ALL' | 'EASY' | 'MEDIUM' | 'HARD'
  question_count INTEGER NOT NULL DEFAULT 10,
  time_per_question INTEGER NOT NULL DEFAULT 15, -- seconds
  auto_advance INTEGER NOT NULL DEFAULT 1,
  reveal_duration INTEGER NOT NULL DEFAULT 6, -- seconds showing answer & leaderboard before next question
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS game_sessions (
  id VARCHAR(64) PRIMARY KEY,
  room_id VARCHAR(64) NOT NULL,
  game_id VARCHAR(64) NOT NULL DEFAULT 'KNOWLEDGE_BATTLE',
  status VARCHAR(32) NOT NULL DEFAULT 'WAITING',
  current_question_index INTEGER NOT NULL DEFAULT -1,
  questions_snapshot TEXT NOT NULL, -- JSON snapshot cố định danh sách câu hỏi và đáp án tại thời điểm bắt đầu trận
  started_at DATETIME,
  finished_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS game_players (
  id VARCHAR(64) PRIMARY KEY,
  session_id VARCHAR(64) NOT NULL,
  tiktok_user_id VARCHAR(128) NOT NULL, -- Định danh ổn định từ connector
  username VARCHAR(128) NOT NULL,
  nickname VARCHAR(150) NOT NULL,
  avatar_url TEXT,
  total_score INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  answered_count INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(session_id, tiktok_user_id),
  FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE
);

-- Ràng buộc quan trọng Mục 9: Unique (session_id, question_id, player_id) cho câu trả lời đầu tiên của người chơi
CREATE TABLE IF NOT EXISTS game_results (
  id VARCHAR(64) PRIMARY KEY,
  session_id VARCHAR(64) NOT NULL,
  question_id VARCHAR(64) NOT NULL,
  player_id VARCHAR(64) NOT NULL, -- FK tới game_players.id
  tiktok_user_id VARCHAR(128) NOT NULL,
  selected_option VARCHAR(8) NOT NULL, -- 'A' | 'B' | 'C' | 'D'
  is_correct INTEGER NOT NULL DEFAULT 0,
  base_points INTEGER NOT NULL DEFAULT 0,
  speed_bonus INTEGER NOT NULL DEFAULT 0,
  total_points INTEGER NOT NULL DEFAULT 0,
  time_remaining_ms INTEGER NOT NULL DEFAULT 0,
  received_at BIGINT NOT NULL,
  UNIQUE(session_id, question_id, player_id),
  FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES game_players(id) ON DELETE CASCADE
);

-- Sự kiện TikTok đã nhận, phục vụ audit và chống trùng event ID (Mục 3.3 & Mục 9)
CREATE TABLE IF NOT EXISTS live_events (
  id VARCHAR(128) PRIMARY KEY, -- Event ID chống trùng
  room_id VARCHAR(64) NOT NULL,
  event_type VARCHAR(32) NOT NULL, -- 'COMMENT' | 'GIFT' | 'JOIN' | 'LIKE' | 'SHARE'
  tiktok_user_id VARCHAR(128) NOT NULL,
  username VARCHAR(128) NOT NULL,
  nickname VARCHAR(150) NOT NULL,
  payload_json TEXT NOT NULL,
  received_at BIGINT NOT NULL,
  processed INTEGER NOT NULL DEFAULT 1
);

-- Ánh xạ quà tặng với hiệu ứng giải trí/hỗ trợ chung, không mua điểm (Mục 3.4 & Mục 9)
CREATE TABLE IF NOT EXISTS gift_mappings (
  id VARCHAR(64) PRIMARY KEY,
  gift_id VARCHAR(64) NOT NULL UNIQUE,
  gift_name VARCHAR(150) NOT NULL,
  effect_type VARCHAR(64) NOT NULL, -- 'FIREWORKS' | 'STAGE_LIGHTS' | 'CHEER_BANNER' | 'SHARED_HINT' | 'CONFETTI_SHOWER'
  display_message VARCHAR(255) NOT NULL,
  duration_ms INTEGER NOT NULL DEFAULT 4000,
  icon VARCHAR(64) NOT NULL DEFAULT 'sparkles',
  is_active INTEGER NOT NULL DEFAULT 1
);

