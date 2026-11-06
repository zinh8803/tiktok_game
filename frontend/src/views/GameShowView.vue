<template>
  <div
    class="gameshow-root"
    :class="{
      'layout-vertical': isVerticalLayout,
      'layout-landscape': !isVerticalLayout,
      'is-embedded': embedded,
    }"
  >
    <!-- Phaser 3 Canvas Stage Layer -->
    <div ref="phaserContainer" class="phaser-canvas-layer"></div>

    <!-- Floating Quick Calibrator Toggle (chỉ hiện trên màn hình Game Show độc lập) -->
    <div v-if="!embedded" class="calib-floating-widget" :class="{ 'calib-open': showCalibPanel }">
      <button
        type="button"
        class="calib-toggle-btn"
        title="Chỉnh khớp khung hình TikTok Điện thoại"
        @click="showCalibPanel = !showCalibPanel"
      >
        <span>⚙️ {{ showCalibPanel ? 'Đóng chỉnh khung' : 'Chỉnh khớp ĐT' }}</span>
      </button>

      <div v-if="showCalibPanel" class="calib-popup-card tabular-nums">
        <div class="calib-popup-header">
          <strong>🎛️ Khung TikTok ĐT ({{ layoutCalib.frameWidth }}×{{ layoutCalib.frameHeight }})</strong>
          <button type="button" class="calib-reset-btn" @click="applyCalibPreset('362x444')">
            Chuẩn 362×444
          </button>
        </div>

        <div class="calib-presets-row">
          <button
            type="button"
            class="calib-preset-btn"
            :class="{ active: layoutCalib.preset === '362x444' }"
            @click="applyCalibPreset('362x444')"
          >
            📱 362×444 (Chuẩn)
          </button>
          <button
            type="button"
            class="calib-preset-btn"
            :class="{ active: layoutCalib.preset === 'tiktok-narrow' }"
            @click="applyCalibPreset('tiktok-narrow')"
          >
            📐 Nhỏ gọn (320×400)
          </button>
          <button
            type="button"
            class="calib-preset-btn"
            :class="{ active: layoutCalib.preset === 'tiktok-safe-zone' }"
            @click="applyCalibPreset('tiktok-safe-zone')"
          >
            💬 Né chat đáy
          </button>
        </div>

        <div class="calib-slider-group">
          <label>
            <span>Chiều rộng khung (px)</span>
            <strong>{{ layoutCalib.frameWidth }}px</strong>
          </label>
          <input
            v-model.number="layoutCalib.frameWidth"
            type="range"
            min="260"
            max="640"
            step="2"
            @input="onManualCalibChange"
          />
        </div>

        <div class="calib-slider-group">
          <label>
            <span>Chiều cao khung (px)</span>
            <strong>{{ layoutCalib.frameHeight }}px</strong>
          </label>
          <input
            v-model.number="layoutCalib.frameHeight"
            type="range"
            min="320"
            max="840"
            step="2"
            @input="onManualCalibChange"
          />
        </div>

        <div class="calib-slider-group">
          <label>
            <span>Thu phóng cỡ khung (Zoom)</span>
            <strong>{{ layoutCalib.scale }}%</strong>
          </label>
          <input
            v-model.number="layoutCalib.scale"
            type="range"
            min="50"
            max="130"
            step="1"
            @input="onManualCalibChange"
          />
        </div>

        <div class="calib-slider-group">
          <label>
            <span>Đẩy Lên / Xuống (Tránh chat/avatar)</span>
            <strong>{{ layoutCalib.offsetY > 0 ? `+${layoutCalib.offsetY}` : layoutCalib.offsetY }}%</strong>
          </label>
          <input
            v-model.number="layoutCalib.offsetY"
            type="range"
            min="-35"
            max="35"
            step="1"
            @input="onManualCalibChange"
          />
        </div>

        <div class="calib-slider-group">
          <label>
            <span>Đẩy Trái / Phải</span>
            <strong>{{ layoutCalib.offsetX > 0 ? `+${layoutCalib.offsetX}` : layoutCalib.offsetX }}%</strong>
          </label>
          <input
            v-model.number="layoutCalib.offsetX"
            type="range"
            min="-30"
            max="30"
            step="1"
            @input="onManualCalibChange"
          />
        </div>
      </div>
    </div>

    <!-- Broadcast Safe Frame Container -->
    <div
      ref="broadcastFrameRef"
      class="broadcast-frame"
      :style="broadcastFrameStyle"
    >
      <!-- Top Broadcast Header (Tích hợp thông báo Quà tặng gọn trên thanh Header, không bao giờ che câu hỏi) -->
      <header class="stage-header" :class="{ 'header-gift-active': !!activeGiftBanner }">
        <div v-if="activeGiftBanner" class="gift-inline-ticker">
          <Sparkles :size="14" class="icon-gold" style="flex-shrink: 0;" />
          <div class="gift-inline-text">
            <strong>{{ activeGiftBanner.user?.nickname }}</strong>
            <span>tặng {{ activeGiftBanner.giftName }} ×{{ activeGiftBanner.repeatCount || 1 }}</span>
            <em v-if="activeGiftBanner.displayMessage">— {{ activeGiftBanner.displayMessage }}</em>
          </div>
        </div>
        <div v-else class="brand-cluster">
          <div class="live-indicator">
            <span class="pulse-dot"></span>
            <span>LIVE</span>
          </div>
          <h1 class="stage-title">{{ roomState?.title || 'Đấu Trường Tri Thức' }}</h1>
        </div>

        <div class="header-metrics tabular-nums">
          <div v-if="!activeGiftBanner" class="metric-pill">
            <Users :size="14" />
            <span>{{ roomState?.playerCount || 0 }} người chơi</span>
          </div>
          <div v-if="roomState?.status === 'PLAYING'" class="metric-pill badge-cyan">
            <span>Câu {{ currentQuestionNumber }}/{{ totalQuestionsCount }}</span>
          </div>
        </div>
      </header>

      <!-- Main Stage Content Grid -->
      <main class="stage-grid">
        <!-- Primary Center Stage -->
        <section ref="stageCardRef" class="center-stage-area">
          <!-- 1. MÀN HÌNH PHÒNG CHỜ (WAITING ROOM & COUNTDOWN) -->
          <div
            v-if="currentPhase === 'WAITING_ROOM' || currentPhase === 'COUNTDOWN'"
            class="waiting-screen"
          >
            <div class="waiting-hero">
              <div class="trophy-emblem">
                <Trophy :size="32" />
              </div>
              <h2 class="waiting-headline">
                {{
                  currentPhase === 'COUNTDOWN'
                    ? 'Trận Đấu Đang Bắt Đầu!'
                    : 'Đấu Trường Tri Thức'
                }}
              </h2>
              <p class="waiting-subtext">
                Bình luận đáp án <strong>A</strong>, <strong>B</strong>, <strong>C</strong> hoặc
                <strong>D</strong> trên khung chat LIVE để tham gia & ghi điểm!
              </p>
            </div>

            <div class="rules-strip">
              <div class="rule-item">
                <CheckCircle2 :size="18" class="icon-cyan" />
                <div>
                  <strong>+100 điểm cơ bản</strong>
                  <p>Trả lời chính xác</p>
                </div>
              </div>
              <div class="rule-item">
                <Zap :size="18" class="icon-gold" />
                <div>
                  <strong>+0–50 điểm tốc độ</strong>
                  <p>Phản xạ càng nhanh</p>
                </div>
              </div>
              <div class="rule-item">
                <ShieldCheck :size="18" class="icon-purple" />
                <div>
                  <strong>Tính đáp án đầu</strong>
                  <p>Chống đổi đáp án</p>
                </div>
              </div>
            </div>

            <div class="waiting-players-box">
              <div class="waiting-players-header">
                <span>Người chơi đã vào ({{ roomState?.playerCount || 0 }})</span>
                <span class="room-code-tag tabular-nums">Phòng: {{ roomCode }}</span>
              </div>
              <div v-if="roomState?.players?.length" class="player-chips">
                <span
                  v-for="plr in roomState.players.slice(0, 12)"
                  :key="plr.id"
                  class="player-chip"
                >
                  {{ plr.nickname }}
                </span>
              </div>
              <p v-else class="empty-players-hint">
                Gõ bình luận bất kỳ hoặc A / B / C / D để ghi danh lên màn hình!
              </p>
            </div>
          </div>

          <!-- 2. MÀN HÌNH CÂU HỎI (QUESTION) -->
          <div v-else-if="currentPhase === 'QUESTION' && activeQuestion" class="question-screen">
            <div class="question-top-bar">
              <div class="question-meta-badges">
                <span class="badge badge-cyan">{{ activeQuestion.categoryName || 'Kiến thức' }}</span>
                <span class="badge badge-purple">{{ formatDifficulty(activeQuestion.difficulty) }}</span>
                <span v-if="eliminatedOption" class="badge badge-gold">
                  Loại: {{ eliminatedOption }}
                </span>
              </div>

              <div
                class="countdown-clock tabular-nums"
                :class="{ 'clock-urgent': remainingSeconds <= 5 }"
              >
                <Clock :size="18" />
                <span class="clock-digits">{{ remainingSeconds }}s</span>
              </div>
            </div>

            <!-- Progress Timer Bar -->
            <div class="timer-track">
              <div
                class="timer-fill"
                :class="{ 'timer-fill-urgent': remainingSeconds <= 5 }"
                :style="{ width: `${timerProgressPercent}%` }"
              ></div>
            </div>

            <!-- Central Question Card -->
            <div class="question-prompt-box">
              <p class="question-text">{{ activeQuestion.question }}</p>
              <div class="answered-counter tabular-nums">
                <MessageSquare :size="14" />
                <span>{{ answeredCount }} người đã chọn đáp án</span>
              </div>
            </div>

            <!-- Four High-Contrast Answer Cards A / B / C / D -->
            <div class="options-grid">
              <div
                v-for="label in (['A', 'B', 'C', 'D'] as const)"
                :key="label"
                class="option-card"
                :class="[
                  `option-card-${label.toLowerCase()}`,
                  { 'option-eliminated': eliminatedOption === label },
                ]"
              >
                <div class="option-key">{{ label }}</div>
                <div class="option-text">
                  {{ activeQuestion.options?.[label] }}
                </div>
                <span v-if="eliminatedOption === label" class="eliminated-tag">LOẠI</span>
              </div>
            </div>
          </div>

          <!-- 3. MÀN HÌNH CÔNG BỐ ĐÁP ÁN (ANSWER REVEAL) -->
          <div
            v-else-if="currentPhase === 'ANSWER_REVEAL' && questionResult"
            class="reveal-screen"
          >
            <div class="reveal-header">
              <span class="badge badge-emerald">ĐÁP ÁN ĐÚNG: {{ questionResult.correctOption }}</span>
              <span class="tabular-nums reveal-stat">
                {{ questionResult.correctPlayersCount }}/{{ questionResult.totalAnswersCount }} trả lời đúng
              </span>
            </div>

            <div class="question-prompt-box reveal-prompt">
              <p class="question-text">{{ questionResult.question }}</p>
            </div>

            <div class="options-grid">
              <div
                v-for="label in (['A', 'B', 'C', 'D'] as const)"
                :key="label"
                class="option-card"
                :class="{
                  'option-correct': questionResult.correctOption === label,
                  'option-wrong': questionResult.correctOption !== label,
                }"
              >
                <div class="option-key">{{ label }}</div>
                <div class="option-text">
                  {{ questionResult.options?.[label] }}
                </div>
                <div class="option-votes tabular-nums">
                  {{ questionResult.optionCounts?.[label] || 0 }}
                </div>
              </div>
            </div>

            <div class="explanation-box">
              <div class="explanation-content">
                <h3>Giải thích đáp án {{ questionResult.correctOption }}</h3>
                <p>{{ questionResult.explanation }}</p>
              </div>
            </div>
          </div>

          <!-- 4. MÀN HÌNH BẢNG XẾP HẠNG TRUNG TÂM (LEADERBOARD PHASE) -->
          <div v-else-if="currentPhase === 'LEADERBOARD'" class="full-leaderboard-screen">
            <div class="leaderboard-stage-header">
              <Award :size="28" class="icon-gold" />
              <div>
                <h2>Bảng Xếp Hạng Tạm Thời</h2>
                <p class="tabular-nums">Sau câu {{ currentQuestionNumber }}/{{ totalQuestionsCount }}</p>
              </div>
            </div>

            <div v-if="leaderboard.length" class="stage-leaderboard-rows tabular-nums">
              <div
                v-for="entry in leaderboard.slice(0, 6)"
                :key="entry.playerId"
                class="stage-lb-row"
                :class="{
                  'lb-top-1': entry.rank === 1,
                  'lb-top-2': entry.rank === 2,
                  'lb-top-3': entry.rank === 3,
                }"
              >
                <div class="lb-rank">{{ entry.rank }}</div>
                <div class="lb-player-info">
                  <strong>{{ entry.nickname }}</strong>
                  <span>Đúng {{ entry.correctCount }} câu</span>
                </div>
                <div v-if="entry.lastQuestionDelta" class="lb-delta">
                  +{{ entry.lastQuestionDelta }}
                </div>
                <div class="lb-total-score">{{ entry.totalScore }}đ</div>
              </div>
            </div>
            <p v-else class="empty-players-hint">Chưa có người chơi ghi điểm ở lượt này.</p>
          </div>

          <!-- 5. MÀN HÌNH CHIẾN THẮNG & VINH DANH TOP 3 (VICTORY) -->
          <div v-else-if="currentPhase === 'VICTORY'" class="victory-screen">
            <div class="victory-header">
              <Trophy :size="32" class="icon-gold" />
              <div>
                <h2>Vinh Danh Nhà Vô Địch</h2>
                <p>{{ leaderboard.length }} người chơi tham gia tranh tài</p>
              </div>
            </div>

            <div v-if="leaderboard.length" class="podium-grid tabular-nums">
              <div
                v-for="(item, idx) in leaderboard.slice(0, 3)"
                :key="item.playerId"
                class="podium-card"
                :class="idx === 0 ? 'podium-gold' : idx === 1 ? 'podium-silver' : 'podium-bronze'"
              >
                <div class="podium-medal">
                  {{ idx === 0 ? 'QUÁN QUÂN 🏆' : `HẠNG ${idx + 1}` }}
                </div>
                <strong class="podium-name">{{ item.nickname }}</strong>
                <div class="podium-score">{{ item.totalScore }} điểm</div>
                <span class="podium-accuracy">Đúng {{ item.correctCount }} câu</span>
              </div>
            </div>
            <p v-else class="empty-players-hint">Trận đấu đã kết thúc.</p>
          </div>
        </section>

        <!-- Compact Leaderboard & Ticker Strip -->
        <aside class="sidebar-leaderboard">
          <div class="sidebar-card">
            <div class="sidebar-header">
              <Trophy :size="15" class="icon-gold" />
              <h3>Top Xếp Hạng</h3>
            </div>

            <div v-if="leaderboard.length" class="mini-lb-list tabular-nums">
              <div
                v-for="item in leaderboard.slice(0, isVerticalLayout ? 5 : 8)"
                :key="item.playerId"
                class="mini-lb-item"
              >
                <span class="mini-rank" :class="`rank-${item.rank}`">{{ item.rank }}</span>
                <div class="mini-user">
                  <strong>{{ item.nickname }}</strong>
                </div>
                <div class="mini-score-col">
                  <span class="mini-score">{{ item.totalScore }}đ</span>
                </div>
              </div>
            </div>
            <div v-else class="sidebar-empty">
              Bình luận A / B / C / D để lên bảng xếp hạng!
            </div>
          </div>
        </aside>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import gsap from 'gsap';
import {
  Trophy,
  Users,
  Clock,
  Zap,
  CheckCircle2,
  ShieldCheck,
  MessageSquare,
  Award,
  Sparkles,
} from 'lucide-vue-next';
import { api } from '../services/api';
import { createRoomSocket } from '../services/socket';
import { PhaserStageController } from '../game/PhaserStage';
import type { Socket } from 'socket.io-client';

const props = defineProps<{
  roomCodeProp?: string;
  embedded?: boolean;
  forceVertical?: boolean;
}>();

const route = useRoute();
const roomCode = computed(() =>
  String(props.roomCodeProp || route.params.roomCode || 'KB2026').toUpperCase()
);

const isVerticalLayout = ref(
  Boolean(
    props.forceVertical ||
      route.query.layout === 'vertical' ||
      (typeof window !== 'undefined' &&
        !props.embedded &&
        (window.innerWidth <= 960 || window.innerHeight >= window.innerWidth * 0.85))
  )
);

const phaserContainer = ref<HTMLElement | null>(null);
const broadcastFrameRef = ref<HTMLElement | null>(null);
const stageCardRef = ref<HTMLElement | null>(null);
let phaserStage: PhaserStageController | null = null;
let socket: Socket | null = null;
let frameResizeObserver: ResizeObserver | null = null;

const showCalibPanel = ref(false);
const autoFitScale = ref(1);
const layoutCalib = ref({
  frameWidth: Number(route.query.fw) || 362,
  frameHeight: Number(route.query.fh) || 444,
  scale: Number(route.query.scale) || 100,
  widthPercent: Number(route.query.w) || 96,
  offsetX: Number(route.query.ox) || 0,
  offsetY: Number(route.query.oy) || 0,
  preset: String(route.query.preset || '362x444'),
});

const STORAGE_CALIB_KEY = 'kb_vertical_layout_362x444_v3';

function loadSavedCalib() {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(STORAGE_CALIB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      layoutCalib.value = {
        frameWidth: Number(route.query.fw) || Number(parsed.frameWidth ?? 362),
        frameHeight: Number(route.query.fh) || Number(parsed.frameHeight ?? 444),
        scale: Number(route.query.scale) || Number(parsed.scale ?? 100),
        widthPercent: Number(route.query.w) || Number(parsed.widthPercent ?? 96),
        offsetX: Number(route.query.ox) || Number(parsed.offsetX ?? 0),
        offsetY: Number(route.query.oy) || Number(parsed.offsetY ?? 0),
        preset: String(route.query.preset || parsed.preset || '362x444'),
      };
    }
  } catch {
    // ignore storage errors
  }
}

function saveAndBroadcastCalib() {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_CALIB_KEY, JSON.stringify(layoutCalib.value));
    } catch {
      // ignore
    }
  }
  socket?.emit('layout.update', {
    roomCode: roomCode.value,
    ...layoutCalib.value,
  });
  requestAnimationFrame(recalcAutoFit);
}

function applyCalibPreset(preset: '362x444' | 'tiktok-narrow' | 'tiktok-safe-zone') {
  if (preset === '362x444') {
    layoutCalib.value = {
      frameWidth: 362,
      frameHeight: 444,
      scale: 100,
      widthPercent: 96,
      offsetX: 0,
      offsetY: 0,
      preset: '362x444',
    };
  } else if (preset === 'tiktok-narrow') {
    layoutCalib.value = {
      frameWidth: 320,
      frameHeight: 400,
      scale: 100,
      widthPercent: 90,
      offsetX: 0,
      offsetY: 0,
      preset: 'tiktok-narrow',
    };
  } else if (preset === 'tiktok-safe-zone') {
    layoutCalib.value = {
      frameWidth: 362,
      frameHeight: 444,
      scale: 96,
      widthPercent: 96,
      offsetX: 0,
      offsetY: -8,
      preset: 'tiktok-safe-zone',
    };
  }
  saveAndBroadcastCalib();
}

function onManualCalibChange() {
  layoutCalib.value.preset = 'custom';
  saveAndBroadcastCalib();
}

function recalcAutoFit() {
  if (props.embedded || !broadcastFrameRef.value || typeof window === 'undefined') {
    autoFitScale.value = 1;
    return;
  }
  const el = broadcastFrameRef.value;
  const naturalHeight = el.scrollHeight || el.offsetHeight || 1;
  const targetH = isVerticalLayout.value
    ? Math.min(layoutCalib.value.frameHeight || 444, window.innerHeight * 0.96)
    : window.innerHeight * 0.94;
  if (naturalHeight > targetH && targetH > 120) {
    autoFitScale.value = Math.max(0.55, Math.min(1, targetH / naturalHeight));
  } else {
    autoFitScale.value = 1;
  }
}

const broadcastFrameStyle = computed(() => {
  if (props.embedded) return {};
  if (!isVerticalLayout.value) {
    const s = (layoutCalib.value.scale / 100) * autoFitScale.value;
    if (s === 1 && !layoutCalib.value.offsetX && !layoutCalib.value.offsetY) return {};
    return {
      transform: `translate(${layoutCalib.value.offsetX}vw, ${layoutCalib.value.offsetY}vh) scale(${s.toFixed(3)})`,
      transformOrigin: 'center center',
    };
  }
  const effectiveScale = (layoutCalib.value.scale / 100) * autoFitScale.value;
  const fw = layoutCalib.value.frameWidth || 362;
  const fh = layoutCalib.value.frameHeight || 444;
  return {
    width: `${fw}px`,
    maxWidth: '98vw',
    maxHeight: `${fh}px`,
    transform: `translate(${layoutCalib.value.offsetX}vw, ${layoutCalib.value.offsetY}vh) scale(${effectiveScale.toFixed(3)})`,
    transformOrigin: 'center center',
  };
});

function handleStorageSync(e: StorageEvent) {
  if (e.key === STORAGE_CALIB_KEY && e.newValue) {
    try {
      const parsed = JSON.parse(e.newValue);
      layoutCalib.value = {
        frameWidth: Number(parsed.frameWidth ?? 362),
        frameHeight: Number(parsed.frameHeight ?? 444),
        scale: Number(parsed.scale ?? 100),
        widthPercent: Number(parsed.widthPercent ?? 96),
        offsetX: Number(parsed.offsetX ?? 0),
        offsetY: Number(parsed.offsetY ?? 0),
        preset: String(parsed.preset || 'custom'),
      };
      requestAnimationFrame(recalcAutoFit);
    } catch {
      // ignore
    }
  }
}

const roomState = ref<any>(null);
const activeQuestion = ref<any>(null);
const questionResult = ref<any>(null);
const leaderboard = ref<any[]>([]);
const recentFeed = ref<any[]>([]);
const remainingSeconds = ref<number>(15);
const answeredCount = ref<number>(0);
const answeredPlayers = ref<Array<{ playerId: string; nickname: string; username: string }>>([]);
const activeGiftBanner = ref<any>(null);
let giftTimeout: any = null;

const currentPhase = computed(() => {
  return roomState.value?.phase || 'WAITING_ROOM';
});

const currentQuestionNumber = computed(() => {
  if (activeQuestion.value?.questionIndex) return activeQuestion.value.questionIndex;
  return (roomState.value?.currentQuestionIndex ?? 0) + 1;
});

const totalQuestionsCount = computed(() => {
  return activeQuestion.value?.totalQuestions || roomState.value?.totalQuestions || 10;
});

const eliminatedOption = computed(() => {
  return roomState.value?.eliminatedHintOption || activeQuestion.value?.eliminatedHintOption || null;
});

const timerProgressPercent = computed(() => {
  const duration = activeQuestion.value?.duration || 15;
  return Math.max(0, Math.min(100, (remainingSeconds.value / duration) * 100));
});

function formatDifficulty(diff?: string) {
  if (diff === 'EASY') return 'Dễ';
  if (diff === 'HARD') return 'Khó';
  return 'TB';
}

function animateStageTransition() {
  if (!stageCardRef.value) return;
  gsap.fromTo(
    stageCardRef.value,
    { opacity: 0.75, y: 8 },
    { opacity: 1, y: 0, duration: 0.3, ease: 'expo.out' }
  );
}

watch(currentPhase, (newPhase) => {
  animateStageTransition();
  if (newPhase === 'WAITING_ROOM' || newPhase === 'COUNTDOWN') {
    phaserStage?.setMode('WAITING');
  } else if (newPhase === 'QUESTION') {
    phaserStage?.setMode('QUESTION');
  } else if (newPhase === 'ANSWER_REVEAL') {
    phaserStage?.setMode('REVEAL');
    phaserStage?.triggerConfetti();
  } else if (newPhase === 'VICTORY') {
    phaserStage?.setMode('VICTORY');
    phaserStage?.triggerConfetti();
    phaserStage?.triggerFireworks(4);
  }
  requestAnimationFrame(recalcAutoFit);
});

watch(remainingSeconds, (sec) => {
  if (currentPhase.value === 'QUESTION' && sec <= 5 && sec > 0) {
    phaserStage?.setMode('URGENT');
  }
});

function handleResize() {
  if (props.embedded) return;
  if (route.query.layout === 'vertical') {
    isVerticalLayout.value = true;
    requestAnimationFrame(recalcAutoFit);
    return;
  }
  if (route.query.layout === 'landscape') {
    isVerticalLayout.value = false;
    requestAnimationFrame(recalcAutoFit);
    return;
  }
  isVerticalLayout.value =
    window.innerWidth <= 960 || window.innerHeight >= window.innerWidth * 0.85;
  requestAnimationFrame(recalcAutoFit);
}

async function loadInitialRecovery() {
  try {
    const data = await api.getRoom(roomCode.value);
    if (data.roomState) {
      roomState.value = data.roomState;
      recentFeed.value = data.roomState.recentEvents || [];
      answeredCount.value = data.roomState.answeredCountCurrentQuestion || 0;
      answeredPlayers.value = data.roomState.answeredPlayersCurrentQuestion || [];
    }
    if (data.activeQuestion) {
      activeQuestion.value = data.activeQuestion;
      remainingSeconds.value =
        data.activeQuestion.remainingSeconds ?? data.activeQuestion.duration ?? 15;
    }
    if (data.lastQuestionResult) {
      questionResult.value = data.lastQuestionResult;
    }
    if (data.leaderboard?.leaderboard) {
      leaderboard.value = data.leaderboard.leaderboard;
    }
  } catch (err) {
    console.warn('Initial room recovery warning:', err);
  }
}

onMounted(async () => {
  loadSavedCalib();
  window.addEventListener('resize', handleResize);
  window.addEventListener('storage', handleStorageSync);
  handleResize();

  if (typeof ResizeObserver !== 'undefined' && broadcastFrameRef.value) {
    frameResizeObserver = new ResizeObserver(() => {
      recalcAutoFit();
    });
    frameResizeObserver.observe(broadcastFrameRef.value);
  }

  if (phaserContainer.value) {
    phaserStage = new PhaserStageController();
    phaserStage.mount(phaserContainer.value);
  }

  await loadInitialRecovery();
  requestAnimationFrame(recalcAutoFit);

  socket = createRoomSocket(roomCode.value);

  socket.on('room.state', (payload) => {
    roomState.value = payload;
    if (payload.recentEvents) {
      recentFeed.value = payload.recentEvents;
    }
    answeredCount.value = payload.answeredCountCurrentQuestion || 0;
    if (payload.answeredPlayersCurrentQuestion) {
      answeredPlayers.value = payload.answeredPlayersCurrentQuestion;
    }
    requestAnimationFrame(recalcAutoFit);
  });

  socket.on('question.started', (payload) => {
    activeQuestion.value = payload;
    questionResult.value = null;
    remainingSeconds.value = payload.duration || 15;
    answeredCount.value = 0;
    answeredPlayers.value = [];
    requestAnimationFrame(recalcAutoFit);
  });

  socket.on('question.timer', (payload) => {
    remainingSeconds.value = payload.remainingSeconds;
  });

  socket.on('player.answered', (payload) => {
    answeredCount.value = payload.answeredCount;
    if (payload.answeredPlayers) {
      answeredPlayers.value = payload.answeredPlayers;
    }
    requestAnimationFrame(recalcAutoFit);
  });

  socket.on('question.result', (payload) => {
    questionResult.value = payload;
    requestAnimationFrame(recalcAutoFit);
  });

  socket.on('leaderboard.updated', (payload) => {
    leaderboard.value = payload.leaderboard || [];
    requestAnimationFrame(recalcAutoFit);
  });

  socket.on('game.finished', (payload) => {
    if (payload.leaderboard) {
      leaderboard.value = payload.leaderboard;
    }
    requestAnimationFrame(recalcAutoFit);
  });

  socket.on('layout.config', (cfg) => {
    if (!cfg) return;
    layoutCalib.value = {
      frameWidth: Number(cfg.frameWidth ?? layoutCalib.value.frameWidth ?? 362),
      frameHeight: Number(cfg.frameHeight ?? layoutCalib.value.frameHeight ?? 444),
      scale: Number(cfg.scale ?? layoutCalib.value.scale),
      widthPercent: Number(cfg.widthPercent ?? layoutCalib.value.widthPercent),
      offsetX: Number(cfg.offsetX ?? layoutCalib.value.offsetX),
      offsetY: Number(cfg.offsetY ?? layoutCalib.value.offsetY),
      preset: String(cfg.preset || layoutCalib.value.preset),
    };
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_CALIB_KEY, JSON.stringify(layoutCalib.value));
      } catch {
        // ignore
      }
    }
    requestAnimationFrame(recalcAutoFit);
  });

  socket.on('activity.feed', (entry) => {
    recentFeed.value = [entry, ...recentFeed.value.filter((e) => e.id !== entry.id)].slice(0, 20);
  });

  socket.on('gift.animation', (giftPayload) => {
    activeGiftBanner.value = giftPayload;
    phaserStage?.triggerFireworks(3);
    if (giftTimeout) clearTimeout(giftTimeout);
    giftTimeout = setTimeout(() => {
      activeGiftBanner.value = null;
    }, giftPayload.durationMs || 4500);
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('storage', handleStorageSync);
  frameResizeObserver?.disconnect();
  if (giftTimeout) clearTimeout(giftTimeout);
  socket?.disconnect();
  phaserStage?.destroy();
});
</script>

<style scoped>
/* ===================================================================
   KHUNG CHUẨN BROADCAST — TỰ ĐỘNG KHỚP MỌI KHUNG HÌNH OBS / TIKTOK STUDIO
   =================================================================== */
.gameshow-root {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at 50% 20%, #19103b 0%, #090c20 60%, #050712 100%);
  color: var(--text-primary);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}

.gameshow-root.is-embedded {
  width: 100%;
  height: 540px;
  padding: 0.75rem;
}

.phaser-canvas-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.broadcast-frame {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.2vh;
  transition: width 0.15s ease, transform 0.15s ease;
}

/*
 * Chế độ Dọc TikTok LIVE (Chuẩn 362 × 444 px theo khung điện thoại):
 * Khung game gọn đúng 362x444px, căn giữa màn hình, không bị tràn mép!
 */
.layout-vertical .broadcast-frame {
  width: 362px;
  max-width: 98vw;
  max-height: 444px;
  gap: 6px;
}

.layout-vertical .stage-header {
  padding: 6px 10px;
  border-radius: 8px;
}

.layout-vertical .stage-title {
  font-size: 12px;
}

.layout-vertical .live-indicator {
  font-size: 9px;
  padding: 2px 6px;
}

.layout-vertical .metric-pill {
  font-size: 10px;
  padding: 2px 7px;
}

.layout-vertical .stage-grid {
  grid-template-columns: 1fr;
  gap: 6px;
}

.layout-vertical .center-stage-area {
  padding: 10px 12px;
  border-radius: 10px;
}

.layout-vertical .waiting-screen {
  gap: 7px;
}

.layout-vertical .trophy-emblem {
  width: 34px;
  height: 34px;
  margin-bottom: 2px;
}

.layout-vertical .waiting-headline {
  font-size: 16px;
}

.layout-vertical .waiting-subtext {
  font-size: 11px;
  line-height: 1.25;
}

.layout-vertical .rules-strip {
  grid-template-columns: 1fr;
  gap: 4px;
}

.layout-vertical .rule-item {
  padding: 5px 8px;
  border-radius: 7px;
  gap: 8px;
}

.layout-vertical .rule-item strong {
  font-size: 11px;
}

.layout-vertical .rule-item p {
  font-size: 10px;
}

.layout-vertical .waiting-players-box {
  padding: 6px 9px;
  border-radius: 7px;
}

.layout-vertical .waiting-players-header {
  font-size: 10.5px;
  margin-bottom: 3px;
}

.layout-vertical .empty-players-hint {
  font-size: 10px;
}

.layout-vertical .question-screen,
.layout-vertical .reveal-screen {
  gap: 6px;
}

.layout-vertical .question-prompt-box {
  padding: 8px 10px;
  border-radius: 8px;
}

.layout-vertical .question-text {
  font-size: 13px;
  line-height: 1.25;
}

.layout-vertical .options-grid {
  grid-template-columns: 1fr;
  gap: 5px;
}

.layout-vertical .option-card {
  padding: 5px 8px;
  border-radius: 7px;
  gap: 7px;
}

.layout-vertical .option-key {
  width: 24px;
  height: 24px;
  font-size: 12px;
}

.layout-vertical .option-text {
  font-size: 12px;
}

.layout-vertical .sidebar-card {
  padding: 6px 10px;
  border-radius: 8px;
}

.layout-vertical .sidebar-header {
  margin-bottom: 4px;
}

.layout-vertical .sidebar-header h3 {
  font-size: 11px;
}

.layout-vertical .sidebar-empty {
  font-size: 10px;
}

.gameshow-root.is-embedded .broadcast-frame {
  width: 100%;
  max-height: 100%;
}

/* Floating Quick Calibrator Widget */
.calib-floating-widget {
  position: fixed;
  top: 0.6rem;
  right: 0.6rem;
  z-index: 60;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.45rem;
}

.calib-toggle-btn {
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: rgba(13, 17, 39, 0.75);
  border: 1px solid rgba(0, 240, 255, 0.35);
  color: #e2f1ff;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  opacity: 0.32;
  transition: opacity 0.2s ease, background 0.2s ease;
}

.calib-floating-widget:hover .calib-toggle-btn,
.calib-floating-widget.calib-open .calib-toggle-btn {
  opacity: 1;
  background: rgba(13, 17, 39, 0.96);
}

.calib-popup-card {
  width: min(310px, 90vw);
  padding: 0.85rem;
  border-radius: 0.85rem;
  background: rgba(10, 14, 34, 0.96);
  border: 1px solid rgba(0, 240, 255, 0.45);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.calib-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78rem;
  color: var(--accent-cyan);
}

.calib-reset-btn {
  padding: 0.2rem 0.5rem;
  border-radius: 0.4rem;
  border: 1px solid var(--border-subtle);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 0.7rem;
  cursor: pointer;
}

.calib-presets-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.35rem;
}

.calib-preset-btn {
  padding: 0.35rem 0.3rem;
  border-radius: 0.45rem;
  border: 1px solid var(--border-subtle);
  background: rgba(24, 30, 64, 0.8);
  color: #dbeafe;
  font-size: 0.68rem;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
}

.calib-preset-btn.active {
  border-color: var(--accent-cyan);
  background: rgba(0, 240, 255, 0.18);
  color: #fff;
}

.calib-slider-group {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.calib-slider-group label {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: var(--text-secondary);
}

.calib-slider-group label strong {
  color: var(--accent-gold);
}

.calib-slider-group input[type='range'] {
  width: 100%;
  accent-color: var(--accent-cyan);
  cursor: pointer;
}

/* Header gọn gàng 1 dòng, không bao giờ tràn chữ */
.stage-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.45rem;
  padding: 1vh 1.6vh;
  background: rgba(13, 17, 39, 0.88);
  border: 1px solid rgba(0, 240, 255, 0.25);
  border-radius: 1.2vh;
}

.brand-cluster {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  min-width: 0;
  flex: 1;
}

.live-indicator {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.3vh 0.8vh;
  border-radius: 999px;
  background: rgba(244, 63, 94, 0.22);
  border: 1px solid rgba(244, 63, 94, 0.55);
  color: #fda4af;
  font-weight: 800;
  font-size: clamp(9px, 1.5vh, 13px);
  letter-spacing: 0.04em;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f43f5e;
  box-shadow: 0 0 8px #f43f5e;
}

.stage-title {
  font-size: clamp(11px, 2vh, 18px);
  font-weight: 800;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-metrics {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
}

.metric-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35vh 0.9vh;
  border-radius: 999px;
  background: rgba(24, 30, 64, 0.9);
  border: 1px solid var(--border-subtle);
  font-weight: 700;
  font-size: clamp(10px, 1.6vh, 14px);
  white-space: nowrap;
}

/* Main Stage Grid */
.stage-grid {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 1.5vh;
  align-items: stretch;
}

.layout-vertical .stage-grid {
  grid-template-columns: 1fr;
  gap: 1.2vh;
}

.center-stage-area {
  background: rgba(13, 17, 39, 0.88);
  border: 1px solid rgba(0, 240, 255, 0.28);
  border-radius: 1.6vh;
  padding: 2vh 2.2vh;
  box-shadow: var(--shadow-stage);
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

/* Waiting Screen */
.waiting-screen {
  display: flex;
  flex-direction: column;
  gap: 1.4vh;
  text-align: center;
}

.trophy-emblem {
  width: clamp(36px, 6.5vh, 64px);
  height: clamp(36px, 6.5vh, 64px);
  margin: 0 auto 0.5vh;
  border-radius: 1.4vh;
  background: rgba(250, 204, 21, 0.14);
  border: 1px solid rgba(250, 204, 21, 0.45);
  color: var(--accent-gold);
  display: flex;
  align-items: center;
  justify-content: center;
}

.waiting-headline {
  font-size: clamp(15px, 3vh, 28px);
  font-weight: 900;
  line-height: 1.22;
  color: #ffffff;
}

.waiting-subtext {
  font-size: clamp(11px, 1.9vh, 16px);
  color: var(--text-secondary);
  margin: 0.3vh auto 0;
  line-height: 1.35;
}

.waiting-subtext strong {
  color: var(--accent-cyan);
}

.rules-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8vh;
  text-align: left;
}

.layout-vertical .rules-strip {
  grid-template-columns: 1fr;
  gap: 0.7vh;
}

.rule-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.9vh 1.2vh;
  border-radius: 1vh;
  background: rgba(24, 30, 64, 0.78);
  border: 1px solid var(--border-subtle);
  min-width: 0;
}

.rule-item strong {
  display: block;
  font-size: clamp(11px, 1.8vh, 15px);
  color: #ffffff;
  line-height: 1.2;
}

.rule-item p {
  font-size: clamp(10px, 1.5vh, 13px);
  color: var(--text-secondary);
  line-height: 1.2;
}

.waiting-players-box {
  background: rgba(8, 11, 26, 0.78);
  border: 1px solid var(--border-subtle);
  border-radius: 1vh;
  padding: 1vh 1.2vh;
  text-align: left;
}

.waiting-players-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: clamp(10px, 1.6vh, 14px);
  color: var(--text-secondary);
  margin-bottom: 0.5vh;
}

.room-code-tag {
  color: var(--accent-cyan);
}

.player-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.player-chip {
  padding: 0.25vh 0.8vh;
  border-radius: 999px;
  background: rgba(0, 240, 255, 0.12);
  border: 1px solid rgba(0, 240, 255, 0.3);
  font-size: clamp(10px, 1.5vh, 13px);
  font-weight: 600;
  color: #e2f1ff;
}

.empty-players-hint {
  color: var(--text-muted);
  font-size: clamp(10px, 1.6vh, 14px);
}

/* Question & Reveal Screen */
.question-screen,
.reveal-screen {
  display: flex;
  flex-direction: column;
  gap: 1.1vh;
}

.question-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
}

.question-meta-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.question-meta-badges .badge {
  font-size: clamp(9px, 1.5vh, 13px);
  padding: 0.25vh 0.8vh;
}

.countdown-clock {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4vh 1.1vh;
  border-radius: 0.9vh;
  background: rgba(0, 240, 255, 0.15);
  border: 2px solid var(--accent-cyan);
  color: var(--accent-cyan);
  font-size: clamp(13px, 2.4vh, 22px);
  font-weight: 900;
}

.countdown-clock.clock-urgent {
  background: rgba(244, 63, 94, 0.24);
  border-color: #f43f5e;
  color: #fda4af;
}

.timer-track {
  width: 100%;
  height: 0.9vh;
  min-height: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.timer-fill {
  height: 100%;
  background: var(--accent-cyan);
  transition: width 0.25s linear;
}

.timer-fill.timer-fill-urgent {
  background: #f43f5e;
}

.question-prompt-box {
  padding: 1.6vh 1.8vh;
  border-radius: 1.2vh;
  background: rgba(22, 28, 62, 0.92);
  border: 1px solid rgba(192, 132, 252, 0.32);
  box-shadow: var(--shadow-card);
  text-align: center;
}

.question-text {
  font-size: clamp(13px, 2.4vh, 22px);
  font-weight: 800;
  line-height: 1.32;
  color: #ffffff;
  margin: 0 auto;
}

.answered-counter {
  margin-top: 0.8vh;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25vh 0.9vh;
  border-radius: 999px;
  background: rgba(0, 240, 255, 0.12);
  color: var(--accent-cyan);
  font-weight: 700;
  font-size: clamp(10px, 1.5vh, 13px);
}

/* 4 Answer Option Cards */
.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.9vh;
}

.layout-vertical .options-grid {
  grid-template-columns: 1fr;
  gap: 0.8vh;
}

.option-card {
  display: flex;
  align-items: center;
  gap: 1vh;
  padding: 1vh 1.3vh;
  border-radius: 1.1vh;
  background: rgba(26, 33, 72, 0.95);
  border: 2px solid rgba(142, 164, 210, 0.28);
  box-shadow: var(--shadow-card);
  min-width: 0;
}

.option-key {
  width: clamp(26px, 4.2vh, 42px);
  height: clamp(26px, 4.2vh, 42px);
  flex-shrink: 0;
  border-radius: 0.8vh;
  background: rgba(0, 240, 255, 0.16);
  border: 1px solid rgba(0, 240, 255, 0.45);
  color: var(--accent-cyan);
  font-size: clamp(12px, 2.1vh, 19px);
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-card-b .option-key {
  background: rgba(250, 204, 21, 0.16);
  border-color: rgba(250, 204, 21, 0.45);
  color: var(--accent-gold);
}

.option-card-c .option-key {
  background: rgba(192, 132, 252, 0.18);
  border-color: rgba(192, 132, 252, 0.45);
  color: #e9d5ff;
}

.option-card-d .option-key {
  background: rgba(52, 211, 153, 0.16);
  border-color: rgba(52, 211, 153, 0.45);
  color: #6ee7b7;
}

.option-text {
  flex: 1;
  font-size: clamp(12px, 2vh, 18px);
  font-weight: 700;
  color: #ffffff;
  line-height: 1.25;
  word-break: break-word;
}

.option-eliminated {
  opacity: 0.32;
  filter: grayscale(0.8);
}

.eliminated-tag {
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.15rem 0.45rem;
  border-radius: 0.35rem;
  background: rgba(244, 63, 94, 0.25);
  color: #fda4af;
}

.option-correct {
  background: rgba(16, 185, 129, 0.24);
  border-color: #10b981;
}

.option-correct .option-key {
  background: #10b981;
  color: #04130d;
  border-color: #34d399;
}

.option-wrong {
  opacity: 0.42;
}

.option-votes {
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: rgba(8, 12, 28, 0.75);
  color: var(--text-secondary);
}

/* Explanation Box */
.reveal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.reveal-stat {
  font-weight: 700;
  font-size: 0.82rem;
  color: var(--accent-gold);
}

.explanation-box {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  padding: 0.6rem 0.8rem;
  border-radius: 0.65rem;
  background: rgba(10, 15, 35, 0.88);
  border: 1px solid rgba(16, 185, 129, 0.35);
}

.layout-vertical .explanation-box {
  padding: 6px 9px;
}

.layout-vertical .explanation-content h3 {
  font-size: 11.5px;
}

.layout-vertical .explanation-content p {
  font-size: 11px;
  line-height: 1.25;
}

.explanation-content h3 {
  font-size: 0.86rem;
  font-weight: 800;
  color: #34d399;
  margin-bottom: 0.15rem;
}

.explanation-content p {
  font-size: 0.82rem;
  color: var(--text-primary);
  line-height: 1.35;
}

.fastest-box {
  border-left: 1px solid var(--border-subtle);
  padding-left: 0.75rem;
  min-width: 150px;
}

.layout-vertical .fastest-box {
  border-left: none;
  border-top: 1px solid var(--border-subtle);
  padding-left: 0;
  padding-top: 0.45rem;
}

.fastest-box h4 {
  font-size: 0.75rem;
  color: var(--accent-gold);
  margin-bottom: 0.2rem;
}

.fastest-item {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.78rem;
}

.fastest-pts {
  font-weight: 800;
  color: var(--accent-gold);
}

/* Full Leaderboard & Victory */
.leaderboard-stage-header,
.victory-header {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.75rem;
}

.leaderboard-stage-header h2,
.victory-header h2 {
  font-size: 1.15rem;
  font-weight: 800;
}

.leaderboard-stage-header p,
.victory-header p {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.stage-leaderboard-rows {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.stage-lb-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.85rem;
  border-radius: 0.65rem;
  background: rgba(22, 28, 62, 0.88);
  border: 1px solid var(--border-subtle);
}

.stage-lb-row.lb-top-1 {
  border-color: var(--accent-gold);
  background: rgba(250, 204, 21, 0.14);
}

.lb-rank {
  width: 28px;
  height: 28px;
  border-radius: 0.4rem;
  background: rgba(0, 240, 255, 0.14);
  color: var(--accent-cyan);
  font-weight: 900;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lb-top-1 .lb-rank {
  background: var(--accent-gold);
  color: #08090f;
}

.lb-player-info {
  flex: 1;
  min-width: 0;
}

.lb-player-info strong {
  display: block;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lb-player-info span {
  font-size: 0.74rem;
  color: var(--text-secondary);
}

.lb-delta {
  font-weight: 800;
  font-size: 0.82rem;
  color: #34d399;
}

.lb-total-score {
  font-size: 1rem;
  font-weight: 900;
  color: var(--accent-gold);
}

/* Podium */
.podium-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.65rem;
}

.layout-vertical .podium-grid {
  grid-template-columns: 1fr;
}

.podium-card {
  padding: 0.85rem;
  border-radius: 0.85rem;
  background: rgba(22, 28, 62, 0.92);
  border: 2px solid var(--border-subtle);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.podium-gold {
  background: rgba(250, 204, 21, 0.16);
  border-color: var(--accent-gold);
}

.podium-medal {
  font-size: 0.74rem;
  font-weight: 900;
  color: var(--accent-gold);
}

.podium-name {
  font-size: 1.05rem;
  font-weight: 900;
  color: #ffffff;
}

.podium-score {
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--accent-cyan);
}

.podium-accuracy {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Sidebar / Bottom Compact Leaderboard */
.sidebar-card {
  background: rgba(13, 17, 39, 0.86);
  border: 1px solid var(--border-subtle);
  border-radius: 0.85rem;
  padding: 0.75rem 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.sidebar-header h3 {
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--text-secondary);
}

.mini-lb-list {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.layout-vertical .mini-lb-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.4rem;
}

.mini-lb-item {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.5rem;
  border-radius: 0.5rem;
  background: rgba(24, 30, 64, 0.65);
  min-width: 0;
}

.mini-rank {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  border-radius: 0.35rem;
  background: rgba(142, 164, 210, 0.16);
  font-size: 0.72rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini-rank.rank-1 {
  background: var(--accent-gold);
  color: #090a0f;
}

.mini-rank.rank-2 {
  background: #e2e8f0;
  color: #090a0f;
}

.mini-rank.rank-3 {
  background: #f59e0b;
  color: #090a0f;
}

.mini-user {
  flex: 1;
  min-width: 0;
}

.mini-user strong {
  display: block;
  font-size: 0.78rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mini-score {
  font-weight: 800;
  font-size: 0.8rem;
  color: var(--accent-gold);
}

.sidebar-empty {
  font-size: 0.76rem;
  color: var(--text-muted);
}

/* Gift Inline Header Ticker (không che câu hỏi, không làm nhảy khung) */
.stage-header.header-gift-active {
  background: linear-gradient(90deg, rgba(45, 27, 10, 0.95) 0%, rgba(21, 16, 48, 0.95) 100%);
  border-color: var(--accent-gold);
  box-shadow: 0 0 14px rgba(250, 204, 21, 0.35);
}

.gift-inline-ticker {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
  flex: 1;
}

.gift-inline-text {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: clamp(10px, 1.7vh, 14px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.layout-vertical .gift-inline-text {
  font-size: 11px;
}

.gift-inline-text strong {
  color: var(--accent-gold);
  font-weight: 800;
}

.gift-inline-text span {
  color: #ffffff;
  font-weight: 700;
}

.gift-inline-text em {
  font-style: normal;
  color: #fde68a;
  overflow: hidden;
  text-overflow: ellipsis;
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

@media (max-width: 480px) {
  .rules-strip,
  .layout-vertical .rules-strip,
  .layout-vertical .mini-lb-list {
    grid-template-columns: 1fr;
  }
}
</style>
