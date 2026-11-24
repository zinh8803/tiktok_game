<template>
  <div class="tug-dash-page">
    <!-- Top Header -->
    <header class="dash-topbar">
      <div class="topbar-brand">
        <div class="brand-badge">🪢</div>
        <div>
          <h1>Kéo Co Tri Thức — Bàn Điều Khiển Streamer</h1>
          <p>Game đấu đội TikTok LIVE · Người chơi comment miễn phí &amp; tặng quà tung kỹ năng</p>
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
        <router-link to="/admin" class="btn btn-secondary">
          <Database :size="16" />
          <span>📚 Ngân hàng câu hỏi</span>
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

    <!-- Main 2-Column Layout -->
    <div class="dash-main-grid">
      <!-- LEFT COLUMN: Controls, Simulator & Scripts -->
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
            Nhập <strong>@username</strong> kênh TikTok đang mở LIVE (không cần mật khẩu). Khi game Kéo Co đang mở, bình luận &amp; quà tặng của phòng sẽ tự động điều phối vào trận Kéo Co.
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
            <button
              v-else
              type="button"
              class="btn btn-danger"
              @click="handleDisconnectTikTok"
            >
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

        <!-- 2. Bảng Điều Khiển Trận Đấu Kéo Co -->
        <section class="panel-card">
          <div class="panel-header">
            <div class="panel-title-group">
              <Settings :size="20" class="icon-purple" />
              <h2>2. Bảng Điều Khiển Trận Đấu Kéo Co</h2>
            </div>
            <span class="badge" :class="tugStatusBadgeClass">
              {{ formatTugStatus(tugState.status) }}
            </span>
          </div>

          <div class="tug-live-summary tabular-nums">
            <div class="sum-chip">
              <span>Vị trí dây</span>
              <strong :class="ropeColorClass">{{ ropeSummaryText }}</strong>
            </div>
            <div class="sum-chip">
              <span>Tiến độ câu hỏi</span>
              <strong>
                {{ tugState.questionIndex >= 0 ? tugState.questionIndex + 1 : 0 }} / {{ tugState.totalQuestions || configForm.questionCount }}
              </strong>
            </div>
            <div class="sum-chip">
              <span>Quân số Đỏ / Xanh</span>
              <strong>🔴 {{ tugState.teams?.RED?.count || 0 }} vs {{ tugState.teams?.BLUE?.count || 0 }} 🔵</strong>
            </div>
            <div class="sum-chip">
              <span>Tổng xu quà</span>
              <strong class="text-gold">🪙 {{ tugState.totalGiftCoins || 0 }}</strong>
            </div>
          </div>

          <div class="config-grid tabular-nums">
            <div class="form-field">
              <label>Số câu hỏi / trận (3–100)</label>
              <input
                v-model.number="configForm.questionCount"
                type="number"
                min="3"
                max="100"
                class="input-control"
              />
            </div>
            <div class="form-field">
              <label>Giây / câu (8–60s)</label>
              <input
                v-model.number="configForm.timePerQuestion"
                type="number"
                min="8"
                max="60"
                class="input-control"
              />
            </div>
            <div class="form-field">
              <label>Giây công bố đáp án (3–15s)</label>
              <input
                v-model.number="configForm.revealSeconds"
                type="number"
                min="3"
                max="15"
                class="input-control"
              />
            </div>
          </div>

          <div class="control-actions-wrap">
            <button type="button" class="btn btn-secondary" @click="saveTugConfig">
              <Save :size="15" />
              <span>Lưu cấu hình</span>
            </button>
            <button type="button" class="btn btn-purple" @click="handleOpenLobby">
              <span>🚪 Mở sảnh chờ (Chọn đội)</span>
            </button>
            <button type="button" class="btn btn-cyan" @click="handleStart">
              <Play :size="15" />
              <span>▶️ Bắt đầu trận đấu</span>
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              :disabled="tugState.status !== 'QUESTION' && tugState.status !== 'REVEAL'"
              @click="handleNext"
            >
              <SkipForward :size="15" />
              <span>⏭️ Câu tiếp / Công bố ngay</span>
            </button>
            <button
              type="button"
              class="btn btn-gold"
              :disabled="tugState.status === 'IDLE'"
              @click="handleFinish"
            >
              <Trophy :size="15" />
              <span>🏁 Kết thúc trận</span>
            </button>
            <button
              type="button"
              class="btn btn-danger"
              :disabled="tugState.status === 'IDLE'"
              @click="handleStop"
            >
              <Square :size="15" />
              <span>⏹️ Đóng game (Trả về Trắc nghiệm)</span>
            </button>
          </div>
        </section>

        <!-- 3. Điều chỉnh bố cục màn hình LIVE -->
        <LiveStageCalibrator
          mode="panel"
          :calib="calib"
          :showAvatarSize="true"
          @apply-preset="applyPreset"
          @change="broadcastCalib"
          @reset="resetCalib"
        />

        <!-- 4. Bộ Giả Lập (Simulator) -->
        <section class="panel-card">
          <div class="panel-header">
            <div class="panel-title-group">
              <Sparkles :size="20" class="icon-gold" />
              <h2>3. Bộ Giả Lập (Simulator) — Test nhanh không cần LIVE</h2>
            </div>
            <div class="sim-team-toggle">
              <span>Quà tặng cho:</span>
              <button
                type="button"
                class="team-pill red"
                :class="{ active: simGiftTeam === 'RED' }"
                @click="simGiftTeam = 'RED'"
              >
                🔴 Đội Đỏ
              </button>
              <button
                type="button"
                class="team-pill blue"
                :class="{ active: simGiftTeam === 'BLUE' }"
                @click="simGiftTeam = 'BLUE'"
              >
                🔵 Đội Xanh
              </button>
            </div>
          </div>

          <div class="sim-grid">
            <button type="button" class="btn btn-secondary" @click="runSim('CROWD', { count: 16 })">
              👥 +16 Người chơi vào 2 đội
            </button>
            <button type="button" class="btn btn-secondary" @click="runSim('JOIN_RED', { count: 3 })">
              🔴 +3 Đội Đỏ
            </button>
            <button type="button" class="btn btn-secondary" @click="runSim('JOIN_BLUE', { count: 3 })">
              🔵 +3 Đội Xanh
            </button>
            <button type="button" class="btn btn-cyan" @click="runSim('ANSWER_WAVE')">
              💬 Đợt trả lời A/B/C/D
            </button>
            <button type="button" class="btn btn-purple" @click="runSim('SPAM')">
              💪 Đợt spam "kéo"
            </button>
          </div>

          <div class="sim-gifts-row">
            <button type="button" class="btn btn-gold" @click="runSim('GIFT', { coins: 1, team: simGiftTeam })">
              🌹 Quà 1 xu (Tiếp sức)
            </button>
            <button type="button" class="btn btn-gold" @click="runSim('GIFT', { coins: 30, team: simGiftTeam })">
              ⚡ Quà 30 xu (Nhân đôi x2)
            </button>
            <button type="button" class="btn btn-gold" @click="runSim('GIFT', { coins: 199, team: simGiftTeam })">
              ❄️ Quà 199 xu (Đóng băng 10s)
            </button>
            <button type="button" class="btn btn-gold" @click="runSim('GIFT', { coins: 1000, team: simGiftTeam })">
              🌪️ Quà 1000 xu (Siêu bão + 50:50)
            </button>
          </div>
        </section>

        <!-- 4. Kịch Bản Người Chơi Free & Kịch Bản Tặng Quà -->
        <section class="panel-card">
          <div class="panel-header">
            <div class="panel-title-group">
              <BookOpen :size="20" class="icon-cyan" />
              <h2>4. Kịch Bản Người Chơi Free &amp; Tặng Quà (Đọc trên LIVE)</h2>
            </div>
            <span class="badge badge-emerald">Kịch bản chuẩn TikTok LIVE</span>
          </div>

          <div class="scripts-grid">
            <!-- Free Script -->
            <div class="script-box free">
              <h3>🆓 Luồng Người Chơi FREE (0 xu)</h3>
              <ul>
                <li>
                  <strong>Bước 1 — Chọn phe:</strong> Comment <code>1</code> / <code>đỏ</code> để vào <strong>Đội Đỏ</strong>, hoặc <code>2</code> / <code>xanh</code> để vào <strong>Đội Xanh</strong>. (Ai trả lời luôn mà chưa chọn sẽ tự xếp cân bằng đội).
                </li>
                <li>
                  <strong>Bước 2 — Giải đố kéo dây:</strong> Comment <code>A</code>, <code>B</code>, <code>C</code>, <code>D</code> (hoặc <code>AA</code>, <code>chọn B</code>). Trả lời đúng kéo từ <strong>+4 đến +7 lực</strong> tùy tốc độ!
                </li>
                <li>
                  <strong>Bước 3 — Cổ vũ tăng tốc:</strong> Spam <code>kéo</code>, <code>cố lên</code>, <code>💪</code> mỗi 1.5s để tiếp sức <strong>+0.5 lực</strong> trực tiếp cho dây.
                </li>
              </ul>
            </div>

            <!-- Gift Script -->
            <div class="script-box gift">
              <h3>🎁 Luồng Kịch Bản Tặng Quà (4 Mốc Kỹ Năng)</h3>
              <div class="tier-list">
                <div v-for="tier in giftTiers" :key="tier.key" class="tier-item">
                  <div class="tier-head">
                    <span class="tier-icon">{{ tier.icon }}</span>
                    <div>
                      <strong>{{ tier.name }}</strong>
                      <small class="tier-coins">
                        {{ tier.minCoins }}{{ tier.maxCoins ? '–' + tier.maxCoins : '+' }} xu · {{ tier.example }}
                      </small>
                    </div>
                  </div>
                  <p>{{ tier.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- RIGHT COLUMN: Live Embedded OBS Preview -->
      <div class="dash-col preview-col">
        <section class="panel-card preview-card">
          <div class="panel-header">
            <div class="panel-title-group">
              <Monitor :size="20" class="icon-cyan" />
              <h2>Xem Trước Trực Tiếp Màn Hình OBS (Live)</h2>
            </div>
            <a :href="obsOverlayUrl" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">
              <ExternalLink :size="14" />
              <span>Mở tab riêng</span>
            </a>
          </div>
          <div class="embedded-tug-wrap">
            <TugOverlayView :roomCodeProp="roomCode" :embedded="true" />
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
  Database,
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
import TugOverlayView from './TugOverlayView.vue';
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

const tugState = ref<any>({
  status: 'IDLE',
  rope: 0,
  questionIndex: -1,
  totalQuestions: 15,
  teams: { RED: { count: 0, contribution: 0 }, BLUE: { count: 0, contribution: 0 } },
  giftTiers: [],
  totalGiftCoins: 0,
});

const configForm = reactive({
  questionCount: 15,
  timePerQuestion: 15,
  revealSeconds: 5,
});

const simGiftTeam = ref<'RED' | 'BLUE'>('RED');
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
  if (typeof window === 'undefined') return `/tug/${roomCode.value}`;
  return `${window.location.origin}/tug/${roomCode.value}`;
});

const connectionBadgeClass = computed(() => {
  const st = tiktokStatus.value?.state;
  if (st === 'CONNECTED') return 'badge-emerald';
  if (st === 'CONNECTING' || st === 'RECONNECTING') return 'badge-gold';
  if (st === 'ERROR') return 'badge-rose';
  return 'badge-purple';
});

const tugStatusBadgeClass = computed(() => {
  const st = tugState.value?.status;
  if (st === 'QUESTION') return 'badge-emerald';
  if (st === 'LOBBY' || st === 'REVEAL') return 'badge-gold';
  if (st === 'FINISHED') return 'badge-cyan';
  return 'badge-purple';
});

const ropeSummaryText = computed(() => {
  const r = Number(tugState.value?.rope || 0);
  if (Math.abs(r) < 0.5) return '0 (Cân bằng)';
  return r < 0 ? `🔴 Đỏ dẫn ${Math.abs(r)}` : `🔵 Xanh dẫn ${Math.abs(r)}`;
});

const ropeColorClass = computed(() => {
  const r = Number(tugState.value?.rope || 0);
  if (r <= -0.5) return 'text-red';
  if (r >= 0.5) return 'text-blue';
  return '';
});

const giftTiers = computed(() => {
  if (tugState.value?.giftTiers?.length) return tugState.value.giftTiers;
  return [
    {
      key: 'BOOST',
      minCoins: 1,
      maxCoins: 9,
      icon: '🌹',
      name: 'Tiếp Sức',
      example: 'Hoa hồng, TikTok, GG (1–9 xu)',
      description: 'Kéo ngay +2 lực mỗi xu cho đội của bạn (tối đa +15/lần).',
    },
    {
      key: 'DOUBLE',
      minCoins: 10,
      maxCoins: 98,
      icon: '⚡',
      name: 'Nhân Đôi x2',
      example: 'Kẹo bông, Nước hoa mini… (10–98 xu)',
      description: '+8 lực kéo & nhân đôi lực của mọi câu trả lời đúng trong câu này và câu kế tiếp.',
    },
    {
      key: 'FREEZE',
      minCoins: 99,
      maxCoins: 499,
      icon: '❄️',
      name: 'Đóng Băng Đối Thủ',
      example: 'Mũ cún, Nước hoa, Donut… (99–499 xu)',
      description: '+12 lực kéo & đóng băng đội bạn 10 giây (không thể tiếp sức, câu đúng chỉ tính 50%).',
    },
    {
      key: 'STORM',
      minCoins: 500,
      maxCoins: null,
      icon: '🌪️',
      name: 'Siêu Bão Tri Thức',
      example: 'Thiên hà, Sư tử, Xe hơi… (500+ xu)',
      description: 'Kéo cực mạnh +30 & mở gợi ý 50:50 loại bỏ 2 đáp án sai cho cả phòng.',
    },
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

function formatTugStatus(status: string) {
  const map: Record<string, string> = {
    IDLE: 'IDLE · Chưa mở',
    LOBBY: 'LOBBY · Đang chọn đội',
    QUESTION: 'QUESTION · Đang thi đấu',
    REVEAL: 'REVEAL · Công bố đáp án',
    FINISHED: 'FINISHED · Đã kết thúc',
  };
  return map[status] || status;
}

function applyTugState(s: any, syncConfig = false) {
  if (!s) return;
  tugState.value = s;
  if (syncConfig && s.config) {
    configForm.questionCount = s.config.questionCount ?? configForm.questionCount;
    configForm.timePerQuestion = s.config.timePerQuestion ?? configForm.timePerQuestion;
    configForm.revealSeconds = s.config.revealSeconds ?? configForm.revealSeconds;
  }
}

async function loadInitial() {
  try {
    const [tState, ttStatus, roomRes] = await Promise.all([
      api.tugState(roomCode.value),
      api.getTikTokStatus(roomCode.value),
      api.getRoom(roomCode.value).catch(() => null),
    ]);
    applyTugState(tState, true);
    if (ttStatus) tiktokStatus.value = ttStatus;
    if (roomRes?.roomState?.tiktokUsername) {
      tiktokUsernameInput.value = roomRes.roomState.tiktokUsername;
    }
  } catch (err: any) {
    showToast(err?.message || 'Không thể tải trạng thái Kéo Co', 'error');
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

async function saveTugConfig() {
  try {
    const res = await api.tugConfig(roomCode.value, { ...configForm });
    applyTugState(res, true);
    showToast('Đã lưu cấu hình Kéo Co Tri Thức!', 'success');
  } catch (err: any) {
    showToast(err?.message || 'Lỗi lưu cấu hình', 'error');
  }
}

async function handleOpenLobby() {
  try {
    await api.tugConfig(roomCode.value, { ...configForm });
    applyTugState(await api.tugLobby(roomCode.value));
    showToast('Đã mở sảnh chờ! Người xem comment 1 (Đỏ) hoặc 2 (Xanh) để vào đội.', 'success');
  } catch (err: any) {
    showToast(err?.message || 'Lỗi mở sảnh chờ', 'error');
  }
}

async function handleStart() {
  try {
    await api.tugConfig(roomCode.value, { ...configForm });
    applyTugState(await api.tugStart(roomCode.value));
    showToast('Trận Kéo Co Tri Thức đang bắt đầu!', 'success');
  } catch (err: any) {
    showToast(err?.message || 'Không thể bắt đầu trận đấu', 'error');
  }
}

async function handleNext() {
  try {
    applyTugState(await api.tugNext(roomCode.value));
  } catch (err: any) {
    showToast(err?.message || 'Lỗi chuyển câu', 'error');
  }
}

async function handleFinish() {
  try {
    applyTugState(await api.tugFinish(roomCode.value));
    showToast('Đã kết thúc trận đấu Kéo Co!', 'info');
  } catch (err: any) {
    showToast(err?.message || 'Lỗi kết thúc trận', 'error');
  }
}

async function handleStop() {
  try {
    applyTugState(await api.tugStop(roomCode.value));
    showToast('Đã đóng game Kéo Co và trả quyền xử lý về game Trắc nghiệm.', 'info');
  } catch (err: any) {
    showToast(err?.message || 'Lỗi đóng game', 'error');
  }
}

async function runSim(kind: string, opts: { coins?: number; team?: string; count?: number } = {}) {
  try {
    if (tugState.value.status === 'IDLE') {
      await api.tugLobby(roomCode.value);
    }
    const res = await api.tugSimulate(roomCode.value, { kind, ...opts });
    applyTugState(res);
    const labels: Record<string, string> = {
      CROWD: 'Đã thêm +16 người chơi chia đều vào 2 đội!',
      JOIN_RED: 'Đã thêm +3 người chơi vào Đội Đỏ!',
      JOIN_BLUE: 'Đã thêm +3 người chơi vào Đội Xanh!',
      ANSWER_WAVE:
        tugState.value.status === 'QUESTION'
          ? 'Đã gửi đợt bình luận trả lời A/B/C/D từ người chơi!'
          : 'Hãy bắt đầu câu hỏi trước khi giả lập đợt trả lời A/B/C/D.',
      SPAM: 'Đã gửi đợt spam "kéo" tiếp sức!',
      GIFT: `Đã kích hoạt quà ${opts.coins} xu cho Đội ${opts.team === 'BLUE' ? 'Xanh' : 'Đỏ'}!`,
    };
    showToast(labels[kind] || 'Đã chạy giả lập!', kind === 'ANSWER_WAVE' && tugState.value.status !== 'QUESTION' ? 'info' : 'success');
  } catch (err: any) {
    showToast(err?.message || 'Lỗi giả lập sự kiện', 'error');
  }
}

async function copyUrl(url: string) {
  try {
    await navigator.clipboard.writeText(url);
    showToast('Đã sao chép URL màn hình OBS vào bộ nhớ tạm!', 'success');
  } catch {
    showToast('Không thể tự động sao chép, vui lòng bôi đen và copy.', 'info');
  }
}

onMounted(async () => {
  await loadInitial();
  socket = createRoomSocket(roomCode.value);
  attachSocket(socket);
  socket.on('tug.state', (s) => applyTugState(s));
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
.tug-dash-page {
  min-height: 100vh;
  padding: 1.5rem 2rem 3rem;
  max-width: 1620px;
  margin: 0 auto;
  background:
    radial-gradient(circle at 12% 0%, rgba(244, 63, 94, 0.14), transparent 40%),
    radial-gradient(circle at 88% 10%, rgba(0, 240, 255, 0.12), transparent 40%);
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
  background: linear-gradient(135deg, #e11d48, #7c3aed, #0284c7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  box-shadow: 0 8px 20px rgba(124, 58, 237, 0.35);
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

.toast-banner button {
  font-size: 0.8rem;
  opacity: 0.85;
  text-decoration: underline;
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

.connect-form {
  display: flex;
  gap: 0.6rem;
}

.connect-form .input-control {
  flex: 1;
}

.tiktok-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.65rem;
}

.tt-metric {
  background: rgba(8, 12, 28, 0.65);
  border: 1px solid var(--border-subtle);
  border-radius: 0.65rem;
  padding: 0.6rem 0.75rem;
}

.tt-metric span {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.tt-metric strong {
  font-size: 0.9rem;
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

.obs-copy-box label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 0.35rem;
}

.obs-url-row {
  display: flex;
  gap: 0.5rem;
}

.obs-url-row .mono {
  font-family: var(--font-mono);
  font-size: 0.82rem;
}

.tug-live-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
}

.sum-chip {
  background: rgba(8, 12, 28, 0.65);
  border: 1px solid var(--border-subtle);
  border-radius: 0.65rem;
  padding: 0.55rem 0.7rem;
}

.sum-chip span {
  display: block;
  font-size: 0.72rem;
  color: var(--text-muted);
}

.sum-chip strong {
  font-size: 0.88rem;
  font-weight: 800;
}

.text-red {
  color: #fb7185;
}

.text-blue {
  color: #38bdf8;
}

.text-gold {
  color: var(--accent-gold);
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.7rem;
}

.form-field label {
  display: block;
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-bottom: 0.3rem;
}

.control-actions-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.sim-team-toggle {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.team-pill {
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
  border: 1px solid var(--border-subtle);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-secondary);
}

.team-pill.red.active {
  background: rgba(225, 29, 72, 0.3);
  border-color: #fb7185;
  color: #fff;
}

.team-pill.blue.active {
  background: rgba(2, 132, 199, 0.3);
  border-color: #38bdf8;
  color: #fff;
}

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

.scripts-grid {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 0.85rem;
}

.script-box {
  background: rgba(8, 12, 28, 0.6);
  border: 1px solid var(--border-subtle);
  border-radius: 0.85rem;
  padding: 0.9rem 1rem;
}

.script-box.free {
  border-top: 3px solid var(--accent-emerald);
}

.script-box.gift {
  border-top: 3px solid var(--accent-gold);
}

.script-box h3 {
  font-size: 0.94rem;
  font-weight: 800;
  margin-bottom: 0.6rem;
}

.script-box ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  font-size: 0.83rem;
  color: var(--text-secondary);
}

.script-box code {
  background: rgba(0, 240, 255, 0.12);
  color: var(--accent-cyan);
  padding: 0.08rem 0.38rem;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
}

.tier-list {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.tier-item {
  background: rgba(250, 204, 21, 0.06);
  border: 1px solid rgba(250, 204, 21, 0.25);
  border-radius: 0.65rem;
  padding: 0.55rem 0.7rem;
}

.tier-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.2rem;
}

.tier-icon {
  font-size: 1.3rem;
}

.tier-head strong {
  display: block;
  font-size: 0.84rem;
  color: #fef08a;
}

.tier-coins {
  display: block;
  font-size: 0.73rem;
  color: var(--text-muted);
}

.tier-item p {
  font-size: 0.79rem;
  color: var(--text-secondary);
  line-height: 1.35;
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

.embedded-tug-wrap {
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
  .tug-dash-page {
    padding: 1rem 0.85rem 2.5rem;
  }
  .tiktok-metrics,
  .tug-live-summary,
  .config-grid,
  .sim-gifts-row,
  .scripts-grid {
    grid-template-columns: 1fr;
  }
  .connect-form,
  .obs-url-row {
    flex-direction: column;
  }
}
</style>
