# Knowledge Battle — Đấu Trường Tri Thức trên TikTok LIVE (MVP)

Hệ thống trò chơi đố vui tương tác trực tiếp trên buổi phát sóng **TikTok LIVE**, được xây dựng đầy đủ theo tài liệu đặc tả **`Knowledge_Battle_Nghiep_vu_va_Huong_dan_ket_noi.pdf`**.

---

## 1. Kiến trúc hệ thống

```text
TikTok LIVE (Bình luận A/B/C/D • Quà tặng)
   ↓
TikTok Connector (tiktok-live-connector / Simulator)
   ↓
Event Processor (Chuẩn hóa GameEvent • Chống trùng Event ID • Rate Limit)
   ↓
Knowledge Battle Engine (Luật chơi • Khóa câu hỏi • Chấm điểm • Bảng xếp hạng)
   ↓
Socket.IO Server (Phát realtime)
   ↙                              ↘
Game Client (Phaser 3 + GSAP)     Streamer Dashboard & Admin (Vue 3)
```

### Cấu trúc thư mục
- [`backend/`](file:///c:/vinhnq/tiktok_game/backend): **NestJS + TypeScript + Socket.IO + `tiktok-live-connector` + SQLite (`node:sqlite`)**
  - [`src/database/mysql-init.sql`](file:///c:/vinhnq/tiktok_game/backend/src/database/mysql-init.sql): Đầy đủ 15 bảng dữ liệu theo Mục 9 (`users`, `rooms`, `room_configs`, `games`, `game_sessions`, `game_players`, `game_results`, `live_events`, `gift_mappings`, `question_categories`, `questions`, `question_options`, `question_sources`, `question_reviews`, `quiz_sets`, `quiz_set_questions`).
  - [`src/integrations/tiktok/tiktok.service.ts`](file:///c:/vinhnq/tiktok_game/backend/src/integrations/tiktok/tiktok.service.ts): Module kết nối TikTok LIVE độc lập theo từng phòng, tự động reconnect có giới hạn, kèm Bộ giả lập sự kiện.
  - [`src/event-processor/event-processor.service.ts`](file:///c:/vinhnq/tiktok_game/backend/src/event-processor/event-processor.service.ts): Chuẩn hóa `GameEvent`, lọc đáp án `A/B/C/D`, chống trùng `event.id` và giới hạn tần suất bình luận.
  - [`src/game-engine/game-engine.service.ts`](file:///c:/vinhnq/tiktok_game/backend/src/game-engine/game-engine.service.ts): Xử lý vòng đời phòng (`WAITING` → `STARTING` → `PLAYING` → `PAUSED` / `FINISHED`), cố định snapshot câu hỏi, khóa câu hỏi khi hết giờ, tính điểm `100 + floor(50 * TimeRemaining / TimeLimit)` trong Transaction.
  - [`src/realtime/realtime.gateway.ts`](file:///c:/vinhnq/tiktok_game/backend/src/realtime/realtime.gateway.ts): Phát sự kiện `room.state`, `question.started` (không lộ đáp án đúng), `question.timer`, `question.result`, `leaderboard.updated`, `gift.animation`, `game.finished` và tự động phục hồi trạng thái khi OBS tải lại Browser Source.
- [`frontend/`](file:///c:/vinhnq/tiktok_game/frontend): **Vue 3 + Vite + Phaser 3 + GSAP + Socket.IO Client**
  - **Streamer Dashboard (`/dashboard`)**: Kết nối TikTok LIVE bằng `@username`, cấu hình phòng, điều khiển trận đấu, lấy link OBS Browser Source, giả lập bình luận/đám đông/quà tặng và xem trước màn hình Game Show trực tiếp.
  - **Admin & Ngân hàng câu hỏi (`/admin`)**: Quản lý danh mục, CRUD câu hỏi, quy trình biên tập viên duyệt (`DRAFT` → `PENDING` → `APPROVED` → `PUBLISHED` → `REJECTED` / `ARCHIVED`), nhập hàng loạt JSON/OpenTriviaDB, cấu hình ánh xạ quà tặng (`gift_mappings`).
  - **Màn hình Game Show OBS (`/game/:roomCode`)**: Sân khấu **Phaser 3** (ánh sáng sân khấu, hạt năng lượng, pháo hoa, mưa pháo giấy) kết hợp **HTML/CSS + GSAP** độ tương phản cao, hỗ trợ cả khung ngang `1920×1080` và khung dọc TikTok `1080×1920`.

---

## 2. Hướng dẫn chạy nhanh trên Windows

### Cách 1: Chạy tự động bằng file `.bat`
Nhấp đúp vào [`start-all.bat`](file:///c:/vinhnq/tiktok_game/start-all.bat) hoặc chạy trong terminal:
```powershell
.\start-all.bat
```

### Cách 2: Chạy từng cửa sổ Terminal
1. **Khởi động Backend (Cổng 4000)**:
   ```powershell
   cd backend
   npm run start
   ```
2. **Khởi động Frontend (Cổng 3000)**:
   ```powershell
   cd frontend
   npm run dev
   ```
3. **Chạy bộ kiểm thử tự động theo Checklist Mục 10.1**:
   ```powershell
   cd backend
   npm test
   ```

---

## 3. Các đường dẫn sử dụng

| Giao diện | URL | Mô tả |
|---|---|---|
| **Streamer Dashboard** | `http://localhost:3000/dashboard` | Kết nối TikTok LIVE, điều khiển trận đấu, giả lập sự kiện |
| **Quản trị Ngân hàng câu hỏi** | `http://localhost:3000/admin` | Duyệt câu hỏi, nhập dữ liệu, cấu hình hiệu ứng quà tặng |
| **OBS Game Show (Ngang 1920×1080)** | `http://localhost:3000/game/KB2026` | Dán vào OBS Browser Source (Width `1920`, Height `1080`) |
| **OBS Game Show (Dọc 1080×1920)** | `http://localhost:3000/game/KB2026?layout=vertical` | Dán vào OBS Browser Source cho khung livestream dọc TikTok |

