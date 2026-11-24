<template>
  <div class="xw-dash-page">
    <!-- Top Header -->
    <header class="dash-topbar">
      <div class="topbar-brand">
        <div class="brand-badge">🧩</div>
        <div>
          <h1>Giải Mã Ô Chữ (Crossword Battle) — Bàn Điều Khiển MC / Streamer</h1>
          <p>Mở từng hàng ngang · Hé lộ ký tự vàng · Khán giả đoán từ khóa bí mật mọi lúc (+500đ)</p>
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
        <router-link to="/catchword/dashboard" class="btn btn-secondary">
          <span>🖼️ Đuổi hình</span>
        </router-link>
        <a :href="obsOverlayUrl" target="_blank" rel="noopener" class="btn btn-cyan">
          <ExternalLink :size="16" />
          <span>📺 Mở màn hình OBS</span>
        </a>
      </nav>
    </header>

    <!-- Toast Notification -->
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

          <div class="obs-copy-box">
            <label>Link Browser Source cho OBS Studio / TikTok LIVE Studio (phòng {{ roomCode }})</label>
            <div class="obs-url-row">
              <input :value="obsOverlayUrl" readonly class="input-control mono" />
              <button type="button" class="btn btn-secondary" @click="copyUrl(obsOverlayUrl)">
                <Copy :size="15" />
                <span>Sao chép</span>
              </button>
            </div>
          </div>
        </section>

        <!-- 2. Chọn Bộ Ô Chữ & Điều Khiển Ván Chơi -->
        <section class="panel-card">
          <div class="panel-header">
            <div class="panel-title-group">
              <Settings :size="20" class="icon-purple" />
              <h2>2. Chọn Bộ Ô Chữ &amp; Điều Khiển Ván Đấu</h2>
            </div>
            <span class="badge badge-cyan">{{ xwState.status }}</span>
          </div>

          <!-- Chọn bộ câu hỏi ô chữ -->
          <div class="set-selector-row">
            <div class="form-field" style="flex: 1;">
              <label>
                📚 Ngân hàng Ô chữ:
                <strong style="color: #facc15;">
                  {{ xwState.bankTotalSets || questionSets.length }} bộ ({{ xwState.bankTotalQuestions || 1000 }}+ câu hỏi hàng ngang)
                </strong>
              </label>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <select v-model="selectedSetId" class="select-control" style="flex: 1;" @change="handleSelectSet">
                  <option v-for="s in questionSets" :key="s.id" :value="s.id">
                    {{ s.name }} — Chủ đề: {{ s.topic }} ({{ s.rows?.length || 5 }} hàng · Từ khóa: {{ s.keyword }})
                  </option>
                </select>
                <button type="button" class="btn btn-purple" @click="handlePickRandomSet">
                  🎲 Đổi bộ ngẫu nhiên
                </button>
                <button type="button" class="btn btn-gold" @click="handleGenerateBulk1000">
                  ⚡ Gen 1,000 câu hỏi
                </button>
              </div>
            </div>
          </div>

          <!-- HỘP ĐÁP ÁN BÍ MẬT DÀNH RIÊNG CHO MC -->
          <div v-if="secretData" class="secret-box">
            <div class="secret-head">
              <span>🔐 TỪ KHÓA BÍ MẬT (Chỉ hiển thị cho MC, OBS đã ẩn):</span>
              <strong class="secret-ans">{{ secretData.keyword }}</strong>
            </div>
            <p class="secret-hint">💡 Gợi ý từ khóa: {{ secretData.keywordHint }}</p>
          </div>

          <!-- Cấu hình điểm & thời gian -->
          <div class="config-grid tabular-nums">
            <div class="form-field">
              <label>Giây / hàng ngang</label>
              <input v-model.number="configForm.timePerRow" type="number" min="10" max="120" class="input-control" />
            </div>
            <div class="form-field">
              <label>Điểm đúng đầu tiên</label>
              <input v-model.number="configForm.firstRowPoints" type="number" min="10" max="1000" class="input-control" />
            </div>
            <div class="form-field">
              <label>Điểm đúng tiếp theo</label>
              <input v-model.number="configForm.subsequentRowPoints" type="number" min="0" max="500" class="input-control" />
            </div>
            <div class="form-field">
              <label>Điểm giải Từ khóa</label>
              <input v-model.number="configForm.keywordPoints" type="number" min="50" max="5000" class="input-control" />
            </div>
          </div>

          <div class="control-actions-wrap">
            <button type="button" class="btn btn-secondary" @click="handleSaveConfig">
              <Save :size="15" />
              <span>Lưu cấu hình</span>
            </button>
            <button type="button" class="btn btn-purple" @click="handleOpenWaiting">
              <span>🚪 Mở sảnh chờ</span>
            </button>
            <button type="button" class="btn btn-cyan" @click="handleStartGame">
              <Play :size="15" />
              <span>▶️ Bắt đầu ván mới</span>
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              :disabled="xwState.status === 'IDLE' || xwState.status === 'FINISHED'"
              @click="handleUnlockKeywordHint"
            >
              <span>💡 Mở gợi ý Từ khóa</span>
            </button>
            <button
              type="button"
              class="btn btn-gold"
              :disabled="xwState.status === 'IDLE' || xwState.status === 'FINISHED'"
              @click="handleStartKeywordFinal"
            >
              <span>🔥 Vòng giải mã cuối (60s)</span>
            </button>
            <button
              v-if="xwState.status !== 'PAUSED'"
              type="button"
              class="btn btn-secondary"
              :disabled="xwState.status === 'IDLE' || xwState.status === 'FINISHED'"
              @click="handlePause"
            >
              <span>⏸️ Tạm dừng</span>
            </button>
            <button
              v-else
              type="button"
              class="btn btn-cyan"
              @click="handleResume"
            >
              <span>▶️ Tiếp tục</span>
            </button>
            <button
              type="button"
              class="btn btn-gold"
              :disabled="xwState.status === 'IDLE'"
              @click="handleFinish"
            >
              <Trophy :size="15" />
              <span>🏁 Kết thúc &amp; Mở hết</span>
            </button>
            <button
              type="button"
              class="btn btn-danger"
              :disabled="xwState.status === 'IDLE'"
              @click="handleStop"
            >
              <Square :size="15" />
              <span>⏹️ Đóng game</span>
            </button>
          </div>
        </section>

        <!-- 3. Bảng Điều Khiển Từng Hàng Ngang (MC chọn hàng bất kỳ) -->
        <section class="panel-card">
          <div class="panel-header">
            <div class="panel-title-group">
              <BookOpen :size="20" class="icon-gold" />
              <h2>3. Điều Khiển Từng Hàng Ngang (Bấm chọn hàng để hỏi)</h2>
            </div>
            <div class="voice-quick">
              <button
                type="button"
                class="btn btn-sm"
                :class="voiceEnabled ? 'btn-cyan' : 'btn-secondary'"
                @click="voiceEnabled = !voiceEnabled"
              >
                {{ voiceEnabled ? '🎙️ MC AI: Bật' : '🔇 MC AI: Tắt' }}
              </button>
            </div>
          </div>

          <div class="rows-manager-list">
            <div
              v-for="r in mergedRowsForMc"
              :key="r.rowNumber"
              class="mc-row-card"
              :class="{
                active: xwState.currentRowNumber === r.rowNumber && xwState.status === 'QUESTION_ACTIVE',
                solved: r.status === 'SOLVED' || r.status === 'REVEALED',
              }"
            >
              <div class="mc-row-top">
                <div class="mc-row-title">
                  <span class="badge badge-purple">Hàng #{{ r.rowNumber }}</span>
                  <strong class="mc-ans">Đáp án: {{ r.secretAnswer }}</strong>
                  <span class="mc-keychar">Ký tự khóa #{{ r.rowNumber }}: [{{ r.keywordChar }}]</span>
                  <span class="badge" :class="rowStatusBadge(r.status)">{{ r.status }}</span>
                </div>
                <div class="mc-row-btns">
                  <button
                    type="button"
                    class="btn btn-cyan btn-sm"
                    :disabled="r.status === 'SOLVED' || r.status === 'REVEALED'"
                    @click="handleOpenRow(r.rowNumber)"
                  >
                    📢 Mở câu hỏi
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary btn-sm"
                    :disabled="r.status === 'SOLVED' || r.status === 'REVEALED'"
                    @click="handleRowHint(r.rowNumber)"
                  >
                    💡 Gợi ý
                  </button>
                  <button
                    type="button"
                    class="btn btn-gold btn-sm"
                    :disabled="r.status === 'SOLVED' || r.status === 'REVEALED'"
                    @click="handleRevealRow(r.rowNumber)"
                  >
                    ✅ Công bố &amp; Mở chữ
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary btn-sm"
                    :disabled="r.status === 'SOLVED' || r.status === 'REVEALED' || r.status === 'SKIPPED'"
                    @click="handleSkipRow(r.rowNumber)"
                  >
                    ⏭️ Bỏ qua
                  </button>
                </div>
              </div>
              <p class="mc-q-text">❓ {{ r.question }}</p>
              <div v-if="r.solversCount > 0" class="mc-solvers-info">
                🎯 Đã có <strong>{{ r.solversCount }}</strong> người trả lời đúng
                <template v-if="r.firstSolver"> · Nhanh nhất: <strong>{{ r.firstSolver.nickname }}</strong></template>
              </div>
            </div>
          </div>
        </section>

        <!-- 4. Bộ Giả Lập (Simulator) -->
        <section class="panel-card">
          <div class="panel-header">
            <div class="panel-title-group">
              <Sparkles :size="20" class="icon-gold" />
              <h2>4. Bộ Giả Lập (Simulator) — Test nhanh không cần TikTok LIVE</h2>
            </div>
          </div>
          <div class="sim-grid">
            <button type="button" class="btn btn-secondary" @click="runSim('JOIN_CROWD', 8)">
              👥 +8 Người chơi vào phòng
            </button>
            <button type="button" class="btn btn-cyan" @click="runSim('ROW_CORRECT')">
              🎯 1 Người trả lời ĐÚNG hàng đang mở
            </button>
            <button type="button" class="btn btn-secondary" @click="runSim('ROW_WRONG')">
              💬 1 Người trả lời SAI hàng ngang
            </button>
            <button type="button" class="btn btn-purple" @click="runSim('KEYWORD_WRONG')">
              🕵️ 1 Người đoán SAI Từ khóa
            </button>
            <button type="button" class="btn btn-gold" @click="runSim('KEYWORD_CORRECT')">
              👑 1 Người giải mã ĐÚNG Từ khóa (+500đ)
            </button>
          </div>
        </section>

        <!-- 5. AI Tạo Bộ Ô Chữ & Tạo Thủ Công -->
        <section class="panel-card">
          <div class="panel-header">
            <div class="panel-title-group">
              <Sparkles :size="20" class="icon-cyan" />
              <h2>5. AI Sinh Bộ Câu Hỏi Ô Chữ Tự Động</h2>
            </div>
          </div>
          <div class="ai-row">
            <input
              v-model="aiTopic"
              class="input-control"
              placeholder="Nhập chủ đề (VD: Lịch sử Việt Nam, Công nghệ, Bóng đá...)"
            />
            <input
              v-model="aiKeyword"
              class="input-control"
              style="max-width: 180px;"
              placeholder="Từ khóa (tùy chọn)"
            />
            <button
              type="button"
              class="btn btn-gold"
              :disabled="isGeneratingAi"
              @click="handleGenerateAiSet"
            >
              <span>{{ isGeneratingAi ? 'Đang tạo...' : '🚀 AI Tạo Bộ Ô Chữ' }}</span>
            </button>
          </div>
        </section>
      </div>

      <!-- RIGHT COLUMN: Embedded Live Preview -->
      <div class="dash-col preview-col">
        <section class="panel-card preview-card">
          <div class="panel-header">
            <div class="panel-title-group">
              <Monitor :size="20" class="icon-cyan" />
              <h2>Xem Trước Màn Hình OBS (Realtime Preview)</h2>
            </div>
            <a :href="obsOverlayUrl" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">
              <ExternalLink :size="14" />
              <span>Mở tab riêng</span>
            </a>
          </div>
          <div class="embedded-wrap">
            <CrosswordOverlayView :roomCodeProp="roomCode" :embedded="true" />
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
  Sparkles,
  Square,
  Trophy,
} from 'lucide-vue-next';
import { api } from '../services/api';
import { createRoomSocket } from '../services/socket';
import { useAiVoice } from '../composables/useAiVoice';
import CrosswordOverlayView from './CrosswordOverlayView.vue';

const roomCode = ref('KB2026');
const { voiceEnabled } = useAiVoice();

const obsOverlayUrl = computed(() => `${window.location.origin}/crossword/${roomCode.value}`);

const toastMessage = ref('');
const toastType = ref<'success' | 'error'>('success');
function showToast(msg: string, type: 'success' | 'error' = 'success') {
  toastMessage.value = msg;
  toastType.value = type;
  setTimeout(() => {
    if (toastMessage.value === msg) toastMessage.value = '';
  }, 4000);
}

const tiktokUsernameInput = ref('');
const isConnectingTikTok = ref(false);
const tiktokStatus = ref<any>({ state: 'DISCONNECTED', eventsReceived: 0 });

const questionSets = ref<any[]>([]);
const selectedSetId = ref('');
const xwState = ref<any>({ status: 'IDLE', rows: [] });
const secretData = ref<any>(null);

const configForm = reactive({
  timePerRow: 20,
  firstRowPoints: 100,
  subsequentRowPoints: 20,
  keywordPoints: 500,
});

const aiTopic = ref('Khám phá Khoa học & Đời sống');
const aiKeyword = ref('');
const isGeneratingAi = ref(false);

let socket: Socket | null = null;

const connectionBadgeClass = computed(() => {
  if (tiktokStatus.value.state === 'CONNECTED') return 'badge-emerald';
  if (tiktokStatus.value.state === 'CONNECTING') return 'badge-gold';
  return 'badge-secondary';
});

const mergedRowsForMc = computed(() => {
  const pubRows = xwState.value.rows || [];
  const secRows = secretData.value?.rows || [];
  return pubRows.map((r: any) => {
    const sec = secRows.find((s: any) => s.rowNumber === r.rowNumber) || {};
    const cleanAns = sec.cleanAnswer || r.cleanAnswer || '';
    const pos = r.answerPosition || sec.answerPosition || 1;
    return {
      ...r,
      question: sec.question || r.question || '',
      secretAnswer: sec.answer || r.answer || '—',
      keywordChar: Array.from(cleanAns)[pos - 1] || '?',
    };
  });
});

function rowStatusBadge(st: string) {
  if (st === 'ACTIVE') return 'badge-cyan';
  if (st === 'SOLVED' || st === 'REVEALED') return 'badge-emerald';
  if (st === 'SKIPPED') return 'badge-gold';
  return 'badge-secondary';
}

async function refreshAll() {
  try {
    const [sets, st, tt] = await Promise.all([
      api.crosswordListSets(),
      api.crosswordState(roomCode.value, true),
      api.getTikTokStatus(roomCode.value),
    ]);
    questionSets.value = sets || [];
    applyFullState(st);
    tiktokStatus.value = tt || { state: 'DISCONNECTED' };
  } catch (err: any) {
    showToast(err?.message || 'Không thể tải dữ liệu Giải Mã Ô Chữ', 'error');
  }
}

function applyFullState(st: any) {
  if (!st) return;
  xwState.value = st;
  if (st.questionSetId) selectedSetId.value = st.questionSetId;
  if (st.secret) secretData.value = st.secret;
  if (st.config) {
    configForm.timePerRow = st.config.timePerRow ?? 20;
    configForm.firstRowPoints = st.config.firstRowPoints ?? 100;
    configForm.subsequentRowPoints = st.config.subsequentRowPoints ?? 20;
    configForm.keywordPoints = st.config.keywordPoints ?? 500;
  }
}

async function handleSelectSet() {
  if (!selectedSetId.value) return;
  try {
    const st = await api.crosswordSelectSet(roomCode.value, selectedSetId.value);
    applyFullState(st);
    showToast('Đã chuyển bộ câu hỏi ô chữ!');
  } catch (err: any) {
    showToast(err?.message, 'error');
  }
}

async function handlePickRandomSet() {
  try {
    const st = await api.crosswordRandomSet(roomCode.value);
    applyFullState(st);
    showToast(`🎲 Đã chọn ngẫu nhiên bộ ô chữ: "${st.questionSetName}"!`);
  } catch (err: any) {
    showToast(err?.message, 'error');
  }
}

async function handleGenerateBulk1000() {
  try {
    const res = await api.crosswordGenerateBulk(1000);
    questionSets.value = await api.crosswordListSets();
    showToast(`⚡ Đã khởi tạo thành công ${res.totalSets} bộ ô chữ (${res.totalQuestions} câu hỏi hàng ngang)!`);
  } catch (err: any) {
    showToast(err?.message, 'error');
  }
}

async function handleSaveConfig() {
  try {
    const st = await api.crosswordConfig(roomCode.value, { ...configForm });
    applyFullState(st);
    showToast('Đã lưu cấu hình điểm & thời gian!');
  } catch (err: any) {
    showToast(err?.message, 'error');
  }
}

async function handleOpenWaiting() {
  try {
    const st = await api.crosswordWaiting(roomCode.value, selectedSetId.value);
    applyFullState(st);
    showToast('Đã mở sảnh chờ Giải Mã Ô Chữ!');
  } catch (err: any) {
    showToast(err?.message, 'error');
  }
}

async function handleStartGame() {
  try {
    const st = await api.crosswordStart(roomCode.value, selectedSetId.value);
    applyFullState(st);
    showToast('🚀 Ván Giải Mã Ô Chữ đã bắt đầu! Hãy chọn 1 hàng ngang để mở câu hỏi.');
  } catch (err: any) {
    showToast(err?.message, 'error');
  }
}

async function handleOpenRow(rowNumber: number) {
  try {
    if (xwState.value.status === 'IDLE' || xwState.value.status === 'FINISHED') {
      await api.crosswordStart(roomCode.value, selectedSetId.value);
    }
    const st = await api.crosswordOpenRow(roomCode.value, rowNumber);
    applyFullState(st);
    showToast(`📢 Đã mở câu hỏi Hàng ngang số ${rowNumber}!`);
  } catch (err: any) {
    showToast(err?.message, 'error');
  }
}

async function handleRevealRow(rowNumber: number) {
  try {
    const st = await api.crosswordRevealRow(roomCode.value, rowNumber);
    applyFullState(st);
    showToast(`✅ Đã công bố Hàng ngang số ${rowNumber} và mở ký tự khóa!`);
  } catch (err: any) {
    showToast(err?.message, 'error');
  }
}

async function handleSkipRow(rowNumber: number) {
  try {
    const st = await api.crosswordSkipRow(roomCode.value, rowNumber);
    applyFullState(st);
    showToast(`⏭️ Đã bỏ qua Hàng ngang số ${rowNumber}`);
  } catch (err: any) {
    showToast(err?.message, 'error');
  }
}

async function handleRowHint(rowNumber: number) {
  try {
    const st = await api.crosswordUnlockHint(roomCode.value, { target: 'ROW', rowNumber });
    applyFullState(st);
    showToast(`💡 Đã hiển thị gợi ý cho Hàng ngang số ${rowNumber}`);
  } catch (err: any) {
    showToast(err?.message, 'error');
  }
}

async function handleUnlockKeywordHint() {
  try {
    const st = await api.crosswordUnlockHint(roomCode.value, { target: 'KEYWORD' });
    applyFullState(st);
    showToast('💡 Đã mở gợi ý Từ khóa bí mật trên màn hình LIVE!');
  } catch (err: any) {
    showToast(err?.message, 'error');
  }
}

async function handleStartKeywordFinal() {
  try {
    const st = await api.crosswordKeywordFinal(roomCode.value);
    applyFullState(st);
    showToast('🔥 Đã kích hoạt Vòng Giải Mã Từ Khóa Cuối (60s)!');
  } catch (err: any) {
    showToast(err?.message, 'error');
  }
}

async function handlePause() {
  try {
    applyFullState(await api.crosswordPause(roomCode.value));
    showToast('⏸️ Đã tạm dừng ván chơi');
  } catch (err: any) {
    showToast(err?.message, 'error');
  }
}

async function handleResume() {
  try {
    applyFullState(await api.crosswordResume(roomCode.value));
    showToast('▶️ Đã tiếp tục ván chơi');
  } catch (err: any) {
    showToast(err?.message, 'error');
  }
}

async function handleFinish() {
  try {
    applyFullState(await api.crosswordFinish(roomCode.value));
    showToast('🏁 Đã kết thúc ván và mở toàn bộ bảng ô chữ!');
  } catch (err: any) {
    showToast(err?.message, 'error');
  }
}

async function handleStop() {
  try {
    applyFullState(await api.crosswordStop(roomCode.value));
    showToast('⏹️ Đã đóng game Giải Mã Ô Chữ');
  } catch (err: any) {
    showToast(err?.message, 'error');
  }
}

async function runSim(kind: string, count?: number) {
  try {
    if (xwState.value.status === 'IDLE') {
      await api.crosswordStart(roomCode.value, selectedSetId.value);
    }
    const st = await api.crosswordSimulate(roomCode.value, { kind, count });
    applyFullState(st);
  } catch (err: any) {
    showToast(err?.message, 'error');
  }
}

async function handleGenerateAiSet() {
  if (!aiTopic.value.trim()) {
    showToast('Vui lòng nhập chủ đề!', 'error');
    return;
  }
  isGeneratingAi.value = true;
  try {
    const res = await api.generateAiCrossword({
      topic: aiTopic.value.trim(),
      keyword: aiKeyword.value.trim() || undefined,
      autoSave: true,
    });
    if (res?.questionSet) {
      questionSets.value = await api.crosswordListSets();
      selectedSetId.value = res.questionSet.id;
      const st = await api.crosswordSelectSet(roomCode.value, res.questionSet.id);
      applyFullState(st);
      showToast(`✨ Đã tạo và chọn bộ ô chữ "${res.questionSet.name}"!`);
    }
  } catch (err: any) {
    showToast(err?.message || 'Lỗi tạo bộ ô chữ AI', 'error');
  } finally {
    isGeneratingAi.value = false;
  }
}

async function handleConnectTikTok() {
  if (!tiktokUsernameInput.value.trim()) return;
  isConnectingTikTok.value = true;
  try {
    tiktokStatus.value = await api.connectTikTok(roomCode.value, tiktokUsernameInput.value.trim());
    showToast('Đã gửi yêu cầu kết nối TikTok LIVE!');
  } catch (err: any) {
    showToast(err?.message, 'error');
  } finally {
    isConnectingTikTok.value = false;
  }
}

async function handleDisconnectTikTok() {
  try {
    tiktokStatus.value = await api.disconnectTikTok(roomCode.value);
    showToast('Đã ngắt kết nối TikTok LIVE');
  } catch (err: any) {
    showToast(err?.message, 'error');
  }
}

function copyUrl(url: string) {
  navigator.clipboard?.writeText(url);
  showToast('Đã sao chép link OBS vào clipboard!');
}

onMounted(async () => {
  await refreshAll();
  socket = createRoomSocket(roomCode.value);
  socket.on('crossword.state', (st) => {
    xwState.value = st;
  });
  socket.on('crossword.secret', (sec) => {
    secretData.value = sec;
  });
  socket.on('tiktok.status', (tt) => {
    tiktokStatus.value = tt;
  });
});

onBeforeUnmount(() => {
  socket?.disconnect();
});
</script>

<style scoped>
.xw-dash-page {
  min-height: 100vh;
  padding: 1.4rem 1.8rem 2.5rem;
  max-width: 1580px;
  margin: 0 auto;
}
.dash-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
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
  background: linear-gradient(135deg, #0ea5e9, #eab308);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.65rem;
}
.topbar-brand h1 {
  font-size: 1.35rem;
  font-weight: 900;
}
.topbar-brand p {
  font-size: 0.84rem;
  color: var(--text-secondary);
}
.topbar-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.toast-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.7rem 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  font-weight: 700;
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.45);
}
.toast-error {
  background: rgba(244, 63, 94, 0.2);
  border-color: rgba(244, 63, 94, 0.45);
}
.dash-main-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.95fr;
  gap: 1.25rem;
  align-items: start;
}
.dash-col {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}
.panel-card {
  background: var(--surface-panel);
  border: 1px solid var(--border-subtle);
  border-radius: 1rem;
  padding: 1.15rem 1.25rem;
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.9rem;
}
.panel-title-group {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}
.panel-title-group h2 {
  font-size: 1.02rem;
  font-weight: 800;
}
.connect-form {
  display: flex;
  gap: 0.55rem;
  margin-bottom: 0.85rem;
}
.obs-copy-box label {
  display: block;
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-bottom: 0.3rem;
}
.obs-url-row {
  display: flex;
  gap: 0.5rem;
}
.secret-box {
  background: linear-gradient(135deg, rgba(250, 204, 21, 0.14), rgba(16, 185, 129, 0.12));
  border: 1.5px dashed rgba(250, 204, 21, 0.55);
  border-radius: 0.8rem;
  padding: 0.8rem 1rem;
  margin: 0.75rem 0;
}
.secret-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.secret-ans {
  font-size: 1.25rem;
  font-weight: 900;
  color: #facc15;
  letter-spacing: 0.08em;
}
.secret-hint {
  font-size: 0.82rem;
  color: #fde047;
  margin-top: 0.25rem;
}
.config-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.65rem;
  margin: 0.85rem 0;
}
.form-field label {
  display: block;
  font-size: 0.76rem;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}
.control-actions-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.rows-manager-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}
.mc-row-card {
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.75rem;
  padding: 0.75rem 0.9rem;
}
.mc-row-card.active {
  border-color: #38bdf8;
  background: rgba(14, 165, 233, 0.14);
}
.mc-row-card.solved {
  border-color: rgba(16, 185, 129, 0.4);
  background: rgba(16, 185, 129, 0.08);
}
.mc-row-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}
.mc-row-title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.mc-ans {
  color: #38bdf8;
  font-size: 0.9rem;
}
.mc-keychar {
  color: #facc15;
  font-size: 0.82rem;
  font-weight: 800;
}
.mc-row-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}
.mc-q-text {
  font-size: 0.86rem;
  color: #e2e8f0;
}
.mc-solvers-info {
  margin-top: 0.35rem;
  font-size: 0.78rem;
  color: #6ee7b7;
}
.sim-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.ai-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.ai-row .input-control {
  flex: 1;
}
.embedded-wrap {
  border-radius: 0.85rem;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.2);
}
@media (max-width: 1100px) {
  .dash-main-grid {
    grid-template-columns: 1fr;
  }
  .config-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
