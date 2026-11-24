# 🎮 TikTok LIVE Interactive Game Hub — Đấu Trường Tri Thức & Mini-Games

Hệ thống trò chơi tương tác trực tiếp trên buổi phát sóng **TikTok LIVE** đỉnh cao, tích hợp kết nối thời gian thực với phòng LIVE TikTok, chấm điểm tự động qua bình luận (Comment), hiệu ứng quà tặng (Gift), thả tim (Likes) và bộ công cụ hiển thị chuyên nghiệp dành cho **OBS Studio** & **TikTok LIVE Studio**.

---

## 🌟 Các chế độ Game nổi bật

1. 🧠 **Đấu Trường Tri Thức (Knowledge Battle)**:
   - Trắc nghiệm A/B/C/D kiến thức đời sống, văn hóa, lịch sử, khoa học với hơn 1.300+ câu hỏi tiếng Việt có sẵn.
   - Chấm điểm tốc độ chính xác từng mili-giây, chống spam/đổi đáp án.
   - **MC Ảo AI đọc câu hỏi tự động** bằng giọng đọc tự nhiên.
   - **Tích lũy Tim LIVE**: Đạt 500 tim loại trừ 1 đáp án sai, bỏ qua thời gian chờ, bật x2 điểm số — **số lượng tim được giữ nguyên và cộng dồn liên tục suốt phiên LIVE**.

2. 🖼️ **Đuổi Hình Bắt Chữ LIVE (Catchword)**:
   - Nhìn tổ hợp Emoji / hình ảnh thị giác đoán từ ghép, thành ngữ, địa danh, món ăn quen thuộc.
   - Chuẩn hóa tiếng Việt thông minh (gõ có dấu hay không dấu đều ăn điểm).
   - Cộng đồng comment `mở` để vote mở ô chữ cái miễn phí; tặng quà để kích hoạt x2 điểm, mở gợi ý nghĩa.
   - **Tự động chơi liên tục (Auto-play loop)**: Tự động qua câu khi có người giải đúng, tự động bắt đầu ván mới với bộ câu hỏi ngẫu nhiên xáo trộn bằng Fisher-Yates shuffle.
   - Giao diện tối ưu chuẩn dọc 9:16 cho điện thoại & TikTok LIVE Studio.

3. 🪢 **Kéo Co Tri Thức (Tug of War)**:
   - Chia 2 phe đối kháng kịch tính, người xem comment hoặc tặng quà để kéo dây về đội mình.

4. 🔤 **Giải Mã Ô Chữ (Crossword Battle)**:
   - Lần lượt mở các hàng ngang để tìm ra manh mối hé lộ từ khóa vàng bí mật.

---

## 🛠️ Yêu cầu môi trường (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính/máy chủ của bạn đã cài đặt:
- **Node.js**: Phiên bản **`20.x`** hoặc **`22.x`** trở lên (Khuyến nghị **Node 22** vì tích hợp sẵn `node:sqlite`, không cần cài đặt database ngoài).
- **Git**: Dùng để clone mã nguồn.
- **Phần mềm Livestream**: **OBS Studio** hoặc **TikTok LIVE Studio**.

---

## 🚀 Hướng dẫn cài đặt từ A đến Z (Khi Clone Repo về)

### Bước 1: Clone dự án về máy
Mở Terminal / PowerShell và gõ:
```bash
git clone https://github.com/vinhnq/tiktok_game.git
cd tiktok_game
```

---

### Bước 2: Cài đặt dependencies cho cả Backend và Frontend

```bash
# 1. Cài đặt thư viện cho Backend
cd backend
npm install

# 2. Cài đặt thư viện cho Frontend
cd ../frontend
npm install

# 3. Quay lại thư mục gốc
cd ..
```

---

### Bước 3: Khởi chạy dự án

#### 👉 Cách 1: Khởi động nhanh bằng 1 click (Khuyên dùng trên Windows)
Nhấp đúp chuột vào file **`start-all.bat`** ở thư mục gốc của dự án. File script sẽ tự động mở 2 cửa sổ chạy song song cả Backend và Frontend.

#### 👉 Cách 2: Chạy thủ công qua 2 Terminal riêng biệt

**Cửa sổ 1 — Khởi động Backend (Port 4000/4100):**
```bash
cd backend
npm run start
# Hoặc chế độ lập trình tự reload: npm run start:dev
```

**Cửa sổ 2 — Khởi động Frontend (Port 3000/3001):**
```bash
cd frontend
npm run dev
```

Sau khi chạy, giao diện web sẽ sẵn sàng tại:
- **Trang chủ Game Hub**: `http://localhost:3000/` (hoặc `http://localhost:3001/`)
- **Bàn điều khiển Streamer**: `http://localhost:3000/dashboard`
- **Bàn điều khiển Đuổi Hình Bắt Chữ**: `http://localhost:3000/catchword/dashboard`
- **Trang Quản trị & Ngân hàng câu hỏi**: `http://localhost:3000/admin`

---

## 📡 Hướng dẫn kết nối TikTok LIVE & Đưa lên OBS Studio

### 1. Kết nối với kênh TikTok đang phát LIVE
1. Mở trình duyệt vào trang **Bàn điều khiển Streamer** (`/dashboard` hoặc `/catchword/dashboard`).
2. Tại ô **1. Kết nối TikTok LIVE**:
   - Nhập `@username` kênh TikTok đang LIVE (Ví dụ: `@vinhnq_live` hoặc `vinhnq_live`).
   - Bấm **Kết nối LIVE**.
   - Trạng thái chuyển sang màu xanh **Đang nhận LIVE** là hoàn tất! Mọi comment, thả tim, quà tặng từ người xem sẽ được nhận diện và tính điểm tức thì.
   *(Nếu chưa live thật, bạn có thể dùng các nút **Giả lập comment, quà tặng, thả tim** ngay trong bảng điều khiển để test thử game!)*

---

### 2. Thiết lập hiển thị trên OBS Studio / TikTok LIVE Studio

1. Mở **OBS Studio** hoặc **TikTok LIVE Studio**.
2. Trong khung **Sources (Nguồn)**, bấm dấu **`+`** ➔ Chọn **Browser (Trình duyệt)**.
3. Đặt tên (ví dụ: `Game_TikTok_Live`).
4. Điền các thông số:
   - **URL**:
     - *Đấu Trường Tri Thức (Khung dọc 9:16 TikTok)*:  
       `http://localhost:3000/game/KB2026?layout=vertical`
     - *Đấu Trường Tri Thức (Khung ngang 16:9)*:  
       `http://localhost:3000/game/KB2026`
     - *Đuổi Hình Bắt Chữ (Khung dọc 9:16 TikTok)*:  
       `http://localhost:3000/catchword/KB2026?layout=vertical`
     - *Đuổi Hình Bắt Chữ (Khung ngang 16:9)*:  
       `http://localhost:3000/catchword/KB2026`
   - **Width (Chiều rộng)**: `1080` (cho dọc) hoặc `1920` (cho ngang).
   - **Height (Chiều cao)**: `1920` (cho dọc) hoặc `1080` (cho ngang).
   - Tích chọn: **Shutdown source when not visible** (Đóng nguồn khi không hiển thị) và **Refresh browser when scene becomes active** (Làm mới khi cảnh hoạt động).
5. Bấm **OK**. Màn hình game sẽ hiện lên sắc nét, trong suốt và tự động tương tác trực tiếp với phiên LIVE!

> 💡 **Mẹo cân chỉnh vị trí**: Ngay trên màn hình OBS, bạn có thể bấm vào nút công cụ **Căn chỉnh sân khấu (LiveStageCalibrator)** ở góc màn hình để kéo giãn tỉ lệ, scale to nhỏ, điều chỉnh độ cao sao cho không bị che lấp bởi avatar streamer hay khung chat TikTok!

---

## 🌐 Hướng dẫn Triển khai (Deploy Production) lên VPS / Cloud Server

Nếu bạn muốn đưa hệ thống lên máy chủ VPS (Ubuntu/Debian) để chạy ổn định 24/7:

### 1. Build mã nguồn
```bash
# Build Backend
cd backend
npm run build

# Build Frontend
cd ../frontend
npm run build
```

### 2. Chạy Backend bằng PM2 (Daemon Process Manager)
```bash
npm install -g pm2
cd backend
pm2 start dist/main.js --name "tiktok-game-backend"
pm2 save
pm2 startup
```

### 3. Cấu hình Nginx Reverse Proxy & SSL (HTTPS + WSS)
Cấu hình mẫu trong `/etc/nginx/sites-available/tiktok-game`:
```nginx
server {
    server_name your-domain.com;

    # Frontend tĩnh
    location / {
        root /var/www/tiktok_game/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API & WebSocket Socket.IO
    location /socket.io/ {
        proxy_pass http://127.0.0.1:4000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
Sau đó kích hoạt chứng chỉ SSL miễn phí bằng Certbot:
```bash
sudo certbot --nginx -d your-domain.com
```

---

## 🧪 Kiểm thử nghiệp vụ tự động (Automated Verification)

Dự án tích hợp sẵn bộ test nghiệp vụ nghiêm ngặt kiểm tra 13 tiêu chí chấm điểm, bảo mật đáp án, chống spam và AI engine:
```bash
cd backend
npm run verify
```
Kết quả mong đợi: `=== TẤT CẢ 13/13 BÀI KIỂM THỬ NGHIỆP VỤ & AI ĐỀU ĐẠT (100% PASS) ===`.

---

## ☕ Ủng hộ tác giả (Buy Me a Coffee / Donate)

Nếu bạn thấy dự án này thú vị, giúp ích cho công việc livestream hoặc tiết kiệm thời gian phát triển của bạn, đừng ngần ngại mời mình một ly cà phê nhé! Sự ủng hộ của bạn là động lực rất lớn để mình tiếp tục phát triển thêm nhiều tính năng mới thú vị hơn! 💖

<div align="center">

### 💳 Thông tin chuyển khoản ủng hộ:
| Phương thức | Chi tiết chuyển khoản |
|---|---|
| **Ngân hàng** | **VietComBank** |
| **Số tài khoản (STK)** | `1025298094`|
| **Chủ tài khoản** | **NGÔ QUỐC VINH** |
| **Lời nhắn chuyển khoản** | `Donate TikTok Game - [Tên bạn]` |

<br/>


</div>

---

## 📄 Bản quyền & Đóng góp (License & Contributing)

- Dự án được phát triển bởi **VinhNQ**.
- Mọi đóng góp, báo lỗi hoặc yêu cầu tính năng mới xin vui lòng mở [Issue](https://github.com/vinhnq/tiktok_game/issues) hoặc gửi Pull Request!

Chúc các bạn có những buổi Livestream bùng nổ tương tác! 🚀🎉
