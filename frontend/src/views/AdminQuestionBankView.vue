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
          :class="activeTab === 'ai-generator' ? 'btn-gold' : 'btn-secondary'"
          @click="activeTab = 'ai-generator'"
        >
          <Sparkles :size="16" />
          <span>✨ AI Sinh Câu Hỏi</span>
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
        <h2>Danh Sách Ánh Xạ Quà Tặng TikTok</h2>
        <p class="panel-sub">
          Mỗi quà tặng có thể cấu hình cộng điểm hoặc loại một đáp án sai trong câu hỏi đang mở.
        </p>

        <div class="gifts-table">
          <div v-for="g in gifts" :key="g.id" class="gift-row">
            <div>
              <strong>{{ g.giftName }}</strong>
              <span class="gift-id-tag tabular-nums">Gift ID: {{ g.giftId }}</span>
              <p>{{ g.displayMessage }}</p>
            </div>
            <div class="gift-badges">
              <span class="badge badge-gold">{{ g.effectType }}</span>
              <span class="badge badge-cyan">
                {{ g.rewardType === 'ELIMINATE_WRONG' ? 'LOẠI ĐÁP ÁN SAI' : g.rewardType === 'POINTS' ? `+${g.rewardPoints} ĐIỂM` : 'KHÔNG THƯỞNG' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-card">
        <h2>Thêm / Cập Nhật Cấu Hình Quà Tặng</h2>
        <form class="q-form" @submit.prevent="saveGiftMapping">
          <div>
            <label>TikTok Gift ID</label>
            <input v-model="giftForm.giftId" class="input-control" placeholder="VD: 5655" required />
          </div>
          <div>
            <label>Tên quà tặng</label>
            <input v-model="giftForm.giftName" class="input-control" placeholder="VD: Hoa Hồng" required />
          </div>
          <div>
            <label>Hiệu ứng kích hoạt trên màn hình Game Show</label>
            <select v-model="giftForm.effectType" class="select-control">
              <option value="FIREWORKS">FIREWORKS (Pháo hoa sân khấu)</option>
              <option value="STAGE_LIGHTS">STAGE_LIGHTS (Ánh sáng hào quang)</option>
              <option value="CHEER_BANNER">CHEER_BANNER (Lời cổ vũ toàn trường quay)</option>
              <option value="SHARED_HINT">SHARED_HINT (Gợi ý loại 1 đáp án sai cho tất cả)</option>
            </select>
          </div>
          <div>
            <label>Hành động thưởng</label>
            <select v-model="giftForm.rewardType" class="select-control">
              <option value="POINTS">Cộng điểm cho người gửi</option>
              <option value="ELIMINATE_WRONG">Loại 1 đáp án sai cho người chơi</option>
              <option value="NONE">Chỉ hiệu ứng, không cộng điểm</option>
            </select>
          </div>
          <div v-if="giftForm.rewardType === 'POINTS'">
            <label>Số điểm cộng</label>
            <input
              v-model.number="giftForm.rewardPoints"
              type="number"
              min="1"
              step="1"
              class="input-control"
              required
            />
          </div>
          <div>
            <label>Thông điệp hiển thị trên màn hình</label>
            <input
              v-model="giftForm.displayMessage"
              class="input-control"
              placeholder="đã gửi quà tặng cổ vũ toàn trường quay!"
              required
            />
          </div>
          <button type="submit" class="btn btn-gold">Lưu ánh xạ quà tặng</button>
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

    <!-- TAB 5: AI QUESTION GENERATOR (GEMINI & SMART ENGINE) -->
    <section v-else-if="activeTab === 'ai-generator'" class="admin-section two-col-admin">
      <!-- Cột trái: Cấu hình tạo câu hỏi AI -->
      <div class="panel-card">
        <div class="flex items-center justify-between mb-3">
          <h2>✨ AI Biên Soạn Câu Hỏi Tự Động</h2>
          <span class="badge badge-gold">Gemini / Smart Engine</span>
        </div>
        <p class="text-sm text-slate-300 mb-4">
          Nhập chủ đề bất kỳ, hệ thống AI sẽ tự động sinh các câu hỏi trắc nghiệm chuẩn 4 đáp án kèm lời giải thích chính xác để dùng ngay trong live stream!
        </p>

        <!-- Chủ đề câu hỏi -->
        <div class="form-group mb-3">
          <label class="form-label font-bold text-slate-200">Chủ đề câu hỏi:</label>
          <input
            v-model="aiForm.topic"
            type="text"
            class="input-control"
            placeholder="Ví dụ: Lịch sử Việt Nam hào hùng, Đố vui mẹo, Bóng đá, v.v."
          />
        </div>

        <!-- Gợi ý chủ đề nhanh -->
        <div class="topic-suggestions mb-4">
          <span class="text-xs text-slate-400 block mb-1">Gợi ý chủ đề hot:</span>
          <div class="suggestion-chips">
            <button
              v-for="s in topicSuggestions"
              :key="s"
              type="button"
              class="chip-btn"
              @click="aiForm.topic = s"
            >
              {{ s }}
            </button>
          </div>
        </div>

        <!-- Số lượng câu & Độ khó -->
        <div class="form-grid-2 mb-3">
          <div class="form-group">
            <label class="form-label">Số lượng câu:</label>
            <select v-model.number="aiForm.count" class="select-control">
              <option :value="5">5 câu (nhanh)</option>
              <option :value="10">10 câu (chuẩn)</option>
              <option :value="15">15 câu</option>
              <option :value="20">20 câu (trận đấu lớn)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Độ khó mong muốn:</label>
            <select v-model="aiForm.difficulty" class="select-control">
              <option value="ALL">Hỗn hợp (Dễ, Vừa, Khó)</option>
              <option value="EASY">Dễ (EASY)</option>
              <option value="MEDIUM">Trung bình (MEDIUM)</option>
              <option value="HARD">Khó (HARD)</option>
            </select>
          </div>
        </div>

        <!-- Tùy chọn nâng cao API Key -->
        <div class="form-group mb-4">
          <label class="form-label">Gemini API Key (Tùy chọn - để trống dùng AI server):</label>
          <input
            v-model="aiForm.apiKey"
            type="password"
            class="input-control font-mono text-xs"
            placeholder="AIzaSy... (nếu có riêng)"
          />
        </div>

        <!-- Checkbox Auto Publish -->
        <div class="checkbox-group mb-4">
          <label class="inline-flex items-center gap-2 cursor-pointer">
            <input v-model="aiForm.autoPublish" type="checkbox" class="w-4 h-4 accent-cyan-500" />
            <span class="text-sm font-semibold text-slate-200">
              Tự động Xuất Bản (PUBLISHED) để chơi ngay trên LIVE
            </span>
          </label>
        </div>

        <button
          type="button"
          class="btn btn-gold w-full flex items-center justify-center gap-2 py-3 font-bold"
          :disabled="isGeneratingAi"
          @click="handleGenerateAi"
        >
          <Sparkles :size="18" />
          <span>{{ isGeneratingAi ? 'Đang tạo câu hỏi bằng AI...' : '🚀 Bắt Đầu Sinh Câu Hỏi Bằng AI' }}</span>
        </button>
      </div>

      <!-- Cột phải: Xem trước danh sách câu hỏi AI vừa sinh -->
      <div class="panel-card">
        <div class="flex items-center justify-between mb-3">
          <h2>📋 Kết Quả Xem Trước ({{ aiGeneratedQuestions.length }} câu)</h2>
          <div v-if="aiGeneratedQuestions.length > 0" class="flex gap-2">
            <button
              type="button"
              class="btn btn-cyan btn-sm"
              :disabled="isSavingAi"
              @click="handleSaveAiQuestions"
            >
              <Save :size="15" />
              <span>Lưu Tất Cả Vào DB</span>
            </button>
            <button
              type="button"
              class="btn btn-secondary btn-sm"
              @click="aiGeneratedQuestions = []"
            >
              Xóa
            </button>
          </div>
        </div>

        <div v-if="aiGeneratedQuestions.length === 0" class="empty-ai-state">
          <div class="empty-icon">🤖</div>
          <h3>Chưa có câu hỏi nào được sinh</h3>
          <p>Nhập chủ đề ở cột bên trái và bấm <strong>"Bắt Đầu Sinh Câu Hỏi Bằng AI"</strong> để xem kết quả.</p>
        </div>

        <div v-else class="ai-questions-list tabular-nums">
          <div
            v-for="(q, idx) in aiGeneratedQuestions"
            :key="idx"
            class="ai-q-card"
          >
            <div class="ai-q-header">
              <span class="q-number">Câu {{ idx + 1 }}</span>
              <span class="badge" :class="q.difficulty === 'EASY' ? 'badge-green' : q.difficulty === 'HARD' ? 'badge-red' : 'badge-gold'">
                {{ q.difficulty }}
              </span>
              <span class="badge badge-purple">{{ q.categoryName }}</span>
            </div>
            <div class="ai-q-content">{{ q.content }}</div>
            <div class="ai-q-options">
              <div
                v-for="(optText, optKey) in q.options"
                :key="optKey"
                class="ai-opt-item"
                :class="{ correct: optKey === q.correctOption }"
              >
                <strong>{{ optKey }}.</strong> {{ optText }}
                <span v-if="optKey === q.correctOption" class="correct-badge">✓ Đúng</span>
              </div>
            </div>
            <div v-if="q.explanation" class="ai-q-exp">
              💡 <em>{{ q.explanation }}</em>
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

const activeTab = ref<'questions' | 'create' | 'gifts' | 'reviews' | 'ai-generator'>('questions');
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

const giftForm = reactive({
  giftId: '',
  giftName: '',
  effectType: 'FIREWORKS',
  rewardType: 'POINTS',
  rewardPoints: 100,
  displayMessage: 'đã khuấy động sân khấu bằng quà tặng đặc biệt!',
});

// AI Question Generator State
const topicSuggestions = [
  '🇻🇳 Lịch sử Việt Nam hào hùng',
  '⚽ Bóng đá Ngoại Hạng Anh & Thế giới',
  '🍜 Ẩm thực & Đặc sản 63 tỉnh thành',
  '💡 Đố mẹo dân gian & logic',
  '🌌 Khoa học & Vũ trụ kỳ thú',
  '📜 Ca dao tục ngữ Việt Nam',
  '🎵 Âm nhạc & Phim ảnh nổi tiếng',
];

const aiForm = reactive({
  topic: '🇻🇳 Lịch sử Việt Nam hào hùng',
  count: 10,
  difficulty: 'ALL',
  apiKey: '',
  autoPublish: true,
});
const isGeneratingAi = ref(false);
const aiGeneratedQuestions = ref<any[]>([]);
const isSavingAi = ref(false);

async function handleGenerateAi() {
  if (!aiForm.topic.trim()) {
    statusNotice.value = 'Vui lòng nhập chủ đề câu hỏi.';
    return;
  }
  isGeneratingAi.value = true;
  statusNotice.value = 'Đang kết nối AI sinh câu hỏi, vui lòng chờ trong giây lát...';
  try {
    const res = await api.generateAiQuestions({
      topic: aiForm.topic,
      count: aiForm.count,
      difficulty: aiForm.difficulty,
      apiKey: aiForm.apiKey || undefined,
      autoPublish: aiForm.autoPublish,
    });
    aiGeneratedQuestions.value = res.questions || [];
    statusNotice.value = `Đã sinh thành công ${res.questions?.length || 0} câu hỏi bằng AI!`;
    if (aiForm.autoPublish) {
      await loadQuestions();
    }
  } catch (err: any) {
    statusNotice.value = `Lỗi sinh câu hỏi: ${err.message}`;
  } finally {
    isGeneratingAi.value = false;
  }
}

async function handleSaveAiQuestions() {
  if (aiGeneratedQuestions.value.length === 0) return;
  isSavingAi.value = true;
  try {
    const res = await api.saveAiQuestions({
      questions: aiGeneratedQuestions.value,
      autoPublish: true,
    });
    statusNotice.value = `Đã lưu thành công ${res.savedCount} câu hỏi vào ngân hàng!`;
    await loadQuestions();
  } catch (err: any) {
    statusNotice.value = `Lỗi lưu câu hỏi: ${err.message}`;
  } finally {
    isSavingAi.value = false;
  }
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

async function saveGiftMapping() {
  gifts.value = await api.upsertGift({ ...giftForm });
  statusNotice.value = `Đã lưu cấu hình quà tặng ${giftForm.giftName}`;
  giftForm.giftId = '';
  giftForm.giftName = '';
  giftForm.rewardType = 'POINTS';
  giftForm.rewardPoints = 100;
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

.gift-row,
.review-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  background: rgba(8, 12, 28, 0.72);
  border: 1px solid var(--border-subtle);
}

.gift-id-tag {
  margin-left: 0.5rem;
  font-size: 0.76rem;
  color: var(--accent-cyan);
}

.gift-row p,
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

/* AI Question Generator Styles */
.topic-suggestions {
  margin-top: 0.35rem;
}
.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}
.chip-btn {
  padding: 0.28rem 0.6rem;
  font-size: 0.76rem;
  font-weight: 600;
  border-radius: 999px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.15s;
}
.chip-btn:hover {
  background: #334155;
  border-color: #38bdf8;
  color: #38bdf8;
}

.empty-ai-state {
  padding: 3rem 1.5rem;
  text-align: center;
  border: 2px dashed rgba(148, 163, 184, 0.2);
  border-radius: 1rem;
  color: #94a3b8;
}
.empty-icon {
  font-size: 2.8rem;
  margin-bottom: 0.5rem;
}
.empty-ai-state h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 0.35rem;
}

.ai-questions-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  max-height: 720px;
  overflow-y: auto;
  padding-right: 0.35rem;
}
.ai-q-card {
  padding: 0.85rem 1rem;
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.ai-q-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  font-weight: 800;
}
.q-number {
  color: #38bdf8;
}
.ai-q-content {
  font-size: 0.95rem;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.45;
}
.ai-q-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.4rem;
}
.ai-opt-item {
  padding: 0.4rem 0.65rem;
  font-size: 0.84rem;
  border-radius: 0.45rem;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.35rem;
}
.ai-opt-item.correct {
  background: rgba(16, 185, 129, 0.18);
  border-color: #10b981;
  color: #a7f3d0;
  font-weight: 700;
}
.correct-badge {
  font-size: 0.7rem;
  padding: 0.1rem 0.35rem;
  border-radius: 0.25rem;
  background: #059669;
  color: #fff;
}
.ai-q-exp {
  font-size: 0.8rem;
  color: #94a3b8;
  border-top: 1px dashed rgba(148, 163, 184, 0.15);
  padding-top: 0.35rem;
}

@media (max-width: 900px) {
  .admin-page {
    padding: 1rem 0.85rem 2.5rem;
  }

  .ai-q-options {
    grid-template-columns: 1fr;
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
