<template>
  <!-- FLOATING MODE (Trên màn hình LIVE / OBS độc lập) -->
  <div v-if="mode === 'floating'" class="cal-floating" :class="{ open: isOpen }">
    <button type="button" class="cal-toggle-btn" @click="isOpen = !isOpen">
      <span>⚙️ {{ isOpen ? 'Đóng chỉnh màn hình' : 'Tùy chỉnh màn hình' }}</span>
    </button>

    <div v-if="isOpen" class="cal-popup tabular-nums">
      <div class="cal-head">
        <strong>📱 Căn chỉnh màn hình LIVE</strong>
        <span class="cal-badge">{{ calib.maxWidth }}px · {{ calib.scale }}%</span>
      </div>

      <div class="cal-presets">
        <button
          type="button"
          class="cal-preset-btn"
          :class="{ active: calib.preset === 'fullscreen' }"
          @click="$emit('apply-preset', 'fullscreen')"
        >
          📱 Full Màn Hình
        </button>
        <button
          type="button"
          class="cal-preset-btn"
          :class="{ active: calib.preset === 'tiktok-safe-zone' }"
          @click="$emit('apply-preset', 'tiktok-safe-zone')"
        >
          🎯 Vùng An Toàn TikTok
        </button>
        <button
          type="button"
          class="cal-preset-btn"
          :class="{ active: calib.preset === 'compact' }"
          @click="$emit('apply-preset', 'compact')"
        >
          📦 Khung Gọn 380px
        </button>
      </div>

      <div class="cal-sliders">
        <label class="cal-field">
          <span><span>Thu phóng (Zoom)</span><strong>{{ calib.scale }}%</strong></span>
          <input v-model.number="calib.scale" type="range" min="50" max="130" step="1" @input="$emit('change')" />
        </label>
        <label class="cal-field">
          <span><span>Rộng khung (px)</span><strong>{{ calib.maxWidth }}px</strong></span>
          <input v-model.number="calib.maxWidth" type="range" min="300" max="960" step="10" @input="$emit('change')" />
        </label>
        <label class="cal-field">
          <span><span>Đẩy Lên / Xuống</span><strong>{{ signed(calib.offsetY) }}%</strong></span>
          <input v-model.number="calib.offsetY" type="range" min="-35" max="35" step="1" @input="$emit('change')" />
        </label>
        <label class="cal-field">
          <span><span>Đẩy Trái / Phải</span><strong>{{ signed(calib.offsetX) }}%</strong></span>
          <input v-model.number="calib.offsetX" type="range" min="-30" max="30" step="1" @input="$emit('change')" />
        </label>
        <label class="cal-field">
          <span><span>Lề Trên (px)</span><strong>{{ calib.paddingTop }}px</strong></span>
          <input v-model.number="calib.paddingTop" type="range" min="0" max="260" step="4" @input="$emit('change')" />
        </label>
        <label class="cal-field">
          <span><span>Lề Dưới (px)</span><strong>{{ calib.paddingBottom }}px</strong></span>
          <input v-model.number="calib.paddingBottom" type="range" min="0" max="320" step="4" @input="$emit('change')" />
        </label>
        <label v-if="showAvatarSize" class="cal-field full">
          <span><span>Cỡ Avatar kéo co (px)</span><strong>{{ calib.avatarSize }}px</strong></span>
          <input v-model.number="calib.avatarSize" type="range" min="22" max="54" step="1" @input="$emit('change')" />
        </label>
      </div>

      <!-- SOUND FX CONTROLS (FLOATING) -->
      <div class="cal-sound-box">
        <div class="cal-sound-header">
          <button
            type="button"
            class="cal-sound-toggle-btn"
            :class="{ active: soundEnabled }"
            @click="toggleSound"
          >
            <span>{{ soundEnabled ? '🔊 Âm thanh: BẬT' : '🔇 Âm thanh: TẮT' }}</span>
          </button>
          <button type="button" class="cal-test-sound-btn" :disabled="!soundEnabled" @click="playCorrect">
            🔔 Test chuông
          </button>
        </div>
        <label v-if="soundEnabled" class="cal-field sound-slider">
          <span><span>Âm lượng Sound FX</span><strong>{{ Math.round(soundVolume * 100) }}%</strong></span>
          <input v-model.number="soundVolume" type="range" min="0" max="1" step="0.05" />
        </label>
      </div>

      <!-- MC AI VOICE CONTROLS (FLOATING) -->
      <div class="cal-voice-box">
        <div class="cal-sound-header">
          <button
            type="button"
            class="cal-voice-toggle-btn"
            :class="{ active: voiceEnabled }"
            @click="voiceEnabled = !voiceEnabled"
          >
            <span>{{ voiceEnabled ? '🗣️ MC Ảo AI: BẬT' : '🤐 MC Ảo AI: TẮT' }}</span>
          </button>
          <button type="button" class="cal-test-voice-btn" :disabled="!voiceEnabled" @click="testVoice">
            🎤 Thử giọng
          </button>
        </div>
        <div v-if="voiceEnabled" class="cal-voice-body">
          <label class="cal-field" style="margin-bottom: 0.45rem;">
            <span><span>Giọng đọc Tiếng Việt</span></span>
            <select
              v-model="selectedVoiceURI"
              class="cal-select-control text-xs"
              style="width: 100%; margin-top: 0.25rem; background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; padding: 0.25rem 0.4rem; color: #fff;"
            >
              <option v-for="v in vietnameseVoices" :key="v.voiceURI" :value="v.voiceURI">
                {{ v.name }}
              </option>
            </select>
          </label>
          <label class="cal-field voice-slider">
            <span><span>Tốc độ đọc</span><strong>{{ voiceRate }}x</strong></span>
            <input v-model.number="voiceRate" type="range" min="0.8" max="1.4" step="0.05" />
          </label>
          <label class="cal-checkbox-row">
            <input v-model="readOptions" type="checkbox" />
            <span>Đọc to cả 4 phương án A, B, C, D</span>
          </label>
        </div>
      </div>

      <div class="cal-foot">
        <button type="button" class="cal-reset-btn" @click="$emit('reset')">↺ Đặt lại mặc định</button>
      </div>
    </div>
  </div>

  <!-- PANEL MODE (Trong Streamer Dashboard) -->
  <section v-else class="panel-card cal-panel tabular-nums">
    <div class="panel-header">
      <div class="panel-title-group">
        <SlidersHorizontal :size="19" class="icon-cyan" />
        <h2>📱 Điều Chỉnh Bố Cục Màn Hình LIVE (Đồng bộ Realtime)</h2>
      </div>
      <div class="cal-panel-right">
        <span class="badge badge-cyan">{{ calib.maxWidth }}px · {{ calib.scale }}%</span>
        <button type="button" class="btn btn-secondary btn-xs" @click="$emit('reset')">
          ↺ Mặc định
        </button>
      </div>
    </div>

    <div class="cal-presets">
      <button
        type="button"
        class="btn"
        :class="calib.preset === 'fullscreen' ? 'btn-cyan' : 'btn-secondary'"
        @click="$emit('apply-preset', 'fullscreen')"
      >
        📱 Full Màn Hình
      </button>
      <button
        type="button"
        class="btn"
        :class="calib.preset === 'tiktok-safe-zone' ? 'btn-cyan' : 'btn-secondary'"
        @click="$emit('apply-preset', 'tiktok-safe-zone')"
      >
        🎯 Vùng An Toàn TikTok
      </button>
      <button
        type="button"
        class="btn"
        :class="calib.preset === 'compact' ? 'btn-cyan' : 'btn-secondary'"
        @click="$emit('apply-preset', 'compact')"
      >
        📦 Khung Gọn 380px
      </button>
    </div>

    <div class="cal-panel-grid">
      <label class="cal-field">
        <span><span>Thu phóng kích thước (Zoom)</span><strong>{{ calib.scale }}%</strong></span>
        <input v-model.number="calib.scale" type="range" min="50" max="130" step="1" @input="$emit('change')" />
      </label>
      <label class="cal-field">
        <span><span>Chiều rộng khung LIVE</span><strong>{{ calib.maxWidth }}px</strong></span>
        <input v-model.number="calib.maxWidth" type="range" min="300" max="960" step="10" @input="$emit('change')" />
      </label>
      <label class="cal-field">
        <span><span>Đẩy Lên / Xuống (Tránh chat)</span><strong>{{ signed(calib.offsetY) }}%</strong></span>
        <input v-model.number="calib.offsetY" type="range" min="-35" max="35" step="1" @input="$emit('change')" />
      </label>
      <label class="cal-field">
        <span><span>Đẩy Trái / Phải</span><strong>{{ signed(calib.offsetX) }}%</strong></span>
        <input v-model.number="calib.offsetX" type="range" min="-30" max="30" step="1" @input="$emit('change')" />
      </label>
      <label class="cal-field">
        <span><span>Lề Trên (Tránh Avatar Host)</span><strong>{{ calib.paddingTop }}px</strong></span>
        <input v-model.number="calib.paddingTop" type="range" min="0" max="260" step="4" @input="$emit('change')" />
      </label>
      <label class="cal-field">
        <span><span>Lề Dưới (Tránh Khung Chat)</span><strong>{{ calib.paddingBottom }}px</strong></span>
        <input v-model.number="calib.paddingBottom" type="range" min="0" max="320" step="4" @input="$emit('change')" />
      </label>
      <label v-if="showAvatarSize" class="cal-field full">
        <span><span>Cỡ Avatar người chơi trên dây kéo co</span><strong>{{ calib.avatarSize }}px</strong></span>
        <input v-model.number="calib.avatarSize" type="range" min="22" max="54" step="1" @input="$emit('change')" />
      </label>
    </div>

    <!-- SOUND FX CONTROLS (PANEL) -->
    <div class="cal-sound-panel-box">
      <div class="sound-panel-left">
        <button
          type="button"
          class="btn btn-sm"
          :class="soundEnabled ? 'btn-emerald' : 'btn-secondary'"
          @click="toggleSound"
        >
          <span>{{ soundEnabled ? '🔊 Âm thanh Sound FX: ĐANG BẬT' : '🔇 Âm thanh Sound FX: ĐANG TẮT' }}</span>
        </button>
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          :disabled="!soundEnabled"
          @click="playCorrect"
        >
          🔔 Thử chuông đúng
        </button>
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          :disabled="!soundEnabled"
          @click="playStart"
        >
          🎺 Thử tiếng bắt đầu
        </button>
      </div>
      <div v-if="soundEnabled" class="sound-panel-right">
        <span class="text-xs text-slate-400 font-semibold">Âm lượng: {{ Math.round(soundVolume * 100) }}%</span>
        <input v-model.number="soundVolume" type="range" min="0" max="1" step="0.05" class="sound-range" />
      </div>
    </div>

    <!-- MC AI VOICE CONTROLS (PANEL) -->
    <div class="cal-voice-panel-box">
      <div class="voice-panel-left">
        <button
          type="button"
          class="btn btn-sm"
          :class="voiceEnabled ? 'btn-gold' : 'btn-secondary'"
          @click="voiceEnabled = !voiceEnabled"
        >
          <span>{{ voiceEnabled ? '🗣️ MC Ảo AI Đọc Câu Hỏi: ĐANG BẬT' : '🤐 MC Ảo AI: ĐANG TẮT' }}</span>
        </button>
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          :disabled="!voiceEnabled"
          @click="testVoice"
        >
          🎤 Thử giọng MC
        </button>
        <label v-if="voiceEnabled" class="inline-flex items-center gap-1.5 text-xs text-slate-300 font-semibold cursor-pointer">
          <input v-model="readOptions" type="checkbox" class="accent-cyan-400" />
          <span>Đọc cả 4 đáp án A B C D</span>
        </label>
        <label v-if="voiceEnabled" class="inline-flex items-center gap-1.5 text-xs text-slate-300 font-semibold cursor-pointer">
          <input v-model="readExplanation" type="checkbox" class="accent-cyan-400" />
          <span>Đọc giải thích khi mở đáp án</span>
        </label>
      </div>
      <div v-if="voiceEnabled" class="voice-panel-right" style="display: flex; gap: 0.65rem; align-items: center; flex-wrap: wrap;">
        <select
          v-model="selectedVoiceURI"
          class="select-control"
          style="font-size: 0.76rem; padding: 0.25rem 0.5rem; max-width: 250px; background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; color: #fff;"
        >
          <option v-for="v in vietnameseVoices" :key="v.voiceURI" :value="v.voiceURI">
            {{ v.name }}
          </option>
        </select>
        <div style="display: flex; align-items: center; gap: 0.35rem;">
          <span class="text-xs text-slate-400 font-semibold">{{ voiceRate }}x</span>
          <input v-model.number="voiceRate" type="range" min="0.8" max="1.4" step="0.05" class="sound-range" style="width: 80px;" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SlidersHorizontal } from 'lucide-vue-next';
import type { StageCalibState, StagePresetName } from '../composables/useStageCalib';
import { useSoundEffects } from '../composables/useSoundEffects';
import { useAiVoice } from '../composables/useAiVoice';

const {
  soundEnabled,
  soundVolume,
  toggleSound,
  playCorrect,
  playStart,
} = useSoundEffects();

const {
  voiceEnabled,
  voiceVolume,
  voiceRate,
  readOptions,
  readExplanation,
  selectedVoiceURI,
  vietnameseVoices,
  testVoice,
} = useAiVoice();

defineProps<{
  mode: 'floating' | 'panel';
  calib: StageCalibState;
  showAvatarSize?: boolean;
}>();

defineEmits<{
  (e: 'apply-preset', preset: StagePresetName): void;
  (e: 'change'): void;
  (e: 'reset'): void;
}>();

const isOpen = ref(false);

function signed(v: number) {
  return v > 0 ? `+${v}` : `${v}`;
}
</script>

<style scoped>
/* Floating widget on LIVE overlay */
.cal-floating {
  position: fixed;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 80;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.cal-toggle-btn {
  padding: 0.42rem 0.85rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.78);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 240, 255, 0.45);
  color: #e0f2fe;
  font-size: 0.78rem;
  font-weight: 800;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
  transition: all 0.2s ease;
}

.cal-toggle-btn:hover {
  background: rgba(0, 240, 255, 0.2);
  border-color: #38bdf8;
}

.cal-popup {
  width: min(340px, calc(100vw - 1.5rem));
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  background: rgba(10, 14, 38, 0.92);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 240, 255, 0.45);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.78);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: #f8fafc;
}

.cal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.86rem;
}

.cal-badge {
  font-size: 0.74rem;
  font-weight: 800;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: rgba(0, 240, 255, 0.15);
  color: #38bdf8;
}

.cal-presets {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.4rem;
}

.cal-preset-btn {
  padding: 0.38rem 0.4rem;
  border-radius: 0.55rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  font-size: 0.72rem;
  font-weight: 700;
  text-align: center;
  transition: all 0.15s ease;
}

.cal-preset-btn.active {
  background: rgba(0, 240, 255, 0.2);
  border-color: #38bdf8;
  color: #ffffff;
}

.cal-sliders,
.cal-panel-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem 0.75rem;
}

.cal-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #cbd5e1;
}

.cal-field.full {
  grid-column: 1 / -1;
}

.cal-field > span {
  display: flex;
  justify-content: space-between;
  gap: 0.35rem;
}

.cal-field strong {
  color: #facc15;
}

.cal-field input[type='range'] {
  width: 100%;
  accent-color: #00f0ff;
  cursor: pointer;
}

.cal-foot {
  display: flex;
  justify-content: flex-end;
}

.cal-reset-btn {
  font-size: 0.76rem;
  font-weight: 700;
  color: #94a3b8;
  padding: 0.2rem 0.5rem;
}

.cal-reset-btn:hover {
  color: #ffffff;
}

/* Dashboard panel mode */
.cal-panel {
  background: var(--surface-panel);
  border: 1px solid var(--border-subtle);
  border-radius: 1rem;
  padding: 1.15rem 1.25rem;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.panel-title-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel-title-group h2 {
  font-size: 1rem;
  font-weight: 800;
}

.cal-panel-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-xs {
  padding: 0.3rem 0.65rem;
  font-size: 0.76rem;
}

.cal-panel .cal-presets .btn {
  padding: 0.45rem 0.55rem;
  font-size: 0.78rem;
}

.icon-cyan {
  color: var(--accent-cyan);
}

.cal-sound-box {
  margin-top: 0.6rem;
  padding: 0.65rem 0.75rem;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cal-sound-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.cal-sound-toggle-btn {
  padding: 0.35rem 0.7rem;
  font-size: 0.78rem;
  font-weight: 700;
  border-radius: 0.45rem;
  border: 1px solid #334155;
  background: #1e293b;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
}

.cal-sound-toggle-btn.active {
  background: #059669;
  border-color: #10b981;
  color: #fff;
}

.cal-test-sound-btn {
  padding: 0.3rem 0.6rem;
  font-size: 0.75rem;
  border-radius: 0.45rem;
  background: #334155;
  color: #e2e8f0;
  border: none;
  cursor: pointer;
}
.cal-test-sound-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.cal-sound-panel-box {
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(15, 23, 42, 0.45);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.sound-panel-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.sound-panel-right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.sound-range {
  width: 90px;
  cursor: pointer;
}

.btn-emerald {
  background: #059669;
  color: #fff;
}
.btn-emerald:hover {
  background: #047857;
}

/* AI Voice Styles */
.cal-voice-box {
  margin-top: 0.5rem;
  padding: 0.65rem 0.75rem;
  background: rgba(30, 27, 75, 0.75);
  border: 1px solid rgba(245, 158, 11, 0.35);
  border-radius: 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cal-voice-toggle-btn {
  padding: 0.35rem 0.7rem;
  font-size: 0.78rem;
  font-weight: 700;
  border-radius: 0.45rem;
  border: 1px solid #475569;
  background: #1e293b;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
}

.cal-voice-toggle-btn.active {
  background: #d97706;
  border-color: #f59e0b;
  color: #fff;
}

.cal-test-voice-btn {
  padding: 0.3rem 0.6rem;
  font-size: 0.75rem;
  border-radius: 0.45rem;
  background: #475569;
  color: #fef08a;
  border: none;
  cursor: pointer;
}
.cal-test-voice-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.cal-voice-body {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.cal-checkbox-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.76rem;
  color: #cbd5e1;
  cursor: pointer;
}

.cal-voice-panel-box {
  margin-top: 0.6rem;
  padding: 0.75rem 1rem;
  background: rgba(30, 27, 75, 0.5);
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.voice-panel-left {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.voice-panel-right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.btn-gold {
  background: #d97706;
  color: #fff;
}
.btn-gold:hover {
  background: #b45309;
}

@media (max-width: 560px) {
  .cal-panel .cal-presets {
    grid-template-columns: 1fr;
  }
}
</style>
