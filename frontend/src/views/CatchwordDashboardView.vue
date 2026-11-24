<template>
  <div class="cw-dash-page">
    <!-- Top Header -->
    <header class="dash-topbar">
      <div class="topbar-brand">
        <div class="brand-badge">🖼️</div>
        <div>
          <h1>Đuổi Hình Bắt Chữ LIVE — Bàn Điều Khiển Streamer</h1>
          <p>Nhìn hình đoán chữ tiếng Việt · Comment "mở" miễn phí &amp; 4 mốc quà tặng tương tác</p>
        </div>
      </div>

      <nav class="topbar-actions">
        <router-link to="/" class="btn btn-secondary">
          <Home :size="16" />
          <span>🏠 Trang chủ Game</span>
        </router-link>
        <router-link to="/dashboard" class="btn btn-secondary">
          <Brain :size="16" />
          <span>🧠 Trắc nghiệm</span>
        </router-link>
        <router-link to="/tug/dashboard" class="btn btn-secondary">
          <span>🪢 Kéo co</span>
        </router-link>
        <a :href="obsOverlayUrl" target="_blank" rel="noopener" class="btn btn-cyan">
          <ExternalLink :size="16" />
          <span>📺 Mở màn hình OBS</span>
        </a>
      </nav>
    </header>

    <!-- Toast Notification Banner -->
    <div v-if="toastMessage" class="toast-banner" :class="`toast-${toastType}`">
      <span>{{ toastMessage }}</span>
      <button type="button" @click="toastMessage = ''">Đóng</button>
    </div>

    <div class="dash-main-grid">
      <!-- LEFT COLUMN -->
      <div class="dash-col">
        <!-- 1. Kết nối TikTok LIVE & Link OBS -->
        <section class="panel-card">
          <div class="panel-header">
            <div class="panel-title-group">
              <Radio :size="20" class="icon-cyan" />
              <h2>1. Kết nối TikTok LIVE &amp; Link OBS</h2>
            </div>
            <span class="badge" :class="connectionBadgeClass">
              {{ tiktokStatus.state }}
            </span>
          </div>

          <p class="panel-desc">
            Nhập <strong>@username</strong> kênh TikTok đang LIVE. Khi game Đuổi Hình Bắt Chữ mở, mọi bình luận đoán chữ và quà tặng sẽ được chấm tự động theo thời gian thực.
          </p>

          <form class="connect-form" @submit.prevent="handleConnectTikTok">
            <input
              v-model="tiktokUsernameInput"
              type="text"
              class="input-control"
              placeholder="Ví dụ: @vinhnq_live"
              :disabled="isConnectingTikTok"
            />
            <button
              v-if="tiktokStatus.state !== 'CONNECTED'"
              type="submit"
              class="btn btn-cyan"
              :disabled="isConnectingTikTok"
            >
              <Plug :size="16" />
              <span>{{ isConnectingTikTok ? 'Đang kết nối...' : 'Kết nối LIVE' }}</span>
            </button>
            <button v-else type="button" class="btn btn-danger" @click="handleDisconnectTikTok">
              <Power :size="16" />
              <span>Ngắt kết nối</span>
            </button>
          </form>

          <div class="tiktok-metrics tabular-nums">
            <div class="tt-metric">
              <span>Trạng thái</span>
              <strong>{{ formatConnectionState(tiktokStatus.state) }}</strong>
            </div>
            <div class="tt-metric">
              <span>TikTok Room ID</span>
              <strong>{{ tiktokStatus.tiktokRoomId || 'Chưa kết nối' }}</strong>
            </div>
            <div class="tt-metric">
              <span>Sự kiện nhận</span>
              <strong>{{ tiktokStatus.eventsReceived || 0 }}</strong>
            </div>
          </div>

          <div v-if="tiktokStatus.lastError" class="connection-alert">
            <AlertTriangle :size="17" />
            <span>{{ tiktokStatus.lastError }}</span>
          </div>

          <div class="obs-copy-box">
            <label>Link Browser Source cho OBS Studio (phòng {{ roomCode }})</label>
            <div class="obs-url-row">
              <input :value="obsOverlayUrl" readonly class="input-control mono" />
              <button type="button" class="btn btn-secondary" @click="copyUrl(obsOverlayUrl)">
                <Copy :size="15" />
                <span>Sao chép</span>
              </button>
            </div>
          </div>
        </section>

        <!-- 2. Điều khiển trận đấu + Secret Đáp Án Cho Host -->
        <section class="panel-card">
          <div class="panel-header">
            <div class="panel-title-group">
              <Settings :size="20" class="icon-purple" />
              <h2>2. Điều Khiển Trận Đấu Đuổi Hình Bắt Chữ</h2>
            </div>
            <span class="badge" :class="cwStatusBadgeClass">
              {{ formatCwStatus(cwState.status) }}
            </span>
          </div>

          <!-- STREAMER SECRET BOX -->
          <div v-if="secretBox" class="secret-box">
            <div class="secret-head">
              <span>🔐 Đáp án dành riêng cho Streamer (OBS không hiển thị):</span>
              <strong class="secret-ans">{{ secretBox.answer }}</strong>
            </div>
            <p class="secret-hint">💡 Gợi ý nghĩa: {{ secretBox.hint }}</p>
          </div>

          <div class="cw-summary tabular-nums">
            <div class="sum-chip">
              <span>Tiến độ câu đố</span>
              <strong>{{ cwState.puzzleIndex >= 0 ? cwState.puzzleIndex + 1 : 0 }} / {{ cwState.totalPuzzles || configForm.puzzleCount }}</strong>
            </div>
            <div class="sum-chip">
              <span>Kho hình ảnh</span>
              <strong>{{ cwState.puzzleBankSize || 38 }} câu</strong>
            </div>
            <div class="sum-chip">
              <span>Người chơi</span>
              <strong>👥 {{ cwState.playerCount || 0 }}</strong>
            </div>
            <div class="sum-chip">
              <span>Vote "mở" chữ</span>
              <strong>🔓 {{ cwState.freeHintProgress || 0 }}/5</strong>
            </div>
          </div>

          <div class="config-grid tabular-nums">
            <div class="form-field">
              <label>Số câu / trận (3–35)</label>
              <input v-model.number="configForm.puzzleCount" type="number" min="3" max="35" class="input-control" />
            </div>
            <div class="form-field">
              <label>Giây / câu (10–90s)</label>
              <input v-model.number="configForm.timePerPuzzle" type="number" min="10" max="90" class="input-control" />
            </div>
            <div class="form-field">
              <label>Giây công bố (3–15s)</label>
              <input v-model.number="configForm.revealSeconds" type="number" min="3" max="15" class="input-control" />
            </div>
            <div class="form-field">
              <label>Tự công bố khi có N người đúng</label>
              <input v-model.number="configForm.autoRevealAfterSolvers" type="number" min="1" max="50" class="input-control" />
            </div>
            <div class="form-field checkbox-field" style="grid-column: 1 / -1; display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
              <input id="cw-auto-loop" v-model="configForm.autoLoop" type="checkbox" style="width: 18px; height: 18px; cursor: pointer;" />
              <label for="cw-auto-loop" style="margin: 0; cursor: pointer; font-weight: 700; color: #38bdf8;">
                🔄 Tự động chơi liên tục (tự động qua câu &amp; lặp bàn mới ngẫu nhiên)
              </label>
            </div>
          </div>

          <div class="control-actions-wrap">
            <button type="button" class="btn btn-secondary" @click="saveConfig">
              <Save :size="15" />
              <span>Lưu cấu hình</span>
            </button>
            <button type="button" class="btn btn-purple" @click="handleOpenLobby">
              <span>🚪 Mở sảnh chờ</span>
            </button>
            <button type="button" class="btn btn-cyan" @click="handleStart">
              <Play :size="15" />
              <span>▶️ Bắt đầu trận</span>
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              :disabled="cwState.status !== 'QUESTION'"
              @click="handleRevealLetter"
            >
              <span>🔤 Mở 1 chữ cái</span>
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              :disabled="cwState.status !== 'QUESTION'"
              @click="handleUnlockHint"
            >
              <span>💡 Hiện gợi ý nghĩa</span>
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              :disabled="cwState.status !== 'QUESTION' && cwState.status !== 'REVEAL'"
              @click="handleNext"
            >
              <SkipForward :size="15" />
              <span>⏭️ Công bố / Câu tiếp</span>
            </button>
            <button
              type="button"
              class="btn btn-gold"
              :disabled="cwState.status === 'IDLE'"
              @click="handleFinish"
            >
              <Trophy :size="15" />
              <span>🏁 Kết thúc trận</span>
            </button>
            <button
              type="button"
              class="btn btn-danger"
              :disabled="cwState.status === 'IDLE'"
              @click="handleStop"
            >
              <Square :size="15" />
              <span>⏹️ Đóng game</span>
            </button>
          </div>
        </section>

        <!-- Điều chỉnh bố cục màn hình LIVE -->
        <LiveStageCalibrator
          mode="panel"
          :calib="calib"
          @apply-preset="applyPreset"
          @change="broadcastCalib"
          @reset="resetCalib"
        />

        <!-- 3. Bộ Giả Lập (Simulator) -->
        <section class="panel-card">
          <div class="panel-header">
            <div class="panel-title-group">
              <Sparkles :size="20" class="icon-gold" />
              <h2>3. Bộ Giả Lập (Simulator) — Test nhanh không cần LIVE</h2>
            </div>
          </div>

          <div class="sim-grid">
            <button type="button" class="btn btn-secondary" @click="runSim('JOIN_CROWD', { count: 10 })">
              👥 +10 Người chơi
            </button>
            <button type="button" class="btn btn-secondary" @click="runSim('WRONG_GUESS')">
              💬 Đoán sai mẫu
            </button>
            <button type="button" class="btn btn-cyan" @click="runSim('CORRECT_GUESS')">
              🎯 1 Người đoán ĐÚNG
            </button>
            <button type="button" class="btn btn-purple" @click="runSim('VOTE_HINT', { count: 5 })">
              🔓 +5 Vote "mở" chữ
            </button>
          </div>

          <div class="sim-gifts-row">
            <button type="button" class="btn btn-gold" @click="runSim('GIFT', { coins: 1 })">
              🌹 Quà 1 xu (Mở 1 ô chữ)
            </button>
            <button type="button" class="btn btn-gold" @click="runSim('GIFT', { coins: 30 })">
              💡 Quà 30 xu (Gợi ý + 10s)
            </button>
            <button type="button" class="btn btn-gold" @click="runSim('GIFT', { coins: 199 })">
              ⚡ Quà 199 xu (Điểm x2 + 2 chữ)
            </button>
            <button type="button" class="btn btn-gold" @click="runSim('GIFT', { coins: 1000 })">
              👑 Quà 1000 xu (Mở 50% chữ)
            </button>
          </div>
        </section>

        <!-- 4. Thêm Câu Đố Nhanh & Kịch Bản Đọc LIVE -->
        <section class="panel-card">
          <div class="panel-header">
            <div class="panel-title-group">
              <BookOpen :size="20" class="icon-cyan" />
              <h2>4. Tạo Câu Đố Nhanh &amp; Kịch Bản Free / Tặng Quà</h2>
            </div>
          </div>

          <!-- AI Catchword Generator -->
          <div class="ai-box mb-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Sparkles :size="16" />
                <span>AI Sinh Câu Đố Đuổi Hình Bắt Chữ Tự Động</span>
              </h3>
              <span class="badge badge-gold">Gemini / Smart Engine</span>
            </div>
            <p class="text-xs text-slate-300 mb-2">
              Nhập chủ đề để AI tự động ghép các biểu tượng Emoji và thành ngữ tiếng Việt chuẩn xác!
            </p>
            <div class="ai-input-row">
              <input
                v-model="aiTopic"
                class="input-control"
                placeholder="Chủ đề (vd: Ca dao tục ngữ, Thành ngữ dân gian, Đố mẹo)"
              />
              <select v-model.number="aiCount" class="select-control count-sel">
                <option :value="3">3 câu</option>
                <option :value="5">5 câu</option>
                <option :value="10">10 câu</option>
              </select>
              <button
                type="button"
                class="btn btn-gold"
                :disabled="isGeneratingAi"
                @click="handleGenerateAiCatchwords"
              >
                <Sparkles :size="15" />
                <span>{{ isGeneratingAi ? 'Đang tạo...' : '🚀 AI Sinh Ngay' }}</span>
              </button>
            </div>
          </div>

          <!-- Quick Puzzle Creator -->
          <form class="creator-box" @submit.prevent="submitCustomPuzzle">
            <h3>➕ Thêm câu Đuổi Hình Bắt Chữ tự tạo (ưu tiên ra đầu tiên)</h3>
            <div class="creator-row">
              <input v-model="puzzleForm.emoji1" class="input-control emoji-inp" placeholder="Emoji 1 (vd: 🐟)" required />
              <input v-model="puzzleForm.label1" class="input-control" placeholder="Nhãn 1 (vd: Cá)" />
              <input v-model="puzzleForm.emoji2" class="input-control emoji-inp" placeholder="Emoji 2 (vd: 🐴)" required />
              <input v-model="puzzleForm.label2" class="input-control" placeholder="Nhãn 2 (vd: Ngựa)" />
            </div>
            <div class="creator-row2">
              <input v-model="puzzleForm.answer" class="input-control" placeholder="Đáp án chính xác (vd: CÁ NGỰA)" required />
              <input v-model="puzzleForm.hint" class="input-control" placeholder="Gợi ý nghĩa ngắn (tùy chọn)" />
              <button type="submit" class="btn btn-cyan">Thêm câu đố</button>
            </div>
          </form>

          <!-- Free & Gift Scripts -->
          <div class="scripts-grid">
            <div class="script-box free">
              <h3>🆓 Luồng Người Chơi FREE (0 xu)</h3>
              <ul>
                <li>Comment đáp án tiếng Việt <strong>có dấu hay không dấu</strong> đều hợp lệ (vd: <code>ca ngua</code> / <code>cá ngựa</code>).</li>
                <li>Đoán đúng <strong>#1</strong> nhận <code>+150đ</code>, #2–#3 nhận <code>+120đ</code>, tiếp theo <code>80–100đ</code>.</li>
                <li>Comment <code>mở</code> / <code>gợi ý</code> / <code>hint</code>: đủ <strong>5 người vote</strong> tự động lật mở 1 ô chữ!</li>
              </ul>
            </div>
            <div class="script-box gift">
              <h3>🎁 Kịch Bản Quà Tặng (4 Mốc)</h3>
              <div class="tier-list">
                <div v-for="t in giftTiers" :key="t.key" class="tier-item">
                  <strong>{{ t.icon }} {{ t.name }} ({{ t.minCoins }}{{ t.maxCoins ? '–' + t.maxCoins : '+' }} xu)</strong>
                  <small>{{ t.description }}</small>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- RIGHT COLUMN: Embedded Live Preview -->
      <div class="dash-col preview-col">
        <section class="panel-card preview-card">
          <div class="panel-header">
            <div class="panel-title-group">
              <Monitor :size="20" class="icon-cyan" />
              <h2>Xem Trước Trực Tiếp Màn Hình OBS</h2>
            </div>
            <a :href="obsOverlayUrl" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">
              <ExternalLink :size="14" />
              <span>Mở tab riêng</span>
            </a>
          </div>
          <div class="embedded-wrap">
            <CatchwordOverlayView :roomCodeProp="roomCode" :embedded="true" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import type { Socket } from 'socket.io-client';
import {
  AlertTriangle,
  BookOpen,
  Brain,
  Copy,
  ExternalLink,
  Home,
  Monitor,
  Play,
  Plug,
  Power,
  Radio,
  Save,
  Settings,
  SkipForward,
  Sparkles,
  Square,
  Trophy,
} from 'lucide-vue-next';
import { api } from '../services/api';
import { createRoomSocket } from '../services/socket';
import CatchwordOverlayView from './CatchwordOverlayView.vue';
import LiveStageCalibrator from '../components/LiveStageCalibrator.vue';
import { useStageCalib } from '../composables/useStageCalib';

const roomCode = ref('KB2026');
let socket: Socket | null = null;
const { calib, broadcastCalib, attachSocket, applyPreset, resetCalib } = useStageCalib(
  roomCode,
  () => socket
);
const tiktokUsernameInput = ref('vinhnq_live');
const isConnectingTikTok = ref(false);
const tiktokStatus = ref<any>({
  state: 'DISCONNECTED',
  tiktokRoomId: null,
  eventsReceived: 0,
  lastError: null,
});

const cwState = ref<any>({
  status: 'IDLE',
  puzzleIndex: -1,
  totalPuzzles: 10,
  puzzleBankSize: 38,
  playerCount: 0,
  freeHintProgress: 0,
  giftTiers: [],
});
const secretInfo = ref<{ puzzleIndex?: number; answer: string; hint: string; explanation: string } | null>(null);

const configForm = reactive({
  puzzleCount: 10,
  timePerPuzzle: 30,
  revealSeconds: 6,
  autoRevealAfterSolvers: 5,
  autoLoop: true,
});

const puzzleForm = reactive({
  emoji1: '',
  label1: '',
  emoji2: '',
  label2: '',
  answer: '',
  hint: '',
});

const toastMessage = ref('');
const toastType = ref<'info' | 'success' | 'error'>('info');
let toastTimer: number | undefined;

function showToast(msg: string, type: 'info' | 'success' | 'error' = 'info') {
  toastMessage.value = msg;
  toastType.value = type;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toastMessage.value = '';
  }, 4500);
}

const obsOverlayUrl = computed(() => {
  if (typeof window === 'undefined') return `/catchword/${roomCode.value}`;
  return `${window.location.origin}/catchword/${roomCode.value}`;
});

const secretBox = computed(() => {
  if (cwState.value.status !== 'QUESTION' && cwState.value.status !== 'REVEAL') return null;
  if (cwState.value.secret?.answer) return cwState.value.secret;
  if (secretInfo.value && secretInfo.value.puzzleIndex === cwState.value.puzzleIndex) {
    return secretInfo.value;
  }
  return null;
});

const connectionBadgeClass = computed(() => {
  const st = tiktokStatus.value?.state;
  if (st === 'CONNECTED') return 'badge-emerald';
  if (st === 'CONNECTING' || st === 'RECONNECTING') return 'badge-gold';
  if (st === 'ERROR') return 'badge-rose';
  return 'badge-purple';
});

const cwStatusBadgeClass = computed(() => {
  const st = cwState.value?.status;
  if (st === 'QUESTION') return 'badge-emerald';
  if (st === 'LOBBY' || st === 'REVEAL') return 'badge-gold';
  if (st === 'FINISHED') return 'badge-cyan';
  return 'badge-purple';
});

const giftTiers = computed(() => {
  if (cwState.value?.giftTiers?.length) return cwState.value.giftTiers;
  return [
    { key: 'LETTER', minCoins: 1, maxCoins: 9, icon: '🌹', name: 'Mở 1 Ô Chữ', description: 'Lật 1 chữ cái +50 điểm.' },
    { key: 'HINT_TIME', minCoins: 10, maxCoins: 98, icon: '💡', name: 'Gợi Ý Vàng & +10s', description: 'Mở gợi ý nghĩa +10s +150 điểm.' },
    { key: 'DOUBLE', minCoins: 99, maxCoins: 499, icon: '⚡', name: 'Nhân Đôi Điểm x2', description: 'x2 điểm 2 câu + mở 2 chữ +400đ.' },
    { key: 'SUPER_REVEAL', minCoins: 500, maxCoins: null, icon: '👑', name: 'Siêu Phá Đảo', description: 'Mở 50% ô chữ + gợi ý +1200đ.' },
  ];
});

function formatConnectionState(state: string) {
  const map: Record<string, string> = {
    DISCONNECTED: 'Chưa kết nối',
    CONNECTING: 'Đang kết nối...',
    CONNECTED: 'Đang nhận LIVE',
    RECONNECTING: 'Đang kết nối lại...',
    ERROR: 'Lỗi kết nối',
  };
  return map[state] || state;
}

function formatCwStatus(status: string) {
  const map: Record<string, string> = {
    IDLE: 'IDLE · Chưa mở',
    LOBBY: 'LOBBY · Chờ người chơi',
    QUESTION: 'QUESTION · Đang đoán chữ',
    REVEAL: 'REVEAL · Công bố đáp án',
    FINISHED: 'FINISHED · Kết thúc',
  };
  return map[status] || status;
}

function applyCwState(s: any, syncConfig = false) {
  if (!s) return;
  cwState.value = s;
  if (s.secret) {
    secretInfo.value = { puzzleIndex: s.puzzleIndex, ...s.secret };
  }
  if (syncConfig && s.config) {
    configForm.puzzleCount = s.config.puzzleCount ?? configForm.puzzleCount;
    configForm.timePerPuzzle = s.config.timePerPuzzle ?? configForm.timePerPuzzle;
    configForm.revealSeconds = s.config.revealSeconds ?? configForm.revealSeconds;
    configForm.autoRevealAfterSolvers = s.config.autoRevealAfterSolvers ?? configForm.autoRevealAfterSolvers;
    configForm.autoLoop = s.config.autoLoop ?? configForm.autoLoop;
  }
}

async function loadInitial() {
  try {
    const [cwRes, ttRes, roomRes] = await Promise.all([
      api.catchwordState(roomCode.value, true),
      api.getTikTokStatus(roomCode.value),
      api.getRoom(roomCode.value).catch(() => null),
    ]);
    applyCwState(cwRes, true);
    if (ttRes) tiktokStatus.value = ttRes;
    if (roomRes?.roomState?.tiktokUsername) {
      tiktokUsernameInput.value = roomRes.roomState.tiktokUsername;
    }
  } catch (err: any) {
    showToast(err?.message || 'Không thể tải trạng thái Đuổi Hình Bắt Chữ', 'error');
  }
}

async function handleConnectTikTok() {
  if (!tiktokUsernameInput.value.trim()) {
    showToast('Vui lòng nhập username TikTok', 'error');
    return;
  }
  isConnectingTikTok.value = true;
  try {
    const res = await api.connectTikTok(roomCode.value, tiktokUsernameInput.value);
    tiktokStatus.value = res;
    if (res.state === 'CONNECTED') {
      showToast(`Đã kết nối tới phiên LIVE của @${res.username}`, 'success');
    } else if (res.error) {
      showToast(res.error, 'error');
    }
  } catch (err: any) {
    showToast(err?.message || 'Lỗi kết nối TikTok LIVE', 'error');
  } finally {
    isConnectingTikTok.value = false;
  }
}

async function handleDisconnectTikTok() {
  try {
    tiktokStatus.value = await api.disconnectTikTok(roomCode.value);
    showToast('Đã ngắt kết nối TikTok LIVE', 'info');
  } catch (err: any) {
    showToast(err?.message || 'Lỗi ngắt kết nối', 'error');
  }
}

async function saveConfig() {
  try {
    applyCwState(await api.catchwordConfig(roomCode.value, { ...configForm }), true);
    showToast('Đã lưu cấu hình Đuổi Hình Bắt Chữ!', 'success');
  } catch (err: any) {
    showToast(err?.message || 'Lỗi lưu cấu hình', 'error');
  }
}

async function handleOpenLobby() {
  try {
    await api.catchwordConfig(roomCode.value, { ...configForm });
    applyCwState(await api.catchwordLobby(roomCode.value));
    showToast('Đã mở sảnh chờ Đuổi Hình Bắt Chữ!', 'success');
  } catch (err: any) {
    showToast(err?.message || 'Lỗi mở sảnh chờ', 'error');
  }
}

async function handleStart() {
  try {
    await api.catchwordConfig(roomCode.value, { ...configForm });
    applyCwState(await api.catchwordStart(roomCode.value));
    showToast('Trận Đuổi Hình Bắt Chữ đang bắt đầu!', 'success');
  } catch (err: any) {
    showToast(err?.message || 'Lỗi bắt đầu trận', 'error');
  }
}

async function handleRevealLetter() {
  try {
    applyCwState(await api.catchwordRevealLetter(roomCode.value, 1));
    showToast('Đã lật mở 1 chữ cái bí mật!', 'info');
  } catch (err: any) {
    showToast(err?.message || 'Lỗi mở chữ cái', 'error');
  }
}

async function handleUnlockHint() {
  try {
    applyCwState(await api.catchwordUnlockHint(roomCode.value));
    showToast('Đã mở gợi ý nghĩa từ khóa!', 'info');
  } catch (err: any) {
    showToast(err?.message || 'Lỗi mở gợi ý', 'error');
  }
}

async function handleNext() {
  try {
    applyCwState(await api.catchwordNext(roomCode.value));
  } catch (err: any) {
    showToast(err?.message || 'Lỗi chuyển câu', 'error');
  }
}

async function handleFinish() {
  try {
    applyCwState(await api.catchwordFinish(roomCode.value));
    showToast('Đã kết thúc trận Đuổi Hình Bắt Chữ!', 'info');
  } catch (err: any) {
    showToast(err?.message || 'Lỗi kết thúc trận', 'error');
  }
}

async function handleStop() {
  try {
    applyCwState(await api.catchwordStop(roomCode.value));
    secretInfo.value = null;
    showToast('Đã đóng game Đuổi Hình Bắt Chữ.', 'info');
  } catch (err: any) {
    showToast(err?.message || 'Lỗi đóng game', 'error');
  }
}

async function runSim(kind: string, opts: { coins?: number; count?: number } = {}) {
  try {
    if (cwState.value.status === 'IDLE') {
      await api.catchwordLobby(roomCode.value);
    }
    const res = await api.catchwordSimulate(roomCode.value, { kind, ...opts });
    applyCwState(res);
    showToast(`Đã chạy giả lập: ${kind}`, 'success');
  } catch (err: any) {
    showToast(err?.message || 'Lỗi giả lập', 'error');
  }
}

const aiTopic = ref('Ca dao tục ngữ Việt Nam');
const aiCount = ref(5);
const isGeneratingAi = ref(false);

async function handleGenerateAiCatchwords() {
  if (!aiTopic.value.trim()) {
    showToast('Vui lòng nhập chủ đề câu đố', 'error');
    return;
  }
  isGeneratingAi.value = true;
  showToast('Đang kết nối AI sinh câu đố...', 'info');
  try {
    const res = await api.generateAiCatchwords({
      topic: aiTopic.value,
      count: aiCount.value,
      autoSave: true,
    });
    await loadInitial();
    showToast(`Đã sinh thành công ${res.count || 0} câu đố AI và lưu vào ngân hàng!`, 'success');
  } catch (err: any) {
    showToast(`Lỗi sinh câu đố AI: ${err.message}`, 'error');
  } finally {
    isGeneratingAi.value = false;
  }
}

async function submitCustomPuzzle() {
  try {
    const created = await api.catchwordAddPuzzle({
      category: 'Tự tạo bởi Streamer',
      difficulty: 'MEDIUM',
      clues: [
        { emoji: puzzleForm.emoji1, label: puzzleForm.label1 },
        { emoji: puzzleForm.emoji2, label: puzzleForm.label2 },
      ],
      answer: puzzleForm.answer,
      hint: puzzleForm.hint,
    });
    puzzleForm.emoji1 = '';
    puzzleForm.label1 = '';
    puzzleForm.emoji2 = '';
    puzzleForm.label2 = '';
    puzzleForm.answer = '';
    puzzleForm.hint = '';
    await loadInitial();
    showToast(`Đã thêm câu đố "${created.answer}" vào đầu hàng đợi trận mới!`, 'success');
  } catch (err: any) {
    showToast(err?.message || 'Không thể thêm câu đố', 'error');
  }
}

async function copyUrl(url: string) {
  try {
    await navigator.clipboard.writeText(url);
    showToast('Đã sao chép URL OBS vào bộ nhớ tạm!', 'success');
  } catch {
    showToast('Không thể sao chép tự động, vui lòng copy thủ công.', 'info');
  }
}

onMounted(async () => {
  await loadInitial();
  socket = createRoomSocket(roomCode.value);
  attachSocket(socket);
  socket.on('catchword.state', (s) => applyCwState(s));
  socket.on('catchword.secret', (sec) => {
    secretInfo.value = sec;
  });
  socket.on('tiktok.status', (status) => {
    tiktokStatus.value = status;
  });
});

onBeforeUnmount(() => {
  socket?.disconnect();
  if (toastTimer) clearTimeout(toastTimer);
});
</script>

<style scoped>
.cw-dash-page {
  min-height: 100vh;
  padding: 1.5rem 2rem 3rem;
  max-width: 1620px;
  margin: 0 auto;
  background:
    radial-gradient(circle at 12% 0%, rgba(99, 102, 241, 0.16), transparent 40%),
    radial-gradient(circle at 88% 10%, rgba(236, 72, 153, 0.14), transparent 40%);
}
.dash-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1.25rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid var(--border-subtle);
}
.topbar-brand {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}
.brand-badge {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #4f46e5, #9333ea, #ec4899);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
}
.topbar-brand h1 {
  font-size: 1.32rem;
  font-weight: 800;
}
.topbar-brand p {
  font-size: 0.85rem;
  color: var(--text-secondary);
}
.topbar-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.55rem;
}
.topbar-actions .btn {
  text-decoration: none;
  font-size: 0.86rem;
}

.toast-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1.1rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  font-weight: 700;
  border: 1px solid var(--border-subtle);
}
.toast-success {
  background: rgba(16, 185, 129, 0.16);
  border-color: rgba(16, 185, 129, 0.45);
  color: #6ee7b7;
}
.toast-error {
  background: rgba(244, 63, 94, 0.18);
  border-color: rgba(244, 63, 94, 0.45);
  color: #fda4af;
}
.toast-info {
  background: rgba(0, 240, 255, 0.14);
  border-color: rgba(0, 240, 255, 0.4);
  color: #a5f3fc;
}

.dash-main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(380px, 0.85fr);
  gap: 1.25rem;
  align-items: start;
}
.dash-col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.panel-card {
  background: var(--surface-panel);
  border: 1px solid var(--border-subtle);
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.65rem;
}
.panel-title-group {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}
.panel-title-group h2 {
  font-size: 1.05rem;
  font-weight: 800;
}
.panel-desc {
  font-size: 0.86rem;
  color: var(--text-secondary);
}
.connect-form,
.obs-url-row {
  display: flex;
  gap: 0.55rem;
}
.connect-form .input-control,
.obs-url-row .input-control {
  flex: 1;
}
.obs-copy-box label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 0.35rem;
}
.mono {
  font-family: var(--font-mono);
  font-size: 0.82rem;
}
.tiktok-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
}
.tt-metric,
.sum-chip {
  background: rgba(8, 12, 28, 0.65);
  border: 1px solid var(--border-subtle);
  border-radius: 0.65rem;
  padding: 0.55rem 0.7rem;
}
.tt-metric span,
.sum-chip span {
  display: block;
  font-size: 0.74rem;
  color: var(--text-muted);
}
.tt-metric strong,
.sum-chip strong {
  font-size: 0.88rem;
}
.connection-alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 0.85rem;
  border-radius: 0.65rem;
  background: rgba(244, 63, 94, 0.14);
  border: 1px solid rgba(244, 63, 94, 0.4);
  color: #fda4af;
  font-size: 0.84rem;
}

.secret-box {
  background: rgba(250, 204, 21, 0.1);
  border: 1px solid rgba(250, 204, 21, 0.45);
  border-radius: 0.75rem;
  padding: 0.7rem 0.9rem;
}
.secret-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.84rem;
}
.secret-ans {
  font-size: 1.05rem;
  color: #fde047;
  font-weight: 900;
}
.secret-hint {
  font-size: 0.8rem;
  color: #fef08a;
  margin-top: 0.25rem;
}

.cw-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
}
.config-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.65rem;
}
.form-field label {
  display: block;
  font-size: 0.76rem;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}
.control-actions-wrap,
.sim-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.sim-gifts-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.creator-box {
  background: rgba(8, 12, 28, 0.55);
  border: 1px solid var(--border-subtle);
  border-radius: 0.85rem;
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.creator-box h3 {
  font-size: 0.9rem;
  font-weight: 800;
}
.creator-row {
  display: grid;
  grid-template-columns: 110px 1fr 110px 1fr;
  gap: 0.45rem;
}
.creator-row2 {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.45rem;
}

.scripts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
}
.script-box {
  background: rgba(8, 12, 28, 0.55);
  border: 1px solid var(--border-subtle);
  border-radius: 0.85rem;
  padding: 0.85rem 0.95rem;
}
.script-box.free {
  border-top: 3px solid var(--accent-emerald);
}
.script-box.gift {
  border-top: 3px solid var(--accent-gold);
}
.script-box h3 {
  font-size: 0.9rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}
.script-box ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  font-size: 0.82rem;
  color: var(--text-secondary);
}
.script-box code {
  background: rgba(0, 240, 255, 0.14);
  color: var(--accent-cyan);
  padding: 0.05rem 0.35rem;
  border-radius: 4px;
  font-family: var(--font-mono);
}
.tier-list {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.tier-item {
  background: rgba(250, 204, 21, 0.06);
  border: 1px solid rgba(250, 204, 21, 0.25);
  border-radius: 0.6rem;
  padding: 0.45rem 0.65rem;
}

.ai-box {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(250, 204, 21, 0.3);
  border-radius: 0.85rem;
  padding: 0.85rem 1rem;
}
.ai-input-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.count-sel {
  max-width: 110px;
}
.tier-item strong {
  display: block;
  font-size: 0.82rem;
  color: #fef08a;
}
.tier-item small {
  font-size: 0.76rem;
  color: var(--text-secondary);
}

.preview-col {
  position: sticky;
  top: 1rem;
}
.preview-card .btn-sm {
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  text-decoration: none;
}
.embedded-wrap {
  border-radius: 0.875rem;
  overflow: hidden;
  border: 1px solid rgba(0, 240, 255, 0.3);
}
.icon-cyan {
  color: var(--accent-cyan);
}
.icon-gold {
  color: var(--accent-gold);
}
.icon-purple {
  color: var(--accent-purple-bright);
}

@media (max-width: 1120px) {
  .dash-main-grid {
    grid-template-columns: 1fr;
  }
  .preview-col {
    position: static;
  }
}
@media (max-width: 720px) {
  .cw-dash-page {
    padding: 1rem 0.85rem 2.5rem;
  }
  .tiktok-metrics,
  .cw-summary,
  .config-grid,
  .sim-gifts-row,
  .creator-row,
  .creator-row2,
  .scripts-grid {
    grid-template-columns: 1fr;
  }
  .connect-form,
  .obs-url-row {
    flex-direction: column;
  }
}
</style>
