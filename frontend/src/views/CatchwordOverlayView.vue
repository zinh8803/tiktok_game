<template>
  <div class="cw-root" :class="{ embedded }">
    <LiveStageCalibrator
      v-if="!embedded"
      mode="floating"
      :calib="calib"
      @apply-preset="applyPreset"
      @change="broadcastCalib"
      @reset="resetCalib"
    />
    <div class="cw-stage" :style="embedded ? undefined : stageStyle">
      <!-- HEADER -->
      <header class="cw-header">
        <div class="title">🖼️ ĐUỔI HÌNH <span>BẮT CHỮ</span></div>
        <div class="sub-row tabular-nums">
          <span class="pill status-pill">
            <template v-if="state.status === 'QUESTION' || state.status === 'REVEAL'">
              Câu {{ Math.max(1, (state.puzzleIndex ?? 0) + 1) }}/{{ state.totalPuzzles }}
            </template>
            <template v-else-if="state.status === 'LOBBY'">Sảnh chờ · Comment để sẵn sàng</template>
            <template v-else-if="state.status === 'FINISHED'">Kết thúc trận</template>
            <template v-else>Chưa mở game</template>
          </span>
          <span v-if="state.puzzle?.category" class="pill cat-pill">{{ state.puzzle.category }}</span>
          <span v-if="state.puzzle?.difficulty" class="pill diff-pill">{{ diffLabel(state.puzzle.difficulty) }}</span>
          <span v-if="state.doubleActive" class="pill x2-pill">⚡ ĐIỂM x2</span>
        </div>
      </header>

      <!-- LOBBY -->
      <section v-if="state.status === 'LOBBY'" class="cw-card lobby">
        <div class="lobby-emoji">🔍🖼️✨</div>
        <h2>Comment đáp án MIỄN PHÍ!</h2>
        <p>
          Người chơi đang chờ: <strong class="tabular-nums">{{ state.playerCount || 0 }}</strong>
        </p>
        <div class="rules-grid">
          <div class="rule-item">💬 Comment từ khóa tiếng Việt (có dấu hoặc không dấu đều tính)</div>
          <div class="rule-item">🔓 Comment <code>mở</code> hoặc <code>gợi ý</code> — đủ 5 vote mở ngay 1 chữ cái!</div>
          <div class="rule-item">⚡ Đoán đúng ĐẦU TIÊN nhận ngay <strong>+150 điểm</strong></div>
        </div>
      </section>

      <!-- IDLE -->
      <section v-else-if="state.status === 'IDLE'" class="cw-card lobby">
        <div class="lobby-emoji">🖼️</div>
        <h2>Game Đuổi Hình Bắt Chữ chưa mở</h2>
        <p>Streamer hãy bấm <strong>"Mở sảnh chờ"</strong> hoặc <strong>"Bắt đầu trận"</strong> trong bảng điều khiển.</p>
      </section>

      <!-- WAITING COUNTDOWN BEFORE ROUND 1 -->
      <section v-else-if="state.status === 'REVEAL' && !state.puzzle" class="cw-card lobby">
        <div class="lobby-emoji">🔔</div>
        <h2>Chuẩn bị! Đuổi Hình Bắt Chữ sắp bắt đầu...</h2>
      </section>

      <!-- ACTIVE QUESTION / REVEAL -->
      <section v-else-if="state.puzzle" class="cw-card puzzle-card" :class="{ shake: shaking }">
        <!-- Timer Row -->
        <div class="timer-row tabular-nums">
          <span class="solved-count">🎯 {{ state.solvedCount || 0 }} người đã giải đúng</span>
          <span v-if="state.status === 'QUESTION'" class="timer" :class="{ urgent: secondsLeft <= 7 }">
            ⏱ {{ secondsLeft }}s
          </span>
          <span v-else class="timer reveal">✅ ĐÃ CÔNG BỐ</span>
        </div>
        <div v-if="state.status === 'QUESTION'" class="timebar">
          <div class="timebar-fill" :style="{ width: timePct + '%' }"></div>
        </div>

        <!-- Clues Grid (Pictures / Visuals) -->
        <div class="clues-arena">
          <template v-for="(clue, idx) in state.puzzle.clues" :key="idx">
            <div v-if="Number(idx) > 0" class="clue-plus">+</div>
            <div class="clue-box">
              <div class="clue-emoji">{{ clue.emoji }}</div>
              <div v-if="clue.label" class="clue-label">{{ clue.label }}</div>
            </div>
          </template>
        </div>

        <!-- Hint Banner -->
        <div v-if="state.puzzle.hintUnlocked && state.puzzle.hint" class="hint-banner">
          💡 <strong>Gợi ý:</strong> {{ state.puzzle.hint }}
        </div>

        <!-- Free Vote Progress Bar ("mở" / "gợi ý") -->
        <div v-if="state.status === 'QUESTION'" class="free-vote-row tabular-nums">
          <div class="fv-text">
            <span>🆓 Comment <code>mở</code> để lật ô chữ:</span>
            <strong>{{ state.freeHintProgress || 0 }} / 5 vote ({{ state.freeHintVotes || 0 }} tổng)</strong>
          </div>
          <div class="fv-bar">
            <div class="fv-fill" :style="{ width: ((state.freeHintProgress || 0) / 5) * 100 + '%' }"></div>
          </div>
        </div>

        <!-- Crossword Letter Boxes -->
        <div class="word-board">
          <div v-for="(word, wIdx) in state.puzzle.wordGroups" :key="wIdx" class="word-group">
            <div
              v-for="tile in word"
              :key="tile.index"
              class="letter-tile"
              :class="{
                revealed: tile.isRevealed && state.status === 'QUESTION',
                solved: state.status === 'REVEAL' || state.status === 'FINISHED',
              }"
            >
              {{ tile.isRevealed ? tile.char : '?' }}
            </div>
          </div>
        </div>

        <!-- Explanation on Reveal -->
        <div v-if="state.status === 'REVEAL' && state.puzzle.explanation" class="explanation-box">
          <strong>🎉 {{ state.puzzle.answer }}:</strong> {{ state.puzzle.explanation }}
        </div>

        <!-- Recent Solvers of Current Round (Never shows answer) -->
        <div v-if="state.solvers?.length" class="solvers-strip">
          <div v-for="s in state.solvers" :key="s.userId" class="solver-chip" :class="{ first: s.order === 1 }">
            <img v-if="s.avatarUrl" :src="s.avatarUrl" class="ava sm" referrerpolicy="no-referrer" />
            <span v-else class="ava sm ph">{{ s.nickname?.[0] }}</span>
            <span>{{ s.order === 1 ? '⚡' : '#' + s.order }} {{ s.nickname }}</span>
            <strong class="tabular-nums">+{{ s.points }}</strong>
          </div>
        </div>
      </section>

      <!-- LEADERBOARD TOP 6 -->
      <section class="cw-card lb-card">
        <div class="lb-head">
          <h3>🏆 Bảng Xếp Hạng Đuổi Hình Bắt Chữ</h3>
          <span class="tabular-nums">👥 {{ state.playerCount || 0 }} người chơi · 🪙 {{ state.totalGiftCoins || 0 }} xu</span>
        </div>
        <div class="lb-grid">
          <div v-for="p in (state.leaderboard || []).slice(0, 6)" :key="p.userId" class="lb-item">
            <span class="rank" :class="'r' + p.rank">#{{ p.rank }}</span>
            <img v-if="p.avatarUrl" :src="p.avatarUrl" class="ava" referrerpolicy="no-referrer" />
            <span v-else class="ava ph">{{ p.nickname?.[0] }}</span>
            <div class="lb-info">
              <strong>{{ p.nickname }}</strong>
              <small class="tabular-nums">✅ {{ p.solvedCount }} câu · ⚡ {{ p.fastestCount }} top 1</small>
            </div>
            <span class="score tabular-nums">{{ p.score }}đ</span>
          </div>
          <div v-if="!state.leaderboard?.length" class="lb-empty">
            Chưa có người chơi nào ghi điểm — Comment ngay để lên bảng!
          </div>
        </div>
      </section>

      <!-- GIFT GUIDE -->
      <section class="gift-guide">
        <div v-for="t in state.giftTiers || []" :key="t.key" class="gift-tier">
          <span class="g-icon">{{ t.icon }}</span>
          <div>
            <strong>{{ t.name }}</strong>
            <small>{{ t.minCoins }}{{ t.maxCoins ? '–' + t.maxCoins : '+' }} xu · +{{ t.points }}đ</small>
          </div>
        </div>
      </section>

      <!-- LIVE EFFECT FEED -->
      <div class="feed">
        <transition-group name="feed">
          <div v-for="e in feed" :key="e.id" class="feed-item" :class="e.kind?.toLowerCase()">
            <img v-if="e.avatarUrl" :src="e.avatarUrl" class="ava sm" referrerpolicy="no-referrer" />
            <span>{{ e.message }}</span>
          </div>
        </transition-group>
      </div>

      <!-- BIG GIFT POPUP -->
      <transition name="pop">
        <div v-if="bigGift" :key="bigGift.id" class="big-gift">
          <div class="bg-icon">{{ bigGift.icon }}</div>
          <div class="bg-name">{{ bigGift.tierName }}</div>
          <div class="bg-who">{{ bigGift.nickname }} · {{ bigGift.giftName }} (+{{ bigGift.points }}đ)</div>
        </div>
      </transition>

      <!-- FINAL WINNER OVERLAY -->
      <transition name="pop">
        <div v-if="state.status === 'FINISHED'" class="winner">
          <div class="trophy">🏆</div>
          <h2>KẾT THÚC ĐUỔI HÌNH BẮT CHỮ!</h2>
          <div v-if="state.mvp" class="mvp">
            <img v-if="state.mvp.avatarUrl" :src="state.mvp.avatarUrl" class="ava lg" referrerpolicy="no-referrer" />
            <div>
              <small>👑 Quán Quân Tri Thức</small>
              <strong>{{ state.mvp.nickname }}</strong>
              <span class="tabular-nums">{{ state.mvp.score }} điểm · Giải đúng {{ state.mvp.solvedCount }} câu</span>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { Socket } from 'socket.io-client';
import { api } from '../services/api';
import { createRoomSocket } from '../services/socket';
import { soundFX } from '../services/sound';
import LiveStageCalibrator from '../components/LiveStageCalibrator.vue';
import { useStageCalib } from '../composables/useStageCalib';

const props = defineProps<{ roomCodeProp?: string; embedded?: boolean }>();
const route = useRoute();
const roomCode = computed(() =>
  String(props.roomCodeProp || route.params.roomCode || 'KB2026').toUpperCase()
);

const isEmbedded = computed(() => {
  if (props.embedded === true) return true;
  if (typeof window !== 'undefined') {
    const p = (window.location.pathname || '').toLowerCase();
    if (p.includes('/dashboard') || p.includes('/admin')) return true;
  }
  if (route && typeof route.path === 'string') {
    const p = route.path.toLowerCase();
    if (p.includes('/dashboard') || p.includes('/admin')) return true;
  }
  return false;
});

let socket: Socket | null = null;
const { calib, stageStyle, broadcastCalib, attachSocket, applyPreset, resetCalib } = useStageCalib(
  roomCode,
  () => socket
);

const state = ref<any>({
  status: 'IDLE',
  puzzleIndex: -1,
  totalPuzzles: 10,
  leaderboard: [],
  giftTiers: [],
  solvers: [],
});
const now = ref(Date.now());
const clockOffset = ref(0);
const feed = ref<any[]>([]);
const bigGift = ref<any>(null);
const shaking = ref(false);
let ticker: number | undefined;
let feedId = 0;
let audioCtx: AudioContext | null = null;

function applyState(s: any) {
  if (!s) return;
  if (s.serverNow) clockOffset.value = s.serverNow - Date.now();
  state.value = s;
}

const serverNow = computed(() => now.value + clockOffset.value);
const secondsLeft = computed(() => {
  const q = state.value.puzzle;
  if (!q) return 0;
  return Math.max(0, Math.ceil((q.endsAt - serverNow.value) / 1000));
});
const timePct = computed(() => {
  const q = state.value.puzzle;
  if (!q) return 0;
  const total = Math.max(1, q.endsAt - q.startedAt);
  return Math.max(0, Math.min(100, ((q.endsAt - serverNow.value) / total) * 100));
});

function diffLabel(d?: string) {
  return d === 'EASY' ? '🟢 Dễ' : d === 'HARD' ? '🔴 Khó' : '🟡 Trung bình';
}

function beep(freq = 660, dur = 0.12, type: OscillatorType = 'triangle', vol = 0.08) {
  if (isEmbedded.value) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    o.stop(audioCtx.currentTime + dur);
  } catch {
    /* ignore */
  }
}

function pushFeed(e: any) {
  const item = { ...e, id: ++feedId };
  feed.value = [item, ...feed.value].slice(0, 5);
  setTimeout(() => {
    feed.value = feed.value.filter((f) => f.id !== item.id);
  }, 5500);
}

function onEffect(e: any) {
  if (!e) return;
  if (['SOLVED', 'FREE_HINT_UNLOCKED', 'HINT', 'GIFT', 'SYSTEM', 'REVEAL'].includes(e.kind)) {
    pushFeed(e);
  }
  if (e.kind === 'SOLVED') {
    if (!isEmbedded.value) soundFX.playCorrectAnswer();
  } else if (e.kind === 'FREE_HINT_UNLOCKED' || e.kind === 'HINT') {
    if (!isEmbedded.value) soundFX.playRevealTile();
  } else if (e.kind === 'GIFT') {
    if (!isEmbedded.value) soundFX.playCorrectAnswer();
    if (e.tier !== 'LETTER') {
      bigGift.value = { ...e, id: ++feedId };
      shaking.value = true;
      setTimeout(() => (shaking.value = false), 550);
      setTimeout(() => {
        if (bigGift.value?.nickname === e.nickname) bigGift.value = null;
      }, 3200);
    }
  } else if (e.kind === 'WINNER') {
    if (!isEmbedded.value) soundFX.playVictoryFanfare();
  }
}

onMounted(async () => {
  try {
    applyState(await api.catchwordState(roomCode.value, false));
  } catch {
    /* backend offline */
  }
  socket = createRoomSocket(roomCode.value);
  attachSocket(socket);
  socket.on('catchword.state', applyState);
  socket.on('catchword.effect', onEffect);
  ticker = window.setInterval(() => (now.value = Date.now()), 250);
});

onBeforeUnmount(() => {
  socket?.disconnect();
  if (ticker) clearInterval(ticker);
});
</script>

<style scoped>
.cw-root {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background:
    radial-gradient(circle at 12% 15%, rgba(99, 102, 241, 0.28), transparent 45%),
    radial-gradient(circle at 88% 20%, rgba(236, 72, 153, 0.22), transparent 45%),
    linear-gradient(180deg, #090b24 0%, #160d35 100%);
  color: #ffffff;
  overflow: hidden;
}
.cw-root.embedded {
  min-height: 0;
  border-radius: 0.875rem;
}
.cw-stage {
  position: relative;
  width: 100%;
  max-width: 780px;
  padding: 1.2rem 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
.cw-header {
  text-align: center;
}
.cw-header .title {
  font-size: clamp(1.55rem, 4.8vw, 2.35rem);
  font-weight: 900;
  letter-spacing: 0.03em;
  text-shadow: 0 4px 18px rgba(99, 102, 241, 0.6);
}
.cw-header .title span {
  background: linear-gradient(90deg, #38bdf8, #facc15, #f472b6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.sub-row {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.35rem;
}
.pill {
  font-size: 0.76rem;
  font-weight: 800;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.09);
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.x2-pill {
  background: #facc15;
  color: #1c1200;
  border-color: #fde047;
  animation: pulse 0.8s infinite alternate;
}

.cw-card {
  background: rgba(15, 17, 46, 0.86);
  border: 1px solid rgba(129, 140, 248, 0.35);
  border-radius: 1.1rem;
  padding: 1rem 1.15rem;
  box-shadow: 0 14px 34px -10px rgba(0, 0, 0, 0.72);
}
.lobby {
  text-align: center;
}
.lobby-emoji {
  font-size: 3rem;
  margin-bottom: 0.35rem;
}
.lobby h2 {
  font-size: 1.3rem;
  font-weight: 900;
  margin-bottom: 0.4rem;
}
.lobby p {
  color: #c7d2fe;
  font-size: 0.92rem;
}
.rules-grid {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 0.8rem;
  text-align: left;
}
.rule-item {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 0.65rem;
  padding: 0.48rem 0.75rem;
  font-size: 0.86rem;
  color: #e2e8f0;
}
.rule-item code,
.fv-text code {
  background: rgba(0, 240, 255, 0.16);
  color: #38bdf8;
  padding: 0.05rem 0.35rem;
  border-radius: 4px;
  font-family: var(--font-mono);
}

.puzzle-card.shake {
  animation: shake 0.5s;
}
.timer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 800;
  font-size: 0.92rem;
}
.solved-count {
  color: #6ee7b7;
}
.timer {
  font-size: 1.15rem;
  color: #facc15;
}
.timer.urgent {
  color: #fb7185;
  animation: pulse 0.5s infinite alternate;
}
.timer.reveal {
  color: #34d399;
}
.timebar {
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.5rem 0 0.85rem;
  overflow: hidden;
}
.timebar-fill {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #facc15, #fb7185);
  transition: width 0.25s linear;
}

.clues-arena {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.65rem;
  padding: 0.85rem;
  border-radius: 0.95rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(236, 72, 153, 0.15));
  border: 1px solid rgba(165, 180, 252, 0.35);
}
.clue-box {
  min-width: 112px;
  padding: 0.75rem 0.95rem;
  border-radius: 0.9rem;
  background: rgba(9, 12, 34, 0.78);
  border: 2px solid rgba(250, 204, 21, 0.45);
  text-align: center;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);
}
.clue-emoji {
  font-size: 3.1rem;
  line-height: 1.1;
}
.clue-label {
  margin-top: 0.3rem;
  font-size: 0.84rem;
  font-weight: 800;
  color: #fde68a;
}
.clue-plus {
  font-size: 1.8rem;
  font-weight: 900;
  color: #facc15;
}

.hint-banner {
  margin-top: 0.75rem;
  padding: 0.55rem 0.85rem;
  border-radius: 0.7rem;
  background: rgba(250, 204, 21, 0.14);
  border: 1px solid rgba(250, 204, 21, 0.45);
  color: #fef08a;
  font-size: 0.88rem;
  text-align: center;
}

.free-vote-row {
  margin-top: 0.75rem;
}
.fv-text {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #cbd5e1;
  margin-bottom: 0.25rem;
}
.fv-bar {
  height: 7px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}
.fv-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #38bdf8);
  transition: width 0.35s ease;
}

.word-board {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.85rem 1.25rem;
  margin-top: 0.9rem;
}
.word-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.35rem;
}
.letter-tile {
  width: 2.35rem;
  height: 2.65rem;
  border-radius: 0.55rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 900;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(148, 163, 184, 0.4);
  color: rgba(255, 255, 255, 0.45);
  transition: all 0.3s ease;
}
.letter-tile.revealed {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-color: #fde047;
  color: #ffffff;
  transform: scale(1.06);
  box-shadow: 0 0 14px rgba(250, 204, 21, 0.5);
}
.letter-tile.solved {
  background: linear-gradient(135deg, #10b981, #059669);
  border-color: #6ee7b7;
  color: #ffffff;
  box-shadow: 0 0 14px rgba(16, 185, 129, 0.5);
}

.explanation-box {
  margin-top: 0.85rem;
  padding: 0.6rem 0.85rem;
  border-radius: 0.7rem;
  background: rgba(16, 185, 129, 0.14);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #a7f3d0;
  font-size: 0.88rem;
  text-align: center;
}

.solvers-strip {
  margin-top: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.solver-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  background: rgba(16, 185, 129, 0.16);
  border: 1px solid rgba(16, 185, 129, 0.4);
}
.solver-chip.first {
  background: rgba(250, 204, 21, 0.2);
  border-color: #facc15;
  color: #fef08a;
}

.lb-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
}
.lb-head h3 {
  font-size: 0.96rem;
  font-weight: 900;
}
.lb-head span {
  font-size: 0.78rem;
  color: #cbd5e1;
}
.lb-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.45rem;
}
.lb-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.6rem;
  border-radius: 0.7rem;
  background: rgba(255, 255, 255, 0.05);
}
.rank {
  font-weight: 900;
  font-size: 0.85rem;
  min-width: 1.5rem;
  color: #94a3b8;
}
.rank.r1 {
  color: #facc15;
}
.rank.r2 {
  color: #e2e8f0;
}
.rank.r3 {
  color: #f59e0b;
}
.ava {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  background: #312e81;
  flex-shrink: 0;
}
.ava.sm {
  width: 20px;
  height: 20px;
}
.ava.lg {
  width: 66px;
  height: 66px;
  border: 3px solid #facc15;
}
.ava.ph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 800;
}
.lb-info {
  flex: 1;
  min-width: 0;
}
.lb-info strong {
  display: block;
  font-size: 0.82rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.lb-info small {
  font-size: 0.7rem;
  color: #94a3b8;
}
.score {
  font-weight: 900;
  color: #facc15;
  font-size: 0.88rem;
}
.lb-empty {
  grid-column: 1 / -1;
  text-align: center;
  font-size: 0.82rem;
  color: #94a3b8;
  padding: 0.5rem 0;
}

.gift-guide {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.45rem;
}
.gift-tier {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(250, 204, 21, 0.08);
  border: 1px solid rgba(250, 204, 21, 0.35);
  border-radius: 0.75rem;
  padding: 0.4rem 0.5rem;
}
.g-icon {
  font-size: 1.4rem;
}
.gift-tier strong {
  display: block;
  font-size: 0.74rem;
  line-height: 1.15;
}
.gift-tier small {
  font-size: 0.68rem;
  color: #fde68a;
}

.feed {
  position: absolute;
  left: 1rem;
  right: 1rem;
  top: 12%;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  pointer-events: none;
  z-index: 5;
}
.feed-item {
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  max-width: 92%;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.16);
}
.feed-item.solved {
  border-color: #34d399;
}
.feed-item.gift {
  background: linear-gradient(90deg, rgba(202, 138, 4, 0.92), rgba(0, 0, 0, 0.75));
}
.feed-enter-active,
.feed-leave-active {
  transition: all 0.35s ease;
}
.feed-enter-from,
.feed-leave-to {
  opacity: 0;
  transform: translateX(-18px);
}

.big-gift {
  position: absolute;
  left: 50%;
  top: 32%;
  transform: translate(-50%, -50%);
  z-index: 10;
  text-align: center;
  padding: 1.2rem 2rem;
  border-radius: 1.4rem;
  background: rgba(0, 0, 0, 0.86);
  border: 3px solid #facc15;
  box-shadow: 0 0 60px rgba(250, 204, 21, 0.65);
}
.bg-icon {
  font-size: 4rem;
  animation: spin-pop 0.8s ease;
}
.bg-name {
  font-size: 1.55rem;
  font-weight: 900;
  color: #facc15;
}
.bg-who {
  font-weight: 700;
}

.winner {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  background: rgba(6, 7, 25, 0.88);
  text-align: center;
  padding: 1.5rem;
}
.winner h2 {
  font-size: clamp(1.5rem, 5vw, 2.4rem);
  font-weight: 900;
  color: #facc15;
}
.trophy {
  font-size: 4.8rem;
  animation: spin-pop 1s ease;
}
.mvp {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1.25rem;
  border-radius: 1rem;
  background: rgba(250, 204, 21, 0.14);
  border: 1px solid rgba(250, 204, 21, 0.5);
  text-align: left;
}
.mvp small {
  display: block;
  color: #fde68a;
}
.mvp strong {
  display: block;
  font-size: 1.2rem;
}

.pop-enter-active,
.pop-leave-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.65);
}
.winner.pop-enter-from,
.winner.pop-leave-to {
  transform: scale(0.92);
}

@keyframes pulse {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.08);
  }
}
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-6px);
  }
  50% {
    transform: translateX(6px);
  }
  75% {
    transform: translateX(-3px);
  }
}
@keyframes spin-pop {
  0% {
    transform: scale(0.2) rotate(-90deg);
  }
  70% {
    transform: scale(1.18) rotate(8deg);
  }
  100% {
    transform: scale(1) rotate(0);
  }
}
@media (max-width: 560px) {
  .gift-guide,
  .lb-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .clue-box {
    min-width: 88px;
    padding: 0.55rem 0.65rem;
  }
  .clue-emoji {
    font-size: 2.3rem;
  }
  .letter-tile {
    width: 1.9rem;
    height: 2.2rem;
    font-size: 1rem;
  }
}
</style>
