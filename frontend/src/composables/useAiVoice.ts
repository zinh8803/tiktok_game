import { ref, reactive, computed, watch } from 'vue';

const STORAGE_KEY_ENABLED = 'kb_voice_enabled';
const STORAGE_KEY_VOLUME = 'kb_voice_volume';
const STORAGE_KEY_RATE = 'kb_voice_rate';
const STORAGE_KEY_PITCH = 'kb_voice_pitch';
const STORAGE_KEY_VOICE_URI = 'kb_voice_uri_v2';
const STORAGE_KEY_READ_OPTIONS = 'kb_voice_read_options';
const STORAGE_KEY_READ_EXP = 'kb_voice_read_exp';
const SPEECH_DEDUP_KEY = 'kb_speech_last_spoken';

/**
 * Khóa chống vọng âm đa tab (Cross-tab deduplication):
 * Khi mở đồng thời 2 tab (ví dụ 1 tab Admin và 1 tab OBS/Game), cả 2 tab đều nhận socket event.
 * Hàm này kiểm tra: nếu CÙNG MỘT CÂU NÓI đã được phát trong vòng 2 giây qua ở bất kỳ tab nào,
 * tab sau sẽ tự động bỏ qua, triệt tiêu 100% hiện tượng vọng âm đè tiếng.
 */
function isDuplicateSpeech(text: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(SPEECH_DEDUP_KEY);
    const now = Date.now();
    if (raw) {
      const last = JSON.parse(raw);
      if (last.text === text && now - last.timestamp < 2000) {
        return true;
      }
    }
    localStorage.setItem(
      SPEECH_DEDUP_KEY,
      JSON.stringify({
        text,
        timestamp: now,
      }),
    );
    return false;
  } catch {
    return false;
  }
}

// Tự động mở khóa chính sách Autoplay của trình duyệt khi người dùng chạm hoặc bấm bất kỳ đâu
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    try {
      const silent = new Audio(
        'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
      );
      silent.play().catch(() => {});
    } catch {}
  };
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
  window.addEventListener('click', unlockAudio, { passive: true });
}

// Reactive Shared State
const voiceEnabled = ref<boolean>(
  typeof window !== 'undefined'
    ? localStorage.getItem(STORAGE_KEY_ENABLED) !== 'false'
    : true,
);

const voiceVolume = ref<number>(
  typeof window !== 'undefined'
    ? Number(localStorage.getItem(STORAGE_KEY_VOLUME)) || 0.95
    : 0.95,
);

const voiceRate = ref<number>(
  typeof window !== 'undefined'
    ? Number(localStorage.getItem(STORAGE_KEY_RATE)) || 1.1
    : 1.1,
);

const voicePitch = ref<number>(
  typeof window !== 'undefined'
    ? Number(localStorage.getItem(STORAGE_KEY_PITCH)) || 1.0
    : 1.0,
);

const readOptions = ref<boolean>(
  typeof window !== 'undefined'
    ? localStorage.getItem(STORAGE_KEY_READ_OPTIONS) === 'true'
    : false,
);

const readExplanation = ref<boolean>(
  typeof window !== 'undefined'
    ? localStorage.getItem(STORAGE_KEY_READ_EXP) !== 'false'
    : true,
);

const selectedVoiceURI = ref<string>(
  typeof window !== 'undefined'
    ? localStorage.getItem(STORAGE_KEY_VOICE_URI) || 'google-translate-vi'
    : 'google-translate-vi',
);

const availableVoices = ref<SpeechSynthesisVoice[]>([]);
const isSpeaking = ref<boolean>(false);

// Audio element state for online Google Translate TTS
let currentAudio: HTMLAudioElement | null = null;
let isAudioPlaying = false;

function stopAudio() {
  isAudioPlaying = false;
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.src = '';
    } catch {}
    currentAudio = null;
  }
}

function updateVoiceList() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const allVoices = window.speechSynthesis.getVoices();
  const viVoices = allVoices.filter(
    (v) =>
      v.lang.toLowerCase().startsWith('vi') ||
      v.name.toLowerCase().includes('vietnam') ||
      v.name.toLowerCase().includes('vietnamese'),
  );

  availableVoices.value = viVoices.length > 0 ? viVoices : allVoices;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  updateVoiceList();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = updateVoiceList;
  }
}

/**
 * Danh sách các giọng đọc Tiếng Việt phong phú (Trực tuyến + Presets + Hệ thống)
 */
export interface AiVoiceOption {
  voiceURI: string;
  name: string;
  type: 'google' | 'preset' | 'system';
}

const defaultVoiceOptions: AiVoiceOption[] = [
  { voiceURI: 'google-translate-vi', name: '🤖 Chị Google TikTok (Trực Tuyến - Quốc Dân)', type: 'google' },
  { voiceURI: 'preset-nu-mc', name: '👩 Nữ MC Truyền Hình (Trong trẻo, tự nhiên)', type: 'preset' },
  { voiceURI: 'preset-nam-mc', name: '👨 Nam MC Đĩnh Đạc (Trầm ấm, lôi cuốn)', type: 'preset' },
  { voiceURI: 'preset-cute', name: '🌸 Cô Nàng Kẹo Ngọt (Anime dễ thương)', type: 'preset' },
  { voiceURI: 'preset-fast', name: '⚡ MC Thần Tốc (Đọc nhanh, nhịp live cuốn)', type: 'preset' },
  { voiceURI: 'preset-robot', name: '👾 Giọng Robot Hài Hước (Biến âm game show)', type: 'preset' },
];

export function useAiVoice() {
  // Sync to localStorage
  watch(voiceEnabled, (v) => localStorage.setItem(STORAGE_KEY_ENABLED, String(v)));
  watch(voiceVolume, (v) => localStorage.setItem(STORAGE_KEY_VOLUME, String(v)));
  watch(voiceRate, (v) => localStorage.setItem(STORAGE_KEY_RATE, String(v)));
  watch(voicePitch, (v) => localStorage.setItem(STORAGE_KEY_PITCH, String(v)));
  watch(readOptions, (v) => localStorage.setItem(STORAGE_KEY_READ_OPTIONS, String(v)));
  watch(readExplanation, (v) => localStorage.setItem(STORAGE_KEY_READ_EXP, String(v)));
  watch(selectedVoiceURI, (v) => localStorage.setItem(STORAGE_KEY_VOICE_URI, v));

  function stop() {
    stopAudio();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    isSpeaking.value = false;
  }

  /**
   * Phát âm thanh qua Endpoint TTS Tiếng Việt (/api/tts - Chị Google chuẩn 100%)
   */
  function playTtsAudio(cleanText: string, onEnd?: () => void, speedMultiplier = 1.0) {
    stopAudio();
    isSpeaking.value = true;
    isAudioPlaying = true;

    const url = `/api/tts?text=${encodeURIComponent(cleanText)}&lang=vi`;
    const audio = new Audio(url);
    currentAudio = audio;
    audio.volume = Math.max(0, Math.min(1, voiceVolume.value));
    audio.playbackRate = Math.max(0.7, Math.min(1.6, voiceRate.value * speedMultiplier));

    audio.onended = () => {
      isSpeaking.value = false;
      isAudioPlaying = false;
      currentAudio = null;
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      console.warn('[useAiVoice] /api/tts endpoint failed');
      isSpeaking.value = false;
      isAudioPlaying = false;
      currentAudio = null;
      // CHỈ fallback sang Web Speech API NẾU máy có sẵn giọng Tiếng Việt thật!
      // Tuyệt đối KHÔNG dùng giọng tiếng Anh (như Microsoft David) đọc tiếng Việt!
      const viVoices = availableVoices.value.filter(
        (v) =>
          v.lang.toLowerCase().startsWith('vi') ||
          v.name.toLowerCase().includes('vietnam') ||
          v.name.toLowerCase().includes('vietnamese'),
      );
      if (viVoices.length > 0) {
        speakWithSpeechSynthesis(cleanText, onEnd);
      } else if (onEnd) {
        onEnd();
      }
    };

    audio.play().catch((err) => {
      console.warn('[useAiVoice] audio.play() blocked by browser autoplay policy or failed:', err);
      isSpeaking.value = false;
      isAudioPlaying = false;
      currentAudio = null;
      // Nếu bị chặn autoplay của trình duyệt do chưa click vào tab: tự động phát ngay khi click/chạm
      if (err?.name === 'NotAllowedError') {
        const unlockAndPlay = () => {
          window.removeEventListener('pointerdown', unlockAndPlay);
          window.removeEventListener('click', unlockAndPlay);
          window.removeEventListener('keydown', unlockAndPlay);
          playTtsAudio(cleanText, onEnd, speedMultiplier);
        };
        window.addEventListener('pointerdown', unlockAndPlay, { once: true });
        window.addEventListener('click', unlockAndPlay, { once: true });
        window.addEventListener('keydown', unlockAndPlay, { once: true });
      } else if (onEnd) {
        onEnd();
      }
    });
  }

  /**
   * Phát âm thanh qua Web Speech API (Nội tuyến)
   */
  function speakWithSpeechSynthesis(cleanText: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const viVoices = availableVoices.value.filter(
      (v) =>
        v.lang.toLowerCase().startsWith('vi') ||
        v.name.toLowerCase().includes('vietnam') ||
        v.name.toLowerCase().includes('vietnamese'),
    );

    // BẮT BUỘC: Nếu Windows/trình duyệt không có giọng Tiếng Việt, HỦY NGAY!
    // Tránh việc trình duyệt tự động fallback sang Microsoft David đọc lơ lớ tiếng Anh!
    if (viVoices.length === 0) {
      console.warn('[useAiVoice] Hệ thống không có giọng Tiếng Việt cài sẵn, bỏ qua SpeechSynthesis.');
      isSpeaking.value = false;
      if (onEnd) onEnd();
      return;
    }

    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.volume = Math.max(0, Math.min(1, voiceVolume.value));
    utter.lang = 'vi-VN';

    let effRate = voiceRate.value;
    let effPitch = voicePitch.value;

    const femaleVi =
      viVoices.find(
        (v) =>
          v.name.includes('HoaiMy') ||
          v.name.includes('Google') ||
          v.name.toLowerCase().includes('female'),
      ) || viVoices[0];

    const maleVi =
      viVoices.find(
        (v) =>
          v.name.includes('NamMinh') ||
          v.name.toLowerCase().includes('male'),
      ) || viVoices[0];

    if (selectedVoiceURI.value === 'preset-nu-mc') {
      if (femaleVi) utter.voice = femaleVi;
      effPitch = 1.15;
      effRate = voiceRate.value * 1.05;
    } else if (selectedVoiceURI.value === 'preset-nam-mc') {
      if (maleVi) utter.voice = maleVi;
      effPitch = 0.85;
      effRate = voiceRate.value * 1.0;
    } else if (selectedVoiceURI.value === 'preset-cute') {
      if (femaleVi) utter.voice = femaleVi;
      effPitch = 1.35;
      effRate = voiceRate.value * 1.12;
    } else if (selectedVoiceURI.value === 'preset-fast') {
      if (femaleVi) utter.voice = femaleVi;
      effPitch = 1.05;
      effRate = Math.min(1.6, voiceRate.value * 1.3);
    } else if (selectedVoiceURI.value === 'preset-robot') {
      effPitch = 0.65;
      effRate = voiceRate.value * 0.95;
    } else if (selectedVoiceURI.value && selectedVoiceURI.value !== 'google-translate-vi') {
      const match = availableVoices.value.find((v) => v.voiceURI === selectedVoiceURI.value);
      if (match) utter.voice = match;
    } else if (femaleVi) {
      utter.voice = femaleVi;
    }

    utter.pitch = Math.max(0.6, Math.min(1.6, effPitch));
    utter.rate = Math.max(0.7, Math.min(1.6, effRate));

    utter.onstart = () => {
      isSpeaking.value = true;
    };
    utter.onend = () => {
      isSpeaking.value = false;
      if (onEnd) onEnd();
    };
    utter.onerror = () => {
      isSpeaking.value = false;
    };

    window.speechSynthesis.speak(utter);
  }

  function speak(text: string, onEnd?: () => void) {
    if (!voiceEnabled.value || typeof window === 'undefined') {
      return;
    }

    const cleanText = text.replace(/[*_#`]/g, '').trim();
    if (!cleanText) return;

    // Chống vọng âm đa tab: nếu chính xác câu này vừa được phát trong vòng 2 giây qua ở bất kỳ tab nào, bỏ qua
    if (isDuplicateSpeech(cleanText)) {
      console.log('[useAiVoice] Đã có tab khác vừa đọc câu này, bỏ qua để chống vọng âm:', cleanText);
      if (onEnd) onEnd();
      return;
    }

    stop();

    const viVoices = availableVoices.value.filter(
      (v) =>
        v.lang.toLowerCase().startsWith('vi') ||
        v.name.toLowerCase().includes('vietnam') ||
        v.name.toLowerCase().includes('vietnamese'),
    );

    const isGoogleTts = selectedVoiceURI.value === 'google-translate-vi';
    const isPreset = selectedVoiceURI.value.startsWith('preset-');
    const hasViSystemVoice = viVoices.length > 0;

    // Nếu chọn Chị Google, chọn Preset, hoặc MÁY KHÔNG CÓ GIỌNG TIẾNG VIỆT HỆ THỐNG:
    // BẮT BUỘC dùng /api/tts để luôn luôn đọc tiếng Việt chuẩn, không bao giờ im lặng!
    if (!hasViSystemVoice || isGoogleTts || isPreset) {
      let speedMult = 1.0;
      if (selectedVoiceURI.value === 'preset-cute') speedMult = 1.15;
      else if (selectedVoiceURI.value === 'preset-fast') speedMult = 1.35;
      else if (selectedVoiceURI.value === 'preset-nam-mc') speedMult = 0.95;
      else if (selectedVoiceURI.value === 'preset-robot') speedMult = 0.9;
      playTtsAudio(cleanText, onEnd, speedMult);
      return;
    }

    // Nếu có giọng tiếng Việt hệ thống (HoaiMy, NamMinh) hoặc chọn trực tiếp giọng hệ thống: dùng Web Speech API
    speakWithSpeechSynthesis(cleanText, onEnd);
  }

  /**
   * Đọc số câu hỏi khi bắt đầu vòng (chỉ đọc số câu theo kịch bản live TikTok)
   */
  function speakQuestion(params: {
    index?: number;
    content?: string;
    options?: Record<string, string>;
  }) {
    if (!voiceEnabled.value) return;

    // params.index được truyền từ payload.questionIndex (đã là số thứ tự 1-based: 1, 2, 3...)
    // Nếu index <= 0 (0-based) thì cộng 1, còn nếu >= 1 thì giữ nguyên chuẩn số câu
    let num = 1;
    if (typeof params.index === 'number') {
      num = params.index > 0 ? params.index : params.index + 1;
    }
    const script = `Câu số ${num}!`;
    speak(script);
  }

  /**
   * Đọc kết quả khi hết giờ: đáp án đúng, số người đúng và tên người trả lời nhanh nhất
   */
  function speakResult(params: {
    correctOption: string;
    correctContent?: string;
    explanation?: string;
    correctCount?: number;
    fastestPlayerName?: string;
  }) {
    if (!voiceEnabled.value) return;

    let script = `Hết giờ! Đáp án đúng là ${params.correctOption}. `;

    const count = Number(params.correctCount || 0);
    if (count > 0) {
      script += `Có ${count} bạn trả lời chính xác. `;
      if (params.fastestPlayerName) {
        script += `Nhanh nhất là bạn ${params.fastestPlayerName}!`;
      }
    } else {
      script += 'Không có bạn nào trả lời đúng.';
    }

    speak(script);
  }

  /**
   * Đọc chúc mừng người chiến thắng chung cuộc
   */
  function speakWinner(winner: { nickname: string; score: number }) {
    if (!voiceEnabled.value) return;
    const script = `Xin nhiệt liệt chúc mừng bạn ${winner.nickname} đã xuất sắc giành ngôi vị quán quân Đấu Trường Tri Thức với ${winner.score} điểm!`;
    speak(script);
  }

  /**
   * Thử giọng đọc mẫu theo đúng kịch bản hết giờ
   */
  function testVoice() {
    speak('Hết giờ! Đáp án đúng là A. Có 15 bạn trả lời chính xác. Nhanh nhất là bạn Minh Anh!');
  }

  const vietnameseVoices = computed<AiVoiceOption[]>(() => {
    const systemVi = availableVoices.value
      .filter(
        (v) =>
          v.lang.toLowerCase().startsWith('vi') ||
          v.name.toLowerCase().includes('vietnam') ||
          v.name.toLowerCase().includes('vietnamese'),
      )
      .map((v) => ({
        voiceURI: v.voiceURI,
        name: `🇻🇳 Hệ thống: ${v.name}`,
        type: 'system' as const,
      }));

    return [...defaultVoiceOptions, ...systemVi];
  });

  const settings = reactive({
    get enabled() {
      return voiceEnabled.value;
    },
    set enabled(v: boolean) {
      voiceEnabled.value = v;
    },
    get volume() {
      return voiceVolume.value;
    },
    set volume(v: number) {
      voiceVolume.value = v;
    },
    get rate() {
      return voiceRate.value;
    },
    set rate(v: number) {
      voiceRate.value = v;
    },
    get pitch() {
      return voicePitch.value;
    },
    set pitch(v: number) {
      voicePitch.value = v;
    },
    get readOptions() {
      return readOptions.value;
    },
    set readOptions(v: boolean) {
      readOptions.value = v;
    },
    get readExplanation() {
      return readExplanation.value;
    },
    set readExplanation(v: boolean) {
      readExplanation.value = v;
    },
    get voiceURI() {
      return selectedVoiceURI.value;
    },
    set voiceURI(v: string) {
      selectedVoiceURI.value = v;
    },
  });

  return {
    settings,
    vietnameseVoices,
    voiceEnabled,
    voiceVolume,
    voiceRate,
    voicePitch,
    readOptions,
    readExplanation,
    selectedVoiceURI,
    availableVoices,
    isSpeaking,
    stop,
    speak,
    speakQuestion,
    speakResult,
    speakWinner,
    testVoice,
  };
}
