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

    <!-- Broadcast Safe Frame Container -->
    <div class="broadcast-frame">
      <!-- Top Broadcast Header -->
      <header class="stage-header">
        <div class="brand-cluster">
          <div class="live-indicator">
            <span class="pulse-dot"></span>
            <span>LIVE</span>
          </div>
          <h1 class="stage-title">{{ roomState?.title || 'Đấu Trường Tri Thức' }}</h1>
        </div>

        <div class="header-metrics tabular-nums">
          <div class="metric-pill">
            <Users :size="14" />
            <span>{{ roomState?.playerCount || 0 }} người chơi</span>
          </div>
          <div v-if="roomState?.status === 'PLAYING'" class="metric-pill badge-cyan">
            <span>Câu {{ currentQuestionNumber }}/{{ totalQuestionsCount }}</span>
          </div>
        </div>
      </header>

      <!-- Gift Animation Overlay Banner (Mục 3.4 & 7.1) -->
      <transition name="gift-pop">
        <div v-if="activeGiftBanner" class="gift-banner-overlay">
          <div class="gift-icon-ring">
            <Sparkles :size="20" />
          </div>
          <div class="gift-banner-text">
            <strong>{{ activeGiftBanner.user?.nickname }}</strong>
            <span>{{ activeGiftBanner.displayMessage }}</span>
          </div>
          <span class="gift-tag">{{ activeGiftBanner.giftName }} ×{{ activeGiftBanner.repeatCount || 1 }}</span>
        </div>
      </transition>

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
                <span>{{ answeredCount }} người đã chốt đáp án</span>
              </div>
              <div v-if="answeredPlayers.length" class="player-chips" style="margin-top: 0.4vh;">
                <span
                  v-for="plr in answeredPlayers.slice(0, 12)"
                  :key="plr.playerId"
                  class="player-chip"
                >
                  ✓ {{ plr.nickname }}
                </span>
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

              <div
                v-if="questionResult.allAnswers?.length || questionResult.fastestPlayers?.length"
                class="fastest-box"
              >
                <h4>Kết quả người trả lời ({{ questionResult.totalAnswersCount || 0 }})</h4>
                <div class="fastest-list tabular-nums">
                  <div
                    v-for="(fp, idx) in (questionResult.allAnswers || questionResult.fastestPlayers).slice(0, 8)"
                    :key="idx"
                    class="fastest-item"
                  >
                    <span class="fastest-name">
                      {{ fp.nickname }}
                      <strong v-if="fp.selectedOption" style="color: var(--accent-cyan);">
                        [{{ fp.selectedOption }}]
                      </strong>
                    </span>
                    <span
                      class="fastest-pts"
                      :style="{ color: fp.points > 0 ? '#6ee7b7' : '#fda4af' }"
                    >
                      {{ fp.points > 0 ? `+${fp.points}đ` : '0đ' }}
                    </span>
                  </div>
                </div>
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
const stageCardRef = ref<HTMLElement | null>(null);
let phaserStage: PhaserStageController | null = null;
let socket: Socket | null = null;

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
    return;
  }
  if (route.query.layout === 'landscape') {
    isVerticalLayout.value = false;
    return;
  }
  isVerticalLayout.value =
    window.innerWidth <= 960 || window.innerHeight >= window.innerWidth * 0.85;
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
  window.addEventListener('resize', handleResize);
  handleResize();

  if (phaserContainer.value) {
    phaserStage = new PhaserStageController();
    phaserStage.mount(phaserContainer.value);
  }

  await loadInitialRecovery();

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
  });

  socket.on('question.started', (payload) => {
    activeQuestion.value = payload;
    questionResult.value = null;
    remainingSeconds.value = payload.duration || 15;
    answeredCount.value = 0;
    answeredPlayers.value = [];
  });

  socket.on('question.timer', (payload) => {
    remainingSeconds.value = payload.remainingSeconds;
  });

  socket.on('player.answered', (payload) => {
    answeredCount.value = payload.answeredCount;
    if (payload.answeredPlayers) {
      answeredPlayers.value = payload.answeredPlayers;
    }
  });

  socket.on('question.result', (payload) => {
    questionResult.value = payload;
  });

  socket.on('leaderboard.updated', (payload) => {
    leaderboard.value = payload.leaderboard || [];
  });

  socket.on('game.finished', (payload) => {
    if (payload.leaderboard) {
      leaderboard.value = payload.leaderboard;
    }
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
  if (giftTimeout) clearTimeout(giftTimeout);
  socket?.disconnect();
  phaserStage?.destroy();
});
</script>

<style scoped>
/* ===================================================================
   KHUNG CHUẨN BROADCAST — TỰ ĐỘNG KHỚP MỌI KHUNG HÌNH OBS / TIKTOK STUDIO
   (Kể cả khi Browser Source đang để 800x600, 1920x1080 hay 1080x1920)
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
  padding: 2vh 2vw;
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
  max-height: 96vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.4vh;
}

/*
 * Chế độ Dọc TikTok LIVE (9:16):
 * Dùng min(92vw, 49vh) để dù OBS/TikTok LIVE Studio để Browser Source mặc định 800x600,
 * 1920x1080 hay 1080x1920 thì toàn bộ khung game vẫn nằm gọn 100% ở vùng giữa màn hình dọc!
 */
.layout-vertical .broadcast-frame {
  width: min(92vw, 49vh);
  max-width: 100%;
  max-height: 94vh;
  gap: 1.2vh;
}

.gameshow-root.is-embedded .broadcast-frame {
  width: 100%;
  max-height: 100%;
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
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  padding: 0.75rem 0.9rem;
  border-radius: 0.75rem;
  background: rgba(10, 15, 35, 0.88);
  border: 1px solid rgba(16, 185, 129, 0.35);
}

.layout-vertical .explanation-box {
  grid-template-columns: 1fr;
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

/* Gift Banner */
.gift-banner-overlay {
  position: fixed;
  top: 3.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  background: rgba(21, 13, 48, 0.96);
  border: 2px solid var(--accent-gold);
  box-shadow: 0 12px 30px -6px rgba(250, 204, 21, 0.45);
  max-width: 92vw;
}

.gift-icon-ring {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 50%;
  background: rgba(250, 204, 21, 0.2);
  color: var(--accent-gold);
  display: flex;
  align-items: center;
  justify-content: center;
}

.gift-banner-text {
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
  min-width: 0;
}

.gift-banner-text strong {
  color: var(--accent-gold);
}

.gift-tag {
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: var(--accent-gold);
  color: #090a10;
  font-weight: 800;
  font-size: 0.74rem;
  white-space: nowrap;
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
