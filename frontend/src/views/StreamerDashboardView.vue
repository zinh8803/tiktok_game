<template>
  <div class="dashboard-page">
    <!-- Top Navigation Bar -->
    <header class="dash-topbar">
      <div class="topbar-brand">
        <div class="brand-badge">KB</div>
        <div>
          <h1>Knowledge Battle — Bàn Điều Khiển Streamer</h1>
          <p>Quản lý phiên TikTok LIVE, điều phối trận đấu và cấu hình OBS Browser Source</p>
        </div>
      </div>

      <nav class="topbar-actions">
        <router-link to="/admin" class="btn btn-secondary">
          <Database :size="17" />
          <span>Ngân Hàng Câu Hỏi ({{ stats.publishedQuestions || 20 }})</span>
        </router-link>
        <a
          :href="obsLandscapeUrl"
          target="_blank"
          rel="noopener"
          class="btn btn-cyan"
        >
          <ExternalLink :size="17" />
          <span>Mở Màn Hình OBS Game Show</span>
        </a>
      </nav>
    </header>

    <!-- Status Notification Banner -->
    <div v-if="toastMessage" class="toast-banner" :class="`toast-${toastType}`">
      <span>{{ toastMessage }}</span>
      <button type="button" @click="toastMessage = ''">Đóng</button>
    </div>

    <!-- Main Dashboard Grid -->
    <div class="dash-main-grid">
      <!-- Left Column: TikTok Connector, Room Config, Simulator -->
      <div class="dash-col">
        <!-- 1. Kết nối TikTok LIVE (Mục 6.4 & 6.5) -->
        <section class="panel-card">
          <div class="panel-header">
            <div class="panel-title-group">
              <Radio :size="20" class="icon-cyan" />
              <h2>1. Kết nối TikTok LIVE</h2>
            </div>
            <span class="badge" :class="connectionBadgeClass">
              {{ tiktokStatus.state }}
            </span>
          </div>

          <p class="panel-desc">
            Nhập <strong>@username</strong> kênh TikTok đang mở LIVE (không nhập mật khẩu).
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
              <span>Sự kiện đã nhận</span>
              <strong>{{ tiktokStatus.eventsReceived || 0 }}</strong>
            </div>
          </div>

          <div v-if="tiktokStatus.lastError" class="connection-alert">
            <AlertTriangle :size="18" />
            <span>{{ tiktokStatus.lastError }}</span>
          </div>
        </section>

        <!-- 2. Cấu hình Phòng chơi & Bộ câu hỏi (Mục 2 & 4.5) -->
        <section class="panel-card">
          <div class="panel-header">
            <div class="panel-title-group">
              <Settings :size="20" class="icon-purple" />
              <h2>2. Cấu hình Phòng & Trận đấu</h2>
            </div>
            <span class="badge badge-cyan tabular-nums">Mã: {{ roomCode }}</span>
          </div>

          <div class="config-form-grid">
            <div class="form-field full-span">
              <label>Tên chương trình hiển thị trên OBS</label>
              <input
                v-model="configForm.title"
                type="text"
                class="input-control"
                placeholder="Knowledge Battle — Đấu Trường Tri Thức"
              />
            </div>

            <div class="form-field">
              <label>Danh mục câu hỏi</label>
              <select v-model="configForm.categoryId" class="select-control">
                <option value="ALL">Tất cả danh mục (Tổng hợp)</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }} ({{ cat.publishedCount }} câu)
                </option>
              </select>
            </div>

            <div class="form-field">
              <label>Độ khó</label>
              <select v-model="configForm.difficulty" class="select-control">
                <option value="ALL">Hỗn hợp (Đủ mọi mức độ)</option>
                <option value="EASY">Dễ (Khởi động)</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="HARD">Khó (Thử thách)</option>
              </select>
            </div>

            <div class="form-field">
              <label>Số lượng câu hỏi / trận</label>
              <select v-model.number="configForm.questionCount" class="select-control tabular-nums">
                <option :value="5">5 câu hỏi (Nhanh)</option>
                <option :value="10">10 câu hỏi (Tiêu chuẩn)</option>
                <option :value="15">15 câu hỏi</option>
                <option :value="20">20 câu hỏi (Marathon)</option>
                <option :value="30">30 câu hỏi</option>
                <option :value="50">50 câu hỏi</option>
                <option :value="100">100 câu hỏi</option>
                <option :value="0">🔥 Chạy hết TẤT CẢ câu hỏi ({{ stats.publishedQuestions || 'Toàn bộ' }} câu)</option>
              </select>
            </div>

            <div class="form-field">
              <label>Thời gian trả lời mỗi câu</label>
              <select v-model.number="configForm.timePerQuestion" class="select-control tabular-nums">
                <option :value="15">15 giây / câu (Test nhanh)</option>
                <option :value="20">20 giây / câu</option>
                <option :value="25">25 giây / câu (Chuẩn bù độ trễ TikTok LIVE)</option>
                <option :value="30">30 giây / câu</option>
                <option :value="45">45 giây / câu</option>
              </select>
            </div>

            <div class="form-field full-span checkbox-row">
              <label class="checkbox-label">
                <input v-model="configForm.autoAdvance" type="checkbox" />
                <span>Tự động chuyển qua Công bố đáp án → Bảng xếp hạng → Câu tiếp theo</span>
              </label>
            </div>
          </div>

          <div class="panel-footer" style="display: flex; gap: 0.65rem; flex-wrap: wrap;">
            <button type="button" class="btn btn-secondary" @click="saveConfig">
              <Save :size="16" />
              <span>Lưu cấu hình phòng</span>
            </button>
            <button type="button" class="btn btn-gold" @click="handleQuickAddRandomQuestions">
              <Sparkles :size="16" />
              <span>+10 Câu hỏi Random</span>
            </button>
          </div>
        </section>

        <!-- 3. Thiết lập OBS Browser Source (Mục 7.3) -->
        <section class="panel-card">
          <div class="panel-header">
            <div class="panel-title-group">
              <Monitor :size="20" class="icon-gold" />
              <h2>3. Đường dẫn OBS Browser Source & Chỉnh Khớp Điện Thoại</h2>
            </div>
          </div>

          <div class="obs-links-list">
            <div class="obs-url-box">
              <div class="obs-url-meta">
                <strong>Layout Ngang (1920 × 1080)</strong>
                <span>Chuẩn màn hình PC / TV Game Show</span>
              </div>
              <div class="obs-url-copy">
                <input :value="obsLandscapeUrl" readonly class="input-control mono-input" />
                <button type="button" class="btn btn-secondary" @click="copyUrl(obsLandscapeUrl)">
                  <Copy :size="15" />
                  <span>Sao chép</span>
                </button>
              </div>
            </div>

            <div class="obs-url-box">
              <div class="obs-url-meta">
                <strong>Layout Dọc TikTok (1080 × 1920)</strong>
                <span>Tự động co giãn & căn khớp màn hình điện thoại</span>
              </div>
              <div class="obs-url-copy">
                <input :value="obsVerticalUrl" readonly class="input-control mono-input" />
                <button type="button" class="btn btn-secondary" @click="copyUrl(obsVerticalUrl)">
                  <Copy :size="15" />
                  <span>Sao chép</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Bộ Chọn Theme Phong Cách (Dễ thương, Hiện đại, Vũ trụ, Hoàng gia) -->
          <div class="calib-dashboard-box tabular-nums" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
            <!-- Bộ Điều Khiển Nhạc Nền Lofi Không Lời & Âm Lượng OBS -->
            <div style="margin-bottom: 1.15rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-subtle);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.65rem;">
                <strong style="color: #ff75a0; font-size: 0.92rem;">
                  🎵 Nhạc Nền Lofi Không Lời & Âm Lượng OBS
                </strong>
                <button
                  type="button"
                  class="btn"
                  :class="dashAudio.bgmEnabled && dashAudio.bgmVolume > 0 ? 'btn-cyan' : 'btn-secondary'"
                  style="padding: 0.25rem 0.7rem; font-size: 0.76rem;"
                  @click="toggleDashBgm"
                >
                  {{ dashAudio.bgmEnabled && dashAudio.bgmVolume > 0 ? '🟢 Nhạc Lofi: Đang Bật' : '⚪ Nhạc Lofi: Đang Tắt' }}
                </button>
              </div>

              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-bottom: 0.8rem;">
                <button
                  type="button"
                  class="btn"
                  :class="dashAudio.lofiStyle === 'chill-cafe' ? 'btn-cyan' : 'btn-secondary'"
                  style="padding: 0.45rem 0.4rem; font-size: 0.76rem; justify-content: center;"
                  @click="setDashLofiStyle('chill-cafe')"
                >
                  ☕ Lofi Chill Cafe
                </button>
                <button
                  type="button"
                  class="btn"
                  :class="dashAudio.lofiStyle === 'dreamy-night' ? 'btn-cyan' : 'btn-secondary'"
                  style="padding: 0.45rem 0.4rem; font-size: 0.76rem; justify-content: center;"
                  @click="setDashLofiStyle('dreamy-night')"
                >
                  🌙 Đêm Thư Giãn
                </button>
                <button
                  type="button"
                  class="btn"
                  :class="dashAudio.lofiStyle === 'pastel-cute' ? 'btn-cyan' : 'btn-secondary'"
                  style="padding: 0.45rem 0.4rem; font-size: 0.76rem; justify-content: center;"
                  @click="setDashLofiStyle('pastel-cute')"
                >
                  🌸 Lofi Kẹo Ngọt
                </button>
              </div>

              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem;">
                <div class="form-field">
                  <label style="display: flex; justify-content: space-between;">
                    <span>🎧 Âm lượng Nhạc nền Lofi</span>
                    <strong style="color: var(--accent-gold);">{{ dashAudio.bgmEnabled ? dashAudio.bgmVolume : 0 }}%</strong>
                  </label>
                  <div style="display: flex; align-items: center; gap: 0.4rem;">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      style="padding: 0.2rem 0.55rem; font-weight: 900;"
                      @click="stepDashBgmVolume(-10)"
                    >
                      −
                    </button>
                    <input
                      v-model.number="dashAudio.bgmVolume"
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      style="flex: 1; accent-color: #ff75a0; cursor: pointer;"
                      @input="emitDashAudioChange"
                    />
                    <button
                      type="button"
                      class="btn btn-secondary"
                      style="padding: 0.2rem 0.55rem; font-weight: 900;"
                      @click="stepDashBgmVolume(10)"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div class="form-field">
                  <label style="display: flex; justify-content: space-between;">
                    <span>🔔 Âm lượng Hiệu ứng (SFX)</span>
                    <strong style="color: var(--accent-cyan);">{{ dashAudio.sfxVolume }}%</strong>
                  </label>
                  <div style="display: flex; align-items: center; gap: 0.4rem;">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      style="padding: 0.2rem 0.55rem; font-weight: 900;"
                      @click="stepDashSfxVolume(-10)"
                    >
                      −
                    </button>
                    <input
                      v-model.number="dashAudio.sfxVolume"
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      style="flex: 1; accent-color: var(--accent-cyan); cursor: pointer;"
                      @input="emitDashAudioChange"
                    />
                    <button
                      type="button"
                      class="btn btn-secondary"
                      style="padding: 0.2rem 0.55rem; font-weight: 900;"
                      @click="stepDashSfxVolume(10)"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.65rem;">
              <strong style="color: var(--accent-cyan); font-size: 0.92rem;">
                🎨 Phong Cách Giao Diện OBS Live (Theme)
              </strong>
              <span class="badge badge-purple" style="font-size: 0.76rem; text-transform: uppercase;">
                {{ dashTheme === 'cute' ? '🌸 Dễ Thương' : dashTheme === 'modern' ? '⚡ Hiện Đại' : dashTheme === 'luxury' ? '👑 Hoàng Gia' : '🌌 Vũ Trụ' }}
              </span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; margin-bottom: 1.25rem;">
              <button
                type="button"
                class="btn"
                :class="dashTheme === 'cute' ? 'btn-cyan' : 'btn-secondary'"
                style="padding: 0.5rem 0.4rem; font-size: 0.78rem; justify-content: center; flex-direction: column; gap: 0.15rem;"
                @click="setDashTheme('cute')"
              >
                <span style="font-size: 1.15rem;">🌸</span>
                <strong>Dễ Thương</strong>
                <small style="font-size: 0.64rem; opacity: 0.75;">Pastel Kẹo Ngọt</small>
              </button>

              <button
                type="button"
                class="btn"
                :class="dashTheme === 'modern' ? 'btn-cyan' : 'btn-secondary'"
                style="padding: 0.5rem 0.4rem; font-size: 0.78rem; justify-content: center; flex-direction: column; gap: 0.15rem;"
                @click="setDashTheme('modern')"
              >
                <span style="font-size: 1.15rem;">⚡</span>
                <strong>Hiện Đại</strong>
                <small style="font-size: 0.64rem; opacity: 0.75;">Cyber Neon</small>
              </button>

              <button
                type="button"
                class="btn"
                :class="dashTheme === 'galaxy' ? 'btn-cyan' : 'btn-secondary'"
                style="padding: 0.5rem 0.4rem; font-size: 0.78rem; justify-content: center; flex-direction: column; gap: 0.15rem;"
                @click="setDashTheme('galaxy')"
              >
                <span style="font-size: 1.15rem;">🌌</span>
                <strong>Vũ Trụ</strong>
                <small style="font-size: 0.64rem; opacity: 0.75;">Deep Stars</small>
              </button>

              <button
                type="button"
                class="btn"
                :class="dashTheme === 'luxury' ? 'btn-cyan' : 'btn-secondary'"
                style="padding: 0.5rem 0.4rem; font-size: 0.78rem; justify-content: center; flex-direction: column; gap: 0.15rem;"
                @click="setDashTheme('luxury')"
              >
                <span style="font-size: 1.15rem;">👑</span>
                <strong>Hoàng Gia</strong>
                <small style="font-size: 0.64rem; opacity: 0.75;">Royal Gold</small>
              </button>
            </div>

            <!-- Bộ chỉnh khớp khung hình TikTok Điện thoại Real-time -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.65rem;">
              <strong style="color: var(--accent-gold); font-size: 0.92rem;">
                📱 Khung Hình TikTok Điện Thoại
              </strong>
              <span class="badge badge-cyan" style="font-size: 0.76rem;">
                {{ dashLayoutCalib.preset === 'fullscreen' ? 'Full Màn Hình' : dashLayoutCalib.preset === 'tiktok-safe-zone' ? 'Vùng An Toàn (160/262)' : `${dashLayoutCalib.frameWidth}×${dashLayoutCalib.frameHeight}` }}
              </span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-bottom: 0.85rem;">
              <button
                type="button"
                class="btn"
                :class="dashLayoutCalib.preset === 'fullscreen' ? 'btn-cyan' : 'btn-secondary'"
                style="padding: 0.45rem 0.5rem; font-size: 0.78rem; justify-content: center;"
                @click="applyDashLayoutPreset('fullscreen')"
              >
                📱 Full Màn Hình (100%)
              </button>
              <button
                type="button"
                class="btn"
                :class="dashLayoutCalib.preset === 'tiktok-safe-zone' ? 'btn-cyan' : 'btn-secondary'"
                style="padding: 0.45rem 0.5rem; font-size: 0.78rem; justify-content: center;"
                @click="applyDashLayoutPreset('tiktok-safe-zone')"
              >
                🎯 Vùng An Toàn (160/262)
              </button>
              <button
                type="button"
                class="btn"
                :class="dashLayoutCalib.preset === '362x444' ? 'btn-cyan' : 'btn-secondary'"
                style="padding: 0.45rem 0.5rem; font-size: 0.78rem; justify-content: center;"
                @click="applyDashLayoutPreset('362x444')"
              >
                📦 Khung 362 × 444
              </button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem;">
              <div class="form-field">
                <label style="display: flex; justify-content: space-between;">
                  <span>Chiều rộng khung (px)</span>
                  <strong style="color: var(--accent-gold);">{{ dashLayoutCalib.frameWidth }}px</strong>
                </label>
                <input
                  v-model.number="dashLayoutCalib.frameWidth"
                  type="range"
                  min="260"
                  max="640"
                  step="2"
                  style="width: 100%; accent-color: var(--accent-cyan); cursor: pointer;"
                  @input="emitDashLayoutChange"
                />
              </div>

              <div class="form-field">
                <label style="display: flex; justify-content: space-between;">
                  <span>Chiều cao khung (px)</span>
                  <strong style="color: var(--accent-gold);">{{ dashLayoutCalib.frameHeight }}px</strong>
                </label>
                <input
                  v-model.number="dashLayoutCalib.frameHeight"
                  type="range"
                  min="320"
                  max="840"
                  step="2"
                  style="width: 100%; accent-color: var(--accent-cyan); cursor: pointer;"
                  @input="emitDashLayoutChange"
                />
              </div>

              <div class="form-field">
                <label style="display: flex; justify-content: space-between;">
                  <span>Thu phóng kích thước (Zoom)</span>
                  <strong style="color: var(--accent-gold);">{{ dashLayoutCalib.scale }}%</strong>
                </label>
                <input
                  v-model.number="dashLayoutCalib.scale"
                  type="range"
                  min="50"
                  max="130"
                  step="1"
                  style="width: 100%; accent-color: var(--accent-cyan); cursor: pointer;"
                  @input="emitDashLayoutChange"
                />
              </div>

              <div class="form-field">
                <label style="display: flex; justify-content: space-between;">
                  <span>Đẩy Lên / Xuống (Tránh chat/avatar)</span>
                  <strong style="color: var(--accent-gold);">{{ dashLayoutCalib.offsetY > 0 ? `+${dashLayoutCalib.offsetY}` : dashLayoutCalib.offsetY }}%</strong>
                </label>
                <input
                  v-model.number="dashLayoutCalib.offsetY"
                  type="range"
                  min="-35"
                  max="35"
                  step="1"
                  style="width: 100%; accent-color: var(--accent-cyan); cursor: pointer;"
                  @input="emitDashLayoutChange"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column: Match Director, Live Preview & Simulator -->
      <div class="dash-col">
        <!-- 4. Điều khiển trận đấu (Match Director Console) -->
        <section class="panel-card director-card">
          <div class="panel-header">
            <div class="panel-title-group">
              <Play :size="20" class="icon-cyan" />
              <h2>4. Điều Khiển Trận Đấu Trực Tiếp</h2>
            </div>
            <div class="status-pills tabular-nums">
              <span class="badge badge-purple">Trạng thái: {{ roomState?.status || 'WAITING' }}</span>
              <span class="badge badge-cyan">Màn hình: {{ roomState?.phase || 'WAITING_ROOM' }}</span>
            </div>
          </div>

          <!-- Banner Đáp Án Đúng Dành Riêng Cho MC / Streamer Khi Đang Live -->
          <div
            v-if="streamerActiveQuestion && roomState?.isQuestionOpen"
            class="streamer-answer-cheat-sheet"
          >
            <div class="cheat-header">
              <span class="cheat-badge">👀 ĐÁP ÁN DÀNH CHO MC (LIVE)</span>
              <span class="cheat-question-tag">Câu {{ streamerActiveQuestion.questionIndex }}/{{ streamerActiveQuestion.totalQuestions }}</span>
            </div>
            <div class="cheat-body">
              <div class="cheat-correct-pill">
                <strong>ĐÁP ÁN ĐÚNG:</strong>
                <span class="correct-letter">{{ streamerActiveQuestion.correctOption }}</span>
                <span class="correct-text">{{ streamerActiveQuestion.options?.[streamerActiveQuestion.correctOption] }}</span>
              </div>
              <p v-if="streamerActiveQuestion.explanation" class="cheat-explanation">
                💡 <em>{{ streamerActiveQuestion.explanation }}</em>
              </p>
            </div>
          </div>

          <div class="director-controls-grid">
            <button
              type="button"
              class="btn btn-cyan"
              :disabled="roomState?.status === 'PLAYING'"
              @click="handleStartMatch"
            >
              <Play :size="17" />
              <span>Bắt đầu trận đấu mới</span>
            </button>

            <button
              type="button"
              class="btn btn-gold"
              :disabled="!roomState?.isQuestionOpen"
              @click="handleRevealNow"
            >
              <CheckCircle2 :size="17" />
              <span>Khóa câu & Chấm điểm ngay</span>
            </button>

            <button
              type="button"
              class="btn btn-purple"
              :disabled="roomState?.status !== 'PLAYING'"
              @click="handleNextStep"
            >
              <SkipForward :size="17" />
              <span>Sang câu tiếp theo</span>
            </button>

            <button
              type="button"
              class="btn btn-secondary"
              :disabled="roomState?.status !== 'PLAYING'"
              @click="handleShowLeaderboard"
            >
              <Trophy :size="17" />
              <span>Hiện Bảng xếp hạng</span>
            </button>

            <button
              v-if="roomState?.status !== 'PAUSED'"
              type="button"
              class="btn btn-secondary"
              :disabled="roomState?.status !== 'PLAYING'"
              @click="handlePauseMatch"
            >
              <Pause :size="17" />
              <span>Tạm dừng</span>
            </button>
            <button
              v-else
              type="button"
              class="btn btn-cyan"
              @click="handleResumeMatch"
            >
              <Play :size="17" />
              <span>Tiếp tục trận đấu</span>
            </button>

            <button
              type="button"
              class="btn btn-danger"
              @click="handleResetRoom"
            >
              <RotateCcw :size="17" />
              <span>Về Phòng chờ (Reset)</span>
            </button>
          </div>
        </section>

        <!-- 5. Bộ Giả Lập Sự Kiện TikTok LIVE (Mục 1.1, 10.1, 14) -->
        <section class="panel-card simulator-card">
          <div class="panel-header">
            <div class="panel-title-group">
              <Sparkles :size="20" class="icon-gold" />
              <h2>5. Bộ Giả Lập Sự Kiện TikTok LIVE (Kiểm thử MVP)</h2>
            </div>
            <span class="badge badge-gold">Test độc lập không cần mở LIVE</span>
          </div>

          <div class="sim-row">
            <div class="sim-user-inputs">
              <input
                v-model="simUser.nickname"
                type="text"
                class="input-control"
                placeholder="Tên hiển thị (VD: Minh Anh)"
              />
              <input
                v-model="simUser.username"
                type="text"
                class="input-control"
                placeholder="Username (VD: minhanh_99)"
              />
            </div>

            <div class="sim-quick-answers">
              <span>Gửi bình luận thử nghiệm:</span>
              <div class="sim-answer-btns">
                <button
                  type="button"
                  class="btn btn-gold sim-opt-btn"
                  title="Giả lập người chơi gõ SS để bắt đầu trận đấu"
                  @click="sendSimulatedComment('SS')"
                >
                  ⚡ Gõ "SS" (Bắt đầu)
                </button>
                <button
                  v-for="opt in (['A', 'B', 'C', 'D'] as const)"
                  :key="opt"
                  type="button"
                  class="btn btn-secondary sim-opt-btn"
                  @click="sendSimulatedComment(opt)"
                >
                  Bình luận {{ opt }}
                </button>
              </div>
            </div>

            <div class="sim-crowd-actions" style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <button
                type="button"
                class="btn"
                :class="roomState?.autoCrowd?.enabled ? 'btn-danger' : 'btn-emerald'"
                style="width: 100%; justify-content: center; font-weight: 800;"
                @click="handleToggleAutoCrowd"
              >
                <Users :size="17" />
                <span>
                  {{
                    roomState?.autoCrowd?.enabled
                      ? `🟢 ĐANG BẬT: Tự động User Ra/Vào & Tự Chơi (50–100 người, hiện có ${roomState?.playerCount || 0} người) — Bấm để Tắt`
                      : '🤖 BẬT Tự Động Giả Lập User Ra/Vào & Tự Chơi (50 – 100 người)'
                  }}
                </span>
              </button>

              <button type="button" class="btn btn-cyan" @click="triggerCrowd(10)">
                <Users :size="16" />
                <span>+10 người trả lời</span>
              </button>
              <button type="button" class="btn btn-cyan" @click="triggerCrowd(30)">
                <Users :size="16" />
                <span>+30 người trả lời</span>
              </button>
              <button type="button" class="btn btn-gold" @click="triggerCrowd(50)">
                <Users :size="16" />
                <span>+50 người trả lời</span>
              </button>
              <button type="button" class="btn btn-purple" @click="triggerCrowd(100)">
                <Users :size="16" />
                <span>+100 người trả lời</span>
              </button>
              <button type="button" class="btn btn-secondary" @click="testDoubleAnswerCheat">
                <ShieldAlert :size="16" />
                <span>Test chống gian lận: Gửi A rồi đổi sang B</span>
              </button>
            </div>

            <div class="sim-gifts-strip">
              <span>Giả lập tặng quà TikTok (Mục 3.4):</span>
              <div class="sim-gift-btns">
                <button
                  v-for="g in gifts"
                  :key="g.giftId"
                  type="button"
                  class="btn btn-secondary gift-sim-btn"
                  @click="sendSimulatedGift(g)"
                >
                  <Sparkles :size="14" class="icon-gold" />
                  <span>{{ g.giftName }}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- 6. Màn hình Preview OBS trực tiếp ngay trên Dashboard -->
        <section class="panel-card preview-card">
          <div class="panel-header">
            <div class="panel-title-group">
              <Eye :size="20" class="icon-cyan" />
              <h2>6. Xem Trước Màn Hình Game Show (Realtime Preview)</h2>
            </div>
            <span class="badge badge-emerald">Đồng bộ Socket.IO</span>
          </div>

          <div class="embedded-preview-wrapper">
            <GameShowView :roomCodeProp="roomCode" :embedded="true" :showAdminAnswers="true" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';
import {
  Radio,
  Plug,
  Power,
  Settings,
  Save,
  Monitor,
  Copy,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Trophy,
  CheckCircle2,
  Sparkles,
  Users,
  ShieldAlert,
  AlertTriangle,
  Database,
  ExternalLink,
  Eye,
} from 'lucide-vue-next';
import { api } from '../services/api';
import { createRoomSocket } from '../services/socket';
import GameShowView from './GameShowView.vue';
import type { Socket } from 'socket.io-client';

const roomCode = ref('KB2026');
const stats = ref<any>({});
const categories = ref<any[]>([]);
const gifts = ref<any[]>([]);
const roomState = ref<any>(null);
const streamerActiveQuestion = ref<any>(null);
const tiktokStatus = ref<any>({
  state: 'DISCONNECTED',
  tiktokRoomId: null,
  eventsReceived: 0,
  lastError: null,
});

const tiktokUsernameInput = ref('vinhnq_live');
const isConnectingTikTok = ref(false);
const toastMessage = ref('');
const toastType = ref<'info' | 'success' | 'error'>('info');

const configForm = reactive({
  title: 'Knowledge Battle — Đấu Trường Tri Thức',
  categoryId: 'ALL',
  difficulty: 'ALL',
  questionCount: 10,
  timePerQuestion: 25,
  autoAdvance: true,
});

const simUser = reactive({
  nickname: 'Minh Anh 🌸',
  username: 'minhanh_99',
});

const dashTheme = ref<'cute' | 'modern' | 'galaxy' | 'luxury'>('cute');

function setDashTheme(th: 'cute' | 'modern' | 'galaxy' | 'luxury') {
  dashTheme.value = th;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem('kb_selected_theme_v2', th);
    } catch {}
  }
  socket?.emit('layout.update', {
    roomCode: roomCode.value,
    ...dashLayoutCalib,
    theme: th,
  });
  const names = {
    cute: '🌸 DỄ THƯƠNG',
    modern: '⚡ HIỆN ĐẠI',
    galaxy: '🌌 VŨ TRỤ',
    luxury: '👑 HOÀNG GIA',
  };
  showToast(`Đã chuyển phong cách giao diện OBS sang: ${names[th]}!`, 'success');
}

const STORAGE_CALIB_KEY = 'kb_vertical_layout_v5';
const STORAGE_AUDIO_KEY = 'kb_lofi_audio_settings_v1';
const dashLayoutCalib = reactive({
  frameWidth: 1080,
  frameHeight: 1920,
  scale: 100,
  widthPercent: 100,
  offsetX: 0,
  offsetY: 0,
  paddingTop: 160,
  paddingBottom: 262,
  preset: 'fullscreen',
});

const dashAudio = reactive({
  bgmEnabled: true,
  bgmVolume: 40,
  sfxVolume: 80,
  lofiStyle: 'chill-cafe' as 'chill-cafe' | 'dreamy-night' | 'pastel-cute',
});

function loadDashSavedCalib() {
  if (typeof window === 'undefined') return;
  try {
    const savedTheme = window.localStorage.getItem('kb_selected_theme_v2');
    if (savedTheme && ['cute', 'modern', 'galaxy', 'luxury'].includes(savedTheme)) {
      dashTheme.value = savedTheme as any;
    }
    const rawAudio = window.localStorage.getItem(STORAGE_AUDIO_KEY);
    if (rawAudio) {
      const parsedAudio = JSON.parse(rawAudio);
      if (typeof parsedAudio.bgmEnabled === 'boolean') dashAudio.bgmEnabled = parsedAudio.bgmEnabled;
      if (typeof parsedAudio.bgmVolume === 'number') dashAudio.bgmVolume = parsedAudio.bgmVolume;
      if (typeof parsedAudio.sfxVolume === 'number') dashAudio.sfxVolume = parsedAudio.sfxVolume;
      if (parsedAudio.lofiStyle) dashAudio.lofiStyle = parsedAudio.lofiStyle;
    }
    const raw = window.localStorage.getItem(STORAGE_CALIB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      dashLayoutCalib.frameWidth = Number(parsed.frameWidth ?? 1080);
      dashLayoutCalib.frameHeight = Number(parsed.frameHeight ?? 1920);
      dashLayoutCalib.scale = Number(parsed.scale ?? 100);
      dashLayoutCalib.widthPercent = Number(parsed.widthPercent ?? 100);
      dashLayoutCalib.offsetX = Number(parsed.offsetX ?? 0);
      dashLayoutCalib.offsetY = Number(parsed.offsetY ?? 0);
      dashLayoutCalib.paddingTop = Number(parsed.paddingTop ?? 160);
      dashLayoutCalib.paddingBottom = Number(parsed.paddingBottom ?? 262);
      dashLayoutCalib.preset = String(parsed.preset || 'fullscreen');
    }
  } catch {
    // ignore
  }
}

function broadcastDashCalib() {
  const payload = {
    frameWidth: dashLayoutCalib.frameWidth,
    frameHeight: dashLayoutCalib.frameHeight,
    scale: dashLayoutCalib.scale,
    widthPercent: dashLayoutCalib.widthPercent,
    offsetX: dashLayoutCalib.offsetX,
    offsetY: dashLayoutCalib.offsetY,
    paddingTop: dashLayoutCalib.paddingTop,
    paddingBottom: dashLayoutCalib.paddingBottom,
    preset: dashLayoutCalib.preset,
    theme: dashTheme.value,
    bgmEnabled: dashAudio.bgmEnabled,
    bgmVolume: dashAudio.bgmVolume,
    sfxVolume: dashAudio.sfxVolume,
    lofiStyle: dashAudio.lofiStyle,
  };
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_CALIB_KEY, JSON.stringify(payload));
      window.localStorage.setItem(
        STORAGE_AUDIO_KEY,
        JSON.stringify({
          bgmEnabled: dashAudio.bgmEnabled,
          bgmVolume: dashAudio.bgmVolume,
          sfxVolume: dashAudio.sfxVolume,
          lofiStyle: dashAudio.lofiStyle,
        })
      );
    } catch {
      // ignore
    }
  }
  socket?.emit('layout.update', {
    roomCode: roomCode.value,
    ...payload,
  });
}

function toggleDashBgm() {
  dashAudio.bgmEnabled = !dashAudio.bgmEnabled;
  if (dashAudio.bgmEnabled && dashAudio.bgmVolume === 0) {
    dashAudio.bgmVolume = 40;
  }
  broadcastDashCalib();
}

function setDashLofiStyle(style: 'chill-cafe' | 'dreamy-night' | 'pastel-cute') {
  dashAudio.lofiStyle = style;
  dashAudio.bgmEnabled = true;
  if (dashAudio.bgmVolume === 0) dashAudio.bgmVolume = 40;
  broadcastDashCalib();
}

function stepDashBgmVolume(delta: number) {
  dashAudio.bgmVolume = Math.max(0, Math.min(100, dashAudio.bgmVolume + delta));
  if (dashAudio.bgmVolume > 0) dashAudio.bgmEnabled = true;
  broadcastDashCalib();
}

function stepDashSfxVolume(delta: number) {
  dashAudio.sfxVolume = Math.max(0, Math.min(100, dashAudio.sfxVolume + delta));
  broadcastDashCalib();
}

function emitDashAudioChange() {
  if (dashAudio.bgmVolume > 0) dashAudio.bgmEnabled = true;
  broadcastDashCalib();
}

function applyDashLayoutPreset(preset: 'fullscreen' | 'tiktok-safe-zone' | '362x444') {
  if (preset === 'fullscreen') {
    dashLayoutCalib.frameWidth = 1080;
    dashLayoutCalib.frameHeight = 1920;
    dashLayoutCalib.scale = 100;
    dashLayoutCalib.widthPercent = 100;
    dashLayoutCalib.offsetX = 0;
    dashLayoutCalib.offsetY = 0;
    dashLayoutCalib.paddingTop = 12;
    dashLayoutCalib.paddingBottom = 16;
    dashLayoutCalib.preset = 'fullscreen';
    showToast('Đã áp dụng Full Màn Hình TikTok (100% Tràn viền)!', 'success');
  } else if (preset === 'tiktok-safe-zone') {
    dashLayoutCalib.frameWidth = 1080;
    dashLayoutCalib.frameHeight = 1920;
    dashLayoutCalib.scale = 100;
    dashLayoutCalib.widthPercent = 100;
    dashLayoutCalib.offsetX = 0;
    dashLayoutCalib.offsetY = 0;
    dashLayoutCalib.paddingTop = 160;
    dashLayoutCalib.paddingBottom = 262;
    dashLayoutCalib.preset = 'tiktok-safe-zone';
    showToast('Đã áp dụng Vùng An Toàn TikTok (Né 160px trên / 262px dưới)!', 'success');
  } else if (preset === '362x444') {
    dashLayoutCalib.frameWidth = 362;
    dashLayoutCalib.frameHeight = 444;
    dashLayoutCalib.scale = 100;
    dashLayoutCalib.widthPercent = 96;
    dashLayoutCalib.offsetX = 0;
    dashLayoutCalib.offsetY = 0;
    dashLayoutCalib.paddingTop = 0;
    dashLayoutCalib.paddingBottom = 0;
    dashLayoutCalib.preset = '362x444';
    showToast('Đã áp dụng Khung Chuẩn 362×444 px!', 'success');
  }
  broadcastDashCalib();
}

function emitDashLayoutChange() {
  dashLayoutCalib.preset = 'custom';
  broadcastDashCalib();
}

let socket: Socket | null = null;

const obsLandscapeUrl = computed(
  () => `${window.location.origin}/game/${roomCode.value}`
);
const obsVerticalUrl = computed(
  () => `${window.location.origin}/game/${roomCode.value}?layout=vertical`
);

const connectionBadgeClass = computed(() => {
  const s = tiktokStatus.value?.state;
  if (s === 'CONNECTED') return 'badge-emerald';
  if (s === 'CONNECTING' || s === 'RECONNECTING') return 'badge-gold';
  if (s === 'ERROR') return 'badge-rose';
  return 'badge-purple';
});

function showToast(msg: string, type: 'info' | 'success' | 'error' = 'info') {
  toastMessage.value = msg;
  toastType.value = type;
  setTimeout(() => {
    if (toastMessage.value === msg) toastMessage.value = '';
  }, 4500);
}

function formatConnectionState(state: string) {
  const map: Record<string, string> = {
    DISCONNECTED: 'Chưa kết nối',
    CONNECTING: 'Đang thiết lập kết nối...',
    CONNECTED: 'Đang nhận sự kiện LIVE',
    RECONNECTING: 'Đang tự động kết nối lại...',
    ERROR: 'Chưa LIVE / Lỗi kết nối',
  };
  return map[state] || state;
}

async function loadDashboardData() {
  try {
    const [healthRes, roomRes, catRes, giftRes] = await Promise.all([
      api.getHealth(),
      api.getRoom(roomCode.value),
      api.getCategories(),
      api.getGifts(),
    ]);

    stats.value = healthRes.stats || {};
    categories.value = catRes || [];
    gifts.value = giftRes || [];

    if (roomRes.roomState) {
      roomState.value = roomRes.roomState;
      configForm.title = roomRes.roomState.title || configForm.title;
      if (roomRes.roomState.tiktokUsername) {
        tiktokUsernameInput.value = roomRes.roomState.tiktokUsername;
      }
      if (roomRes.roomState.config) {
        configForm.categoryId = roomRes.roomState.config.categoryId || 'ALL';
        configForm.difficulty = roomRes.roomState.config.difficulty || 'ALL';
        configForm.questionCount =
          roomRes.roomState.config.questionCount !== undefined &&
          roomRes.roomState.config.questionCount !== null
            ? Number(roomRes.roomState.config.questionCount)
            : 10;
        configForm.timePerQuestion = roomRes.roomState.config.timePerQuestion || 15;
        configForm.autoAdvance = Boolean(roomRes.roomState.config.autoAdvance);
      }
    }
    if (roomRes.streamerActiveQuestion) {
      streamerActiveQuestion.value = roomRes.streamerActiveQuestion;
    } else if (roomRes.activeQuestion) {
      streamerActiveQuestion.value = roomRes.activeQuestion;
    }
    if (roomRes.tiktokStatus) {
      tiktokStatus.value = roomRes.tiktokStatus;
    }
  } catch (err: any) {
    showToast(err.message || 'Không thể tải dữ liệu dashboard', 'error');
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
      showToast(`Đã kết nối thành công tới phiên LIVE của @${res.username}`, 'success');
    } else if (res.error) {
      showToast(res.error, 'error');
    }
  } catch (err: any) {
    showToast(err.message, 'error');
  } finally {
    isConnectingTikTok.value = false;
  }
}

async function handleDisconnectTikTok() {
  const res = await api.disconnectTikTok(roomCode.value);
  tiktokStatus.value = res;
  showToast('Đã ngắt kết nối TikTok LIVE', 'info');
}

async function saveConfig() {
  try {
    await api.updateRoomConfig(roomCode.value, {
      ...configForm,
      tiktokUsername: tiktokUsernameInput.value.trim().replace(/^@/, ''),
    });
    showToast('Đã lưu cấu hình phòng chơi thành công!', 'success');
  } catch (err: any) {
    showToast(err.message, 'error');
  }
}

async function handleQuickAddRandomQuestions() {
  try {
    const res = await api.generateRandomQuestions(10, 'PUBLISHED');
    await loadDashboardData();
    if (res.generatedCount > 0) {
      showToast(`Đã bổ sung thêm ${res.generatedCount} câu hỏi mới (đảm bảo không trùng lặp) vào Ngân hàng!`, 'success');
    } else {
      showToast('Bạn đã nạp toàn bộ câu hỏi trong kho mẫu có sẵn (chống trùng 100%). Để thêm câu hỏi mới, hãy vào "Ngân Hàng Câu Hỏi" -> chọn tab "Tạo / Nhập Câu Hỏi" để dán danh sách JSON!', 'info');
    }
  } catch (err: any) {
    showToast(err.message, 'error');
  }
}

async function handleStartMatch() {
  try {
    await saveConfig();
    await api.startGame(roomCode.value, false);
    showToast('Trận đấu đang bắt đầu!', 'success');
  } catch (err: any) {
    showToast(err.message, 'error');
  }
}

async function handleRevealNow() {
  await api.revealQuestion(roomCode.value);
}

async function handleNextStep() {
  await api.nextStep(roomCode.value);
}

async function handleShowLeaderboard() {
  await api.showLeaderboard(roomCode.value);
}

async function handlePauseMatch() {
  await api.pauseGame(roomCode.value);
  showToast('Đã tạm dừng trận đấu', 'info');
}

async function handleResumeMatch() {
  await api.resumeGame(roomCode.value);
  showToast('Đã tiếp tục trận đấu', 'success');
}

async function handleResetRoom() {
  await api.resetGame(roomCode.value);
  showToast('Đã đưa phòng về trạng thái Phòng chờ (WAITING)', 'info');
}

async function sendSimulatedComment(content: string) {
  const res = await api.simulateEvent(roomCode.value, {
    type: 'COMMENT',
    userId: `sim-${simUser.username}`,
    username: simUser.username,
    nickname: simUser.nickname,
    content,
  });
  if (res.reason === 'ALREADY_ANSWERED') {
    showToast(
      `Chống gian lận: ${simUser.nickname} đã trả lời câu này rồi, chỉ tính đáp án đầu tiên!`,
      'error'
    );
  } else if (res.reason === 'QUESTION_CLOSED') {
    showToast(
      `Đã ghi nhận ${simUser.nickname} tham gia / bình luận ngoài giờ mở câu hỏi.`,
      'info'
    );
  } else {
    showToast(`${simUser.nickname} vừa gửi đáp án "${content}"`, 'success');
  }
}

async function triggerCrowd(count: number) {
  await api.simulateCrowd(roomCode.value, count);
  showToast(`Đang giả lập ${count} người xem bình luận đáp án A/B/C/D đồng thời!`, 'success');
}

async function handleToggleAutoCrowd() {
  const nextEnabled = !roomState.value?.autoCrowd?.enabled;
  const res = await api.toggleAutoCrowd(roomCode.value, nextEnabled, 50, 100);
  if (res.enabled) {
    showToast(
      `Đã BẬT chế độ Tự động 50–100 User tự ra/vào phòng và tự động trả lời mọi câu hỏi!`,
      'success'
    );
  } else {
    showToast('Đã TẮT chế độ Tự động giả lập 50–100 User.', 'info');
  }
}

async function testDoubleAnswerCheat() {
  await api.simulateEvent(roomCode.value, {
    type: 'COMMENT',
    userId: `sim-${simUser.username}`,
    username: simUser.username,
    nickname: simUser.nickname,
    content: 'A',
  });
  const second = await api.simulateEvent(roomCode.value, {
    type: 'COMMENT',
    userId: `sim-${simUser.username}`,
    username: simUser.username,
    nickname: simUser.nickname,
    content: 'B',
  });
  if (!second.acceptedAnswer) {
    showToast(
      'Kiểm thử thành công: Hệ thống chỉ nhận đáp án A đầu tiên và từ chối đáp án B kế tiếp!',
      'success'
    );
  }
}

async function sendSimulatedGift(gift: any) {
  await api.simulateEvent(roomCode.value, {
    type: 'GIFT',
    userId: `sim-${simUser.username}`,
    username: simUser.username,
    nickname: simUser.nickname,
    giftId: gift.giftId,
    giftName: gift.giftName,
  });
  showToast(`Đã kích hoạt hiệu ứng quà tặng: ${gift.giftName}`, 'success');
}

async function copyUrl(url: string) {
  try {
    await navigator.clipboard.writeText(url);
    showToast('Đã sao chép URL vào bộ nhớ tạm — dán vào OBS Browser Source!', 'success');
  } catch {
    showToast('Không thể tự động sao chép, vui lòng bôi đen và copy.', 'info');
  }
}

onMounted(async () => {
  loadDashSavedCalib();
  await loadDashboardData();
  socket = createRoomSocket(roomCode.value);

  socket.on('room.state', (payload) => {
    roomState.value = payload;
    if (payload?.status === 'WAITING' || payload?.status === 'FINISHED') {
      streamerActiveQuestion.value = null;
    }
  });

  socket.on('question.started', (payload) => {
    if (!streamerActiveQuestion.value || streamerActiveQuestion.value.questionId !== payload.questionId) {
      streamerActiveQuestion.value = payload;
    }
  });

  socket.on('streamer.question.started', (payload) => {
    streamerActiveQuestion.value = payload;
  });

  socket.on('question.result', () => {
    // Khi câu hỏi đã công bố kết quả thì giữ nguyên hoặc đợi câu mới
  });

  socket.on('game.finished', () => {
    streamerActiveQuestion.value = null;
  });

  socket.on('tiktok.status', (status) => {
    tiktokStatus.value = status;
  });

  socket.on('layout.config', (cfg) => {
    if (!cfg) return;
    if (cfg.theme && ['cute', 'modern', 'galaxy', 'luxury'].includes(cfg.theme)) {
      dashTheme.value = cfg.theme as any;
    }
    dashLayoutCalib.frameWidth = Number(cfg.frameWidth ?? dashLayoutCalib.frameWidth ?? 1080);
    dashLayoutCalib.frameHeight = Number(cfg.frameHeight ?? dashLayoutCalib.frameHeight ?? 1920);
    dashLayoutCalib.scale = Number(cfg.scale ?? dashLayoutCalib.scale);
    dashLayoutCalib.widthPercent = Number(cfg.widthPercent ?? dashLayoutCalib.widthPercent);
    dashLayoutCalib.offsetX = Number(cfg.offsetX ?? dashLayoutCalib.offsetX);
    dashLayoutCalib.offsetY = Number(cfg.offsetY ?? dashLayoutCalib.offsetY);
    dashLayoutCalib.paddingTop = Number(cfg.paddingTop ?? dashLayoutCalib.paddingTop ?? 160);
    dashLayoutCalib.paddingBottom = Number(cfg.paddingBottom ?? dashLayoutCalib.paddingBottom ?? 262);
    dashLayoutCalib.preset = String(cfg.preset || dashLayoutCalib.preset);
  });
});

onBeforeUnmount(() => {
  socket?.disconnect();
});
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  padding: 1.5rem 2rem 3rem;
  max-width: 1640px;
  margin: 0 auto;
}

.dash-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--border-subtle);
  margin-bottom: 1.5rem;
}

.topbar-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-badge {
  width: 48px;
  height: 48px;
  border-radius: 0.875rem;
  background: var(--accent-cyan);
  color: #050814;
  font-weight: 900;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.topbar-brand h1 {
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.topbar-brand p {
  font-size: 0.88rem;
  color: var(--text-secondary);
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toast-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  border-radius: 0.75rem;
  margin-bottom: 1.25rem;
  font-weight: 600;
  font-size: 0.92rem;
  background: rgba(0, 240, 255, 0.14);
  border: 1px solid rgba(0, 240, 255, 0.4);
}

.toast-success {
  background: rgba(16, 185, 129, 0.18);
  border-color: rgba(16, 185, 129, 0.45);
  color: #6ee7b7;
}

.toast-error {
  background: rgba(244, 63, 94, 0.18);
  border-color: rgba(244, 63, 94, 0.45);
  color: #fda4af;
}

.dash-main-grid {
  display: grid;
  grid-template-columns: 540px 1fr;
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 1200px) {
  .dash-main-grid {
    grid-template-columns: 1fr;
  }
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
  padding: 1.35rem 1.5rem;
  box-shadow: var(--shadow-card);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.panel-title-group {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.panel-title-group h2 {
  font-size: 1.05rem;
  font-weight: 800;
}

.panel-desc {
  font-size: 0.88rem;
  color: var(--text-secondary);
  margin-bottom: 0.85rem;
}

.connect-form {
  display: flex;
  gap: 0.65rem;
  margin-bottom: 1rem;
}

.tiktok-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.65rem;
}

.tt-metric {
  padding: 0.65rem 0.8rem;
  border-radius: 0.65rem;
  background: rgba(8, 12, 28, 0.7);
  border: 1px solid var(--border-subtle);
}

.tt-metric span {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.tt-metric strong {
  font-size: 0.88rem;
  color: var(--text-primary);
}

.connection-alert {
  margin-top: 0.85rem;
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  padding: 0.75rem 0.9rem;
  border-radius: 0.65rem;
  background: rgba(244, 63, 94, 0.14);
  border: 1px solid rgba(244, 63, 94, 0.35);
  color: #fda4af;
  font-size: 0.84rem;
}

.config-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.9rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-field.full-span {
  grid-column: 1 / -1;
}

.form-field label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  cursor: pointer;
}

.panel-footer {
  margin-top: 1.1rem;
  display: flex;
  justify-content: flex-end;
}

.obs-links-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.obs-url-box {
  padding: 0.85rem;
  border-radius: 0.75rem;
  background: rgba(8, 12, 28, 0.68);
  border: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.obs-url-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
}

.obs-url-meta span {
  color: var(--text-muted);
}

.obs-url-copy {
  display: flex;
  gap: 0.5rem;
}

.mono-input {
  font-family: var(--font-mono);
  font-size: 0.82rem;
}

.status-pills {
  display: flex;
  gap: 0.5rem;
}

/* Banner Đáp Án Cheat Sheet Cho Streamer / MC */
.streamer-answer-cheat-sheet {
  margin-bottom: 0.95rem;
  padding: 0.85rem 1.1rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.12) 100%);
  border: 1.5px solid rgba(16, 185, 129, 0.55);
  box-shadow: 0 4px 18px rgba(16, 185, 129, 0.15);
}

.cheat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.cheat-badge {
  font-size: 0.76rem;
  font-weight: 800;
  color: #10b981;
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.cheat-question-tag {
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.cheat-body {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.cheat-correct-pill {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.cheat-correct-pill strong {
  font-size: 0.85rem;
  color: #e2e8f0;
}

.correct-letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 0.45rem;
  background: #10b981;
  color: #041f12;
  font-weight: 900;
  font-size: 1.1rem;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.5);
}

.correct-text {
  font-size: 0.98rem;
  font-weight: 800;
  color: #6ee7b7;
}

.cheat-explanation {
  font-size: 0.82rem;
  color: #cbd5e1;
  line-height: 1.35;
  margin: 0;
  padding-top: 0.25rem;
  border-top: 1px dashed rgba(16, 185, 129, 0.25);
}

.director-controls-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

/* Simulator */
.sim-row {
  display: flex;
  flex-direction: column;
  gap: 0.95rem;
}

.sim-user-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
}

.sim-quick-answers,
.sim-gifts-strip {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  font-size: 0.84rem;
  color: var(--text-secondary);
}

.sim-answer-btns,
.sim-gift-btns,
.sim-crowd-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.sim-opt-btn {
  flex: 1;
  min-width: 110px;
}

.embedded-preview-wrapper {
  border-radius: 0.875rem;
  overflow: hidden;
  border: 1px solid rgba(0, 240, 255, 0.3);
  max-height: 640px;
  overflow-y: auto;
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

@media (max-width: 768px) {
  .dashboard-page {
    padding: 1rem 0.85rem 2.5rem;
  }

  .dash-topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .topbar-actions {
    width: 100%;
    flex-direction: column;
  }

  .topbar-actions .btn {
    width: 100%;
  }

  .panel-card {
    padding: 1.05rem;
  }

  .panel-header {
    flex-wrap: wrap;
  }

  .connect-form,
  .obs-url-copy {
    flex-direction: column;
  }

  .tiktok-metrics,
  .config-form-grid,
  .director-controls-grid,
  .sim-user-inputs {
    grid-template-columns: 1fr;
  }

  .director-controls-grid .btn {
    min-height: 46px;
  }
}
</style>

