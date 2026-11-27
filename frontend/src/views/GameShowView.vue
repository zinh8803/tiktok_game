<template>
  <div
    class="gameshow-root"
    :class="[
      `theme-${currentTheme}`,
      {
        'layout-vertical': isVerticalLayout,
        'layout-landscape': !isVerticalLayout,
        'is-embedded': isEmbedded,
      }
    ]"
  >
    <div
      class="question-color-cycle-background"
      :style="{ background: questionColorCycleBackground }"
      aria-hidden="true"
    ></div>

    <!-- Phaser 3 Canvas Stage Layer -->
    <div ref="phaserContainer" class="phaser-canvas-layer"></div>

    <!-- Floating Quick Calibrator & Theme Toggle (chỉ hiện trên màn hình Game Show độc lập) -->
    <div v-if="!isEmbedded" class="calib-floating-widget" :class="{ 'calib-open': showCalibPanel }">
      <div class="calib-top-actions">
        <!-- Cụm nút bật/tắt & tăng giảm nhanh Nhạc nền Lofi trên thanh nổi -->
        <div class="quick-audio-pill tabular-nums">
          <button
            type="button"
            class="quick-audio-toggle"
            :title="isSoundMuted ? 'Âm thanh đang tắt (Bấm để bật)' : 'Bấm để Tắt/Bật âm thanh'"
            @click="toggleSoundMute"
          >
            <span>{{
              isSoundMuted
                ? '🔇 Đã tắt'
                : bgmEnabled && bgmVolume > 0
                  ? `🎵 Lofi ${bgmVolume}%`
                  : '🔊 Chỉ SFX'
            }}</span>
          </button>
          <button
            v-if="!isSoundMuted"
            type="button"
            class="quick-vol-step-btn"
            title="Giảm âm lượng nhạc Lofi (-10%)"
            @click="stepBgmVolume(-10)"
          >
            −
          </button>
          <button
            v-if="!isSoundMuted"
            type="button"
            class="quick-vol-step-btn"
            title="Tăng âm lượng nhạc Lofi (+10%)"
            @click="stepBgmVolume(10)"
          >
            +
          </button>
        </div>

        <!-- Nút đổi theme nhanh 1 chạm -->
        <button
          type="button"
          class="quick-theme-btn"
          :title="`Đang dùng theme: ${currentThemeInfo?.name} (Bấm để đổi nhanh)`"
          @click="cycleNextTheme"
        >
          <span>{{ currentThemeInfo?.icon }} {{ currentThemeInfo?.name }}</span>
        </button>

        <!-- Nút mở bảng cài đặt -->
        <button
          type="button"
          class="calib-toggle-btn"
          title="Cài đặt Nhạc Lofi, Theme & Khung hình TikTok"
          @click="showCalibPanel = !showCalibPanel"
        >
          <span>⚙️ {{ showCalibPanel ? 'Đóng' : 'Nhạc & Cài đặt' }}</span>
        </button>
      </div>

      <div v-if="showCalibPanel" class="calib-popup-card tabular-nums">
        <!-- BỘ CÀI ĐẶT NHẠC NỀN LOFI KHÔNG LỜI & ÂM LƯỢNG -->
        <div class="lofi-audio-section">
          <div class="calib-popup-header">
            <strong>🎵 Nhạc Nền Lofi Không Lời</strong>
            <button
              type="button"
              class="lofi-power-btn"
              :class="{ active: !isSoundMuted && bgmEnabled && bgmVolume > 0 }"
              @click="toggleBgmEnabled"
            >
              {{ !isSoundMuted && bgmEnabled && bgmVolume > 0 ? '🟢 Đang Bật' : '⚪ Đang Tắt' }}
            </button>
          </div>

          <!-- Chọn phong cách giai điệu Lofi -->
          <div class="lofi-style-row">
            <button
              v-for="st in LOFI_STYLE_OPTIONS"
              :key="st.id"
              type="button"
              class="lofi-style-btn"
              :class="{ active: lofiStyle === st.id }"
              :title="st.desc"
              @click="changeLofiStyle(st.id)"
            >
              <span>{{ st.icon }}</span>
              <strong>{{ st.name.replace('Lofi ', '') }}</strong>
            </button>
          </div>

          <!-- Thanh chỉnh âm lượng Nhạc nền Lofi (Tăng / Giảm) -->
          <div class="calib-slider-group">
            <label>
              <span>🎧 Âm lượng Nhạc Lofi</span>
              <strong>{{ isSoundMuted || !bgmEnabled ? '0%' : `${bgmVolume}%` }}</strong>
            </label>
            <div class="vol-slider-with-btns">
              <button
                type="button"
                class="vol-step-btn"
                title="Giảm nhạc nền 10%"
                @click="stepBgmVolume(-10)"
              >
                −
              </button>
              <input
                v-model.number="bgmVolume"
                type="range"
                min="0"
                max="100"
                step="5"
                @input="onAudioControlChange"
              />
              <button
                type="button"
                class="vol-step-btn"
                title="Tăng nhạc nền 10%"
                @click="stepBgmVolume(10)"
              >
                +
              </button>
            </div>
          </div>

          <!-- Thanh chỉnh âm lượng Hiệu ứng (Đếm ngược & Trả lời đúng) -->
          <div class="calib-slider-group">
            <label>
              <span>🔔 Âm lượng Hiệu ứng (SFX)</span>
              <strong>{{ isSoundMuted ? '0%' : `${sfxVolume}%` }}</strong>
            </label>
            <div class="vol-slider-with-btns">
              <button
                type="button"
                class="vol-step-btn"
                title="Giảm hiệu ứng 10%"
                @click="stepSfxVolume(-10)"
              >
                −
              </button>
              <input
                v-model.number="sfxVolume"
                type="range"
                min="0"
                max="100"
                step="5"
                @input="onAudioControlChange"
              />
              <button
                type="button"
                class="vol-step-btn"
                title="Tăng hiệu ứng 10%"
                @click="stepSfxVolume(10)"
              >
                +
              </button>
            </div>
          </div>

          <!-- MC ẢO AI ĐỌC CÂU HỎI & KẾT QUẢ -->
          <div class="calib-popup-header" style="margin-top: 0.85rem; padding-top: 0.75rem; border-top: 1px dashed rgba(255, 255, 255, 0.15);">
            <strong>🎙️ MC Ảo AI Đọc Tự Động</strong>
            <button
              type="button"
              class="lofi-power-btn"
              :class="{ active: aiVoice.settings.enabled }"
              @click="aiVoice.settings.enabled = !aiVoice.settings.enabled"
            >
              {{ aiVoice.settings.enabled ? '🟢 Đang Bật' : '⚪ Đang Tắt' }}
            </button>
          </div>

          <div v-if="aiVoice.settings.enabled" class="ai-voice-calib-body">
            <div class="calib-slider-group">
              <label>
                <span>🗣️ Giọng đọc tiếng Việt</span>
              </label>
              <select
                v-model="aiVoice.settings.voiceURI"
                class="input-control"
                style="width: 100%; font-size: 0.78rem; padding: 0.35rem 0.5rem; background: rgba(15, 23, 42, 0.9); color: #fff; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 6px;"
              >
                <option v-for="v in aiVoice.vietnameseVoices.value" :key="v.voiceURI" :value="v.voiceURI">
                  {{ v.name }}
                </option>
              </select>
            </div>

            <div class="calib-slider-group" style="margin-top: 0.5rem;">
              <label>
                <span>⚡ Tốc độ đọc</span>
                <strong>{{ aiVoice.settings.rate }}x</strong>
              </label>
              <input
                v-model.number="aiVoice.settings.rate"
                type="range"
                min="0.8"
                max="1.5"
                step="0.05"
              />
            </div>

            <div style="display: flex; gap: 0.5rem; margin-top: 0.6rem;">
              <button
                type="button"
                class="btn btn-secondary"
                style="flex: 1; font-size: 0.75rem; padding: 0.35rem 0.6rem; border-radius: 6px; justify-content: center;"
                @click="aiVoice.testVoice"
              >
                🎤 Thử giọng đọc
              </button>
              <button
                v-if="aiVoice.isSpeaking.value"
                type="button"
                class="btn btn-purple"
                style="font-size: 0.75rem; padding: 0.35rem 0.6rem; border-radius: 6px;"
                @click="aiVoice.stop"
              >
                ⏹ Dừng
              </button>
            </div>
          </div>
        </div>

        <!-- BỘ CHỌN THEME PHONG CÁCH -->
        <div class="theme-selector-section">
          <div class="theme-section-title">
            <span>🎨 Chọn Giao Diện (Theme):</span>
            <strong class="theme-current-name">{{ currentThemeInfo?.name }}</strong>
          </div>
          <div class="theme-options-grid">
            <button
              v-for="th in THEME_OPTIONS"
              :key="th.id"
              type="button"
              class="theme-card-btn"
              :class="{ active: currentTheme === th.id }"
              @click="switchTheme(th.id)"
            >
              <span class="theme-btn-icon">{{ th.icon }}</span>
              <div class="theme-btn-texts">
                <strong>{{ th.name }}</strong>
                <small>{{ th.sub }}</small>
              </div>
            </button>
          </div>
        </div>

        <!-- BỘ CHỌN KHUNG TIKTOK ĐIỆN THOẠI -->
        <div class="calib-popup-header">
          <strong>📱 Khung Hình TikTok</strong>
          <span class="calib-badge">{{
            layoutCalib.preset === 'fullscreen'
              ? 'Full Màn Hình'
              : layoutCalib.preset === 'tiktok-safe-zone'
                ? 'Vùng An Toàn (160/262)'
                : `${layoutCalib.frameWidth}×${layoutCalib.frameHeight}`
          }}</span>
        </div>

        <div class="calib-presets-row">
          <button
            type="button"
            class="calib-preset-btn"
            :class="{ active: layoutCalib.preset === 'fullscreen' }"
            @click="applyCalibPreset('fullscreen')"
          >
            📱 Full Tràn Viền
          </button>
          <button
            type="button"
            class="calib-preset-btn"
            :class="{ active: layoutCalib.preset === 'tiktok-safe-zone' }"
            @click="applyCalibPreset('tiktok-safe-zone')"
          >
            🎯 Vùng An Toàn
          </button>
          <button
            type="button"
            class="calib-preset-btn"
            :class="{ active: layoutCalib.preset === '362x444' }"
            @click="applyCalibPreset('362x444')"
          >
            📦 Khung 362×444
          </button>
        </div>

        <!-- Safe zone sliders for TikTok Live (160px top, 262px bottom) -->
        <div v-if="layoutCalib.preset === 'tiktok-safe-zone'" class="calib-slider-group">
          <label>
            <span>Né trên (Avatar & BXH)</span>
            <strong>{{ layoutCalib.paddingTop }}px</strong>
          </label>
          <input
            v-model.number="layoutCalib.paddingTop"
            type="range"
            min="0"
            max="350"
            step="2"
            @input="onManualCalibChange"
          />
        </div>

        <div v-if="layoutCalib.preset === 'tiktok-safe-zone'" class="calib-slider-group">
          <label>
            <span>Né dưới (Khung Chat & Quà)</span>
            <strong>{{ layoutCalib.paddingBottom }}px</strong>
          </label>
          <input
            v-model.number="layoutCalib.paddingBottom"
            type="range"
            min="0"
            max="450"
            step="2"
            @input="onManualCalibChange"
          />
        </div>

        <!-- Width / Height sliders for 362x444 or custom -->
        <div v-if="layoutCalib.preset === '362x444' || layoutCalib.preset === 'custom'" class="calib-slider-group">
          <label>
            <span>Chiều rộng khung (px)</span>
            <strong>{{ layoutCalib.frameWidth }}px</strong>
          </label>
          <input
            v-model.number="layoutCalib.frameWidth"
            type="range"
            min="260"
            max="1080"
            step="4"
            @input="onManualCalibChange"
          />
        </div>

        <div v-if="layoutCalib.preset === '362x444' || layoutCalib.preset === 'custom'" class="calib-slider-group">
          <label>
            <span>Chiều cao khung (px)</span>
            <strong>{{ layoutCalib.frameHeight }}px</strong>
          </label>
          <input
            v-model.number="layoutCalib.frameHeight"
            type="range"
            min="320"
            max="1920"
            step="4"
            @input="onManualCalibChange"
          />
        </div>

        <!-- Common Zoom / Offset sliders -->
        <div class="calib-slider-group">
          <label>
            <span>Thu phóng cỡ khung (Zoom)</span>
            <strong>{{ layoutCalib.scale }}%</strong>
          </label>
          <input
            v-model.number="layoutCalib.scale"
            type="range"
            min="50"
            max="150"
            step="1"
            @input="onManualCalibChange"
          />
        </div>

        <div class="calib-slider-group">
          <label>
            <span>Đẩy Lên / Xuống (Y)</span>
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
            <span>Đẩy Trái / Phải (X)</span>
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
      :class="{
        'frame-fullscreen': layoutCalib.preset === 'fullscreen',
        'frame-safe-zone': layoutCalib.preset === 'tiktok-safe-zone',
        'frame-box-362x444': layoutCalib.preset === '362x444',
      }"
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
            <span>{{ roomState?.playerCount || 0 }}</span>
          </div>
          <div v-if="roomState?.status === 'PLAYING'" class="metric-pill badge-cyan">
            <span>Câu {{ currentQuestionNumber }}/{{ totalQuestionsCount }}</span>
          </div>
        </div>
      </header>

      <!-- THANH TIM DỌC BÊN PHẢI (VERTICAL RIGHT-SIDE HEART METER) -->
      <aside
        class="heart-vertical-rail tabular-nums"
        :class="{ 'heart-milestone-ready': (heartProgress.current || heartProgress.total) >= 500 }"
        :title="heartGoalLabel"
      >
        <div class="heart-v-top">
          <span class="heart-pulse-emoji">💖</span>
          <span class="heart-v-goal">{{ heartGoalShortLabel }}</span>
        </div>

        <div class="heart-v-track">
          <div class="heart-v-tick tick-75"></div>
          <div class="heart-v-tick tick-50"></div>
          <div class="heart-v-tick tick-25"></div>
          <div class="heart-v-fill" :style="{ height: `${heartPercent}%` }">
            <span class="heart-v-glow"></span>
          </div>
          <span class="heart-v-pct">{{ heartPercent }}%</span>
        </div>

        <div class="heart-v-bottom">
          <strong class="heart-v-step">
            {{ (heartProgress.current % 500 === 0 && heartProgress.current > 0) ? 500 : (heartProgress.current % 500) }}/500
          </strong>
          <small class="heart-v-total">
            {{ heartProgress.total || heartProgress.current || 0 }} Tim
          </small>
        </div>
      </aside>

      <!-- Like Milestone Pop Banner -->
      <transition name="pop-milestone">
        <div v-if="likeMilestoneBanner" class="like-milestone-popup">
          <span class="milestone-pulse-icon">🔥</span>
          <span class="milestone-msg">{{ likeMilestoneBanner.message }}</span>
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
                Bình luận <strong>SS</strong> để bắt đầu chơi! Trả lời bằng cách gõ <strong>A</strong>, <strong>B</strong>, <strong>C</strong> hoặc
                <strong>D</strong> trên khung chat LIVE để ghi điểm!
              </p>
            </div>

            <div class="rules-strip">
              <div class="rule-item">
                <CheckCircle2 :size="18" class="icon-cyan" />
                <div>
                  <strong>+100 điểm</strong>
                  <p>Trả lời chính xác</p>
                </div>
              </div>
              <div class="rule-item">
                <Zap :size="18" class="icon-gold" />
                <div>
                  <strong>+0–50 tốc độ</strong>
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
              <div class="rule-item rule-item-heart">
                <span class="rule-heart-icon">💖</span>
                <div>
                  <strong>Thả 500 tim</strong>
                  <p>Bắt đầu ngay (Đã tích lũy: {{ heartProgress.total || heartProgress.current || 0 }} Tim)</p>
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
                  <img
                    class="chip-avatar"
                    :src="resolveAvatarSrc(plr)"
                    :alt="plr.nickname"
                    referrerpolicy="no-referrer"
                    @error="markAvatarFailed(plr)"
                  />
                  <span>{{ plr.nickname }}</span>
                </span>
              </div>
              <p v-else class="empty-players-hint">
                Gõ bình luận bất kỳ hoặc gõ "SS" để bắt đầu trận đấu!
              </p>
            </div>
          </div>

          <!-- 2. MÀN HÌNH CÂU HỎI (QUESTION) -->
          <div v-else-if="currentPhase === 'QUESTION' && activeQuestion" class="question-screen">
            <div class="question-top-bar">
              <div class="question-meta-badges">
                <span class="badge badge-cyan">{{ activeQuestion.categoryName || 'Kiến thức' }}</span>
                <span class="badge badge-purple">{{ formatDifficulty(activeQuestion.difficulty) }}</span>
                <span v-if="eliminatedOptions.length > 0" class="badge badge-gold">
                  Loại: {{ eliminatedOptions.join(', ') }}
                </span>
                <span v-if="isDoublePoints" class="badge badge-amber animate-pulse">
                  ⚡ x2 ĐIỂM
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
                  { 'option-eliminated': isOptionEliminated(label) },
                ]"
              >
                <div class="option-key">{{ label }}</div>
                <div class="option-text">
                  {{ activeQuestion.options?.[label] }}
                </div>
                <span v-if="isOptionEliminated(label)" class="eliminated-tag">LOẠI</span>
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
              <div v-if="questionResult.fastestPlayers?.length" class="fastest-box">
                <h4>⚡ Nhanh nhất câu này</h4>
                <div class="fastest-list">
                  <div
                    v-for="(fp, fIdx) in questionResult.fastestPlayers.slice(0, 3)"
                    :key="fp.playerId || fp.username || fIdx"
                    class="fastest-item"
                  >
                    <div class="fastest-user">
                      <img
                        class="fastest-avatar"
                        :src="resolveAvatarSrc(fp)"
                        :alt="fp.nickname"
                        referrerpolicy="no-referrer"
                        @error="markAvatarFailed(fp)"
                      />
                      <strong>{{ fp.nickname }}</strong>
                    </div>
                    <span class="fastest-pts tabular-nums">+{{ fp.points }}đ</span>
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
                v-for="entry in leaderboard.slice(0, isVerticalLayout ? 8 : 6)"
                :key="entry.playerId"
                class="stage-lb-row"
                :class="{
                  'lb-top-1': entry.rank === 1,
                  'lb-top-2': entry.rank === 2,
                  'lb-top-3': entry.rank === 3,
                }"
              >
                <template v-if="isVerticalLayout">
                  <div class="lb-card-top">
                    <div class="lb-rank">{{ entry.rank }}</div>
                    <div class="player-avatar avatar-md" :class="`avatar-rank-${entry.rank}`">
                      <img
                        :src="resolveAvatarSrc(entry)"
                        :alt="entry.nickname"
                        referrerpolicy="no-referrer"
                        @error="markAvatarFailed(entry)"
                      />
                    </div>
                    <strong class="lb-name" :title="entry.nickname">{{ entry.nickname }}</strong>
                  </div>
                  <div class="lb-card-bottom">
                    <span class="lb-correct-pill">Đúng {{ entry.correctCount }} câu</span>
                    <div class="lb-scores-right">
                      <span v-if="entry.lastQuestionDelta" class="lb-delta">+{{ entry.lastQuestionDelta }}</span>
                      <span class="lb-total-score">{{ entry.totalScore }}đ</span>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="lb-rank">{{ entry.rank }}</div>
                  <div class="player-avatar avatar-md" :class="`avatar-rank-${entry.rank}`">
                    <img
                      :src="resolveAvatarSrc(entry)"
                      :alt="entry.nickname"
                      referrerpolicy="no-referrer"
                      @error="markAvatarFailed(entry)"
                    />
                  </div>
                  <div class="lb-player-info">
                    <strong :title="entry.nickname">{{ entry.nickname }}</strong>
                    <span>Đúng {{ entry.correctCount }} câu</span>
                  </div>
                  <div v-if="entry.lastQuestionDelta" class="lb-delta">
                    +{{ entry.lastQuestionDelta }}
                  </div>
                  <div class="lb-total-score">{{ entry.totalScore }}đ</div>
                </template>
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
                <div class="player-avatar avatar-lg podium-avatar" :class="`avatar-rank-${idx + 1}`">
                  <img
                    :src="resolveAvatarSrc(item)"
                    :alt="item.nickname"
                    referrerpolicy="no-referrer"
                    @error="markAvatarFailed(item)"
                  />
                </div>
                <strong class="podium-name">{{ item.nickname }}</strong>
                <div class="podium-score">{{ item.totalScore }} điểm</div>
                <span class="podium-accuracy">Đúng {{ item.correctCount }} câu</span>
              </div>
            </div>
            <p v-else class="empty-players-hint">Trận đấu đã kết thúc.</p>

            <div class="victory-countdown-bar">
              <span class="victory-countdown-badge">
                <Clock :size="15" /> Sẽ quay lại sảnh chờ sau {{ victorySecondsRemaining }}s...
              </span>
            </div>
          </div>
        </section>

        <!-- Compact Leaderboard & Ticker Strip -->
        <aside class="sidebar-leaderboard">
          <div class="sidebar-card">
            <div class="sidebar-header">
              <Trophy :size="15" class="icon-gold" />
              <h3>Top Xếp Hạng ({{ leaderboard.length }})</h3>
            </div>

            <div v-if="leaderboard.length" class="mini-lb-list tabular-nums">
              <div
                v-for="item in leaderboard.slice(0, 8)"
                :key="item.playerId"
                class="mini-lb-item"
                :class="`mini-item-rank-${item.rank}`"
              >
                <span class="mini-rank" :class="`rank-${item.rank}`">{{ item.rank }}</span>
                <div class="player-avatar avatar-sm" :class="`avatar-rank-${item.rank}`">
                  <img
                    :src="resolveAvatarSrc(item)"
                    :alt="item.nickname"
                    referrerpolicy="no-referrer"
                    @error="markAvatarFailed(item)"
                  />
                </div>
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
import { soundFX, LOFI_STYLE_OPTIONS, type LofiStyle } from '../services/sound';
import { useAiVoice } from '../composables/useAiVoice';
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

const isVerticalLayout = ref(
  Boolean(
    props.forceVertical ||
      route.query.layout === 'vertical' ||
      (typeof window !== 'undefined' &&
        !isEmbedded.value &&
        (window.innerWidth <= 960 || window.innerHeight >= window.innerWidth * 0.85))
  )
);

const phaserContainer = ref<HTMLElement | null>(null);
const broadcastFrameRef = ref<HTMLElement | null>(null);
const stageCardRef = ref<HTMLElement | null>(null);
let phaserStage: PhaserStageController | null = null;
let socket: Socket | null = null;
let frameResizeObserver: ResizeObserver | null = null;
const aiVoice = useAiVoice();

type LayoutPreset = 'fullscreen' | 'tiktok-safe-zone' | '362x444' | 'custom';
type GameTheme = 'cute' | 'modern' | 'galaxy' | 'luxury';

const THEME_OPTIONS = [
  {
    id: 'cute' as GameTheme,
    name: 'Dễ Thương',
    sub: 'Kẹo Ngọt Pastel',
    icon: '🌸',
    color: '#ff6b9d',
    desc: 'Hồng phấn kẹo dẻo, nút nổi 3D, chữ tròn đáng yêu',
  },
  {
    id: 'modern' as GameTheme,
    name: 'Hiện Đại',
    sub: 'Aurora Glass',
    icon: '✨',
    color: '#38bdf8',
    desc: 'Kính mờ cực quang, font Jakarta thanh lịch',
  },
  {
    id: 'galaxy' as GameTheme,
    name: 'Cyber Esport',
    sub: 'Neon Gaming',
    icon: '🎮',
    color: '#00f5d4',
    desc: 'Viền điện tử phát sáng, font sci-fi cực chất',
  },
  {
    id: 'luxury' as GameTheme,
    name: 'Hoàng Gia',
    sub: 'Vàng Kim 24K',
    icon: '👑',
    color: '#fbbf24',
    desc: 'Vàng kim vương giả, phong cách Triệu Phú',
  },
];

const currentTheme = ref<GameTheme>('cute');

const currentThemeInfo = computed(() => {
  return THEME_OPTIONS.find((t) => t.id === currentTheme.value) || THEME_OPTIONS[0];
});

function switchTheme(theme: GameTheme) {
  currentTheme.value = theme;
  phaserStage?.setVisualStyle(theme);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem('kb_selected_theme_v2', theme);
    } catch {}
  }
  socket?.emit('layout.update', {
    roomCode: roomCode.value,
    ...layoutCalib.value,
    theme,
  });
}

function cycleNextTheme() {
  const currentIndex = THEME_OPTIONS.findIndex((t) => t.id === currentTheme.value);
  const nextIndex = (currentIndex + 1) % THEME_OPTIONS.length;
  switchTheme(THEME_OPTIONS[nextIndex].id);
}

function loadSavedTheme() {
  if (typeof window === 'undefined') return;
  try {
    const q = route.query.theme as GameTheme;
    if (q && ['cute', 'modern', 'galaxy', 'luxury'].includes(q)) {
      currentTheme.value = q;
      return;
    }
    const saved = window.localStorage.getItem('kb_selected_theme_v2') as GameTheme;
    if (saved && ['cute', 'modern', 'galaxy', 'luxury'].includes(saved)) {
      currentTheme.value = saved;
    } else {
      currentTheme.value = 'cute';
    }
  } catch {}
}

const showCalibPanel = ref(false);
const autoFitScale = ref(1);
const layoutCalib = ref({
  preset: (route.query.preset as LayoutPreset) || 'fullscreen',
  frameWidth: Number(route.query.fw) || 1080,
  frameHeight: Number(route.query.fh) || 1920,
  scale: Number(route.query.scale) || 100,
  widthPercent: Number(route.query.w) || 100,
  offsetX: Number(route.query.ox) || 0,
  offsetY: Number(route.query.oy) || 0,
  paddingTop: Number(route.query.pt) || 160,
  paddingBottom: Number(route.query.pb) || 262,
});

const STORAGE_CALIB_KEY = 'kb_vertical_layout_v5';

function loadSavedCalib() {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(STORAGE_CALIB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      layoutCalib.value = {
        preset: (route.query.preset as LayoutPreset) || parsed.preset || 'fullscreen',
        frameWidth: Number(route.query.fw) || Number(parsed.frameWidth ?? 1080),
        frameHeight: Number(route.query.fh) || Number(parsed.frameHeight ?? 1920),
        scale: Number(route.query.scale) || Number(parsed.scale ?? 100),
        widthPercent: Number(route.query.w) || Number(parsed.widthPercent ?? 100),
        offsetX: Number(route.query.ox) || Number(parsed.offsetX ?? 0),
        offsetY: Number(route.query.oy) || Number(parsed.offsetY ?? 0),
        paddingTop: Number(route.query.pt) || Number(parsed.paddingTop ?? 160),
        paddingBottom: Number(route.query.pb) || Number(parsed.paddingBottom ?? 262),
      };
      return;
    }
  } catch {
    // ignore storage errors
  }
  const presetQuery = (route.query.preset as LayoutPreset) || 'fullscreen';
  applyCalibPreset(presetQuery);
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
    theme: currentTheme.value,
  });
  requestAnimationFrame(recalcAutoFit);
}

function applyCalibPreset(preset: 'fullscreen' | 'tiktok-safe-zone' | '362x444') {
  if (preset === 'fullscreen') {
    layoutCalib.value = {
      preset: 'fullscreen',
      frameWidth: 1080,
      frameHeight: 1920,
      scale: 100,
      widthPercent: 100,
      offsetX: 0,
      offsetY: 0,
      paddingTop: 12,
      paddingBottom: 16,
    };
  } else if (preset === 'tiktok-safe-zone') {
    layoutCalib.value = {
      preset: 'tiktok-safe-zone',
      frameWidth: 1080,
      frameHeight: 1920,
      scale: 100,
      widthPercent: 100,
      offsetX: 0,
      offsetY: 0,
      paddingTop: 160,
      paddingBottom: 262,
    };
  } else if (preset === '362x444') {
    layoutCalib.value = {
      preset: '362x444',
      frameWidth: 362,
      frameHeight: 444,
      scale: 100,
      widthPercent: 96,
      offsetX: 0,
      offsetY: 0,
      paddingTop: 0,
      paddingBottom: 0,
    };
  }
  saveAndBroadcastCalib();
}

function onManualCalibChange() {
  layoutCalib.value.preset = 'custom';
  saveAndBroadcastCalib();
}

function recalcAutoFit() {
  if (isEmbedded.value || !broadcastFrameRef.value || typeof window === 'undefined') {
    autoFitScale.value = 1;
    return;
  }
  const el = broadcastFrameRef.value;
  const naturalHeight = el.scrollHeight || el.offsetHeight || 1;
  let targetH = window.innerHeight * 0.96;

  if (isVerticalLayout.value) {
    if (layoutCalib.value.preset === '362x444') {
      targetH = Math.min(layoutCalib.value.frameHeight || 444, window.innerHeight * 0.96);
    } else if (layoutCalib.value.preset === 'tiktok-safe-zone') {
      const topPad = layoutCalib.value.paddingTop ?? 160;
      const bottomPad = layoutCalib.value.paddingBottom ?? 262;
      const safeAvailable = window.innerHeight - topPad - bottomPad;
      targetH = safeAvailable > 200 ? safeAvailable : window.innerHeight * 0.95;
    } else {
      targetH = window.innerHeight;
    }
  }

  if (isVerticalLayout.value && naturalHeight > targetH && targetH > 120) {
    autoFitScale.value = Math.max(0.58, Math.min(1, targetH / naturalHeight));
  } else {
    autoFitScale.value = 1;
  }
}

const broadcastFrameStyle = computed(() => {
  if (isEmbedded.value) return {};

  const effectiveScale = (layoutCalib.value.scale / 100) * autoFitScale.value;
  const ox = layoutCalib.value.offsetX || 0;
  const oy = layoutCalib.value.offsetY || 0;
  const transform =
    effectiveScale !== 1 || ox !== 0 || oy !== 0
      ? `translate(${ox}vw, ${oy}vh) scale(${effectiveScale.toFixed(3)})`
      : undefined;

  if (!isVerticalLayout.value) {
    if (!transform) return {};
    return {
      transform,
      transformOrigin: 'center center',
    };
  }

  // --- Chế độ dọc TikTok LIVE ---
  if (layoutCalib.value.preset === 'fullscreen') {
    return {
      width: '100%',
      maxWidth: '100%',
      height: '100%',
      maxHeight: '100%',
      padding: '12px 14px',
      boxSizing: 'border-box',
      transform,
      transformOrigin: 'center center',
    };
  }

  if (layoutCalib.value.preset === 'tiktok-safe-zone') {
    const topPad = layoutCalib.value.paddingTop ?? 160;
    const bottomPad = layoutCalib.value.paddingBottom ?? 262;
    return {
      width: '100%',
      maxWidth: '100%',
      height: '100%',
      maxHeight: '100%',
      paddingTop: `${topPad}px`,
      paddingBottom: `${bottomPad}px`,
      paddingLeft: '12px',
      paddingRight: '12px',
      boxSizing: 'border-box',
      transform,
      transformOrigin: 'center center',
    };
  }

  // Khung 362x444 hoặc custom
  const fw = layoutCalib.value.frameWidth || 362;
  const fh = layoutCalib.value.frameHeight || 444;
  return {
    width: `${fw}px`,
    maxWidth: '98vw',
    maxHeight: `${fh}px`,
    transform,
    transformOrigin: 'center center',
  };
});

function handleStorageSync(e: StorageEvent) {
  if (e.key === STORAGE_CALIB_KEY && e.newValue) {
    try {
      const parsed = JSON.parse(e.newValue);
      layoutCalib.value = {
        frameWidth: Number(parsed.frameWidth ?? 1080),
        frameHeight: Number(parsed.frameHeight ?? 1920),
        scale: Number(parsed.scale ?? 100),
        widthPercent: Number(parsed.widthPercent ?? 100),
        offsetX: Number(parsed.offsetX ?? 0),
        offsetY: Number(parsed.offsetY ?? 0),
        paddingTop: Number(parsed.paddingTop ?? 160),
        paddingBottom: Number(parsed.paddingBottom ?? 262),
        preset: String(parsed.preset || 'fullscreen') as LayoutPreset,
      };
      requestAnimationFrame(recalcAutoFit);
    } catch {
      // ignore
    }
  }
  if (e.key === 'kb_selected_theme_v2' && e.newValue) {
    if (['cute', 'modern', 'galaxy', 'luxury'].includes(e.newValue)) {
      currentTheme.value = e.newValue as GameTheme;
    }
  }
  if (e.key === STORAGE_AUDIO_KEY && e.newValue) {
    try {
      const parsed = JSON.parse(e.newValue);
      if (typeof parsed.bgmEnabled === 'boolean') bgmEnabled.value = parsed.bgmEnabled;
      if (typeof parsed.bgmVolume === 'number') bgmVolume.value = parsed.bgmVolume;
      if (typeof parsed.sfxVolume === 'number') sfxVolume.value = parsed.sfxVolume;
      if (parsed.lofiStyle) lofiStyle.value = parsed.lofiStyle as LofiStyle;
      syncSoundEngine();
    } catch {}
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
const heartProgress = ref({
  current: 0,
  target: 500,
  total: 0,
});
const likeMilestoneBanner = ref<{
  type: string;
  message: string;
  totalLikes?: number;
} | null>(null);
let likeMilestoneTimeout: any = null;
const isSoundMuted = ref<boolean>(Boolean(props.embedded));
const bgmEnabled = ref<boolean>(true);
const bgmVolume = ref<number>(40);
const sfxVolume = ref<number>(80);
const lofiStyle = ref<LofiStyle>('chill-cafe');
const STORAGE_AUDIO_KEY = 'kb_lofi_audio_settings_v1';
let giftTimeout: any = null;
let lastTickSoundKey = '';

// --- Avatar người chơi trên bảng thành tích (Ảnh thật TikTok + Chibi SVG Portrait tự động) ---
const failedAvatarKeys = ref<Set<string>>(new Set());
const avatarSvgCache = new Map<string, string>();

function avatarKey(entry: any): string {
  return String(entry?.playerId || entry?.id || entry?.tiktokUserId || entry?.username || entry?.nickname || 'guest');
}

function markAvatarFailed(entry: any) {
  const key = avatarKey(entry);
  if (failedAvatarKeys.value.has(key)) return;
  const next = new Set(failedAvatarKeys.value);
  next.add(key);
  failedAvatarKeys.value = next;
}

function generateCuteAvatarDataUri(entry: any): string {
  const key = avatarKey(entry);
  const cached = avatarSvgCache.get(key);
  if (cached) return cached;

  let hash = 2166136261;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }

  const bgPairs = [
    ['#ff75a0', '#a855f7'],
    ['#38bdf8', '#6366f1'],
    ['#34d399', '#0ea5e9'],
    ['#fbbf24', '#f97316'],
    ['#f472b6', '#fb7185'],
    ['#a78bfa', '#ec4899'],
    ['#2dd4bf', '#3b82f6'],
    ['#f59e0b', '#ef4444'],
  ];
  const skinTones = ['#ffe4d6', '#ffdbb5', '#fce0c5', '#f5cba7'];
  const hairColors = ['#2d1b4e', '#4a2511', '#1e293b', '#831843', '#b45309', '#4c1d95', '#be123c', '#0f766e'];
  const shirtColors = ['#ff4785', '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

  const [bg1, bg2] = bgPairs[hash % bgPairs.length];
  const skin = skinTones[(hash >>> 3) % skinTones.length];
  const hair = hairColors[(hash >>> 5) % hairColors.length];
  const shirt = shirtColors[(hash >>> 7) % shirtColors.length];
  const styleIdx = (hash >>> 9) % 4;
  const accessoryIdx = (hash >>> 11) % 4;

  // Tóc đa dạng theo nhân vật
  const hairBackSvg =
    styleIdx === 0
      ? `<circle cx="50" cy="44" r="29" fill="${hair}" /><circle cx="24" cy="32" r="10" fill="${hair}" /><circle cx="76" cy="32" r="10" fill="${hair}" />`
      : styleIdx === 1
        ? `<path d="M21 48 C21 20 79 20 79 48 L82 72 C65 66 35 66 18 72 Z" fill="${hair}" />`
        : styleIdx === 2
          ? `<circle cx="50" cy="43" r="28" fill="${hair}" />`
          : `<path d="M22 46 C22 18 78 18 78 46 L75 62 L25 62 Z" fill="${hair}" />`;

  const hairBangsSvg =
    styleIdx === 0
      ? `<path d="M24 42 Q37 22 50 34 Q63 22 76 42 Q64 29 50 37 Q36 29 24 42 Z" fill="${hair}" />`
      : styleIdx === 1
        ? `<path d="M23 43 C30 24 70 24 77 43 C65 33 35 33 23 43 Z" fill="${hair}" />`
        : `<path d="M24 40 Q40 24 54 35 Q67 25 76 40 C68 26 32 26 24 40 Z" fill="${hair}" />`;

  // Phụ kiện dễ thương (Tai mèo / Vương miện / Tai nghe / Ngôi sao)
  const accessorySvg =
    accessoryIdx === 0
      ? `<polygon points="24,26 32,12 40,23" fill="${hair}" /><polygon points="27,24 32,15 37,22" fill="#fda4af" /><polygon points="76,26 68,12 60,23" fill="${hair}" /><polygon points="73,24 68,15 63,22" fill="#fda4af" />`
      : accessoryIdx === 1
        ? `<polygon points="36,21 41,10 50,17 59,10 64,21" fill="#fbbf24" stroke="#ffffff" stroke-width="1.5" />`
        : accessoryIdx === 2
          ? `<path d="M20 48 A30 30 0 0 1 80 48" fill="none" stroke="#38bdf8" stroke-width="4" /><rect x="15" y="42" width="8" height="15" rx="4" fill="#0284c7" /><rect x="77" y="42" width="8" height="15" rx="4" fill="#0284c7" />`
          : `<circle cx="70" cy="27" r="5" fill="#fde047" stroke="#ffffff" stroke-width="1.2" />`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bg1}" />
        <stop offset="100%" stop-color="${bg2}" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="50" fill="url(#g)" />
    <circle cx="50" cy="96" r="30" fill="${shirt}" />
    ${hairBackSvg}
    <circle cx="50" cy="50" r="23" fill="${skin}" />
    ${hairBangsSvg}
    <circle cx="41" cy="51" r="3.4" fill="#1e1b4b" />
    <circle cx="59" cy="51" r="3.4" fill="#1e1b4b" />
    <circle cx="42.2" cy="49.8" r="1.2" fill="#ffffff" />
    <circle cx="60.2" cy="49.8" r="1.2" fill="#ffffff" />
    <ellipse cx="35" cy="56.5" rx="4.2" ry="2.2" fill="#fb7185" opacity="0.65" />
    <ellipse cx="65" cy="56.5" rx="4.2" ry="2.2" fill="#fb7185" opacity="0.65" />
    <path d="M44 59 Q50 64.5 56 59" fill="none" stroke="#881337" stroke-width="2.4" stroke-linecap="round" />
    ${accessorySvg}
  </svg>`;

  const uri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  avatarSvgCache.set(key, uri);
  return uri;
}

function resolveAvatarSrc(entry: any): string {
  const key = avatarKey(entry);
  const rawUrl = typeof entry?.avatarUrl === 'string' ? entry.avatarUrl.trim() : '';
  if (rawUrl && !failedAvatarKeys.value.has(key)) {
    return rawUrl;
  }
  return generateCuteAvatarDataUri(entry);
}

function syncSoundEngine() {
  // Nếu là khung preview nhúng nhỏ trong Dashboard thì tắt tiếng tuyệt đối để tránh vọng âm với tab OBS/User
  const effectiveMuted = isEmbedded.value ? true : isSoundMuted.value;
  soundFX.setMuted(effectiveMuted);
  if (isEmbedded.value) {
    soundFX.stopBgm();
  } else {
    soundFX.setBgmEnabled(bgmEnabled.value);
    soundFX.setBgmVolume(bgmVolume.value);
    soundFX.setSfxVolume(sfxVolume.value);
    soundFX.setLofiStyle(lofiStyle.value);
    soundFX.syncBgmPlaybackState();
  }
}

function saveAudioPrefs(broadcast = true) {
  if (typeof window !== 'undefined') {
    try {
      const key = isEmbedded.value ? 'kb_sound_muted_embed' : 'kb_sound_muted_obs';
      window.localStorage.setItem(key, isSoundMuted.value ? '1' : '0');
      window.localStorage.setItem(
        STORAGE_AUDIO_KEY,
        JSON.stringify({
          bgmEnabled: bgmEnabled.value,
          bgmVolume: bgmVolume.value,
          sfxVolume: sfxVolume.value,
          lofiStyle: lofiStyle.value,
        })
      );
    } catch {}
  }
  syncSoundEngine();
  if (broadcast) {
    socket?.emit('layout.update', {
      roomCode: roomCode.value,
      ...layoutCalib.value,
      theme: currentTheme.value,
      bgmEnabled: bgmEnabled.value,
      bgmVolume: bgmVolume.value,
      sfxVolume: sfxVolume.value,
      lofiStyle: lofiStyle.value,
    });
  }
}

function loadSavedSoundPref() {
  if (typeof window === 'undefined') return;
  try {
    const key = isEmbedded.value ? 'kb_sound_muted_embed' : 'kb_sound_muted_obs';
    const savedMute = window.localStorage.getItem(key);
    if (savedMute !== null) {
      isSoundMuted.value = savedMute === '1';
    } else {
      isSoundMuted.value = Boolean(isEmbedded.value);
    }

    const rawAudio = window.localStorage.getItem(STORAGE_AUDIO_KEY);
    if (rawAudio) {
      const parsed = JSON.parse(rawAudio);
      if (typeof parsed.bgmEnabled === 'boolean') bgmEnabled.value = parsed.bgmEnabled;
      if (typeof parsed.bgmVolume === 'number') bgmVolume.value = Math.max(0, Math.min(100, parsed.bgmVolume));
      if (typeof parsed.sfxVolume === 'number') sfxVolume.value = Math.max(0, Math.min(100, parsed.sfxVolume));
      if (parsed.lofiStyle && ['chill-cafe', 'dreamy-night', 'pastel-cute'].includes(parsed.lofiStyle)) {
        lofiStyle.value = parsed.lofiStyle as LofiStyle;
      }
    }
  } catch {}
  syncSoundEngine();
}

function toggleSoundMute() {
  isSoundMuted.value = !isSoundMuted.value;
  if (!isSoundMuted.value && bgmVolume.value === 0) {
    bgmVolume.value = 40;
    bgmEnabled.value = true;
  }
  saveAudioPrefs(true);
  if (!isSoundMuted.value) {
    soundFX.playCountdownTick(10);
  }
}

function toggleBgmEnabled() {
  if (isSoundMuted.value) {
    isSoundMuted.value = false;
    bgmEnabled.value = true;
    if (bgmVolume.value === 0) bgmVolume.value = 40;
  } else {
    bgmEnabled.value = !bgmEnabled.value;
    if (bgmEnabled.value && bgmVolume.value === 0) {
      bgmVolume.value = 40;
    }
  }
  saveAudioPrefs(true);
}

function changeLofiStyle(style: LofiStyle) {
  lofiStyle.value = style;
  if (isSoundMuted.value) isSoundMuted.value = false;
  if (!bgmEnabled.value) bgmEnabled.value = true;
  if (bgmVolume.value === 0) bgmVolume.value = 40;
  saveAudioPrefs(true);
}

function stepBgmVolume(delta: number) {
  const next = Math.max(0, Math.min(100, bgmVolume.value + delta));
  bgmVolume.value = next;
  if (next > 0) {
    bgmEnabled.value = true;
    if (isSoundMuted.value) isSoundMuted.value = false;
  }
  saveAudioPrefs(true);
}

function stepSfxVolume(delta: number) {
  const next = Math.max(0, Math.min(100, sfxVolume.value + delta));
  sfxVolume.value = next;
  if (next > 0 && isSoundMuted.value) {
    isSoundMuted.value = false;
  }
  saveAudioPrefs(true);
  if (next > 0) {
    soundFX.playCountdownTick(10);
  }
}

function onAudioControlChange() {
  if (bgmVolume.value > 0) {
    bgmEnabled.value = true;
    if (isSoundMuted.value) isSoundMuted.value = false;
  }
  saveAudioPrefs(true);
}

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

const questionColorCycleBackground = computed(() => {
  const cycle = Math.floor(Math.max(0, currentQuestionNumber.value - 1) / 10) % 6;
  const backgrounds = [
    'radial-gradient(circle at 18% 16%, rgba(255, 107, 157, 0.42) 0%, transparent 42%), radial-gradient(circle at 82% 84%, rgba(168, 85, 247, 0.36) 0%, transparent 48%), linear-gradient(145deg, #211437 0%, #090c20 72%, #160d2c 100%)',
    'radial-gradient(circle at 78% 18%, rgba(56, 189, 248, 0.42) 0%, transparent 44%), radial-gradient(circle at 16% 84%, rgba(45, 212, 191, 0.34) 0%, transparent 48%), linear-gradient(145deg, #09263b 0%, #071326 72%, #082d35 100%)',
    'radial-gradient(circle at 22% 22%, rgba(250, 204, 21, 0.38) 0%, transparent 42%), radial-gradient(circle at 84% 78%, rgba(245, 158, 11, 0.32) 0%, transparent 48%), linear-gradient(145deg, #38220d 0%, #171022 72%, #2b160d 100%)',
    'radial-gradient(circle at 80% 22%, rgba(244, 63, 94, 0.42) 0%, transparent 44%), radial-gradient(circle at 18% 82%, rgba(192, 132, 252, 0.36) 0%, transparent 48%), linear-gradient(145deg, #351329 0%, #130b22 72%, #29102c 100%)',
    'radial-gradient(circle at 20% 18%, rgba(52, 211, 153, 0.38) 0%, transparent 44%), radial-gradient(circle at 82% 82%, rgba(14, 165, 233, 0.34) 0%, transparent 48%), linear-gradient(145deg, #092e2d 0%, #071521 72%, #092b38 100%)',
    'radial-gradient(circle at 50% 12%, rgba(129, 140, 248, 0.44) 0%, transparent 46%), radial-gradient(circle at 50% 88%, rgba(236, 72, 153, 0.32) 0%, transparent 50%), linear-gradient(145deg, #1d1645 0%, #0b0c21 72%, #2b1235 100%)',
  ];
  return backgrounds[cycle];
});

const eliminatedOption = computed(() => {
  return roomState.value?.eliminatedHintOption || activeQuestion.value?.eliminatedHintOption || null;
});

const eliminatedOptions = computed<string[]>(() => {
  const fromState = roomState.value?.eliminatedOptions;
  if (Array.isArray(fromState) && fromState.length > 0) return fromState;
  const fromActiveQ = activeQuestion.value?.eliminatedOptions;
  if (Array.isArray(fromActiveQ) && fromActiveQ.length > 0) return fromActiveQ;
  const single = roomState.value?.eliminatedHintOption || activeQuestion.value?.eliminatedHintOption;
  return single ? [single] : [];
});

const isDoublePoints = computed<boolean>(() => {
  return !!(roomState.value?.isDoublePoints || activeQuestion.value?.isDoublePoints);
});

const isOptionEliminated = (label: string) => {
  return eliminatedOptions.value.includes(label);
};

const heartGoalShortLabel = computed(() => {
  if (currentPhase.value === 'QUESTION') {
    return eliminatedOptions.value.length >= 1 ? '50/50 & x2' : 'Loại 1 đáp án';
  }
  if (currentPhase.value === 'ANSWER_REVEAL' || currentPhase.value === 'LEADERBOARD') {
    return 'Chuyển câu';
  }
  if (currentPhase.value === 'WAITING_ROOM') {
    return 'Bắt đầu';
  }
  return 'Thả tim';
});

const heartGoalLabel = computed(() => {
  if (currentPhase.value === 'QUESTION') {
    if (eliminatedOptions.value.length >= 1) {
      return '500 tim tiếp theo: Chế độ 50/50 & x2 Điểm số!';
    }
    return '500 tim: Loại trừ 1 đáp án sai!';
  }
  if (currentPhase.value === 'ANSWER_REVEAL' || currentPhase.value === 'LEADERBOARD') {
    return '500 tim: Chuyển câu tức thì! (1.000 tim: Câu Hỏi Vàng x2)';
  }
  if (currentPhase.value === 'WAITING_ROOM') {
    return '500 tim: Bắt đầu trận đấu luôn!';
  }
  return 'Thả tim tương tác';
});

const heartPercent = computed(() => {
  const cur = heartProgress.value.current || 0;
  const rem = cur % 500;
  if (rem === 0 && cur > 0) return 100;
  return Math.min(100, Math.max(0, Math.round((rem / 500) * 100)));
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

const victorySecondsRemaining = ref(5);
let victoryCountdownTimer: ReturnType<typeof setInterval> | null = null;

watch(currentPhase, (newPhase) => {
  animateStageTransition();
  if (newPhase === 'WAITING_ROOM' || newPhase === 'COUNTDOWN') {
    phaserStage?.setMode('WAITING');
    if (victoryCountdownTimer) {
      clearInterval(victoryCountdownTimer);
      victoryCountdownTimer = null;
    }
  } else if (newPhase === 'QUESTION') {
    phaserStage?.setMode('QUESTION');
  } else if (newPhase === 'ANSWER_REVEAL') {
    phaserStage?.setMode('REVEAL');
    phaserStage?.triggerConfetti();
  } else if (newPhase === 'VICTORY') {
    phaserStage?.setMode('VICTORY');
    phaserStage?.triggerConfetti();
    phaserStage?.triggerFireworks(4);
    victorySecondsRemaining.value = 5;
    if (victoryCountdownTimer) clearInterval(victoryCountdownTimer);
    victoryCountdownTimer = setInterval(() => {
      if (victorySecondsRemaining.value > 1) {
        victorySecondsRemaining.value--;
      } else {
        if (victoryCountdownTimer) {
          clearInterval(victoryCountdownTimer);
          victoryCountdownTimer = null;
        }
      }
    }, 1000);
  } else {
    if (victoryCountdownTimer) {
      clearInterval(victoryCountdownTimer);
      victoryCountdownTimer = null;
    }
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
      if (data.roomState.heartProgress) {
        heartProgress.value = data.roomState.heartProgress;
      }
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
  loadSavedTheme();
  loadSavedCalib();
  loadSavedSoundPref();
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
    setTimeout(() => {
      phaserStage?.setVisualStyle(currentTheme.value);
    }, 60);
  }

  await loadInitialRecovery();
  requestAnimationFrame(recalcAutoFit);

  socket = createRoomSocket(roomCode.value);
  let lastResultSoundQuestionId = '';

  socket.on('room.state', (payload) => {
    const prevPhase = roomState.value?.phase;
    roomState.value = payload;
    if (payload.heartProgress) {
      heartProgress.value = payload.heartProgress;
    }
    if (payload.recentEvents) {
      recentFeed.value = payload.recentEvents;
    }
    answeredCount.value = payload.answeredCountCurrentQuestion || 0;
    if (payload.answeredPlayersCurrentQuestion) {
      answeredPlayers.value = payload.answeredPlayersCurrentQuestion;
    }
    if (prevPhase !== payload.phase) {
      requestAnimationFrame(recalcAutoFit);
    }
  });

  socket.on('like.progress', (payload) => {
    heartProgress.value = {
      current: payload.current || 0,
      target: payload.target || 500,
      total: payload.total || 0,
    };
  });

  socket.on('like.milestone', (payload) => {
    likeMilestoneBanner.value = payload;
    if (!isEmbedded.value && !isSoundMuted.value) {
      soundFX.playStartMatch();
    }
    if (likeMilestoneTimeout) clearTimeout(likeMilestoneTimeout);
    likeMilestoneTimeout = setTimeout(() => {
      likeMilestoneBanner.value = null;
    }, 4500);
  });

  socket.on('question.started', (payload) => {
    activeQuestion.value = payload;
    questionResult.value = null;
    const initialSec = payload.duration || 15;
    remainingSeconds.value = initialSec;
    answeredCount.value = 0;
    answeredPlayers.value = [];
    if (initialSec > 0) {
      lastTickSoundKey = `${payload.questionId || payload.questionIndex || ''}:${initialSec}`;
      if (!isEmbedded.value && !isSoundMuted.value) {
        soundFX.playCountdownTick(initialSec);
      }
    }
    // Giọng đọc MC Ảo AI đọc số câu hỏi (có cơ chế chống trùng đa tab tự động)
    aiVoice.speakQuestion({
      index: payload.questionIndex,
    });
    requestAnimationFrame(recalcAutoFit);
  });

  socket.on('question.timer', (payload) => {
    const nextSec = payload.remainingSeconds;
    remainingSeconds.value = nextSec;
    if (currentPhase.value === 'QUESTION' && nextSec > 0) {
      const tickKey = `${payload.questionId || payload.questionIndex || ''}:${nextSec}`;
      if (tickKey !== lastTickSoundKey) {
        lastTickSoundKey = tickKey;
        if (!isEmbedded.value && !isSoundMuted.value) {
          soundFX.playCountdownTick(nextSec);
        }
      }
    }
  });

  socket.on('player.answered', (payload) => {
    answeredCount.value = payload.answeredCount;
    if (payload.answeredPlayers) {
      answeredPlayers.value = payload.answeredPlayers;
    }
  });

  socket.on('question.result', (payload) => {
    const isFirstRevealForQuestion = lastResultSoundQuestionId !== String(payload?.questionId || '');
    questionResult.value = payload;
    if (isFirstRevealForQuestion) {
      lastResultSoundQuestionId = String(payload?.questionId || '');
      if (!isEmbedded.value && !isSoundMuted.value && Number(payload?.correctPlayersCount || 0) > 0) {
        soundFX.playCorrectAnswer();
      }
      // Giọng đọc MC Ảo AI đọc đáp án đúng, số người đúng và tên người nhanh nhất (có cơ chế chống trùng đa tab tự động)
      const fastestName = payload.fastestPlayers?.[0]?.nickname || payload.fastestPlayers?.[0]?.username;
      aiVoice.speakResult({
        correctOption: payload.correctOption,
        correctContent: payload.options?.[payload.correctOption],
        correctCount: payload.correctPlayersCount,
        fastestPlayerName: fastestName,
      });
      requestAnimationFrame(recalcAutoFit);
    }
  });

  socket.on('leaderboard.updated', (payload) => {
    leaderboard.value = payload.leaderboard || [];
  });

  socket.on('game.finished', (payload) => {
    if (payload.leaderboard) {
      leaderboard.value = payload.leaderboard;
      if (payload.leaderboard.length > 0) {
        const champ = payload.leaderboard[0];
        aiVoice.speakWinner({
          nickname: champ.nickname || champ.username || 'Quán quân',
          score: champ.totalScore || 0,
        });
      }
    }
    requestAnimationFrame(recalcAutoFit);
  });

  socket.on('layout.config', (cfg) => {
    if (!cfg) return;
    if (cfg.theme && ['cute', 'modern', 'galaxy', 'luxury'].includes(cfg.theme)) {
      currentTheme.value = cfg.theme as GameTheme;
      phaserStage?.setVisualStyle(cfg.theme as GameTheme);
      try {
        window.localStorage.setItem('kb_selected_theme_v2', cfg.theme);
      } catch {}
    }
    if (typeof cfg.bgmEnabled === 'boolean') bgmEnabled.value = cfg.bgmEnabled;
    if (typeof cfg.bgmVolume === 'number') bgmVolume.value = Math.max(0, Math.min(100, cfg.bgmVolume));
    if (typeof cfg.sfxVolume === 'number') sfxVolume.value = Math.max(0, Math.min(100, cfg.sfxVolume));
    if (cfg.lofiStyle && ['chill-cafe', 'dreamy-night', 'pastel-cute'].includes(cfg.lofiStyle)) {
      lofiStyle.value = cfg.lofiStyle as LofiStyle;
    }
    saveAudioPrefs(false);
    layoutCalib.value = {
      frameWidth: Number(cfg.frameWidth ?? layoutCalib.value.frameWidth ?? 1080),
      frameHeight: Number(cfg.frameHeight ?? layoutCalib.value.frameHeight ?? 1920),
      scale: Number(cfg.scale ?? layoutCalib.value.scale),
      widthPercent: Number(cfg.widthPercent ?? layoutCalib.value.widthPercent),
      offsetX: Number(cfg.offsetX ?? layoutCalib.value.offsetX),
      offsetY: Number(cfg.offsetY ?? layoutCalib.value.offsetY),
      paddingTop: Number(cfg.paddingTop ?? layoutCalib.value.paddingTop ?? 160),
      paddingBottom: Number(cfg.paddingBottom ?? layoutCalib.value.paddingBottom ?? 262),
      preset: String(cfg.preset || layoutCalib.value.preset) as LayoutPreset,
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
  if (likeMilestoneTimeout) clearTimeout(likeMilestoneTimeout);
  if (victoryCountdownTimer) {
    clearInterval(victoryCountdownTimer);
    victoryCountdownTimer = null;
  }
  if (!isEmbedded.value) {
    soundFX.stopBgm();
    aiVoice.stop();
  }
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
  transition: background 0.4s ease, color 0.4s ease;
}

.question-color-cycle-background {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  transition: background 2.4s ease-in-out;
}

.gameshow-root.layout-vertical {
  padding: 0;
  width: 100vw;
  height: 100vh;
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
 * Chế độ Dọc TikTok LIVE:
 * 1. Full Màn Hình (Tràn viền 100%)
 * 2. Vùng An Toàn TikTok (Né 160px trên / 262px dưới)
 * 3. Khung cố định 362×444
 */
.layout-vertical .broadcast-frame {
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
}

.layout-vertical .broadcast-frame.frame-box-362x444 {
  width: 362px !important;
  max-width: 98vw !important;
  max-height: 444px !important;
  height: auto !important;
  margin: auto;
  justify-content: center;
  gap: 6px;
}

.layout-vertical .stage-header {
  padding: 8px 12px;
  border-radius: 10px;
  flex-shrink: 0;
}

.layout-vertical .stage-title {
  font-size: clamp(12px, 2vh, 18px);
}

.layout-vertical .live-indicator {
  font-size: 10px;
  padding: 2px 7px;
}

.layout-vertical .metric-pill {
  font-size: 11px;
  padding: 3px 8px;
}

.layout-vertical .heart-goal-pill {
  font-size: 10px;
  padding: 2px 6px;
}

.layout-vertical .heart-pill-track {
  width: 28px;
  height: 4px;
}

.layout-vertical .stage-grid {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
  min-height: 0;
}

.layout-vertical .broadcast-frame.frame-box-362x444 .stage-grid {
  flex: initial;
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;
}

.layout-vertical .center-stage-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 12px 14px;
  border-radius: 12px;
  min-height: 0;
}

.layout-vertical .broadcast-frame.frame-box-362x444 .center-stage-area {
  padding: 10px 12px;
  border-radius: 10px;
}

.layout-vertical .waiting-screen {
  gap: 8px;
}

.layout-vertical .trophy-emblem {
  width: clamp(34px, 5vh, 48px);
  height: clamp(34px, 5vh, 48px);
  margin-bottom: 2px;
}

.layout-vertical .waiting-headline {
  font-size: clamp(16px, 2.4vh, 22px);
}

.layout-vertical .waiting-subtext {
  font-size: clamp(11px, 1.6vh, 14px);
  line-height: 1.3;
}

.layout-vertical .rules-strip {
  grid-template-columns: 1fr;
  gap: 5px;
}

.layout-vertical .rule-item {
  padding: 6px 10px;
  border-radius: 8px;
  gap: 8px;
}

.layout-vertical .rule-item strong {
  font-size: clamp(11px, 1.6vh, 14px);
}

.layout-vertical .rule-item p {
  font-size: clamp(10px, 1.4vh, 12px);
}

.layout-vertical .waiting-players-box {
  padding: 7px 10px;
  border-radius: 8px;
}

.layout-vertical .waiting-players-header {
  font-size: clamp(10.5px, 1.5vh, 13px);
  margin-bottom: 4px;
}

.layout-vertical .empty-players-hint {
  font-size: clamp(10px, 1.4vh, 12px);
}

.layout-vertical .question-screen,
.layout-vertical .reveal-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 8px;
}

.layout-vertical .question-prompt-box {
  padding: 10px 12px;
  border-radius: 10px;
}

.layout-vertical .question-text {
  font-size: clamp(14px, 2.2vh, 22px);
  line-height: 1.35;
}

.layout-vertical .options-grid {
  grid-template-columns: 1fr;
  gap: 6px;
}

/* Khi hiển thị đáp án (ANSWER_REVEAL) ở mobile/dọc: xếp 4 đáp án A/B/C/D thành 2x2 gọn gàng để dành đủ chỗ hiển thị BXH 2 cột dọc bên dưới */
.layout-vertical .reveal-screen .options-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 5px;
}

.layout-vertical .reveal-screen .option-card {
  padding: 5px 8px;
  gap: 6px;
}

.layout-vertical .reveal-screen .option-key {
  width: 24px;
  height: 24px;
  font-size: 12px;
}

.layout-vertical .reveal-screen .option-text {
  font-size: clamp(11px, 1.55vh, 14px);
  line-height: 1.2;
}

.layout-vertical .reveal-screen .question-prompt-box {
  padding: 7px 10px;
}

.layout-vertical .reveal-screen .question-text {
  font-size: clamp(12.5px, 1.85vh, 17px);
  line-height: 1.28;
}

.layout-vertical .reveal-screen .explanation-content p {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.layout-vertical .option-card {
  padding: 7px 10px;
  border-radius: 8px;
  gap: 8px;
}

.layout-vertical .option-key {
  width: clamp(26px, 3.8vh, 36px);
  height: clamp(26px, 3.8vh, 36px);
  font-size: clamp(12px, 1.8vh, 16px);
}

.layout-vertical .option-text {
  font-size: clamp(12.5px, 1.8vh, 16px);
}

.layout-vertical .sidebar-card {
  padding: 7px 12px;
  border-radius: 10px;
  flex-shrink: 0;
}

.layout-vertical .sidebar-header {
  margin-bottom: 4px;
}

.layout-vertical .sidebar-header h3 {
  font-size: clamp(11px, 1.6vh, 14px);
}

.layout-vertical .sidebar-empty {
  font-size: clamp(10px, 1.4vh, 12px);
}

.gameshow-root.is-embedded .broadcast-frame {
  width: 100%;
  max-height: 100%;
}

/* Floating Quick Calibrator & Theme Widget */
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

.calib-top-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.quick-audio-pill {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border-radius: 999px;
  background: rgba(13, 17, 39, 0.88);
  border: 1px solid rgba(0, 240, 255, 0.45);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(6px);
}

.quick-audio-toggle {
  padding: 0.28rem 0.65rem;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.15s ease;
}

.quick-audio-toggle:hover {
  background: rgba(0, 240, 255, 0.18);
}

.quick-vol-step-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: #e2f1ff;
  font-size: 0.85rem;
  font-weight: 900;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.quick-vol-step-btn:hover {
  background: var(--accent-cyan);
  color: #06101f;
  border-color: var(--accent-cyan);
}

.lofi-audio-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-bottom: 0.7rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.lofi-power-btn {
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
  font-size: 0.68rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s ease;
}

.lofi-power-btn.active {
  background: rgba(16, 185, 129, 0.22);
  border-color: #34d399;
  color: #6ee7b7;
}

.lofi-style-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.35rem;
}

.lofi-style-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: 0.35rem 0.25rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.05);
  color: #dbeafe;
  font-size: 0.66rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.lofi-style-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.lofi-style-btn.active {
  background: rgba(255, 117, 160, 0.22);
  border-color: #ff75a0;
  color: #ffffff;
  box-shadow: 0 0 10px rgba(255, 117, 160, 0.25);
}

.vol-slider-with-btns {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.vol-slider-with-btns input[type='range'] {
  flex: 1;
}

.vol-step-btn {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 0.4rem;
  border: 1px solid rgba(0, 240, 255, 0.35);
  background: rgba(24, 30, 64, 0.85);
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 900;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.vol-step-btn:hover {
  background: var(--accent-cyan);
  color: #081024;
}

.quick-theme-btn {
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(13, 17, 39, 0.85);
  border: 1px solid rgba(255, 117, 160, 0.45);
  color: #fff;
  font-size: 0.76rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
  transition: transform 0.15s ease, background 0.2s ease, border-color 0.2s ease;
  backdrop-filter: blur(6px);
}

.quick-theme-btn:hover {
  transform: translateY(-1px) scale(1.03);
  border-color: #ff75a0;
  background: rgba(255, 117, 160, 0.25);
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
  opacity: 0.4;
  transition: opacity 0.2s ease, background 0.2s ease;
  backdrop-filter: blur(6px);
}

.calib-floating-widget:hover .calib-toggle-btn,
.calib-floating-widget.calib-open .calib-toggle-btn {
  opacity: 1;
  background: rgba(13, 17, 39, 0.96);
}

.calib-popup-card {
  width: min(340px, 94vw);
  padding: 0.9rem;
  border-radius: 0.9rem;
  background: rgba(10, 14, 34, 0.96);
  border: 1px solid rgba(0, 240, 255, 0.45);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  backdrop-filter: blur(12px);
}

/* Theme Selector in Popup */
.theme-selector-section {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding-bottom: 0.65rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.theme-section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.74rem;
  color: var(--text-secondary);
}

.theme-current-name {
  color: var(--accent-cyan);
  font-weight: 800;
}

.theme-options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.35rem;
}

.theme-card-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.5rem;
  border-radius: 0.55rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  color: #e2f1ff;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
}

.theme-card-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.theme-card-btn.active {
  background: rgba(0, 240, 255, 0.16);
  border-color: var(--accent-cyan);
  box-shadow: 0 0 12px rgba(0, 240, 255, 0.25);
}

.theme-btn-icon {
  font-size: 1.15rem;
  flex-shrink: 0;
}

.theme-btn-texts {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  min-width: 0;
}

.theme-btn-texts strong {
  font-size: 0.74rem;
  font-weight: 800;
}

.theme-btn-texts small {
  font-size: 0.62rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.calib-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78rem;
  color: var(--accent-cyan);
}

.calib-badge {
  font-size: 0.68rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: rgba(0, 240, 255, 0.16);
  border: 1px solid rgba(0, 240, 255, 0.4);
  color: var(--accent-cyan);
  font-weight: 800;
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

/* Thanh Tim Dọc Bên Phải (Vertical Right-Side Heart Progress Bar) */
.heart-vertical-rail {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 45;
  width: 54px;
  padding: 8px 5px;
  border-radius: 999px;
  background: rgba(13, 17, 39, 0.92);
  border: 2px solid rgba(244, 63, 94, 0.65);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55), 0 0 14px rgba(244, 63, 94, 0.35);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  pointer-events: auto;
  transition: all 0.25s ease;
}

.heart-vertical-rail.heart-milestone-ready {
  border-color: #fbbf24;
  box-shadow: 0 8px 26px rgba(0, 0, 0, 0.6), 0 0 18px rgba(251, 191, 36, 0.65);
}

.heart-v-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-align: center;
}

.heart-pulse-emoji {
  display: inline-block;
  animation: heartPulse 1.15s infinite ease-in-out;
  font-size: 1.35rem;
  line-height: 1;
  filter: drop-shadow(0 0 6px rgba(244, 63, 94, 0.75));
}

@keyframes heartPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.24); }
}

.heart-v-goal {
  font-size: 9px;
  font-weight: 900;
  color: #fecdd3;
  line-height: 1.1;
  text-align: center;
  max-width: 48px;
  word-break: break-word;
}

.heart-v-track {
  position: relative;
  width: 18px;
  height: clamp(115px, 21vh, 185px);
  background: rgba(255, 255, 255, 0.12);
  border: 1.5px solid rgba(251, 113, 133, 0.45);
  border-radius: 999px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.55);
}

.heart-v-tick {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.22);
  z-index: 2;
}
.heart-v-tick.tick-75 { bottom: 75%; }
.heart-v-tick.tick-50 { bottom: 50%; }
.heart-v-tick.tick-25 { bottom: 25%; }

.heart-v-fill {
  position: relative;
  width: 100%;
  background: linear-gradient(0deg, #e11d48 0%, #f43f5e 50%, #fb7185 85%, #fde047 100%);
  border-radius: 999px;
  transition: height 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 0 12px rgba(244, 63, 94, 0.85);
}

.heart-v-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 999px;
  filter: blur(1px);
}

.heart-v-pct {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  font-size: 8.5px;
  font-weight: 900;
  color: #ffffff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.95);
  white-space: nowrap;
}

.heart-v-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  line-height: 1.15;
}

.heart-v-step {
  font-size: 10px;
  font-weight: 900;
  color: #fde047;
}

.heart-v-total {
  font-size: 8.5px;
  font-weight: 700;
  color: #fda4af;
}

.layout-vertical .stage-grid {
  padding-right: 56px;
}

.layout-vertical .heart-vertical-rail {
  right: 6px;
  width: 50px;
  padding: 7px 4px;
}

.layout-vertical .heart-v-track {
  width: 16px;
  height: clamp(110px, 20vh, 175px);
}

.theme-cute .heart-vertical-rail {
  background: rgba(255, 255, 255, 0.94);
  border: 2.5px solid #ff4785;
  box-shadow: 0 5px 0 #ff9ec4, 0 10px 22px rgba(255, 71, 133, 0.25);
}

.theme-cute .heart-v-goal {
  color: #be185d;
}

.theme-cute .heart-v-track {
  background: #ffe4ef;
  border-color: #f472b6;
}

.theme-cute .heart-v-step {
  color: #e11d48;
}

.theme-cute .heart-v-total {
  color: #9d174d;
}

/* Like Milestone Popup */
.like-milestone-popup {
  position: absolute;
  top: 4.8vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6vh 1.4vh;
  background: linear-gradient(135deg, rgba(225, 29, 72, 0.95), rgba(159, 18, 57, 0.95));
  border: 1.5px solid #fda4af;
  border-radius: 999px;
  box-shadow: 0 4px 20px rgba(244, 63, 94, 0.6), 0 0 12px rgba(255, 255, 255, 0.4);
  color: #ffffff;
  font-weight: 800;
  font-size: clamp(11px, 1.8vh, 15px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  pointer-events: none;
  animation: milestoneBounce 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes milestoneBounce {
  0% { transform: translate(-50%, -10px) scale(0.8); opacity: 0; }
  100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
}

.pop-milestone-enter-active,
.pop-milestone-leave-active {
  transition: all 0.35s ease;
}
.pop-milestone-enter-from {
  opacity: 0;
  transform: translate(-50%, -15px) scale(0.8);
}
.pop-milestone-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px) scale(0.9);
}

.rule-item-heart {
  border-color: rgba(244, 63, 94, 0.35);
  background: rgba(244, 63, 94, 0.08);
}
.rule-heart-icon {
  font-size: 1.15rem;
  line-height: 1;
}

.badge-amber {
  background: rgba(245, 158, 11, 0.22);
  border-color: rgba(245, 158, 11, 0.55);
  color: #fde68a;
  font-weight: 800;
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
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.22vh 0.75vh 0.22vh 0.28vh;
  border-radius: 999px;
  background: rgba(0, 240, 255, 0.12);
  border: 1px solid rgba(0, 240, 255, 0.3);
  font-size: clamp(10px, 1.5vh, 13px);
  font-weight: 600;
  color: #e2f1ff;
}

.chip-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 1.5px solid rgba(255, 255, 255, 0.7);
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
  margin-bottom: 0.3rem;
}

.fastest-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.fastest-item {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.45rem;
  padding: 0.2rem 0.55rem 0.2rem 0.25rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(250, 204, 21, 0.35);
  font-size: 0.76rem;
}

.fastest-user {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
}

.fastest-user strong {
  max-width: 110px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fastest-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 1.5px solid var(--accent-gold);
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

.layout-vertical .stage-leaderboard-rows {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.4rem;
}

.layout-vertical .stage-lb-row {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  padding: 0.42rem 0.52rem;
  gap: 0.3rem;
  min-width: 0;
}

.layout-vertical .stage-lb-row .lb-card-top {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
  width: 100%;
}

.layout-vertical .stage-lb-row .lb-rank {
  width: 20px;
  height: 20px;
  font-size: 0.72rem;
  flex-shrink: 0;
}

.layout-vertical .stage-lb-row .avatar-md {
  width: 24px;
  height: 24px;
  border-width: 2px;
  flex-shrink: 0;
}

.layout-vertical .stage-lb-row .lb-name {
  flex: 1;
  min-width: 0;
  font-size: 0.78rem;
  font-weight: 800;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.25;
}

.theme-cute .layout-vertical .stage-lb-row .lb-name,
.theme-cute.layout-vertical .stage-lb-row .lb-name {
  color: #4a154b;
}

.layout-vertical .stage-lb-row .lb-card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.3rem;
  width: 100%;
  padding-top: 0.2rem;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
}

.theme-cute .layout-vertical .stage-lb-row .lb-card-bottom,
.theme-cute.layout-vertical .stage-lb-row .lb-card-bottom {
  border-top-color: rgba(244, 114, 182, 0.3);
}

.layout-vertical .stage-lb-row .lb-correct-pill {
  font-size: 0.65rem;
  color: var(--text-secondary);
  white-space: nowrap;
  font-weight: 600;
}

.layout-vertical .stage-lb-row .lb-scores-right {
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
  flex-shrink: 0;
}

.layout-vertical .stage-lb-row .lb-delta {
  font-size: 0.72rem;
  white-space: nowrap;
}

.layout-vertical .stage-lb-row .lb-total-score {
  font-size: 0.8rem;
  white-space: nowrap;
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

/* Avatar người chơi trên bảng thành tích */
.player-avatar {
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(142, 164, 210, 0.18);
  border: 2px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}

.player-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.player-avatar span {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 900;
  line-height: 1;
}

.avatar-sm {
  width: 28px;
  height: 28px;
  border-width: 2px;
}

.avatar-sm span {
  font-size: 0.75rem;
}

.avatar-md {
  width: 38px;
  height: 38px;
  border-width: 2.5px;
}

.avatar-md span {
  font-size: 0.95rem;
}

.avatar-lg {
  width: 68px;
  height: 68px;
  border-width: 3px;
}

.avatar-lg span {
  font-size: 1.6rem;
}

.podium-avatar {
  margin: 0.25rem auto 0.15rem;
}

.avatar-rank-1,
.lb-top-1 .player-avatar,
.podium-gold .player-avatar {
  border-color: #fbbf24;
  box-shadow: 0 0 12px rgba(251, 191, 36, 0.6);
}

.avatar-rank-2,
.lb-top-2 .player-avatar,
.podium-silver .player-avatar {
  border-color: #e2e8f0;
  box-shadow: 0 0 8px rgba(226, 232, 240, 0.45);
}

.avatar-rank-3,
.lb-top-3 .player-avatar,
.podium-bronze .player-avatar {
  border-color: #f59e0b;
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.45);
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

.victory-countdown-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.8rem;
}

.victory-countdown-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: rgba(30, 41, 79, 0.88);
  border: 1px solid rgba(147, 197, 253, 0.4);
  padding: 0.4rem 0.95rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #93c5fd;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  animation: victory-pulse 1.5s ease-in-out infinite alternate;
}

@keyframes victory-pulse {
  0% { transform: scale(0.98); opacity: 0.9; }
  100% { transform: scale(1.02); opacity: 1; }
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.35rem 0.45rem;
}

.layout-vertical .mini-lb-item {
  padding: 0.26rem 0.38rem;
  gap: 0.28rem;
}

.layout-vertical .mini-lb-item .mini-rank {
  width: 19px;
  height: 19px;
  font-size: 0.68rem;
}

.layout-vertical .mini-lb-item .avatar-sm {
  width: 20px;
  height: 20px;
}

.layout-vertical .mini-user strong {
  font-size: 0.72rem;
}

.layout-vertical .mini-score {
  font-size: 0.73rem;
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
  .layout-vertical .rules-strip {
    grid-template-columns: 1fr;
  }

  .mini-lb-list,
  .layout-vertical .mini-lb-list,
  .layout-vertical .stage-leaderboard-rows {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.35rem 0.45rem;
  }
}

/* ===================================================================
   HỆ THỐNG 4 THEME ĐỘC BẢN: ĐỔI TOÀN DIỆN GIAO DIỆN, FONT CHỮ & MÀU SẮC
   =================================================================== */

/* -------------------------------------------------------------------
   1. THEME DỄ THƯƠNG - KẸO NGỌT PASTEL (CUTE CANDY POP)
   Font: Baloo 2 (Tiêu đề tròn trịa đáng yêu) + Quicksand (Nội dung mềm mại)
   Tông màu: Hồng Dâu - Kem Sữa - Tím Khoai Môn - Vàng Bơ - Xanh Bạc Hà (Nền sáng Pastel)
   ------------------------------------------------------------------- */
.theme-cute {
  font-family: 'Quicksand', 'Baloo 2', 'Be Vietnam Pro', sans-serif;
  background: linear-gradient(155deg, #ffdde8 0%, #f3d1ff 38%, #dce8ff 74%, #ffe8f3 100%) !important;
  color: #4a154b;
  --accent-cyan: #ff4785;
  --accent-gold: #f59e0b;
  --accent-purple: #9333ea;
  --text-primary: #4a154b;
  --text-secondary: #7e3b82;
  --text-muted: #a66aa8;
}

.theme-cute .stage-title,
.theme-cute .waiting-headline,
.theme-cute .question-text,
.theme-cute .option-key,
.theme-cute .countdown-clock,
.theme-cute .leaderboard-stage-header h2,
.theme-cute .victory-header h2,
.theme-cute .podium-name,
.theme-cute .podium-score,
.theme-cute .sidebar-header h3 {
  font-family: 'Baloo 2', 'Quicksand', cursive, sans-serif;
  letter-spacing: 0.01em;
}

.theme-cute .stage-header {
  background: rgba(255, 255, 255, 0.92);
  border: 2.5px solid #ff85b3;
  border-radius: 999px;
  box-shadow: 0 5px 0 #ff9ec4, 0 10px 20px rgba(255, 71, 133, 0.16);
  padding: 0.8vh 1.8vh;
}

.theme-cute .stage-header.header-gift-active {
  background: linear-gradient(90deg, #fff0f6 0%, #fef3c7 100%);
  border-color: #f59e0b;
  box-shadow: 0 5px 0 #fbbf24, 0 8px 20px rgba(245, 158, 11, 0.25);
}

.theme-cute .gift-inline-text strong {
  color: #d97706;
}
.theme-cute .gift-inline-text span {
  color: #4a154b;
}
.theme-cute .gift-inline-text em {
  color: #db2777;
}

.theme-cute .live-indicator {
  background: linear-gradient(135deg, #ff4785, #ff75a0);
  border: 2px solid #ffffff;
  color: #ffffff;
  box-shadow: 0 3px 8px rgba(255, 71, 133, 0.35);
}

.theme-cute .pulse-dot {
  background: #ffffff;
  box-shadow: 0 0 6px #ffffff;
}

.theme-cute .stage-title {
  color: #831843;
  font-weight: 800;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.9);
}

.theme-cute .metric-pill {
  background: #fff0f7;
  border: 2px solid #ff9ec4;
  color: #be185d;
  font-weight: 800;
  box-shadow: 0 2px 0 #ffb3d1;
}

.theme-cute .center-stage-area {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
  border: 3px solid #ff85b3;
  border-radius: 26px;
  box-shadow: 0 8px 0 #ff9ec4, 0 18px 40px rgba(190, 24, 93, 0.14);
}

.theme-cute .trophy-emblem {
  background: linear-gradient(135deg, #fffbeb, #fde68a);
  border: 3px solid #f59e0b;
  color: #d97706;
  border-radius: 22px;
  box-shadow: 0 5px 0 #fbbf24;
}

.theme-cute .waiting-headline {
  color: #9d174d;
  text-shadow: 0 2px 0 #fce7f3;
}

.theme-cute .waiting-subtext {
  color: #6b21a8;
  font-weight: 700;
}

.theme-cute .waiting-subtext strong {
  color: #e11d48;
  background: #ffe4e6;
  padding: 0 6px;
  border-radius: 8px;
}

.theme-cute .rule-item {
  background: #fff5f9;
  border: 2px solid #fbcfe8;
  border-radius: 18px;
  box-shadow: 0 4px 0 #f9a8d4;
}

.theme-cute .rule-item strong {
  color: #831843;
  font-family: 'Baloo 2', sans-serif;
}

.theme-cute .rule-item p {
  color: #7e22ce;
  font-weight: 600;
}

.theme-cute .waiting-players-box {
  background: #fdf4ff;
  border: 2px dashed #e879f9;
  border-radius: 18px;
}

.theme-cute .waiting-players-header {
  color: #86198f;
}

.theme-cute .room-code-tag {
  color: #ffffff;
  background: #ec4899;
  padding: 2px 10px;
  border-radius: 999px;
  font-weight: 800;
}

.theme-cute .player-chip {
  background: #ffffff;
  border: 2px solid #f472b6;
  color: #9d174d;
  font-weight: 700;
  box-shadow: 0 2px 0 #fbcfe8;
}

.theme-cute .empty-players-hint {
  color: #a21caf;
  font-weight: 600;
}

.theme-cute .question-meta-badges .badge-cyan {
  background: #ffe4ef;
  color: #be185d;
  border: 2px solid #f472b6;
  font-weight: 800;
}

.theme-cute .question-meta-badges .badge-purple {
  background: #f3e8ff;
  color: #7e22ce;
  border: 2px solid #c084fc;
  font-weight: 800;
}

.theme-cute .countdown-clock {
  background: #fff0f6;
  border: 2.5px solid #ff4785;
  color: #e11d48;
  border-radius: 999px;
  box-shadow: 0 4px 0 #ff9ec4;
}

.theme-cute .countdown-clock.clock-urgent {
  background: #ffe4e6;
  border-color: #e11d48;
  color: #be123c;
}

.theme-cute .timer-track {
  background: #fce7f3;
  border: 1.5px solid #f9a8d4;
  height: 1.1vh;
}

.theme-cute .timer-fill {
  background: linear-gradient(90deg, #ff4785, #a855f7, #38bdf8);
}

.theme-cute .question-prompt-box {
  background: linear-gradient(180deg, #ffffff 0%, #fff7fb 100%);
  border: 2.5px solid #f472b6;
  border-radius: 22px;
  box-shadow: 0 6px 0 #fbcfe8, 0 10px 24px rgba(244, 114, 182, 0.14);
}

.theme-cute .question-text {
  color: #4a154b;
  font-weight: 800;
}

.theme-cute .answered-counter {
  background: #fce7f3;
  border: 1.5px solid #f472b6;
  color: #be185d;
  font-weight: 800;
}

/* 4 Nút đáp án Kẹo Ngọt 3D nổi khối theo 4 hương vị */
.theme-cute .option-card {
  border-radius: 18px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.theme-cute .option-card-a {
  background: #fff0f6;
  border: 2.5px solid #fb7185;
  box-shadow: 0 5px 0 #fda4af;
}

.theme-cute .option-card-b {
  background: #fefce8;
  border: 2.5px solid #fbbf24;
  box-shadow: 0 5px 0 #fcd34d;
}

.theme-cute .option-card-c {
  background: #faf5ff;
  border: 2.5px solid #c084fc;
  box-shadow: 0 5px 0 #d8b4fe;
}

.theme-cute .option-card-d {
  background: #ecfdf5;
  border: 2.5px solid #34d399;
  box-shadow: 0 5px 0 #6ee7b7;
}

.theme-cute .option-card-a .option-key {
  background: #fb7185;
  border-color: #f43f5e;
  color: #ffffff;
  border-radius: 14px;
  box-shadow: 0 3px 0 #e11d48;
}

.theme-cute .option-card-b .option-key {
  background: #f59e0b;
  border-color: #d97706;
  color: #ffffff;
  border-radius: 14px;
  box-shadow: 0 3px 0 #b45309;
}

.theme-cute .option-card-c .option-key {
  background: #a855f7;
  border-color: #9333ea;
  color: #ffffff;
  border-radius: 14px;
  box-shadow: 0 3px 0 #7e22ce;
}

.theme-cute .option-card-d .option-key {
  background: #10b981;
  border-color: #059669;
  color: #ffffff;
  border-radius: 14px;
  box-shadow: 0 3px 0 #047857;
}

.theme-cute .option-text {
  color: #3b0764;
  font-weight: 800;
}

.theme-cute .option-correct {
  background: #d1fae5 !important;
  border-color: #059669 !important;
  box-shadow: 0 5px 0 #10b981 !important;
}

.theme-cute .option-votes {
  background: #ffffff;
  border: 1.5px solid #e9d5ff;
  color: #6b21a8;
  font-weight: 800;
}

.theme-cute .explanation-box {
  background: #f0fdf4;
  border: 2px solid #34d399;
  border-radius: 16px;
}

.theme-cute .explanation-content h3 {
  color: #047857;
}

.theme-cute .explanation-content p {
  color: #064e3b;
  font-weight: 700;
}

.theme-cute .fastest-box h4,
.theme-cute .fastest-pts,
.theme-cute .reveal-stat {
  color: #d97706;
}

.theme-cute .fastest-item span:first-child {
  color: #4a154b;
  font-weight: 700;
}

.theme-cute .sidebar-card {
  background: rgba(255, 255, 255, 0.9);
  border: 2.5px solid #ff85b3;
  border-radius: 22px;
  box-shadow: 0 6px 0 #ff9ec4, 0 10px 24px rgba(255, 71, 133, 0.12);
}

.theme-cute .sidebar-header h3 {
  color: #9d174d;
  font-size: 0.9rem;
}

.theme-cute .mini-lb-item,
.theme-cute .stage-lb-row,
.theme-cute .podium-card {
  background: #fff5f9;
  border: 2px solid #fbcfe8;
  border-radius: 14px;
}

.theme-cute .mini-user strong,
.theme-cute .lb-player-info strong,
.theme-cute .podium-name {
  color: #4a154b;
  font-weight: 800;
}

.theme-cute .mini-score,
.theme-cute .lb-total-score {
  color: #e11d48;
  font-weight: 900;
}

.theme-cute .sidebar-empty {
  color: #9d174d;
  font-weight: 600;
}

/* -------------------------------------------------------------------
   2. THEME HIỆN ĐẠI - AURORA GLASS (MODERN AURORA)
   Font: Plus Jakarta Sans (Hiện đại, sắc nét chuẩn UI Apple/Spotify)
   Tông màu: Cực quang Indigo - Xanh Ngọc Lam - Tím Hồng Kính Mờ
   ------------------------------------------------------------------- */
.theme-modern {
  font-family: 'Plus Jakarta Sans', 'Be Vietnam Pro', sans-serif;
  background:
    radial-gradient(circle at 15% 15%, rgba(56, 189, 248, 0.35) 0%, transparent 45%),
    radial-gradient(circle at 85% 20%, rgba(236, 72, 153, 0.32) 0%, transparent 45%),
    radial-gradient(circle at 50% 85%, rgba(99, 102, 241, 0.38) 0%, transparent 50%),
    linear-gradient(160deg, #0b132b 0%, #1c2541 50%, #0f172a 100%) !important;
  --accent-cyan: #38bdf8;
  --accent-gold: #fbbf24;
  --accent-purple: #818cf8;
}

.theme-modern .stage-title,
.theme-modern .waiting-headline,
.theme-modern .question-text {
  font-family: 'Plus Jakarta Sans', 'Be Vietnam Pro', sans-serif;
  letter-spacing: -0.015em;
}

.theme-modern .stage-header {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}

.theme-modern .live-indicator {
  background: linear-gradient(135deg, #06b6d4, #6366f1);
  border: none;
  color: #ffffff;
}

.theme-modern .pulse-dot {
  background: #38bdf8;
  box-shadow: 0 0 8px #38bdf8;
}

.theme-modern .metric-pill {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #f8fafc;
}

.theme-modern .center-stage-area {
  background: rgba(15, 23, 42, 0.68);
  backdrop-filter: blur(24px);
  border: 1.5px solid rgba(255, 255, 255, 0.18);
  border-radius: 24px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.theme-modern .waiting-headline {
  background: linear-gradient(90deg, #ffffff 0%, #bae6fd 50%, #f5d0fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.theme-modern .rule-item {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 16px;
}

.theme-modern .waiting-players-box {
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(56, 189, 248, 0.25);
  border-radius: 16px;
}

.theme-modern .question-prompt-box {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.85) 100%);
  border: 1.5px solid rgba(56, 189, 248, 0.35);
  border-radius: 20px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

.theme-modern .timer-fill {
  background: linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899);
}

.theme-modern .option-card {
  background: rgba(30, 41, 59, 0.75);
  backdrop-filter: blur(12px);
  border: 1.5px solid rgba(255, 255, 255, 0.16);
  border-radius: 16px;
  transition: all 0.2s ease;
}

.theme-modern .option-card-a .option-key {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  border: none;
  color: #ffffff;
  border-radius: 12px;
}

.theme-modern .option-card-b .option-key {
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  border: none;
  color: #ffffff;
  border-radius: 12px;
}

.theme-modern .option-card-c .option-key {
  background: linear-gradient(135deg, #8b5cf6, #d946ef);
  border: none;
  color: #ffffff;
  border-radius: 12px;
}

.theme-modern .option-card-d .option-key {
  background: linear-gradient(135deg, #10b981, #0d9488);
  border: none;
  color: #ffffff;
  border-radius: 12px;
}

.theme-modern .sidebar-card {
  background: rgba(15, 23, 42, 0.68);
  backdrop-filter: blur(20px);
  border: 1.5px solid rgba(255, 255, 255, 0.16);
  border-radius: 20px;
}

.theme-modern .mini-lb-item {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

/* -------------------------------------------------------------------
   3. THEME CYBER ESPORT - NEON GAMING (GALAXY / CYBER)
   Font: Chakra Petch (Góc cạnh thể thao điện tử Sci-Fi Esport)
   Tông màu: Đen Vũ Trụ - Xanh Lục Bảo Neon (#00f5d4) - Hồng Tia Chớp (#f72585)
   ------------------------------------------------------------------- */
.theme-galaxy {
  font-family: 'Chakra Petch', 'Be Vietnam Pro', sans-serif;
  background:
    radial-gradient(circle at 50% 0%, rgba(247, 37, 133, 0.24) 0%, transparent 50%),
    radial-gradient(circle at 50% 100%, rgba(0, 245, 212, 0.2) 0%, transparent 50%),
    linear-gradient(180deg, #050511 0%, #0a0924 55%, #04030f 100%) !important;
  --accent-cyan: #00f5d4;
  --accent-gold: #fee440;
  --accent-purple: #f72585;
}

.theme-galaxy .stage-title,
.theme-galaxy .waiting-headline,
.theme-galaxy .question-text,
.theme-galaxy .option-key,
.theme-galaxy .countdown-clock,
.theme-galaxy .option-text,
.theme-galaxy .sidebar-header h3 {
  font-family: 'Chakra Petch', 'Be Vietnam Pro', sans-serif;
  letter-spacing: 0.02em;
}

.theme-galaxy .stage-header {
  background: rgba(9, 11, 32, 0.95);
  border: 1.5px solid #00f5d4;
  border-radius: 6px;
  box-shadow: 0 0 18px rgba(0, 245, 212, 0.28), inset 0 0 12px rgba(0, 245, 212, 0.1);
}

.theme-galaxy .center-stage-area {
  background: rgba(8, 10, 28, 0.92);
  border: 2px solid #00f5d4;
  border-radius: 10px;
  box-shadow: 0 0 30px rgba(0, 245, 212, 0.2), inset 0 0 25px rgba(247, 37, 133, 0.08);
}

.theme-galaxy .waiting-headline {
  color: #00f5d4;
  text-transform: uppercase;
  text-shadow: 0 0 14px rgba(0, 245, 212, 0.55);
}

.theme-galaxy .question-prompt-box {
  background: rgba(14, 17, 48, 0.96);
  border: 1.5px solid #f72585;
  border-radius: 8px;
  box-shadow: 0 0 22px rgba(247, 37, 133, 0.25);
}

.theme-galaxy .option-card {
  background: rgba(12, 16, 44, 0.95);
  border: 1.5px solid rgba(0, 245, 212, 0.45);
  border-radius: 6px;
  box-shadow: inset 0 0 10px rgba(0, 245, 212, 0.08);
}

.theme-galaxy .option-key {
  border-radius: 4px;
}

.theme-galaxy .timer-fill {
  background: linear-gradient(90deg, #00f5d4, #f72585);
  box-shadow: 0 0 12px #00f5d4;
}

.theme-galaxy .sidebar-card {
  background: rgba(8, 10, 28, 0.92);
  border: 1.5px solid rgba(247, 37, 133, 0.55);
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(247, 37, 133, 0.18);
}

/* -------------------------------------------------------------------
   4. THEME HOÀNG GIA - VÀNG KIM 24K (ROYAL LUXURY GOLD)
   Font: Montserrat (Đẳng cấp, sang trọng chuẩn Giải Đấu Vô Địch)
   Tông màu: Đỏ Rượu Vang / Đen Obsidian - Vàng Kim 24K (#fbbf24)
   ------------------------------------------------------------------- */
.theme-luxury {
  font-family: 'Montserrat', 'Be Vietnam Pro', sans-serif;
  background:
    radial-gradient(circle at 50% 15%, rgba(245, 158, 11, 0.28) 0%, transparent 50%),
    linear-gradient(165deg, #271203 0%, #140802 55%, #090300 100%) !important;
  --accent-cyan: #fbbf24;
  --accent-gold: #fde047;
  --accent-purple: #f59e0b;
  --text-secondary: #fde68a;
}

.theme-luxury .stage-title,
.theme-luxury .waiting-headline,
.theme-luxury .question-text,
.theme-luxury .option-key,
.theme-luxury .countdown-clock,
.theme-luxury .sidebar-header h3 {
  font-family: 'Montserrat', 'Be Vietnam Pro', sans-serif;
  letter-spacing: 0.02em;
}

.theme-luxury .stage-header {
  background: linear-gradient(90deg, rgba(45, 24, 5, 0.95) 0%, rgba(28, 14, 3, 0.95) 100%);
  border: 1.5px solid #fbbf24;
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(251, 191, 36, 0.22);
}

.theme-luxury .live-indicator {
  background: linear-gradient(135deg, #b45309, #f59e0b);
  border-color: #fde68a;
  color: #ffffff;
}

.theme-luxury .metric-pill {
  background: rgba(66, 32, 6, 0.9);
  border: 1px solid rgba(251, 191, 36, 0.5);
  color: #fef08a;
}

.theme-luxury .center-stage-area {
  background: linear-gradient(180deg, rgba(36, 18, 4, 0.94) 0%, rgba(18, 9, 2, 0.96) 100%);
  border: 2px solid #fbbf24;
  border-radius: 16px;
  box-shadow: 0 0 40px rgba(251, 191, 36, 0.18), 0 20px 50px rgba(0, 0, 0, 0.85);
}

.theme-luxury .trophy-emblem {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  border: 2px solid #fef08a;
  color: #1c0d02;
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
}

.theme-luxury .waiting-headline {
  background: linear-gradient(180deg, #ffffff 0%, #fde047 60%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
}

.theme-luxury .rule-item {
  background: rgba(54, 27, 6, 0.8);
  border: 1px solid rgba(251, 191, 36, 0.35);
}

.theme-luxury .waiting-players-box {
  background: rgba(24, 11, 2, 0.85);
  border: 1px solid rgba(251, 191, 36, 0.4);
}

.theme-luxury .player-chip {
  background: rgba(251, 191, 36, 0.15);
  border: 1px solid rgba(251, 191, 36, 0.5);
  color: #fef08a;
}

.theme-luxury .question-prompt-box {
  background: linear-gradient(180deg, rgba(56, 29, 6, 0.96) 0%, rgba(33, 16, 3, 0.96) 100%);
  border: 2px solid #fbbf24;
  border-radius: 14px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.6), inset 0 0 18px rgba(251, 191, 36, 0.12);
}

.theme-luxury .timer-fill {
  background: linear-gradient(90deg, #b45309, #fbbf24, #fef08a);
}

.theme-luxury .option-card {
  background: linear-gradient(90deg, rgba(46, 23, 5, 0.95) 0%, rgba(30, 15, 3, 0.95) 100%);
  border: 1.5px solid rgba(251, 191, 36, 0.5);
  border-radius: 12px;
}

.theme-luxury .option-key {
  background: linear-gradient(135deg, #f59e0b, #fbbf24) !important;
  border: 1px solid #fef08a !important;
  color: #1c0d02 !important;
  font-weight: 900;
}

.theme-luxury .sidebar-card {
  background: linear-gradient(180deg, rgba(36, 18, 4, 0.94) 0%, rgba(18, 9, 2, 0.96) 100%);
  border: 1.5px solid #fbbf24;
  border-radius: 14px;
}

.theme-luxury .mini-lb-item {
  background: rgba(56, 29, 6, 0.75);
  border: 1px solid rgba(251, 191, 36, 0.28);
}
</style>
