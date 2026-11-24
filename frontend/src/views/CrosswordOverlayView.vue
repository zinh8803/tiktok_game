<template>
  <div class="xw-root" :class="{ embedded: isEmbedded }">
    <LiveStageCalibrator
      v-if="!isEmbedded"
      mode="floating"
      :calib="calib"
      @apply-preset="applyPreset"
      @change="broadcastCalib"
      @reset="resetCalib"
    />

    <div class="xw-stage" :style="isEmbedded ? undefined : stageStyle">
      <!-- 1. HEADER: LOGO & CHỦ ĐỀ -->
      <header class="xw-header">
        <div class="title">🧩 GIẢI MÃ <span>Ô CHỮ</span></div>
        <div class="sub-row tabular-nums">
          <span class="pill status-pill">
            <template v-if="state.status === 'QUESTION_ACTIVE'">
              🔴 Đang mở Hàng ngang #{{ state.currentRowNumber }}
            </template>
            <template v-else-if="state.status === 'QUESTION_REVEAL'">
              ✨ Đã mở Hàng ngang #{{ state.currentRowNumber }}
            </template>
            <template v-else-if="state.status === 'KEYWORD_ACTIVE'">
              🔥 VÒNG GIẢI MÃ TỪ KHÓA CUỐI
            </template>
            <template v-else-if="state.status === 'READY'">
              Sẵn sàng · Đã mở {{ state.solvedRowsCount || 0 }}/{{ state.totalRowsCount || 5 }} hàng
            </template>
            <template v-else-if="state.status === 'WAITING'">
              Sảnh chờ · Bình luận để tham gia
            </template>
            <template v-else-if="state.status === 'PAUSED'">
              ⏸️ Đang tạm dừng
            </template>
            <template v-else-if="state.status === 'FINISHED'">
              🏁 Kết thúc ván chơi
            </template>
            <template v-else>
              Chưa mở ván chơi
            </template>
          </span>
          <span v-if="state.topic" class="pill topic-pill">📚 Chủ đề: {{ state.topic }}</span>
          <span class="pill pts-pill">👑 Giải từ khóa: +{{ state.config?.keywordPoints || 500 }}đ</span>
        </div>
      </header>

      <!-- 2. KHU VỰC TỪ KHÓA BÍ MẬT (LUÔN HIỂN THỊ KHI ĐANG CHƠI) -->
      <section v-if="state.status !== 'IDLE'" class="xw-card keyword-banner" :class="{ solved: Boolean(state.keywordWinner) }">
        <div class="kw-top">
          <div class="kw-title">
            <span class="kw-badge">🔑 TỪ KHÓA BÍ MẬT ({{ state.keywordLength || 5 }} CHỮ CÁI)</span>
            <span class="kw-syntax">
              💬 Đoán mọi lúc: <code>KEYWORD &lt;từ khóa&gt;</code> hoặc <code>TK &lt;từ khóa&gt;</code>
            </span>
          </div>
          <div v-if="state.status === 'KEYWORD_ACTIVE'" class="kw-timer urgent tabular-nums">
            ⏱ {{ keywordSecondsLeft }}s
          </div>
        </div>

        <div class="kw-tiles-row">
          <div
            v-for="kt in state.keywordTiles || []"
            :key="kt.position"
            class="kw-tile"
            :class="{
              revealed: kt.isRevealed,
              winner: Boolean(state.keywordWinner),
            }"
          >
            <small class="kw-pos">{{ kt.position }}</small>
            <span>{{ kt.isRevealed ? kt.char : '?' }}</span>
          </div>
        </div>

        <div v-if="state.keywordHintUnlocked && state.keywordHint" class="kw-hint">
          💡 <strong>Gợi ý từ khóa:</strong> {{ state.keywordHint }}
        </div>

        <div v-if="state.keywordWinner" class="kw-winner-strip">
          👑 <strong>{{ state.keywordWinner.nickname }}</strong> đã giải mã thành công từ khóa
          <strong>"{{ state.keyword }}"</strong> (+{{ state.keywordWinner.pointsEarned }} điểm)!
        </div>
      </section>

      <!-- IDLE / WAITING STATE -->
      <section v-if="state.status === 'IDLE'" class="xw-card lobby-card">
        <div class="lobby-icon">🧩</div>
        <h2>Game Giải Mã Ô Chữ — Crossword Battle</h2>
        <p>MC/Streamer hãy bấm <strong>"Mở sảnh chờ"</strong> hoặc <strong>"Bắt đầu ván"</strong> trên bảng điều khiển.</p>
      </section>

      <section v-else-if="state.status === 'WAITING'" class="xw-card lobby-card">
        <div class="lobby-icon">🎯🧩✨</div>
        <h2>Sảnh Chờ Giải Mã Ô Chữ!</h2>
        <p>
          Chủ đề: <strong>{{ state.topic }}</strong> · Người chơi tham gia:
          <strong class="tabular-nums">{{ state.playerCount || 0 }}</strong>
        </p>
        <div class="rules-list">
          <div class="rule-box">1️⃣ Giải các câu hỏi hàng ngang để lật mở từng ký tự màu vàng của Từ khóa bí mật.</div>
          <div class="rule-box">2️⃣ Trả lời đúng hàng ngang đầu tiên: <strong>+{{ state.config?.firstRowPoints || 100 }}đ</strong>, trả lời đúng tiếp theo: <strong>+{{ state.config?.subsequentRowPoints || 20 }}đ</strong>.</div>
          <div class="rule-box">3️⃣ Bình luận <code>KEYWORD &lt;đáp án&gt;</code> bất cứ lúc nào để giành <strong>+{{ state.config?.keywordPoints || 500 }}đ</strong>!</div>
        </div>
      </section>

      <!-- 3. BẢNG Ô CHỮ TRUNG TÂM (CROSSWORD BOARD) -->
      <section v-if="state.status !== 'IDLE' && state.status !== 'WAITING'" class="xw-card board-card">
        <div class="board-head">
          <h3>📋 BẢNG Ô CHỮ ({{ state.solvedRowsCount || 0 }}/{{ state.totalRowsCount || 5 }} HÀNG ĐÃ MỞ)</h3>
          <span class="legend">
            <i class="dot special"></i> Cột chữ vàng = Ký tự Từ khóa
          </span>
        </div>

        <div class="crossword-grid">
          <div
            v-for="row in state.rows || []"
            :key="row.rowNumber"
            class="xw-row"
            :class="{
              active: row.rowNumber === state.currentRowNumber && state.status === 'QUESTION_ACTIVE',
              solved: row.status === 'SOLVED' || row.status === 'REVEALED',
              skipped: row.status === 'SKIPPED',
            }"
          >
            <div class="row-num tabular-nums">Hàng {{ row.rowNumber }}</div>

            <div class="row-tiles">
              <!-- Ô đệm căn thẳng cột từ khóa màu vàng -->
              <div
                v-for="n in row.offsetLeft || 0"
                :key="'pad-' + n"
                class="tile-spacer"
              ></div>

              <!-- Các ô chữ của hàng ngang -->
              <div
                v-for="tile in row.tiles"
                :key="tile.position"
                class="xw-tile"
                :class="{
                  special: tile.isSpecial,
                  revealed: tile.isRevealed,
                  active: row.rowNumber === state.currentRowNumber && state.status === 'QUESTION_ACTIVE',
                }"
              >
                <span>{{ tile.isRevealed ? tile.char : '' }}</span>
              </div>
            </div>

            <div class="row-meta tabular-nums">
              <span v-if="row.firstSolver" class="solver-tag" :title="row.firstSolver.nickname">
                ⚡ {{ row.firstSolver.nickname }}
              </span>
              <span v-else-if="row.status === 'REVEALED'" class="status-tag open">Đã mở</span>
              <span v-else-if="row.status === 'SKIPPED'" class="status-tag skip">🔒 Chưa giải</span>
              <span v-else class="status-tag len">{{ row.length }} chữ</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. CÂU HỎI HÀNG NGANG HIỆN TẠI & ĐỒNG HỒ ĐẾM NGƯỢC -->
      <section
        v-if="state.activeRow && (state.status === 'QUESTION_ACTIVE' || state.status === 'QUESTION_REVEAL')"
        class="xw-card question-card"
      >
        <div class="q-top tabular-nums">
          <div class="q-badge">
            📢 HÀNG NGANG SỐ {{ state.activeRow.rowNumber }} ({{ state.activeRow.length }} CHỮ CÁI)
          </div>
          <div
            v-if="state.status === 'QUESTION_ACTIVE'"
            class="q-timer"
            :class="{ urgent: rowSecondsLeft <= 5 }"
          >
            ⏱ {{ rowSecondsLeft }}s
          </div>
          <div v-else-if="state.activeRow.answer" class="q-timer revealed">
            ✅ {{ state.activeRow.answer }}
          </div>
          <div v-else class="q-timer urgent">
            🔒 CHƯA AI GIẢI ĐÚNG (GIỮ BÍ MẬT)
          </div>
        </div>

        <div v-if="state.status === 'QUESTION_ACTIVE'" class="timebar">
          <div class="timebar-fill" :style="{ width: rowTimePct + '%' }"></div>
        </div>

        <p class="q-content">{{ state.activeRow.question }}</p>

        <div v-if="state.activeRow.hintUnlocked && state.activeRow.hint" class="q-hint">
          💡 <strong>Gợi ý:</strong> {{ state.activeRow.hint }}
        </div>

        <!-- Danh sách người trả lời đúng hàng ngang hiện tại -->
        <div v-if="state.activeRow.solvers?.length" class="solvers-row">
          <div
            v-for="s in state.activeRow.solvers"
            :key="s.userId"
            class="solver-pill"
            :class="{ first: s.order === 1 }"
          >
            <img v-if="s.avatarUrl" :src="s.avatarUrl" class="ava sm" referrerpolicy="no-referrer" />
            <span v-else class="ava sm ph">{{ s.nickname?.[0] }}</span>
            <span>{{ s.order === 1 ? '⚡ #1' : '#' + s.order }} {{ s.nickname }}</span>
            <strong class="tabular-nums">+{{ s.points }}đ</strong>
          </div>
        </div>
        <div v-else-if="state.status === 'QUESTION_ACTIVE'" class="q-guide">
          💬 Bình luận trực tiếp đáp án hoặc <code>{{ state.activeRow.rowNumber }} &lt;đáp án&gt;</code> để ghi điểm!
        </div>
      </section>

      <!-- VÒNG GIẢI MÃ CUỐI: LỊCH SỬ ĐOÁN TỪ KHÓA -->
      <section v-if="state.recentKeywordAttempts?.length" class="xw-card attempts-card">
        <div class="att-head">
          <span>🕵️ Lượt đoán Từ khóa bí mật gần nhất:</span>
        </div>
        <div class="att-list">
          <div
            v-for="att in state.recentKeywordAttempts"
            :key="att.id"
            class="att-chip"
            :class="{ ok: att.isCorrect }"
          >
            <strong>{{ att.nickname }}:</strong>
            <span>{{ att.guess }}</span>
          </div>
        </div>
      </section>

      <!-- 5. BẢNG XẾP HẠNG TOP NGƯỜI CHƠI -->
      <section class="xw-card lb-card">
        <div class="lb-head">
          <h3>🏆 Bảng Xếp Hạng Giải Mã Ô Chữ</h3>
          <span class="tabular-nums">👥 {{ state.playerCount || 0 }} người tham gia</span>
        </div>
        <div class="lb-grid">
          <div v-for="p in (state.leaderboard || []).slice(0, 6)" :key="p.userId" class="lb-item">
            <span class="rank" :class="'r' + p.rank">#{{ p.rank }}</span>
            <img v-if="p.avatarUrl" :src="p.avatarUrl" class="ava" referrerpolicy="no-referrer" />
            <span v-else class="ava ph">{{ p.nickname?.[0] }}</span>
            <div class="lb-info">
              <strong>{{ p.nickname }}</strong>
              <small class="tabular-nums">
                ✅ {{ p.rowsSolved }} hàng · ⚡ {{ p.firstRowCount }} top 1
                <template v-if="p.keywordSolved"> · 👑 Giải từ khóa</template>
              </small>
            </div>
            <span class="score tabular-nums">{{ p.score }}đ</span>
          </div>
          <div v-if="!state.leaderboard?.length" class="lb-empty">
            Chưa có người chơi ghi điểm — Bình luận giải hàng ngang hoặc đoán từ khóa ngay!
          </div>
        </div>
      </section>

      <!-- LIVE FEED -->
      <div class="feed">
        <transition-group name="feed">
          <div v-for="e in feed" :key="e.id" class="feed-item" :class="e.kind?.toLowerCase()">
            <img v-if="e.avatarUrl" :src="e.avatarUrl" class="ava sm" referrerpolicy="no-referrer" />
            <span>{{ e.message }}</span>
          </div>
        </transition-group>
      </div>

      <!-- FINAL WINNER MODAL -->
      <transition name="pop">
        <div v-if="state.status === 'FINISHED'" class="winner-card">
          <div class="trophy">🏆</div>
          <h2>KẾT THÚC GIẢI MÃ Ô CHỮ!</h2>
          <div class="final-kw">
            Từ khóa bí mật: <strong>{{ state.keyword }}</strong>
          </div>
          <div v-if="state.keywordWinner" class="kw-hero">
            👑 Người giải mã từ khóa: <strong>{{ state.keywordWinner.nickname }}</strong> (+{{ state.keywordWinner.pointsEarned }}đ)
          </div>
          <div v-if="state.mvp" class="mvp-box">
            <img v-if="state.mvp.avatarUrl" :src="state.mvp.avatarUrl" class="ava lg" referrerpolicy="no-referrer" />
            <div>
              <small>🥇 Quán Quân Ván Đấu</small>
              <strong>{{ state.mvp.nickname }}</strong>
              <span class="tabular-nums">{{ state.mvp.score }} điểm · Giải đúng {{ state.mvp.rowsSolved }} hàng ngang</span>
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
import { useAiVoice } from '../composables/useAiVoice';
import LiveStageCalibrator from '../components/LiveStageCalibrator.vue';
import { useStageCalib } from '../composables/useStageCalib';

const props = defineProps<{ roomCodeProp?: string; embedded?: boolean }>();
const route = useRoute();
const aiVoice = useAiVoice();

const roomCode = computed(() =>
  String(props.roomCodeProp || route.params.roomCode || 'KB2026').toUpperCase(),
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
  () => socket,
);

const state = ref<any>({
  status: 'IDLE',
  rows: [],
  keywordTiles: [],
  leaderboard: [],
  recentKeywordAttempts: [],
});

const now = ref(Date.now());
const clockOffset = ref(0);
const feed = ref<any[]>([]);
let ticker: number | undefined;
let feedId = 0;

function applyState(s: any) {
  if (!s) return;
  if (s.serverNow) clockOffset.value = s.serverNow - Date.now();
  state.value = s;
}

const serverNow = computed(() => now.value + clockOffset.value);

const rowSecondsLeft = computed(() => {
  const r = state.value.activeRow;
  if (!r || !r.endsAt) return 0;
  return Math.max(0, Math.ceil((r.endsAt - serverNow.value) / 1000));
});

const rowTimePct = computed(() => {
  const r = state.value.activeRow;
  if (!r || !r.endsAt || !r.startedAt) return 0;
  const total = Math.max(1, r.endsAt - r.startedAt);
  return Math.max(0, Math.min(100, ((r.endsAt - serverNow.value) / total) * 100));
});

const keywordSecondsLeft = computed(() => {
  if (!state.value.keywordEndsAt) return 0;
  return Math.max(0, Math.ceil((state.value.keywordEndsAt - serverNow.value) / 1000));
});

function pushFeed(e: any) {
  if (!e?.message) return;
  const item = { ...e, id: ++feedId };
  feed.value = [item, ...feed.value].slice(0, 5);
  setTimeout(() => {
    feed.value = feed.value.filter((f) => f.id !== item.id);
  }, 5500);
}

function onEffect(e: any) {
  if (!e) return;
  pushFeed(e);

  if (e.kind === 'ROW_OPENED') {
    if (!isEmbedded.value) soundFX.playStartMatch();
    aiVoice.speak(`Hàng ngang số ${e.rowNumber}, gồm ${e.length} chữ cái. ${e.question}`);
  } else if (e.kind === 'ROW_CORRECT') {
    if (!isEmbedded.value) soundFX.playCorrectAnswer();
  } else if (e.kind === 'ROW_REVEALED') {
    if (!isEmbedded.value) soundFX.playRevealTile();
    const solverText = e.player?.displayName
      ? `Bạn ${e.player.displayName} trả lời nhanh nhất.`
      : '';
    aiVoice.speak(
      `Hàng ngang số ${e.rowNumber}, đáp án là ${e.answer}. Mở ký tự từ khóa ${e.keywordCharacter}. ${solverText}`,
    );
  } else if (e.kind === 'ROW_TIMEOUT') {
    aiVoice.speak(
      `Hết giờ! Hàng ngang số ${e.rowNumber} chưa có bạn nào trả lời đúng nên ô chữ vẫn giữ bí mật.`,
    );
  } else if (e.kind === 'KEYWORD_WINNER') {
    if (!isEmbedded.value) soundFX.playVictoryFanfare();
    aiVoice.speak(
      `Xin chúc mừng bạn ${e.nickname} đã giải mã thành công từ khóa bí mật ${e.keyword} và giành ${e.pointsEarned} điểm!`,
    );
  } else if (e.kind === 'KEYWORD_FINAL') {
    if (!isEmbedded.value) soundFX.playStartMatch();
    aiVoice.speak(
      `Đã hết các câu hỏi hàng ngang! Bây giờ là ${e.timeLimit || 60} giây cuối cùng để giải mã từ khóa bí mật!`,
    );
  }
}

onMounted(async () => {
  try {
    applyState(await api.crosswordState(roomCode.value, false));
  } catch {
    /* backend offline */
  }
  socket = createRoomSocket(roomCode.value);
  attachSocket(socket);
  socket.on('crossword.state', applyState);
  socket.on('crossword.effect', onEffect);
  ticker = window.setInterval(() => (now.value = Date.now()), 250);
});

onBeforeUnmount(() => {
  socket?.disconnect();
  if (ticker) clearInterval(ticker);
});
</script>

<style scoped>
.xw-root {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background:
    radial-gradient(circle at 15% 15%, rgba(14, 165, 233, 0.24), transparent 45%),
    radial-gradient(circle at 85% 20%, rgba(234, 179, 8, 0.18), transparent 45%),
    linear-gradient(180deg, #070b1e 0%, #111836 100%);
  color: #ffffff;
  overflow: hidden;
}
.xw-root.embedded {
  min-height: 0;
  border-radius: 0.875rem;
}
.xw-stage {
  position: relative;
  width: 100%;
  max-width: 820px;
  padding: 1rem 0.95rem 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.xw-header {
  text-align: center;
}
.xw-header .title {
  font-size: clamp(1.5rem, 4.5vw, 2.25rem);
  font-weight: 900;
  letter-spacing: 0.04em;
  text-shadow: 0 4px 16px rgba(14, 165, 233, 0.5);
}
.xw-header .title span {
  background: linear-gradient(90deg, #38bdf8, #facc15, #f97316);
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
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.22rem 0.65rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.09);
  border: 1px solid rgba(255, 255, 255, 0.14);
}
.topic-pill {
  color: #38bdf8;
  border-color: rgba(56, 189, 248, 0.35);
}
.pts-pill {
  color: #facc15;
  border-color: rgba(250, 204, 21, 0.4);
  background: rgba(250, 204, 21, 0.1);
}
.xw-card {
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 1rem;
  padding: 0.85rem 1rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
}

/* KEYWORD BANNER */
.keyword-banner {
  border: 1.5px solid rgba(250, 204, 21, 0.45);
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(66, 32, 6, 0.45) 100%);
}
.keyword-banner.solved {
  border-color: #10b981;
  box-shadow: 0 0 24px rgba(16, 185, 129, 0.35);
}
.kw-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
}
.kw-title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.kw-badge {
  font-size: 0.8rem;
  font-weight: 900;
  color: #facc15;
  letter-spacing: 0.04em;
}
.kw-syntax {
  font-size: 0.75rem;
  color: #e2e8f0;
}
.kw-syntax code {
  background: rgba(250, 204, 21, 0.2);
  color: #fde047;
  padding: 0.1rem 0.4rem;
  border-radius: 0.35rem;
  font-weight: 800;
}
.kw-tiles-row {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.45rem;
}
.kw-tile {
  position: relative;
  width: 2.7rem;
  height: 2.9rem;
  border-radius: 0.6rem;
  background: rgba(15, 23, 42, 0.85);
  border: 2px dashed rgba(250, 204, 21, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 900;
  color: #94a3b8;
  transition: all 0.35s ease;
}
.kw-tile.revealed {
  background: linear-gradient(135deg, #f59e0b, #eab308);
  border: 2px solid #fef08a;
  color: #0f172a;
  transform: scale(1.05);
  box-shadow: 0 0 16px rgba(250, 204, 21, 0.55);
}
.kw-tile.winner {
  background: linear-gradient(135deg, #10b981, #059669);
  border-color: #a7f3d0;
  color: #ffffff;
}
.kw-pos {
  position: absolute;
  top: 2px;
  left: 5px;
  font-size: 0.58rem;
  opacity: 0.75;
}
.kw-hint {
  margin-top: 0.55rem;
  text-align: center;
  font-size: 0.8rem;
  color: #fef08a;
  background: rgba(250, 204, 21, 0.12);
  padding: 0.35rem 0.65rem;
  border-radius: 0.5rem;
}
.kw-winner-strip {
  margin-top: 0.55rem;
  text-align: center;
  font-size: 0.85rem;
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.45);
  color: #a7f3d0;
  padding: 0.4rem 0.7rem;
  border-radius: 0.5rem;
}

/* BOARD */
.board-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.65rem;
}
.board-head h3 {
  font-size: 0.85rem;
  font-weight: 900;
  color: #93c5fd;
  letter-spacing: 0.04em;
}
.legend {
  font-size: 0.72rem;
  color: #fde047;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}
.dot.special {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background: #facc15;
  display: inline-block;
}
.crossword-grid {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.xw-row {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.38rem 0.55rem;
  border-radius: 0.65rem;
  background: rgba(30, 41, 59, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.07);
  transition: all 0.25s ease;
}
.xw-row.active {
  background: rgba(14, 165, 233, 0.16);
  border-color: #38bdf8;
  box-shadow: 0 0 16px rgba(56, 189, 248, 0.28);
}
.xw-row.solved {
  background: rgba(16, 185, 129, 0.09);
  border-color: rgba(16, 185, 129, 0.25);
}
.row-num {
  min-width: 3.6rem;
  font-size: 0.76rem;
  font-weight: 800;
  color: #cbd5e1;
}
.row-tiles {
  display: flex;
  align-items: center;
  gap: 0.24rem;
  flex: 1;
  overflow-x: auto;
  padding: 2px 0;
}
.tile-spacer {
  width: 2.05rem;
  height: 2.15rem;
  flex-shrink: 0;
}
.xw-tile {
  width: 2.05rem;
  height: 2.15rem;
  flex-shrink: 0;
  border-radius: 0.42rem;
  background: rgba(15, 23, 42, 0.9);
  border: 1.5px solid rgba(148, 163, 184, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.98rem;
  font-weight: 900;
  color: #f8fafc;
  transition: transform 0.35s ease, background 0.35s ease;
}
.xw-tile.active {
  border-color: #38bdf8;
  background: rgba(14, 165, 233, 0.22);
}
.xw-tile.special {
  border: 2px solid #facc15;
  background: rgba(250, 204, 21, 0.16);
}
.xw-tile.revealed {
  background: #1e293b;
  border-color: #38bdf8;
  color: #38bdf8;
}
.xw-tile.special.revealed {
  background: linear-gradient(135deg, #f59e0b, #eab308);
  border-color: #fef08a;
  color: #0f172a;
  box-shadow: 0 0 10px rgba(250, 204, 21, 0.5);
}
.row-meta {
  min-width: 5.2rem;
  text-align: right;
  font-size: 0.72rem;
}
.solver-tag {
  background: rgba(16, 185, 129, 0.2);
  color: #6ee7b7;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  font-weight: 700;
  display: inline-block;
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.status-tag {
  color: #94a3b8;
  font-weight: 700;
}

/* ACTIVE QUESTION CARD */
.question-card {
  border-color: rgba(56, 189, 248, 0.45);
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(12, 74, 110, 0.35));
}
.q-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.45rem;
}
.q-badge {
  font-size: 0.8rem;
  font-weight: 900;
  color: #38bdf8;
}
.q-timer {
  font-size: 1rem;
  font-weight: 900;
  color: #facc15;
}
.q-timer.urgent {
  color: #f43f5e;
  animation: pulse 0.8s infinite;
}
.q-timer.revealed {
  color: #34d399;
}
.timebar {
  height: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
  margin-bottom: 0.55rem;
}
.timebar-fill {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #facc15);
  transition: width 0.25s linear;
}
.q-content {
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1.4;
  color: #f8fafc;
  margin-bottom: 0.5rem;
}
.q-hint {
  font-size: 0.82rem;
  color: #fde047;
  background: rgba(250, 204, 21, 0.12);
  padding: 0.35rem 0.65rem;
  border-radius: 0.45rem;
  margin-bottom: 0.5rem;
}
.q-guide {
  font-size: 0.76rem;
  color: #94a3b8;
}
.solvers-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.4rem;
}
.solver-pill {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(255, 255, 255, 0.08);
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.75rem;
}
.solver-pill.first {
  background: rgba(250, 204, 21, 0.2);
  border: 1px solid rgba(250, 204, 21, 0.45);
  color: #fef08a;
}

/* KEYWORD ATTEMPTS */
.attempts-card {
  padding: 0.6rem 0.85rem;
}
.att-head {
  font-size: 0.74rem;
  color: #94a3b8;
  margin-bottom: 0.35rem;
}
.att-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}
.att-chip {
  font-size: 0.74rem;
  background: rgba(255, 255, 255, 0.06);
  padding: 0.18rem 0.5rem;
  border-radius: 999px;
  display: flex;
  gap: 0.3rem;
}
.att-chip.ok {
  background: rgba(16, 185, 129, 0.25);
  color: #6ee7b7;
}

/* LEADERBOARD */
.lb-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.55rem;
}
.lb-head h3 {
  font-size: 0.88rem;
  font-weight: 800;
}
.lb-head span {
  font-size: 0.74rem;
  color: #94a3b8;
}
.lb-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.45rem;
}
.lb-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.4rem 0.6rem;
  border-radius: 0.6rem;
}
.rank {
  font-size: 0.78rem;
  font-weight: 900;
  min-width: 1.6rem;
}
.rank.r1 {
  color: #facc15;
}
.rank.r2 {
  color: #e2e8f0;
}
.rank.r3 {
  color: #fb923c;
}
.ava {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}
.ava.sm {
  width: 20px;
  height: 20px;
}
.ava.lg {
  width: 48px;
  height: 48px;
}
.ava.ph {
  background: #334155;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.75rem;
}
.lb-info {
  flex: 1;
  min-width: 0;
}
.lb-info strong {
  display: block;
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.lb-info small {
  font-size: 0.68rem;
  color: #94a3b8;
}
.score {
  font-weight: 900;
  color: #facc15;
  font-size: 0.85rem;
}
.lb-empty {
  font-size: 0.78rem;
  color: #94a3b8;
  text-align: center;
  padding: 0.5rem;
}

/* LOBBY & WINNER */
.lobby-card {
  text-align: center;
  padding: 1.5rem 1rem;
}
.lobby-icon {
  font-size: 2.6rem;
  margin-bottom: 0.4rem;
}
.rules-list {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-top: 0.85rem;
  text-align: left;
}
.rule-box {
  background: rgba(255, 255, 255, 0.06);
  padding: 0.5rem 0.75rem;
  border-radius: 0.55rem;
  font-size: 0.82rem;
}
.feed {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.feed-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.76rem;
  background: rgba(15, 23, 42, 0.88);
  border-left: 3px solid #38bdf8;
  padding: 0.32rem 0.65rem;
  border-radius: 0.45rem;
}
.winner-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(6, 78, 59, 0.92));
  border: 2px solid #facc15;
  border-radius: 1.1rem;
  padding: 1.2rem;
  text-align: center;
}
.winner-card .trophy {
  font-size: 2.6rem;
}
.final-kw {
  margin: 0.45rem 0;
  font-size: 1.05rem;
  color: #fde047;
}
.kw-hero {
  font-size: 0.9rem;
  color: #6ee7b7;
  margin-bottom: 0.65rem;
}
.mvp-box {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.08);
  padding: 0.6rem 1rem;
  border-radius: 0.75rem;
  text-align: left;
}
.mvp-box strong {
  display: block;
  font-size: 1rem;
}
</style>
