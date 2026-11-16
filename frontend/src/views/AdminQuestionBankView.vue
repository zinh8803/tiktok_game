<template>
  <div class="admin-page">
    <!-- Top Header -->
    <header class="admin-topbar">
      <div class="topbar-left">
        <router-link to="/dashboard" class="btn btn-secondary">
          <ArrowLeft :size="17" />
          <span>Quay lại Streamer Dashboard</span>
        </router-link>
        <div>
          <h1>Quản Trị Ngân Hàng Câu Hỏi & Cấu Hình Hệ Thống</h1>
          <p>Chuẩn hóa dữ liệu, kiểm duyệt biên tập (Mục 4) và ánh xạ quà tặng TikTok (Mục 3.4)</p>
        </div>
      </div>

      <div class="topbar-tabs">
        <button
          type="button"
          class="btn btn-gold"
          :disabled="isGeneratingRandom"
          @click="handleGenerateRandom(10, 'PUBLISHED')"
        >
          <Sparkles :size="16" />
          <span>{{ isGeneratingRandom ? 'Đang tạo...' : '+10 Câu Hỏi Random Ngay' }}</span>
        </button>
        <button
          type="button"
          class="btn"
          :class="activeTab === 'questions' ? 'btn-cyan' : 'btn-secondary'"
          @click="activeTab = 'questions'"
        >
          <BookOpen :size="16" />
          <span>Ngân Hàng Câu Hỏi ({{ questions.length }})</span>
        </button>
        <button
          type="button"
          class="btn"
          :class="activeTab === 'create' ? 'btn-cyan' : 'btn-secondary'"
          @click="openCreateQuestion"
        >
          <PlusCircle :size="16" />
          <span>Tạo / Nhập Câu Hỏi</span>
        </button>
        <button
          type="button"
          class="btn"
          :class="activeTab === 'gifts' ? 'btn-cyan' : 'btn-secondary'"
          @click="activeTab = 'gifts'"
        >
          <Sparkles :size="16" />
          <span>Ánh Xạ Quà Tặng ({{ gifts.length }})</span>
        </button>
        <button
          type="button"
          class="btn"
          :class="activeTab === 'reviews' ? 'btn-cyan' : 'btn-secondary'"
          @click="activeTab = 'reviews'"
        >
          <ClipboardCheck :size="16" />
          <span>Lịch Sử Kiểm Duyệt</span>
        </button>
      </div>
    </header>

    <div v-if="statusNotice" class="notice-bar">
      <span>{{ statusNotice }}</span>
      <button type="button" @click="statusNotice = ''">Đóng</button>
    </div>

    <!-- TAB 1: DANH SÁCH & KIỂM DUYỆT CÂU HỎI -->
    <section v-if="activeTab === 'questions'" class="admin-section">
      <!-- Filter Bar -->
      <div class="filter-bar">
        <input
          v-model="filters.search"
          type="text"
          class="input-control search-box"
          placeholder="Tìm kiếm nội dung câu hỏi hoặc giải thích..."
          @input="loadQuestions"
        />

        <select v-model="filters.categoryId" class="select-control" @change="loadQuestions">
          <option value="ALL">Tất cả danh mục</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">
            {{ c.name }} ({{ c.publishedCount }}/{{ c.totalCount }})
          </option>
        </select>

        <select v-model="filters.difficulty" class="select-control" @change="loadQuestions">
          <option value="ALL">Mọi độ khó</option>
          <option value="EASY">Dễ (EASY)</option>
          <option value="MEDIUM">Trung bình (MEDIUM)</option>
          <option value="HARD">Khó (HARD)</option>
        </select>

        <select v-model="filters.status" class="select-control" @change="loadQuestions">
          <option value="ALL">Mọi trạng thái duyệt</option>
          <option value="PUBLISHED">PUBLISHED (Đang dùng trong game)</option>
          <option value="PENDING">PENDING (Chờ biên tập viên duyệt)</option>
          <option value="DRAFT">DRAFT (Bản nháp)</option>
          <option value="APPROVED">APPROVED (Đã duyệt nội dung)</option>
          <option value="REJECTED">REJECTED (Từ chối)</option>
          <option value="ARCHIVED">ARCHIVED (Ngừng sử dụng)</option>
        </select>
      </div>

      <!-- Questions List -->
      <div class="questions-list">
        <article
          v-for="q in questions"
          :key="q.id"
          class="question-admin-card"
        >
          <div class="qa-top">
            <div class="qa-badges">
              <span class="badge" :class="statusBadgeClass(q.status)">{{ q.status }}</span>
              <span class="badge badge-cyan">{{ q.categoryName }}</span>
              <span class="badge badge-purple">{{ q.difficulty }}</span>
              <span v-if="q.source" class="source-pill">
                Nguồn: {{ q.source.sourceType }} • {{ q.source.license }}
              </span>
            </div>

            <div class="qa-actions">
              <button
                v-if="q.status !== 'PUBLISHED'"
                type="button"
                class="btn btn-cyan btn-sm"
                @click="changeStatus(q.id, 'PUBLISHED', 'Biên tập viên duyệt và xuất bản vào game')"
              >
                <Check :size="14" />
                <span>Duyệt & Xuất bản</span>
              </button>
              <button
                v-if="q.status === 'PUBLISHED'"
                type="button"
                class="btn btn-secondary btn-sm"
                @click="changeStatus(q.id, 'ARCHIVED', 'Tạm ngừng sử dụng câu hỏi')"
              >
                <span>Lưu trữ (Archive)</span>
              </button>
              <button
                v-if="q.status === 'PENDING' || q.status === 'DRAFT'"
                type="button"
                class="btn btn-danger btn-sm"
                @click="changeStatus(q.id, 'REJECTED', 'Chưa đạt yêu cầu kiểm chứng nguồn')"
              >
                <span>Từ chối</span>
              </button>
              <button
                type="button"
                class="btn btn-secondary btn-sm"
                @click="editExistingQuestion(q)"
              >
                <span>Chỉnh sửa</span>
              </button>
            </div>
          </div>

          <h3 class="qa-content">{{ q.content }}</h3>

          <div class="qa-options-grid">
            <div
              v-for="opt in q.options"
              :key="opt.id"
              class="qa-opt-item"
              :class="{ 'qa-opt-correct': opt.isCorrect }"
            >
              <span class="qa-opt-label">{{ opt.label }}</span>
              <span>{{ opt.content }}</span>
              <Check v-if="opt.isCorrect" :size="15" />
            </div>
          </div>

          <div class="qa-footer">
            <p><strong>Giải thích:</strong> {{ q.explanation || 'Chưa có giải thích' }}</p>
            <span v-if="q.source?.attribution" class="qa-attribution">
              Ghi công: {{ q.source.attribution }}
            </span>
          </div>
        </article>
      </div>
    </section>

    <!-- TAB 2: TẠO CÂU HỎI MỚI HOẶC NHẬP DỮ LIỆU JSON / OPEN TRIVIA DB -->
    <section v-else-if="activeTab === 'create'" class="admin-section two-col-admin">
      <!-- Form Tạo / Sửa Câu Hỏi -->
      <div class="panel-card">
        <h2>{{ editingQuestionId ? 'Chỉnh Sửa Câu Hỏi' : 'Tạo Câu Hỏi Mới (Mục 4.2 & 4.4)' }}</h2>
        <form class="q-form" @submit.prevent="submitQuestionForm">
          <div class="form-row-2">
            <div>
              <label>Danh mục</label>
              <select v-model="qForm.categoryId" class="select-control">
                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div>
              <label>Độ khó</label>
              <select v-model="qForm.difficulty" class="select-control">
                <option value="EASY">Dễ (EASY)</option>
                <option value="MEDIUM">Trung bình (MEDIUM)</option>
                <option value="HARD">Khó (HARD)</option>
              </select>
            </div>
          </div>

          <div>
            <label>Nội dung câu hỏi (Tiếng Việt)</label>
            <textarea
              v-model="qForm.content"
              rows="3"
              class="textarea-control"
              placeholder="Nhập câu hỏi rõ ràng, ngắn gọn dễ đọc trên điện thoại..."
              required
            ></textarea>
          </div>

          <div class="options-editor-grid">
            <div v-for="lbl in (['A', 'B', 'C', 'D'] as const)" :key="lbl" class="opt-edit-box">
              <div class="opt-edit-head">
                <strong>Đáp án {{ lbl }}</strong>
                <label class="correct-radio">
                  <input v-model="qForm.correctOption" type="radio" :value="lbl" />
                  <span>Đáp án đúng</span>
                </label>
              </div>
              <input
                v-model="qForm.options[lbl]"
                type="text"
                class="input-control"
                :placeholder="`Nội dung lựa chọn ${lbl}`"
                required
              />
            </div>
          </div>

          <div>
            <label>Giải thích đáp án (Hiển thị khi câu hỏi đóng)</label>
            <textarea
              v-model="qForm.explanation"
              rows="2"
              class="textarea-control"
              placeholder="Giải thích ngắn gọn lý do đáp án đúng..."
            ></textarea>
          </div>

          <div class="form-row-3">
            <div>
              <label>Nguồn dữ liệu (Mục 4.1)</label>
              <select v-model="qForm.sourceType" class="select-control">
                <option value="WIKIDATA">Wikidata (CC0)</option>
                <option value="WIKIPEDIA">Wikipedia (CC BY-SA)</option>
                <option value="OPEN_TRIVIA_DB">Open Trivia DB</option>
                <option value="AI">AI Hỗ trợ soạn nháp</option>
                <option value="MANUAL">Biên tập viên tự soạn</option>
              </select>
            </div>
            <div>
              <label>Giấy phép / Điều kiện</label>
              <input
                v-model="qForm.license"
                type="text"
                class="input-control"
                placeholder="CC BY-SA 4.0 / CC0 1.0"
              />
            </div>
            <div>
              <label>Trạng thái xuất bản</label>
              <select v-model="qForm.status" class="select-control">
                <option value="PUBLISHED">PUBLISHED (Xuất bản ngay)</option>
                <option value="PENDING">PENDING (Chờ duyệt)</option>
                <option value="DRAFT">DRAFT (Bản nháp)</option>
              </select>
            </div>
          </div>

          <div>
            <label>Ghi công / Link nguồn tham khảo</label>
            <input
              v-model="qForm.attribution"
              type="text"
              class="input-control"
              placeholder="Ví dụ: Wikipedia Tiếng Việt / Wikidata Q1858"
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-cyan">
              <Save :size="16" />
              <span>{{ editingQuestionId ? 'Cập nhật câu hỏi' : 'Lưu vào Ngân hàng câu hỏi' }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Nhập hàng loạt JSON (Bulk Import) -->
      <div class="panel-card">
        <h2>Nhập Hàng Loạt Câu Hỏi (JSON / OpenTriviaDB / AI)</h2>
        <p class="panel-sub">
          Dán mảng JSON câu hỏi đã chuẩn hóa để nhập nhanh vào trạng thái chờ duyệt hoặc xuất bản.
        </p>

        <textarea
          v-model="bulkJsonText"
          rows="14"
          class="textarea-control mono-textarea"
        ></textarea>

        <div class="form-actions">
          <button type="button" class="btn btn-purple" @click="handleBulkImport('PENDING')">
            <span>Nhập vào hàng đợi Chờ duyệt (PENDING)</span>
          </button>
          <button type="button" class="btn btn-cyan" @click="handleBulkImport('PUBLISHED')">
            <span>Nhập & Xuất bản ngay (PUBLISHED)</span>
          </button>
        </div>
      </div>
    </section>

    <!-- TAB 3: ÁNH XẠ QUÀ TẶNG TIKTOK (GIFT MAPPINGS - MỤC 3.4) -->
    <section v-else-if="activeTab === 'gifts'" class="admin-section two-col-admin">
      <div class="panel-card">
        <div class="panel-header-flex">
          <div>
            <h2>Danh Sách Cấu Hình Quà Tặng TikTok ({{ gifts.length }})</h2>
            <p class="panel-sub">
              Bấm <strong>"Sửa"</strong> trên từng quà tặng để chỉnh sửa chức năng, số điểm, biểu tượng hoặc thông điệp. Các quà tặng đang bật sẽ hiển thị trực tiếp trên màn hình người chơi.
            </p>
          </div>
          <button
            v-if="editingGiftRecordId"
            type="button"
            class="btn btn-secondary btn-sm"
            @click="resetGiftForm"
          >
            + Thêm quà mới
          </button>
        </div>

        <div class="gifts-table">
          <div
            v-for="g in gifts"
            :key="g.id"
            class="gift-row"
            :class="{
              'gift-row-editing': editingGiftRecordId === g.id,
              'gift-row-inactive': g.isActive === false,
            }"
          >
            <div class="gift-row-main">
              <div class="gift-emoji-avatar">
                {{ resolveGiftEmoji(g.icon, g.giftName) }}
              </div>
              <div class="gift-row-info">
                <div class="gift-title-line">
                  <strong>{{ g.giftName }}</strong>
                  <span class="gift-id-tag tabular-nums">ID: {{ g.giftId }}</span>
                  <span
                    class="badge"
                    :class="g.isActive !== false ? 'badge-emerald' : 'badge-rose'"
                  >
                    {{ g.isActive !== false ? 'Đang hiển thị' : 'Đang ẩn' }}
                  </span>
                </div>
                <p class="gift-msg-preview">{{ g.displayMessage }}</p>
                <div class="gift-badges">
                  <span class="badge badge-cyan">
                    🎯 Chức năng: {{ formatGiftRewardLabel(g) }}
                  </span>
                  <span class="badge badge-gold">
                    ✨ Hiệu ứng: {{ formatEffectLabel(g.effectType) }}
                  </span>
                  <span class="badge badge-purple tabular-nums">
                    ⏱ {{ ((g.durationMs || 4000) / 1000).toFixed(1) }}s
                  </span>
                </div>
              </div>
            </div>

            <div class="gift-row-actions">
              <button
                type="button"
                class="btn btn-cyan btn-sm"
                @click="editGiftItem(g)"
              >
                ✏️ Sửa
              </button>
              <button
                type="button"
                class="btn btn-secondary btn-sm"
                @click="handleToggleGift(g)"
              >
                {{ g.isActive !== false ? '🙈 Ẩn' : '👁️ Hiện' }}
              </button>
              <button
                type="button"
                class="btn btn-danger btn-sm"
                @click="handleDeleteGift(g)"
              >
                🗑️ Xóa
              </button>
            </div>
          </div>

          <div v-if="!gifts.length" class="empty-gifts-box">
            Chưa có cấu hình quà tặng nào. Hãy thêm quà tặng ở biểu mẫu bên phải!
          </div>
        </div>
      </div>

      <div class="panel-card gift-editor-panel" :class="{ 'editor-highlight': !!editingGiftRecordId }">
        <div class="panel-header-flex">
          <h2>
            {{
              editingGiftRecordId
                ? `✏️ Chỉnh Sửa Quà Tặng: ${giftForm.giftName || ''}`
                : '➕ Thêm Cấu Hình Quà Tặng Mới'
            }}
          </h2>
          <button
            v-if="editingGiftRecordId"
            type="button"
            class="btn btn-secondary btn-sm"
            @click="resetGiftForm"
          >
            Hủy sửa
          </button>
        </div>

        <!-- Mẫu điền nhanh quà TikTok phổ biến -->
        <div class="preset-gifts-box">
          <span class="preset-label">Chọn nhanh mẫu quà TikTok:</span>
          <div class="preset-chips">
            <button
              v-for="preset in tiktokGiftPresets"
              :key="preset.giftId"
              type="button"
              class="preset-chip-btn"
              @click="applyGiftPreset(preset)"
            >
              <span>{{ preset.icon }}</span>
              <span>{{ preset.giftName }}</span>
              <small>({{ preset.giftId }})</small>
            </button>
          </div>
        </div>

        <form class="q-form" @submit.prevent="saveGiftMapping">
          <div class="form-row-2">
            <div>
              <label>TikTok Gift ID (hoặc từ khóa tên quà)</label>
              <input
                v-model="giftForm.giftId"
                class="input-control"
                placeholder="VD: 5655"
                required
              />
            </div>
            <div>
              <label>Tên hiển thị quà tặng</label>
              <input
                v-model="giftForm.giftName"
                class="input-control"
                placeholder="VD: Hoa Hồng (Rose)"
                required
              />
            </div>
          </div>

          <!-- Chọn Icon / Emoji hiển thị trên màn hình User -->
          <div>
            <label>Biểu tượng (Emoji hiển thị trên màn hình người chơi)</label>
            <div class="emoji-picker-row">
              <input
                v-model="giftForm.icon"
                class="input-control emoji-input"
                placeholder="🌹"
                maxlength="8"
              />
              <div class="emoji-quick-list">
                <button
                  v-for="emo in giftEmojiOptions"
                  :key="emo"
                  type="button"
                  class="emoji-choice-btn"
                  :class="{ active: giftForm.icon === emo }"
                  @click="giftForm.icon = emo"
                >
                  {{ emo }}
                </button>
              </div>
            </div>
          </div>

          <div class="form-row-2">
            <div>
              <label>Chức năng của quà tặng trong Game</label>
              <select v-model="giftForm.rewardType" class="select-control" @change="onRewardTypeChange">
                <option value="POINTS">⚡ Cộng điểm cho người tặng</option>
                <option value="ELIMINATE_WRONG">🎯 Loại trừ 1 đáp án sai (Trợ giúp 50/50)</option>
                <option value="POINTS_AND_ELIMINATE">🔥 Vừa cộng điểm + Vừa loại 1 đáp án sai</option>
                <option value="ADD_TIME">⏱️ Cộng thêm giây suy nghĩ cho câu đang mở</option>
                <option value="NONE">✨ Chỉ phát hiệu ứng vinh danh sân khấu</option>
              </select>
            </div>

            <div>
              <label>Hiệu ứng sân khấu khi nhận quà</label>
              <select v-model="giftForm.effectType" class="select-control">
                <option value="FIREWORKS">🎆 Pháo hoa đại tiệc (FIREWORKS)</option>
                <option value="STAGE_LIGHTS">⚡ Ánh sáng hào quang (STAGE_LIGHTS)</option>
                <option value="CHEER_BANNER">🎉 Băng rôn cổ vũ (CHEER_BANNER)</option>
                <option value="SHARED_HINT">💡 Ngôi sao gợi ý (SHARED_HINT)</option>
                <option value="CONFETTI_SHOWER">🎊 Mưa kim tuyến (CONFETTI_SHOWER)</option>
              </select>
            </div>
          </div>

          <!-- Cấu hình số điểm hoặc số giây cộng thêm -->
          <div
            v-if="
              giftForm.rewardType === 'POINTS' ||
              giftForm.rewardType === 'POINTS_AND_ELIMINATE' ||
              giftForm.rewardType === 'ADD_TIME'
            "
            class="reward-value-box"
          >
            <label>
              {{
                giftForm.rewardType === 'ADD_TIME'
                  ? 'Số giây cộng thêm cho câu hỏi (Mỗi 1 quà)'
                  : 'Số điểm cộng trực tiếp cho người tặng (Mỗi 1 quà)'
              }}
            </label>
            <div class="reward-input-with-chips">
              <input
                v-model.number="giftForm.rewardPoints"
                type="number"
                min="1"
                step="1"
                class="input-control"
                required
              />
              <div v-if="giftForm.rewardType === 'ADD_TIME'" class="quick-pts-chips">
                <button
                  v-for="sec in [5, 10, 15, 20]"
                  :key="sec"
                  type="button"
                  class="chip-val-btn"
                  :class="{ active: giftForm.rewardPoints === sec }"
                  @click="giftForm.rewardPoints = sec"
                >
                  +{{ sec }}s
                </button>
              </div>
              <div v-else class="quick-pts-chips">
                <button
                  v-for="pts in [50, 100, 200, 300, 500, 1000]"
                  :key="pts"
                  type="button"
                  class="chip-val-btn"
                  :class="{ active: giftForm.rewardPoints === pts }"
                  @click="giftForm.rewardPoints = pts"
                >
                  +{{ pts }}đ
                </button>
              </div>
            </div>
          </div>

          <div class="form-row-2">
            <div>
              <label>Thời lượng hiển thị trên màn hình (ms)</label>
              <input
                v-model.number="giftForm.durationMs"
                type="number"
                min="1500"
                max="15000"
                step="500"
                class="input-control"
                required
              />
            </div>
            <div>
              <label>Trạng thái hiển thị trên màn hình User</label>
              <select v-model="giftForm.isActive" class="select-control">
                <option :value="true">✅ Bật (Hiển thị & kích hoạt trong game)</option>
                <option :value="false">🙈 Tắt (Tạm ẩn khỏi màn hình user)</option>
              </select>
            </div>
          </div>

          <div>
            <label>Thông điệp vinh danh khi người chơi tặng quà</label>
            <input
              v-model="giftForm.displayMessage"
              class="input-control"
              placeholder="đã gửi quà tặng cổ vũ toàn trường quay!"
              required
            />
          </div>

          <!-- Xem trước thẻ hiển thị trên màn hình User -->
          <div class="user-gift-preview-card">
            <span class="preview-caption">👁️ Xem trước hiển thị trên màn hình người chơi:</span>
            <div class="preview-gift-pill">
              <span class="preview-gift-emoji">{{ resolveGiftEmoji(giftForm.icon, giftForm.giftName) }}</span>
              <div class="preview-gift-texts">
                <strong>{{ giftForm.giftName || 'Tên quà tặng' }}</strong>
                <span class="preview-gift-func">{{ formatGiftRewardLabel(giftForm) }}</span>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-gold">
              <Save :size="16" />
              <span>{{
                editingGiftRecordId ? 'Lưu cập nhật cấu hình quà tặng' : 'Thêm cấu hình quà tặng mới'
              }}</span>
            </button>
            <button
              v-if="editingGiftRecordId"
              type="button"
              class="btn btn-secondary"
              @click="resetGiftForm"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- TAB 4: LỊCH SỬ KIỂM DUYỆT (QUESTION REVIEWS - MỤC 9) -->
    <section v-else-if="activeTab === 'reviews'" class="admin-section">
      <div class="panel-card">
        <h2>Lịch Sử Kiểm Duyệt Nội Dung (Bảng question_reviews)</h2>
        <div class="reviews-list tabular-nums">
          <div v-for="rev in reviews" :key="rev.id" class="review-item">
            <div class="rev-main">
              <strong>{{ rev.question_content || rev.question_id }}</strong>
              <p>{{ rev.notes }}</p>
            </div>
            <div class="rev-meta">
              <span class="badge badge-purple">{{ rev.previous_status }} → {{ rev.new_status }}</span>
              <small>{{ rev.reviewed_at }}</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import {
  ArrowLeft,
  BookOpen,
  PlusCircle,
  Sparkles,
  ClipboardCheck,
  Check,
  Save,
} from 'lucide-vue-next';
import { api } from '../services/api';

const activeTab = ref<'questions' | 'create' | 'gifts' | 'reviews'>('questions');
const categories = ref<any[]>([]);
const questions = ref<any[]>([]);
const gifts = ref<any[]>([]);
const reviews = ref<any[]>([]);
const statusNotice = ref('');
const editingQuestionId = ref<string | null>(null);
const isGeneratingRandom = ref(false);

const filters = reactive({
  search: '',
  categoryId: 'ALL',
  difficulty: 'ALL',
  status: 'ALL',
});

const qForm = reactive({
  categoryId: 'cat-geo',
  content: '',
  difficulty: 'MEDIUM',
  options: {
    A: '',
    B: '',
    C: '',
    D: '',
  },
  correctOption: 'A',
  explanation: '',
  sourceType: 'WIKIPEDIA',
  license: 'CC BY-SA 4.0',
  attribution: '',
  status: 'PUBLISHED',
});

const editingGiftRecordId = ref<string | null>(null);
const giftEmojiOptions = ['🌹', '🎆', '⚡', '🌟', '👑', '🍦', '💖', '🦁', '🚀', '💎', '🔥', '🎁'];

const tiktokGiftPresets = [
  {
    giftId: '5655',
    giftName: 'Hoa Hồng (Rose)',
    icon: '🌹',
    effectType: 'CHEER_BANNER',
    rewardType: 'POINTS',
    rewardPoints: 100,
    durationMs: 3500,
    displayMessage: 'đã gửi Hoa Hồng cổ vũ toàn trường quay!',
  },
  {
    giftId: '5879',
    giftName: 'Tim Tay (Finger Heart)',
    icon: '💖',
    effectType: 'STAGE_LIGHTS',
    rewardType: 'POINTS',
    rewardPoints: 150,
    durationMs: 4000,
    displayMessage: 'đã thả Tim Tay thắp sáng sân khấu Game Show!',
  },
  {
    giftId: '5827',
    giftName: 'Kem Ốc Quế',
    icon: '🍦',
    effectType: 'CONFETTI_SHOWER',
    rewardType: 'ADD_TIME',
    rewardPoints: 10,
    durationMs: 4000,
    displayMessage: 'đã tặng Kem Ốc Quế tiếp thêm thời gian suy nghĩ!',
  },
  {
    giftId: '5269',
    giftName: 'Pháo Hoa Sân Khấu',
    icon: '🎆',
    effectType: 'FIREWORKS',
    rewardType: 'POINTS',
    rewardPoints: 300,
    durationMs: 5000,
    displayMessage: 'đã kích hoạt Đại Tiệc Pháo Hoa rực rỡ!',
  },
  {
    giftId: '9999',
    giftName: 'Ngôi Sao Tri Thức',
    icon: '🌟',
    effectType: 'SHARED_HINT',
    rewardType: 'ELIMINATE_WRONG',
    rewardPoints: 0,
    durationMs: 5500,
    displayMessage: 'đã mở Gợi Ý Chung (Loại trừ 1 đáp án sai) cho tất cả người chơi!',
  },
  {
    giftId: '5658',
    giftName: 'Vương Miện Hoàng Gia',
    icon: '👑',
    effectType: 'FIREWORKS',
    rewardType: 'POINTS_AND_ELIMINATE',
    rewardPoints: 500,
    durationMs: 6000,
    displayMessage: 'đã trao Vương Miện Hoàng Gia: vừa cộng điểm khủng vừa mở gợi ý!',
  },
];

const giftForm = reactive({
  giftId: '',
  giftName: '',
  icon: '🌹',
  effectType: 'FIREWORKS',
  rewardType: 'POINTS',
  rewardPoints: 100,
  durationMs: 4000,
  isActive: true,
  displayMessage: 'đã khuấy động sân khấu bằng quà tặng đặc biệt!',
});

function resolveGiftEmoji(icon?: string, giftName?: string): string {
  const map: Record<string, string> = {
    flower: '🌹',
    sparkles: '🎆',
    zap: '⚡',
    lightbulb: '🌟',
    crown: '👑',
    heart: '💖',
    icecream: '🍦',
    lion: '🦁',
    rocket: '🚀',
    diamond: '💎',
    fire: '🔥',
    gift: '🎁',
  };
  if (icon && map[icon.toLowerCase()]) return map[icon.toLowerCase()];
  if (icon && icon.trim().length <= 8 && !/^[a-zA-Z]+$/.test(icon.trim())) {
    return icon.trim();
  }
  const lower = (giftName || '').toLowerCase();
  if (lower.includes('hồng') || lower.includes('rose')) return '🌹';
  if (lower.includes('pháo') || lower.includes('firework')) return '🎆';
  if (lower.includes('ánh sáng')) return '⚡';
  if (lower.includes('tim') || lower.includes('heart')) return '💖';
  if (lower.includes('sao') || lower.includes('gợi ý')) return '🌟';
  if (lower.includes('vương miện') || lower.includes('crown')) return '👑';
  if (lower.includes('kem')) return '🍦';
  if (lower.includes('sư tử') || lower.includes('lion')) return '🦁';
  return '🎁';
}

function formatGiftRewardLabel(g: any): string {
  const rType = g?.rewardType || 'POINTS';
  const pts = g?.rewardPoints ?? 100;
  if (rType === 'ELIMINATE_WRONG') return 'Loại 1 đáp án sai';
  if (rType === 'POINTS_AND_ELIMINATE') return `+${pts} Điểm & Loại 1 sai`;
  if (rType === 'ADD_TIME') return `+${pts || 10} giây suy nghĩ`;
  if (rType === 'NONE') return 'Hiệu ứng vinh danh';
  return `+${pts} Điểm`;
}

function formatEffectLabel(effectType?: string): string {
  const map: Record<string, string> = {
    FIREWORKS: 'Pháo hoa',
    STAGE_LIGHTS: 'Ánh sáng',
    CHEER_BANNER: 'Băng rôn cổ vũ',
    SHARED_HINT: 'Gợi ý 50/50',
    CONFETTI_SHOWER: 'Mưa kim tuyến',
  };
  return map[effectType || ''] || effectType || 'Pháo hoa';
}

const bulkJsonText = ref(
  JSON.stringify(
    [
      {
        categoryId: 'cat-geo',
        content: 'Sông nào dài nhất trên lãnh thổ Việt Nam?',
        difficulty: 'MEDIUM',
        options: {
          A: 'Sông Hồng',
          B: 'Sông Đồng Nai',
          C: 'Sông Đà',
          D: 'Sông Hương',
        },
        correctOption: 'B',
        explanation:
          'Sông Đồng Nai là con sông nội địa dài nhất chảy trên lãnh thổ Việt Nam (~586 km).',
        sourceType: 'WIKIPEDIA',
        license: 'CC BY-SA 4.0',
        attribution: 'Wikipedia Tiếng Việt - Sông Đồng Nai',
      },
    ],
    null,
    2
  )
);

function statusBadgeClass(status: string) {
  if (status === 'PUBLISHED') return 'badge-emerald';
  if (status === 'PENDING' || status === 'DRAFT') return 'badge-gold';
  if (status === 'REJECTED') return 'badge-rose';
  return 'badge-purple';
}

async function loadQuestions() {
  questions.value = await api.getQuestions({
    categoryId: filters.categoryId,
    difficulty: filters.difficulty,
    status: filters.status,
    search: filters.search,
  });
}

async function loadAllAdminData() {
  const [cats, qList, giftList, revList] = await Promise.all([
    api.getCategories(),
    api.getQuestions(filters),
    api.getGifts(),
    api.getReviews(),
  ]);
  categories.value = cats;
  questions.value = qList;
  gifts.value = giftList;
  reviews.value = revList;
}

function openCreateQuestion() {
  editingQuestionId.value = null;
  qForm.content = '';
  qForm.options = { A: '', B: '', C: '', D: '' };
  qForm.correctOption = 'A';
  qForm.explanation = '';
  qForm.attribution = '';
  activeTab.value = 'create';
}

function editExistingQuestion(q: any) {
  editingQuestionId.value = q.id;
  qForm.categoryId = q.categoryId;
  qForm.content = q.content;
  qForm.difficulty = q.difficulty;
  qForm.explanation = q.explanation;
  qForm.status = q.status;
  qForm.sourceType = q.source?.sourceType || 'MANUAL';
  qForm.license = q.source?.license || 'CC BY-SA 4.0';
  qForm.attribution = q.source?.attribution || '';
  for (const opt of q.options) {
    qForm.options[opt.label as 'A' | 'B' | 'C' | 'D'] = opt.content;
    if (opt.isCorrect) qForm.correctOption = opt.label;
  }
  activeTab.value = 'create';
}

async function submitQuestionForm() {
  try {
    if (editingQuestionId.value) {
      await api.updateQuestion(editingQuestionId.value, { ...qForm });
      statusNotice.value = 'Đã cập nhật câu hỏi thành công!';
    } else {
      await api.createQuestion({ ...qForm });
      statusNotice.value = 'Đã thêm câu hỏi mới vào ngân hàng câu hỏi!';
    }
    await loadAllAdminData();
    activeTab.value = 'questions';
  } catch (err: any) {
    statusNotice.value = err.message;
  }
}

async function changeStatus(id: string, status: string, notes: string) {
  await api.reviewQuestion(id, status, notes);
  statusNotice.value = `Đã chuyển trạng thái câu hỏi sang ${status}`;
  await loadAllAdminData();
}

async function handleBulkImport(targetStatus: string) {
  try {
    const parsed = JSON.parse(bulkJsonText.value);
    const res = await api.importQuestions(parsed, targetStatus);
    statusNotice.value = `Đã nhập thành công ${res.importedCount} câu hỏi ở trạng thái ${targetStatus}!`;
    await loadAllAdminData();
    activeTab.value = 'questions';
  } catch (err: any) {
    statusNotice.value = `Lỗi định dạng JSON: ${err.message}`;
  }
}

async function handleGenerateRandom(count = 10, targetStatus = 'PUBLISHED') {
  isGeneratingRandom.value = true;
  try {
    const res = await api.generateRandomQuestions(count, targetStatus);
    if (res.generatedCount > 0) {
      statusNotice.value = `Đã tự động thêm ${res.generatedCount} câu hỏi mới (chống trùng lặp 100%) vào Ngân hàng câu hỏi!`;
    } else {
      statusNotice.value = `Toàn bộ câu hỏi trong kho mẫu có sẵn đã được nạp hết vào ngân hàng. Để bổ sung thêm câu hỏi mới, bạn hãy dùng tab "Tạo / Nhập Câu Hỏi" bên dưới!`;
    }
    await loadAllAdminData();
    activeTab.value = 'questions';
  } catch (err: any) {
    statusNotice.value = `Lỗi tạo câu hỏi ngẫu nhiên: ${err.message}`;
  } finally {
    isGeneratingRandom.value = false;
  }
}

function resetGiftForm() {
  editingGiftRecordId.value = null;
  giftForm.giftId = '';
  giftForm.giftName = '';
  giftForm.icon = '🌹';
  giftForm.effectType = 'FIREWORKS';
  giftForm.rewardType = 'POINTS';
  giftForm.rewardPoints = 100;
  giftForm.durationMs = 4000;
  giftForm.isActive = true;
  giftForm.displayMessage = 'đã khuấy động sân khấu bằng quà tặng đặc biệt!';
}

function editGiftItem(g: any) {
  editingGiftRecordId.value = g.id;
  giftForm.giftId = g.giftId || '';
  giftForm.giftName = g.giftName || '';
  giftForm.icon = resolveGiftEmoji(g.icon, g.giftName);
  giftForm.effectType = g.effectType || 'FIREWORKS';
  giftForm.rewardType = g.rewardType || 'POINTS';
  giftForm.rewardPoints =
    g.rewardType === 'ADD_TIME'
      ? Number(g.rewardPoints || 10)
      : Number(g.rewardPoints || 100);
  giftForm.durationMs = Number(g.durationMs || 4000);
  giftForm.isActive = g.isActive !== false;
  giftForm.displayMessage =
    g.displayMessage || 'đã gửi quà tặng cổ vũ toàn trường quay!';
}

function applyGiftPreset(preset: any) {
  giftForm.giftId = preset.giftId;
  giftForm.giftName = preset.giftName;
  giftForm.icon = preset.icon;
  giftForm.effectType = preset.effectType;
  giftForm.rewardType = preset.rewardType;
  giftForm.rewardPoints = preset.rewardPoints;
  giftForm.durationMs = preset.durationMs;
  giftForm.displayMessage = preset.displayMessage;
  giftForm.isActive = true;
}

function onRewardTypeChange() {
  if (giftForm.rewardType === 'ADD_TIME' && giftForm.rewardPoints > 30) {
    giftForm.rewardPoints = 10;
  } else if (
    (giftForm.rewardType === 'POINTS' ||
      giftForm.rewardType === 'POINTS_AND_ELIMINATE') &&
    giftForm.rewardPoints <= 0
  ) {
    giftForm.rewardPoints = 100;
  }
}

async function saveGiftMapping() {
  try {
    const payload = { ...giftForm };
    if (editingGiftRecordId.value) {
      gifts.value = await api.updateGift(editingGiftRecordId.value, payload);
      statusNotice.value = `Đã cập nhật cấu hình quà tặng "${giftForm.giftName}" thành công!`;
    } else {
      gifts.value = await api.upsertGift(payload);
      statusNotice.value = `Đã thêm cấu hình quà tặng "${giftForm.giftName}" thành công!`;
    }
    resetGiftForm();
  } catch (err: any) {
    statusNotice.value = `Lỗi lưu quà tặng: ${err.message}`;
  }
}

async function handleToggleGift(g: any) {
  try {
    const nextState = g.isActive === false;
    gifts.value = await api.toggleGift(g.id, nextState);
    statusNotice.value = `${nextState ? 'Đã bật hiển thị' : 'Đã ẩn'} quà tặng "${g.giftName}" trên màn hình người chơi!`;
  } catch (err: any) {
    statusNotice.value = `Lỗi cập nhật trạng thái: ${err.message}`;
  }
}

async function handleDeleteGift(g: any) {
  try {
    gifts.value = await api.deleteGift(g.id);
    if (editingGiftRecordId.value === g.id) {
      resetGiftForm();
    }
    statusNotice.value = `Đã xóa cấu hình quà tặng "${g.giftName}"`;
  } catch (err: any) {
    statusNotice.value = `Lỗi xóa quà tặng: ${err.message}`;
  }
}

onMounted(() => {
  loadAllAdminData();
});
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  padding: 1.5rem 2rem 3rem;
  max-width: 1540px;
  margin: 0 auto;
}

.admin-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--border-subtle);
  margin-bottom: 1.5rem;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.topbar-left h1 {
  font-size: 1.35rem;
  font-weight: 800;
}

.topbar-left p {
  font-size: 0.86rem;
  color: var(--text-secondary);
}

.topbar-tabs {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.notice-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.15rem;
  border-radius: 0.75rem;
  background: rgba(16, 185, 129, 0.18);
  border: 1px solid rgba(16, 185, 129, 0.45);
  color: #6ee7b7;
  margin-bottom: 1.25rem;
}

.filter-bar {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.2fr;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.question-admin-card {
  background: var(--surface-panel);
  border: 1px solid var(--border-subtle);
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.qa-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.qa-badges,
.qa-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.source-pill {
  font-size: 0.78rem;
  color: var(--text-secondary);
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
}

.btn-sm {
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
}

.qa-content {
  font-size: 1.12rem;
  font-weight: 700;
}

.qa-options-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.65rem;
}

.qa-opt-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.8rem;
  border-radius: 0.65rem;
  background: rgba(8, 12, 28, 0.75);
  border: 1px solid var(--border-subtle);
  font-size: 0.88rem;
}

.qa-opt-correct {
  background: rgba(16, 185, 129, 0.18);
  border-color: #10b981;
  color: #6ee7b7;
  font-weight: 700;
}

.qa-opt-label {
  font-weight: 800;
  color: var(--accent-cyan);
}

.qa-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.84rem;
  color: var(--text-secondary);
  border-top: 1px solid var(--border-subtle);
  padding-top: 0.65rem;
}

.qa-attribution {
  color: var(--text-muted);
}

.two-col-admin {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 1.5rem;
  align-items: start;
}

.panel-card {
  background: var(--surface-panel);
  border: 1px solid var(--border-subtle);
  border-radius: 1rem;
  padding: 1.5rem;
}

.panel-card h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.panel-sub {
  font-size: 0.86rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.q-form {
  display: flex;
  flex-direction: column;
  gap: 0.95rem;
}

.q-form label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 0.3rem;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}

.form-row-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;
}

.options-editor-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}

.opt-edit-box {
  padding: 0.85rem;
  border-radius: 0.75rem;
  background: rgba(8, 12, 28, 0.65);
  border: 1px solid var(--border-subtle);
}

.opt-edit-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.45rem;
  font-size: 0.84rem;
}

.correct-radio {
  display: inline-flex !important;
  align-items: center;
  gap: 0.35rem;
  margin: 0 !important;
  cursor: pointer;
}

.mono-textarea {
  font-family: var(--font-mono);
  font-size: 0.82rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.gifts-table,
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.panel-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
}

.gift-row,
.review-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.95rem 1.1rem;
  border-radius: 0.85rem;
  background: rgba(8, 12, 28, 0.76);
  border: 1px solid var(--border-subtle);
  transition: all 0.2s ease;
}

.gift-row:hover {
  border-color: rgba(0, 240, 255, 0.45);
}

.gift-row-editing {
  border-color: var(--accent-gold);
  background: rgba(250, 204, 21, 0.08);
  box-shadow: 0 0 18px rgba(250, 204, 21, 0.16);
}

.gift-row-inactive {
  opacity: 0.6;
}

.gift-row-main {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  min-width: 0;
  flex: 1;
}

.gift-emoji-avatar {
  width: 46px;
  height: 46px;
  border-radius: 0.8rem;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.55rem;
  flex-shrink: 0;
}

.gift-row-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 0;
}

.gift-title-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.gift-id-tag {
  font-size: 0.76rem;
  padding: 0.1rem 0.45rem;
  border-radius: 0.35rem;
  background: rgba(0, 240, 255, 0.12);
  color: var(--accent-cyan);
}

.gift-msg-preview {
  font-size: 0.82rem;
  color: var(--text-secondary);
  margin: 0;
}

.gift-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.2rem;
}

.gift-row-actions {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex-shrink: 0;
}

.gift-editor-panel.editor-highlight {
  border-color: var(--accent-gold);
  box-shadow: 0 0 24px rgba(250, 204, 21, 0.14);
}

.preset-gifts-box {
  background: rgba(8, 12, 28, 0.68);
  border: 1px dashed rgba(0, 240, 255, 0.3);
  border-radius: 0.75rem;
  padding: 0.75rem 0.9rem;
  margin-bottom: 1rem;
}

.preset-label {
  display: block;
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--accent-cyan);
  margin-bottom: 0.45rem;
}

.preset-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.preset-chip-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.32rem 0.65rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #e2f1ff;
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.preset-chip-btn:hover {
  background: rgba(0, 240, 255, 0.16);
  border-color: var(--accent-cyan);
  transform: translateY(-1px);
}

.preset-chip-btn small {
  color: var(--text-muted);
  font-size: 0.7rem;
}

.emoji-picker-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.emoji-input {
  width: 72px;
  text-align: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.emoji-quick-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.emoji-choice-btn {
  width: 36px;
  height: 36px;
  border-radius: 0.55rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  font-size: 1.15rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.emoji-choice-btn:hover,
.emoji-choice-btn.active {
  background: rgba(0, 240, 255, 0.22);
  border-color: var(--accent-cyan);
  transform: scale(1.08);
}

.reward-value-box {
  background: rgba(0, 240, 255, 0.06);
  border: 1px solid rgba(0, 240, 255, 0.24);
  border-radius: 0.75rem;
  padding: 0.75rem 0.9rem;
}

.reward-input-with-chips {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.reward-input-with-chips .input-control {
  width: 120px;
}

.quick-pts-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.chip-val-btn {
  padding: 0.32rem 0.65rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #e2f1ff;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.chip-val-btn:hover,
.chip-val-btn.active {
  background: var(--accent-cyan);
  border-color: var(--accent-cyan);
  color: #071026;
}

.user-gift-preview-card {
  background: rgba(13, 17, 39, 0.85);
  border: 1px solid rgba(250, 204, 21, 0.35);
  border-radius: 0.8rem;
  padding: 0.75rem 0.95rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.preview-caption {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.preview-gift-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.4rem 0.85rem;
  border-radius: 0.7rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(0, 240, 255, 0.4);
}

.preview-gift-emoji {
  font-size: 1.4rem;
}

.preview-gift-texts {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.preview-gift-texts strong {
  font-size: 0.82rem;
  color: #ffffff;
}

.preview-gift-func {
  font-size: 0.74rem;
  font-weight: 800;
  color: var(--accent-gold);
}

.empty-gifts-box {
  padding: 1.5rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.88rem;
}

.rev-main p {
  font-size: 0.84rem;
  color: var(--text-secondary);
  margin-top: 0.2rem;
}

.rev-meta {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

@media (max-width: 900px) {
  .admin-page {
    padding: 1rem 0.85rem 2.5rem;
  }

  .filter-bar,
  .qa-options-grid,
  .two-col-admin,
  .form-row-2,
  .form-row-3,
  .options-editor-grid {
    grid-template-columns: 1fr;
  }

  .qa-footer,
  .gift-row,
  .review-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .rev-meta {
    text-align: left;
  }
}
</style>
