<template>
  <div class="tug-root" :class="{ embedded }">
    <LiveStageCalibrator
      v-if="!embedded"
      mode="floating"
      :calib="calib"
      :showAvatarSize="true"
      @apply-preset="applyPreset"
      @change="broadcastCalib"
      @reset="resetCalib"
    />
    <div class="tug-stage" :style="embedded ? embeddedStyle : stageStyle">
      <!-- HEADER -->
      <header class="tug-header">
        <div class="title">🪢 KÉO CO <span>TRI THỨC</span></div>
        <div class="sub tabular-nums">
          <template v-if="state.status === 'QUESTION' || state.status === 'REVEAL'">
            Câu {{ Math.max(1, (state.questionIndex ?? 0) + 1) }}/{{ state.totalQuestions }}
          </template>
          <template v-else-if="state.status === 'LOBBY'">Sảnh chờ · Chọn đội</template>
          <template v-else-if="state.status === 'FINISHED'">Kết thúc trận</template>
          <template v-else>Chưa mở game</template>
        </div>
      </header>

      <!-- TEAM SCOREBOARD -->
      <section class="teams tabular-nums">
        <div class="team red" :class="{ frozen: isFrozen('RED') }">
          <div class="team-name">🔴 ĐỘI ĐỎ</div>
          <div class="team-meta">👥 {{ state.teams?.RED?.count || 0 }} · 💪 {{ state.teams?.RED?.contribution || 0 }}</div>
          <div class="team-buffs">
            <span v-if="state.teams?.RED?.doubleActive" class="buff x2">⚡ x2</span>
            <span v-if="isFrozen('RED')" class="buff ice">❄️ {{ frozenLeft('RED') }}s</span>
          </div>
        </div>
        <div class="vs">VS</div>
        <div class="team blue" :class="{ frozen: isFrozen('BLUE') }">
          <div class="team-name">ĐỘI XANH 🔵</div>
          <div class="team-meta">👥 {{ state.teams?.BLUE?.count || 0 }} · 💪 {{ state.teams?.BLUE?.contribution || 0 }}</div>
          <div class="team-buffs">
            <span v-if="state.teams?.BLUE?.doubleActive" class="buff x2">⚡ x2</span>
            <span v-if="isFrozen('BLUE')" class="buff ice">❄️ {{ frozenLeft('BLUE') }}s</span>
          </div>
        </div>
      </section>

      <!-- ROPE ARENA -->
      <section class="arena" :class="{ shake: shaking }">
        <div class="zone zone-red">🏁</div>
        <div class="zone zone-blue">🏁</div>
        <div class="center-line"></div>
        <div class="rope-wrap" :style="{ transform: `translateX(${ropeShiftPct}%)` }">
          <div class="rope">
            <div class="knot">🎀</div>
          </div>

          <!-- Đội Đỏ (Bên trái dây) -->
          <div class="crowd-side left">
            <template v-if="redMembers.length">
              <div
                v-for="(m, idx) in redMembers"
                :key="m.userId"
                class="rope-ava red"
                :class="{ leader: Number(idx) === 0 }"
                :style="ropeAvatarStyle('RED', Number(idx), redMembers.length)"
                :title="`${m.nickname} (${m.contribution} lực)`"
              >
                <img
                  v-if="m.avatarUrl && !failedAvatars[m.userId]"
                  :src="m.avatarUrl"
                  referrerpolicy="no-referrer"
                  @error="markAvatarFailed(m.userId)"
                />
                <span v-else class="rope-ava-fallback">{{ m.nickname?.[0] || '?' }}</span>
                <span v-if="Number(idx) === 0" class="leader-crown">👑</span>
              </div>
              <div v-if="(state.teams?.RED?.count || 0) > redMembers.length" class="crowd-more red tabular-nums">
                +{{ (state.teams?.RED?.count || 0) - redMembers.length }}
              </div>
            </template>
            <div v-else class="puller left-idle">
              <span v-for="i in 2" :key="'l' + i" class="man" :style="{ animationDelay: i * 0.14 + 's' }">🧍</span>
            </div>
          </div>

          <!-- Đội Xanh (Bên phải dây) -->
          <div class="crowd-side right">
            <template v-if="blueMembers.length">
              <div
                v-for="(m, idx) in blueMembers"
                :key="m.userId"
                class="rope-ava blue"
                :class="{ leader: Number(idx) === 0 }"
                :style="ropeAvatarStyle('BLUE', Number(idx), blueMembers.length)"
                :title="`${m.nickname} (${m.contribution} lực)`"
              >
                <img
                  v-if="m.avatarUrl && !failedAvatars[m.userId]"
                  :src="m.avatarUrl"
                  referrerpolicy="no-referrer"
                  @error="markAvatarFailed(m.userId)"
                />
                <span v-else class="rope-ava-fallback">{{ m.nickname?.[0] || '?' }}</span>
                <span v-if="Number(idx) === 0" class="leader-crown">👑</span>
              </div>
              <div v-if="(state.teams?.BLUE?.count || 0) > blueMembers.length" class="crowd-more blue tabular-nums">
                +{{ (state.teams?.BLUE?.count || 0) - blueMembers.length }}
              </div>
            </template>
            <div v-else class="puller right-idle">
              <span v-for="i in 2" :key="'r' + i" class="man" :style="{ animationDelay: i * 0.14 + 's' }">🧍</span>
            </div>
          </div>
        </div>
        <div class="rope-meter tabular-nums">
          <div class="meter-fill red" :style="{ width: redPct + '%' }"></div>
          <div class="meter-fill blue" :style="{ width: bluePct + '%' }"></div>
          <span class="meter-label">{{ ropeLabel }}</span>
        </div>
        <transition name="pop">
          <div v-if="deltaFlash" :key="deltaFlash.key" class="delta-flash" :class="deltaFlash.team">
            {{ deltaFlash.text }}
          </div>
        </transition>
      </section>

      <!-- LOBBY -->
      <section v-if="state.status === 'LOBBY'" class="panel lobby">
        <h2>Comment để vào đội — MIỄN PHÍ!</h2>
        <div class="join-row">
          <div class="join red"><strong>1</strong><span>hoặc "đỏ"</span><em>→ Đội Đỏ</em></div>
          <div class="join blue"><strong>2</strong><span>hoặc "xanh"</span><em>→ Đội Xanh</em></div>
        </div>
        <p>Trả lời A/B/C/D đúng để kéo dây · Spam "kéo" để tiếp sức · Tặng quà để tung kỹ năng!</p>
      </section>

      <!-- QUESTION -->
      <section v-else-if="state.question && (state.status === 'QUESTION' || state.status === 'REVEAL')" class="panel question">
        <div class="q-top">
          <span class="chip">{{ state.question.categoryName }}</span>
          <span class="chip diff">{{ diffLabel(state.question.difficulty) }}</span>
          <span v-if="state.status === 'QUESTION'" class="timer tabular-nums" :class="{ urgent: secondsLeft <= 5 }">⏱ {{ secondsLeft }}s</span>
          <span v-else class="timer reveal">✅ Đáp án</span>
        </div>
        <div v-if="state.status === 'QUESTION'" class="timebar">
          <div class="timebar-fill" :style="{ width: timePct + '%' }"></div>
        </div>
        <h3 class="q-content">{{ state.question.content }}</h3>
        <div class="options">
          <div
            v-for="lbl in ['A', 'B', 'C', 'D']"
            :key="lbl"
            class="opt"
            :class="{
              eliminated: state.eliminatedOptions?.includes(lbl),
              correct: state.status === 'REVEAL' && state.question.correctOption === lbl,
              dim: state.status === 'REVEAL' && state.question.correctOption !== lbl,
            }"
          >
            <b>{{ lbl }}</b>
            <span>{{ state.question.options?.[lbl] }}</span>
          </div>
        </div>
        <div v-if="state.status === 'QUESTION'" class="q-foot tabular-nums">
          💬 Comment A/B/C/D · Đã trả lời: {{ state.answeredCount }}
          <span v-if="state.eliminatedOptions?.length" class="hint">🌪️ 50:50 đã mở!</span>
        </div>
        <div v-else-if="state.lastReveal" class="reveal-row tabular-nums">
          <span class="red">🔴 {{ state.lastReveal.redCorrect }} đúng · +{{ state.lastReveal.redPull }}</span>
          <span class="blue">🔵 {{ state.lastReveal.blueCorrect }} đúng · +{{ state.lastReveal.bluePull }}</span>
        </div>
      </section>

      <!-- WAITING START (REVEAL without question = countdown) -->
      <section v-else-if="state.status === 'REVEAL'" class="panel lobby">
        <h2>🔔 Chuẩn bị! Trận đấu sắp bắt đầu...</h2>
      </section>

      <!-- IDLE -->
      <section v-else-if="state.status === 'IDLE'" class="panel lobby">
        <h2>⏳ Game Kéo Co chưa mở</h2>
        <p>Streamer hãy bấm "Mở sảnh chờ" trong bảng điều khiển.</p>
      </section>

      <!-- TOP CONTRIBUTORS -->
      <section class="tops">
        <div class="top-col red">
          <div class="top-title">🔴 Top Đỏ</div>
          <div v-for="(p, i) in (state.teams?.RED?.top || []).slice(0, 3)" :key="p.userId" class="top-item">
            <span class="rank">{{ i + 1 }}</span>
            <img v-if="p.avatarUrl" :src="p.avatarUrl" class="ava" referrerpolicy="no-referrer" />
            <span v-else class="ava ph">{{ p.nickname?.[0] }}</span>
            <span class="nm">{{ p.nickname }}</span>
            <span class="pt tabular-nums">{{ p.contribution }}</span>
          </div>
          <div v-if="!state.teams?.RED?.top?.length" class="empty">Chưa có ai</div>
        </div>
        <div class="top-col blue">
          <div class="top-title">🔵 Top Xanh</div>
          <div v-for="(p, i) in (state.teams?.BLUE?.top || []).slice(0, 3)" :key="p.userId" class="top-item">
            <span class="rank">{{ i + 1 }}</span>
            <img v-if="p.avatarUrl" :src="p.avatarUrl" class="ava" referrerpolicy="no-referrer" />
            <span v-else class="ava ph">{{ p.nickname?.[0] }}</span>
            <span class="nm">{{ p.nickname }}</span>
            <span class="pt tabular-nums">{{ p.contribution }}</span>
          </div>
          <div v-if="!state.teams?.BLUE?.top?.length" class="empty">Chưa có ai</div>
        </div>
      </section>

      <!-- GIFT GUIDE -->
      <section class="gift-guide">
        <div v-for="t in state.giftTiers || []" :key="t.key" class="gift-tier">
          <span class="g-icon">{{ t.icon }}</span>
          <div>
            <strong>{{ t.name }}</strong>
            <small>{{ t.minCoins }}{{ t.maxCoins ? '–' + t.maxCoins : '+' }} xu</small>
          </div>
        </div>
      </section>

      <!-- EFFECT FEED -->
      <div class="feed">
        <transition-group name="feed">
          <div v-for="e in feed" :key="e.id" class="feed-item" :class="[e.team?.toLowerCase(), e.kind?.toLowerCase()]">
            <img v-if="e.avatarUrl" :src="e.avatarUrl" class="ava sm" referrerpolicy="no-referrer" />
            <span>{{ e.message }}</span>
          </div>
        </transition-group>
      </div>

      <!-- BIG GIFT POPUP -->
      <transition name="pop">
        <div v-if="bigGift" :key="bigGift.id" class="big-gift" :class="bigGift.team?.toLowerCase()">
          <div class="bg-icon">{{ bigGift.icon }}</div>
          <div class="bg-name">{{ bigGift.tierName }}</div>
          <div class="bg-who">{{ bigGift.nickname }} · {{ bigGift.giftName }}</div>
        </div>
      </transition>

      <!-- WINNER -->
      <transition name="pop">
        <div v-if="state.status === 'FINISHED'" class="winner" :class="state.winner?.toLowerCase()">
          <div class="trophy">🏆</div>
          <h2 v-if="state.winner === 'DRAW'">HAI ĐỘI HÒA!</h2>
          <h2 v-else>ĐỘI {{ state.winner === 'RED' ? 'ĐỎ' : 'XANH' }} CHIẾN THẮNG!</h2>
          <div v-if="state.mvp" class="mvp">
            <img v-if="state.mvp.avatarUrl" :src="state.mvp.avatarUrl" class="ava lg" referrerpolicy="no-referrer" />
            <div>
              <small>⭐ MVP của trận</small>
              <strong>{{ state.mvp.nickname }}</strong>
              <span class="tabular-nums">{{ state.mvp.contribution }} lực kéo</span>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
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
const { calib, stageStyle, embeddedStyle, broadcastCalib, attachSocket, applyPreset, resetCalib } =
  useStageCalib(roomCode, () => socket);

const state = ref<any>({ status: 'IDLE', rope: 0, teams: {}, giftTiers: [] });
const now = ref(Date.now());
const clockOffset = ref(0);
const feed = ref<any[]>([]);
const bigGift = ref<any>(null);
const deltaFlash = ref<any>(null);
const shaking = ref(false);
const failedAvatars = ref<Record<string, boolean>>({});
let ticker: number | undefined;
let feedId = 0;
let audioCtx: AudioContext | null = null;

function markAvatarFailed(userId: string) {
  failedAvatars.value = { ...failedAvatars.value, [userId]: true };
}

const redMembers = computed<any[]>(() => state.value.teams?.RED?.members || state.value.teams?.RED?.top || []);
const blueMembers = computed<any[]>(() => state.value.teams?.BLUE?.members || state.value.teams?.BLUE?.top || []);

function ropeAvatarStyle(team: 'RED' | 'BLUE', idx: number, total: number) {
  const pct = total <= 1 ? 0 : Math.min(idx * 17, (idx / (total - 1)) * 84);
  const stagger = [0, -18, 18, -9, 9, -24, 24][idx % 7];
  const style: Record<string, string | number> = {
    top: `calc(50% + ${stagger}px)`,
    zIndex: 80 - idx,
    animationDelay: `${(idx % 6) * 0.12}s`,
  };
  if (team === 'RED') style.right = `${pct}%`;
  else style.left = `${pct}%`;
  return style;
}

function applyState(s: any) {
  if (!s) return;
  if (s.serverNow) clockOffset.value = s.serverNow - Date.now();
  state.value = s;
}

const serverNow = computed(() => now.value + clockOffset.value);
const ropeShiftPct = computed(() => Math.max(-100, Math.min(100, Number(state.value.rope || 0))) * 0.32);
const redPct = computed(() => Math.max(0, Math.min(50, -Number(state.value.rope || 0) / 2)));
const bluePct = computed(() => Math.max(0, Math.min(50, Number(state.value.rope || 0) / 2)));
const ropeLabel = computed(() => {
  const r = Number(state.value.rope || 0);
  if (Math.abs(r) < 0.5) return 'Cân bằng';
  return `${r < 0 ? 'Đỏ' : 'Xanh'} dẫn ${Math.abs(Math.round(r))}%`;
});
const secondsLeft = computed(() => {
  const q = state.value.question;
  if (!q) return 0;
  return Math.max(0, Math.ceil((q.endsAt - serverNow.value) / 1000));
});
const timePct = computed(() => {
  const q = state.value.question;
  if (!q) return 0;
  const total = q.endsAt - q.startedAt;
  return Math.max(0, Math.min(100, ((q.endsAt - serverNow.value) / total) * 100));
});

function isFrozen(team: 'RED' | 'BLUE') {
  const until = state.value.teams?.[team]?.frozenUntil || 0;
  return until > serverNow.value;
}
function frozenLeft(team: 'RED' | 'BLUE') {
  const until = state.value.teams?.[team]?.frozenUntil || 0;
  return Math.max(0, Math.ceil((until - serverNow.value) / 1000));
}
function diffLabel(d?: string) {
  return d === 'EASY' ? '🟢 Dễ' : d === 'HARD' ? '🔴 Khó' : '🟡 Trung bình';
}

function beep(freq = 660, dur = 0.12, type: OscillatorType = 'triangle', vol = 0.08) {
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
  }, 6000);
}

function onEffect(e: any) {
  if (e.kind === 'JOIN' || e.kind === 'SYSTEM' || e.kind === 'GIFT') pushFeed(e);
  if (e.kind === 'GIFT') {
    if (!isEmbedded.value) soundFX.playCorrectAnswer();
    if (e.tier === 'FREEZE' || e.tier === 'STORM' || e.tier === 'DOUBLE') {
      bigGift.value = { ...e, id: ++feedId };
      shaking.value = true;
      setTimeout(() => (shaking.value = false), 600);
      setTimeout(() => {
        if (bigGift.value?.id && bigGift.value.nickname === e.nickname) bigGift.value = null;
      }, 3200);
    }
  }
  if (e.kind === 'WINNER') {
    if (!isEmbedded.value) soundFX.playVictoryFanfare();
  }
}

watch(
  () => state.value.lastReveal,
  (rv, old) => {
    if (!rv || (old && old.delta === rv.delta && old.correctOption === rv.correctOption)) return;
    if (Math.abs(rv.delta) < 0.1) return;
    deltaFlash.value = {
      key: Date.now(),
      team: rv.delta < 0 ? 'red' : 'blue',
      text: `${rv.delta < 0 ? '🔴 Đỏ' : '🔵 Xanh'} kéo ${Math.abs(rv.delta)}!`,
    };
    shaking.value = true;
    if (!isEmbedded.value) soundFX.playPullRope();
    setTimeout(() => (shaking.value = false), 600);
    setTimeout(() => (deltaFlash.value = null), 2200);
  }
);

onMounted(async () => {
  try {
    applyState(await api.tugState(roomCode.value));
  } catch {
    /* backend offline */
  }
  socket = createRoomSocket(roomCode.value);
  attachSocket(socket);
  socket.on('tug.state', applyState);
  socket.on('tug.effect', onEffect);
  ticker = window.setInterval(() => (now.value = Date.now()), 250);
});

onBeforeUnmount(() => {
  socket?.disconnect();
  if (ticker) clearInterval(ticker);
});
</script>

<style scoped>
.tug-root {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background:
    radial-gradient(circle at 0% 30%, rgba(244, 63, 94, 0.28), transparent 45%),
    radial-gradient(circle at 100% 30%, rgba(14, 165, 233, 0.28), transparent 45%),
    linear-gradient(180deg, #0b0820 0%, #120a2e 100%);
  color: #fff;
  overflow: hidden;
}
.tug-root.embedded {
  min-height: 0;
  border-radius: 0.875rem;
}
.tug-stage {
  position: relative;
  width: 100%;
  max-width: 760px;
  padding: 1.25rem 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}
.tug-header {
  text-align: center;
}
.tug-header .title {
  font-size: clamp(1.6rem, 5vw, 2.4rem);
  font-weight: 900;
  letter-spacing: 0.04em;
  text-shadow: 0 4px 18px rgba(192, 132, 252, 0.6);
}
.tug-header .title span {
  background: linear-gradient(90deg, #fb7185, #facc15, #38bdf8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.tug-header .sub {
  font-size: 0.95rem;
  color: #c7d2fe;
  font-weight: 700;
}

.teams {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0.6rem;
}
.team {
  border-radius: 1rem;
  padding: 0.7rem 0.9rem;
  border: 2px solid transparent;
  transition: filter 0.3s ease;
}
.team.red {
  background: linear-gradient(135deg, rgba(225, 29, 72, 0.85), rgba(159, 18, 57, 0.85));
  border-color: #fda4af;
}
.team.blue {
  background: linear-gradient(135deg, rgba(2, 132, 199, 0.85), rgba(30, 64, 175, 0.85));
  border-color: #7dd3fc;
  text-align: right;
}
.team.frozen {
  filter: saturate(0.3) brightness(1.2) hue-rotate(160deg);
}
.team-name {
  font-weight: 900;
  font-size: 1.1rem;
}
.team-meta {
  font-size: 0.85rem;
  opacity: 0.9;
}
.team-buffs {
  display: flex;
  gap: 0.35rem;
  min-height: 1.4rem;
  margin-top: 0.2rem;
}
.team.blue .team-buffs {
  justify-content: flex-end;
}
.buff {
  font-size: 0.75rem;
  font-weight: 900;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
}
.buff.x2 {
  background: #facc15;
  color: #1a1300;
  animation: pulse 0.8s infinite alternate;
}
.buff.ice {
  background: #e0f2fe;
  color: #075985;
}
.vs {
  font-weight: 900;
  font-size: 1.4rem;
  color: #facc15;
  text-shadow: 0 0 12px rgba(250, 204, 21, 0.7);
}

.arena {
  position: relative;
  height: 168px;
  border-radius: 1.1rem;
  background: linear-gradient(90deg, rgba(244, 63, 94, 0.25), rgba(255, 255, 255, 0.04) 50%, rgba(14, 165, 233, 0.25));
  border: 1px solid rgba(255, 255, 255, 0.15);
  overflow: hidden;
}
.arena.shake {
  animation: shake 0.5s;
}
.zone {
  position: absolute;
  top: 0;
  bottom: 30px;
  width: 9%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}
.zone-red {
  left: 0;
  background: repeating-linear-gradient(45deg, rgba(244, 63, 94, 0.35) 0 8px, transparent 8px 16px);
}
.zone-blue {
  right: 0;
  background: repeating-linear-gradient(45deg, rgba(14, 165, 233, 0.35) 0 8px, transparent 8px 16px);
}
.center-line {
  position: absolute;
  left: 50%;
  top: 8px;
  bottom: 34px;
  width: 3px;
  background: #facc15;
  box-shadow: 0 0 12px #facc15;
  transform: translateX(-50%);
}
.rope-wrap {
  position: absolute;
  left: 0;
  right: 0;
  top: 12px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}
.rope {
  position: relative;
  width: 84%;
  height: 10px;
  border-radius: 6px;
  background: repeating-linear-gradient(60deg, #d6a36a 0 8px, #a16207 8px 14px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5);
  z-index: 2;
}
.knot {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -55%);
  font-size: 2rem;
  filter: drop-shadow(0 0 10px #facc15);
  z-index: 95;
}
.crowd-side {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 10;
}
.crowd-side.left {
  left: 5%;
  right: 54%;
}
.crowd-side.right {
  left: 54%;
  right: 5%;
}
.rope-ava {
  position: absolute;
  width: var(--tug-ava-size, 34px);
  height: var(--tug-ava-size, 34px);
  margin-top: calc(var(--tug-ava-size, 34px) * -0.5);
  border-radius: 50%;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.65);
  transition: left 0.45s ease, right 0.45s ease, top 0.45s ease;
}
.rope-ava.red {
  background: linear-gradient(135deg, #fb7185, #be123c);
  border: 2px solid #fecdd3;
  animation: pull-left 0.75s ease-in-out infinite alternate;
}
.rope-ava.blue {
  background: linear-gradient(135deg, #38bdf8, #1d4ed8);
  border: 2px solid #bae6fd;
  animation: pull-right 0.75s ease-in-out infinite alternate;
}
.rope-ava.leader {
  width: calc(var(--tug-ava-size, 34px) + 4px);
  height: calc(var(--tug-ava-size, 34px) + 4px);
  margin-top: calc((var(--tug-ava-size, 34px) + 4px) * -0.5);
  border-color: #facc15;
  box-shadow: 0 0 14px rgba(250, 204, 21, 0.75);
}
.rope-ava img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}
.rope-ava-fallback {
  font-size: 0.85rem;
  font-weight: 900;
  color: #ffffff;
  text-transform: uppercase;
}
.leader-crown {
  position: absolute;
  top: -11px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.78rem;
  line-height: 1;
  pointer-events: none;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8));
}
.crowd-more {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 90;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 900;
  color: #ffffff;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid #facc15;
}
.crowd-more.red {
  left: 0;
}
.crowd-more.blue {
  right: 0;
}
.puller {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 0.1rem;
  font-size: 2rem;
}
.puller.left-idle {
  right: 0;
  filter: drop-shadow(0 0 6px #f43f5e) hue-rotate(-20deg);
}
.puller.right-idle {
  left: 0;
  filter: drop-shadow(0 0 6px #0ea5e9);
}
.man {
  display: inline-block;
  animation: pull 0.7s ease-in-out infinite alternate;
}
.rope-meter {
  position: absolute;
  left: 0.75rem;
  right: 0.75rem;
  bottom: 0.5rem;
  height: 18px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.45);
  overflow: hidden;
}
.meter-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  transition: width 0.9s ease;
}
.meter-fill.red {
  right: 50%;
  background: linear-gradient(270deg, #fb7185, #be123c);
}
.meter-fill.blue {
  left: 50%;
  background: linear-gradient(90deg, #38bdf8, #1d4ed8);
}
.meter-label {
  position: relative;
  display: block;
  text-align: center;
  font-size: 0.72rem;
  font-weight: 900;
  line-height: 18px;
  text-shadow: 0 1px 2px #000;
}
.delta-flash {
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.3rem 0.9rem;
  border-radius: 999px;
  font-weight: 900;
  font-size: 1.05rem;
  white-space: nowrap;
}
.delta-flash.red {
  background: #e11d48;
}
.delta-flash.blue {
  background: #0284c7;
}

.panel {
  background: rgba(15, 12, 41, 0.85);
  border: 1px solid rgba(192, 132, 252, 0.35);
  border-radius: 1.1rem;
  padding: 1rem 1.1rem;
  box-shadow: 0 14px 36px -10px rgba(0, 0, 0, 0.7);
}
.lobby {
  text-align: center;
}
.lobby h2 {
  font-size: 1.3rem;
  font-weight: 900;
  margin-bottom: 0.7rem;
}
.lobby p {
  color: #c7d2fe;
  font-size: 0.92rem;
}
.join-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.join {
  border-radius: 1rem;
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.join strong {
  font-size: 2.6rem;
  font-weight: 900;
  line-height: 1;
}
.join em {
  font-style: normal;
  font-weight: 800;
}
.join span {
  font-size: 0.8rem;
  opacity: 0.85;
}
.join.red {
  background: linear-gradient(135deg, #e11d48, #9f1239);
}
.join.blue {
  background: linear-gradient(135deg, #0284c7, #1e40af);
}

.q-top {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}
.chip {
  font-size: 0.74rem;
  font-weight: 800;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  background: rgba(192, 132, 252, 0.2);
  color: #e9d5ff;
}
.timer {
  margin-left: auto;
  font-weight: 900;
  font-size: 1.1rem;
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
  margin: 0.55rem 0;
  overflow: hidden;
}
.timebar-fill {
  height: 100%;
  background: linear-gradient(90deg, #facc15, #fb7185);
  transition: width 0.25s linear;
}
.q-content {
  font-size: clamp(1.1rem, 3.4vw, 1.45rem);
  font-weight: 800;
  line-height: 1.35;
  margin: 0.4rem 0 0.8rem;
}
.options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.55rem;
}
.opt {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.6rem 0.75rem;
  border-radius: 0.8rem;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.14);
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}
.opt b {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.9rem;
  height: 1.9rem;
  border-radius: 0.55rem;
  background: linear-gradient(135deg, #7c3aed, #c026d3);
  font-weight: 900;
}
.opt.eliminated {
  opacity: 0.25;
  text-decoration: line-through;
}
.opt.correct {
  background: rgba(16, 185, 129, 0.35);
  border-color: #34d399;
  box-shadow: 0 0 18px rgba(52, 211, 153, 0.55);
}
.opt.correct b {
  background: #10b981;
}
.opt.dim {
  opacity: 0.45;
}
.q-foot {
  margin-top: 0.7rem;
  font-size: 0.86rem;
  color: #c7d2fe;
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}
.hint {
  color: #facc15;
  font-weight: 800;
}
.reveal-row {
  margin-top: 0.7rem;
  display: flex;
  justify-content: space-between;
  font-weight: 800;
  font-size: 0.95rem;
}
.reveal-row .red {
  color: #fda4af;
}
.reveal-row .blue {
  color: #7dd3fc;
}

.tops {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
}
.top-col {
  border-radius: 0.9rem;
  padding: 0.6rem 0.7rem;
  background: rgba(15, 12, 41, 0.75);
}
.top-col.red {
  border: 1px solid rgba(244, 63, 94, 0.5);
}
.top-col.blue {
  border: 1px solid rgba(14, 165, 233, 0.5);
}
.top-title {
  font-weight: 900;
  font-size: 0.85rem;
  margin-bottom: 0.35rem;
}
.top-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  padding: 0.15rem 0;
}
.rank {
  width: 1.1rem;
  font-weight: 900;
  color: #facc15;
}
.ava {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  background: #312e81;
  flex-shrink: 0;
}
.ava.ph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 800;
}
.ava.sm {
  width: 22px;
  height: 22px;
}
.ava.lg {
  width: 64px;
  height: 64px;
  border: 3px solid #facc15;
}
.nm {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 700;
}
.pt {
  font-weight: 900;
  color: #facc15;
}
.empty {
  font-size: 0.78rem;
  color: #94a3b8;
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
  top: 46%;
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
  font-size: 0.8rem;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.feed-item.red {
  border-color: #fb7185;
}
.feed-item.blue {
  border-color: #38bdf8;
}
.feed-item.gift {
  background: linear-gradient(90deg, rgba(202, 138, 4, 0.9), rgba(0, 0, 0, 0.7));
}
.feed-enter-active,
.feed-leave-active {
  transition: all 0.35s ease;
}
.feed-enter-from,
.feed-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.big-gift {
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
  z-index: 10;
  text-align: center;
  padding: 1.2rem 2rem;
  border-radius: 1.4rem;
  background: rgba(0, 0, 0, 0.82);
  border: 3px solid #facc15;
  box-shadow: 0 0 60px rgba(250, 204, 21, 0.6);
}
.big-gift.red {
  border-color: #fb7185;
  box-shadow: 0 0 60px rgba(244, 63, 94, 0.7);
}
.big-gift.blue {
  border-color: #38bdf8;
  box-shadow: 0 0 60px rgba(14, 165, 233, 0.7);
}
.bg-icon {
  font-size: 4rem;
  animation: spin-pop 0.8s ease;
}
.bg-name {
  font-size: 1.6rem;
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
  gap: 0.8rem;
  background: rgba(5, 3, 20, 0.86);
  text-align: center;
}
.winner h2 {
  font-size: clamp(1.8rem, 6vw, 2.8rem);
  font-weight: 900;
}
.winner.red h2 {
  color: #fb7185;
  text-shadow: 0 0 24px #e11d48;
}
.winner.blue h2 {
  color: #38bdf8;
  text-shadow: 0 0 24px #0284c7;
}
.trophy {
  font-size: 5rem;
  animation: spin-pop 1s ease;
}
.mvp {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.2rem;
  border-radius: 1rem;
  background: rgba(250, 204, 21, 0.12);
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
  transform: translate(-50%, -50%) scale(0.6);
}
.winner.pop-enter-from,
.winner.pop-leave-to {
  transform: scale(0.9);
}
.delta-flash.pop-enter-from,
.delta-flash.pop-leave-to {
  transform: translateX(-50%) scale(0.6);
}

@keyframes pull {
  from {
    transform: rotate(-8deg) translateX(0);
  }
  to {
    transform: rotate(10deg) translateX(3px);
  }
}
@keyframes pull-left {
  from {
    transform: translateX(0) rotate(0deg);
  }
  to {
    transform: translateX(-4px) rotate(-6deg);
  }
}
@keyframes pull-right {
  from {
    transform: translateX(0) rotate(0deg);
  }
  to {
    transform: translateX(4px) rotate(6deg);
  }
}
@keyframes pulse {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
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
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0);
  }
}
@media (max-width: 520px) {
  .gift-guide {
    grid-template-columns: repeat(2, 1fr);
  }
  .options {
    grid-template-columns: 1fr;
  }
}
</style>
