<template>
  <div class="hub-page">
    <header class="hub-hero">
      <div class="hero-badge">🎮 TIKTOK LIVE GAME HUB</div>
      <h1>Kho Game Tương Tác <span class="grad">Tri Thức</span></h1>
      <p>
        Chọn trò chơi cho phiên LIVE của bạn. Người xem chơi miễn phí bằng bình luận,
        tặng quà để kích hoạt hiệu ứng & kỹ năng đặc biệt.
      </p>
      <div class="hero-stats tabular-nums">
        <div class="stat">
          <strong>{{ stats.publishedQuestions ?? '—' }}</strong>
          <span>câu hỏi sẵn sàng</span>
        </div>
        <div class="stat">
          <strong>{{ readyGames.length }}</strong>
          <span>game đang chạy</span>
        </div>
        <div class="stat">
          <strong>{{ devGames.length }}</strong>
          <span>game đang phát triển</span>
        </div>
      </div>
    </header>

    <section class="hub-section">
      <h2 class="section-title">🔥 Sẵn sàng phát LIVE</h2>
      <div class="game-grid">
        <article v-for="g in readyGames" :key="g.id" class="game-card ready" :style="{ '--accent': g.accent }">
          <div class="card-cover" :style="{ background: g.cover }">
            <span class="cover-emoji">{{ g.emoji }}</span>
            <span class="status-pill live">{{ g.tag }}</span>
          </div>
          <div class="card-body">
            <h3>{{ g.name }}</h3>
            <p class="card-desc">{{ g.desc }}</p>
            <ul class="feature-list">
              <li v-for="f in g.features" :key="f">{{ f }}</li>
            </ul>
            <div class="card-actions">
              <router-link :to="g.dashboard" class="btn btn-cyan">🎛️ Bảng điều khiển</router-link>
              <a :href="g.overlay" target="_blank" class="btn btn-secondary">📺 Màn hình OBS</a>
              <router-link v-if="g.extra" :to="g.extra.to" class="btn btn-secondary">{{ g.extra.label }}</router-link>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="hub-section">
      <h2 class="section-title">🛠️ Đang phát triển</h2>
      <div class="game-grid small">
        <article v-for="g in devGames" :key="g.id" class="game-card dev">
          <div class="card-cover" :style="{ background: g.cover }">
            <span class="cover-emoji">{{ g.emoji }}</span>
            <span class="status-pill soon">Sắp ra mắt</span>
          </div>
          <div class="card-body">
            <h3>{{ g.name }}</h3>
            <p class="card-desc">{{ g.desc }}</p>
            <div class="progress-row">
              <div class="progress-bar"><div class="progress-fill" :style="{ width: g.progress + '%' }"></div></div>
              <span class="tabular-nums">{{ g.progress }}%</span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <footer class="hub-footer">
      Mã phòng mặc định: <strong>KB2026</strong> · Kết nối TikTok LIVE ở bảng điều khiển của từng game.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { api } from '../services/api';

const stats = ref<any>({});

const readyGames = [
  {
    id: 'quiz',
    name: 'Đấu Trường Tri Thức',
    emoji: '🧠',
    tag: 'Trắc nghiệm · Đang chạy',
    accent: '#00f0ff',
    cover: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 55%, #0891b2 100%)',
    desc: 'Gameshow trắc nghiệm A/B/C/D. Người xem comment đáp án, trả lời nhanh và đúng để leo bảng xếp hạng.',
    features: ['Comment A/B/C/D để trả lời', 'Bảng xếp hạng realtime có avatar', 'Quà tặng: cộng điểm, loại đáp án sai'],
    dashboard: '/dashboard',
    overlay: '/game/KB2026?layout=vertical',
    extra: { to: '/admin', label: '📚 Ngân hàng câu hỏi' },
  },
  {
    id: 'tug',
    name: 'Kéo Co Tri Thức',
    emoji: '🪢',
    tag: 'Đấu đội · MỚI',
    accent: '#f43f5e',
    cover: 'linear-gradient(135deg, #be123c 0%, #7c3aed 50%, #0284c7 100%)',
    desc: 'Đội Đỏ đấu Đội Xanh! Trả lời đúng để kéo dây về phía đội mình, tặng quà để tung kỹ năng lật kèo.',
    features: ['Free: comment 1/2 chọn đội, trả lời & spam "kéo"', 'Quà: Tiếp sức · Nhân đôi · Đóng băng · Siêu bão 50:50', 'MVP & top đóng góp từng đội'],
    dashboard: '/tug/dashboard',
    overlay: '/tug/KB2026',
  },
  {
    id: 'catchword',
    name: 'Đuổi Hình Bắt Chữ LIVE',
    emoji: '🖼️',
    tag: 'Đoán chữ · MỚI',
    accent: '#ec4899',
    cover: 'linear-gradient(135deg, #312e81 0%, #7c3aed 50%, #db2777 100%)',
    desc: 'Nhìn tổ hợp hình ảnh đoán thành ngữ, từ ghép, địa danh Việt Nam! Có ô chữ ẩn và tự tạo câu đố.',
    features: ['Free: đoán chữ không cần dấu & vote "mở" (5 vote = 1 chữ)', 'Quà: Mở ô chữ · Gợi ý vàng +10s · Điểm x2 · Mở 50% chữ', 'Tạo câu đố nhanh cho Streamer'],
    dashboard: '/catchword/dashboard',
    overlay: '/catchword/KB2026',
  },
  {
    id: 'crossword',
    name: 'Giải Mã Ô Chữ — Crossword Battle',
    emoji: '🧩',
    tag: 'Ô chữ & Từ khóa · MỚI',
    accent: '#facc15',
    cover: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #ca8a04 100%)',
    desc: 'Giải các câu hỏi hàng ngang để lật mở cột ký tự vàng và suy luận Từ khóa bí mật! Tất cả người xem cùng tranh tài.',
    features: [
      'Đúng hàng ngang đầu tiên +100đ, người đúng tiếp theo +20đ',
      'Đoán từ khóa mọi lúc bằng cú pháp KEYWORD <đáp án> (+500đ)',
      'Tích hợp AI sinh bộ ô chữ & Giọng đọc MC Ảo Tiếng Việt',
    ],
    dashboard: '/crossword/dashboard',
    overlay: '/crossword/KB2026',
  },
];

const devGames = [
  { id: 'millionaire', name: 'Ai Là Triệu Phú LIVE', emoji: '💰', progress: 45, cover: 'linear-gradient(135deg,#78350f,#ca8a04)', desc: '15 nấc tiền thưởng, quyền trợ giúp mở bằng quà tặng.' },
  { id: 'race', name: 'Đua Xe Tri Thức', emoji: '🏎️', progress: 30, cover: 'linear-gradient(135deg,#064e3b,#059669)', desc: 'Mỗi câu đúng giúp xe tăng tốc, quà tặng là nitro.' },
  { id: 'english', name: 'Vua Tiếng Anh', emoji: '🇬🇧', progress: 15, cover: 'linear-gradient(135deg,#7f1d1d,#2563eb)', desc: 'Từ vựng, nối từ và điền chỗ trống theo cấp độ.' },
];

onMounted(async () => {
  try {
    const res = await api.getHealth();
    stats.value = res.stats || {};
  } catch {
    stats.value = {};
  }
});
</script>

<style scoped>
.hub-page {
  min-height: 100vh;
  padding: 2.5rem 2rem 3rem;
  max-width: 1280px;
  margin: 0 auto;
  background:
    radial-gradient(circle at 15% 0%, rgba(147, 51, 234, 0.25), transparent 45%),
    radial-gradient(circle at 90% 10%, rgba(0, 240, 255, 0.15), transparent 40%);
}
.hub-hero {
  text-align: center;
  margin-bottom: 2.5rem;
}
.hero-badge {
  display: inline-block;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--border-cyan);
  color: var(--accent-cyan);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
}
.hub-hero h1 {
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  font-weight: 900;
  line-height: 1.15;
}
.grad {
  background: linear-gradient(90deg, #00f0ff, #c084fc, #f43f5e);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hub-hero p {
  max-width: 640px;
  margin: 0.85rem auto 0;
  color: var(--text-secondary);
}
.hero-stats {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}
.stat {
  background: var(--surface-panel);
  border: 1px solid var(--border-subtle);
  border-radius: 0.875rem;
  padding: 0.75rem 1.4rem;
  min-width: 150px;
}
.stat strong {
  display: block;
  font-size: 1.6rem;
  font-weight: 900;
  color: var(--accent-gold);
}
.stat span {
  font-size: 0.82rem;
  color: var(--text-muted);
}
.hub-section {
  margin-bottom: 2.5rem;
}
.section-title {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 1rem;
}
.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
  gap: 1.25rem;
}
.game-grid.small {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}
.game-card {
  background: var(--surface-panel);
  border: 1px solid var(--border-subtle);
  border-radius: 1.1rem;
  overflow: hidden;
  box-shadow: var(--shadow-card);
  transition: transform 0.2s ease, border-color 0.2s ease;
  display: flex;
  flex-direction: column;
}
.game-card.ready:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
}
.game-card.dev {
  opacity: 0.82;
}
.card-cover {
  position: relative;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dev .card-cover {
  height: 110px;
  filter: saturate(0.6);
}
.cover-emoji {
  font-size: 4.2rem;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4));
}
.dev .cover-emoji {
  font-size: 3rem;
}
.status-pill {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 800;
}
.status-pill.live {
  background: rgba(16, 185, 129, 0.9);
  color: #fff;
}
.status-pill.soon {
  background: rgba(0, 0, 0, 0.55);
  color: var(--accent-gold);
  border: 1px solid var(--border-gold);
}
.card-body {
  padding: 1.15rem 1.25rem 1.3rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  flex: 1;
}
.card-body h3 {
  font-size: 1.25rem;
  font-weight: 800;
}
.card-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
}
.feature-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.84rem;
  color: var(--text-muted);
}
.feature-list li::before {
  content: '✓ ';
  color: var(--accent-emerald);
  font-weight: 800;
}
.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 0.5rem;
}
.card-actions .btn {
  text-decoration: none;
  font-size: 0.86rem;
}
.progress-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.8rem;
  color: var(--text-muted);
}
.progress-bar {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-gold), var(--accent-amber));
}
.hub-footer {
  text-align: center;
  font-size: 0.84rem;
  color: var(--text-muted);
}
@media (max-width: 560px) {
  .hub-page {
    padding: 1.5rem 0.9rem;
  }
  .game-grid {
    grid-template-columns: 1fr;
  }
}
</style>
