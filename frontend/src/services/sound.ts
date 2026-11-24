/**
 * Bộ tổng hợp âm thanh & Nhạc nền Lofi Không Lời (Web Audio API)
 * - Không phụ thuộc file MP3 ngoài, 100% không bản quyền khi phát TikTok LIVE
 * - Có bộ tạo nhạc Lofi Chillhop thời gian thực (Rhodes Jazz Chords, Sub-bass, Soft Lo-Fi Beat, Kalimba Melody)
 * - Hỗ trợ chỉnh âm lượng Nhạc nền (BGM) và Hiệu ứng (SFX) độc lập từ 0% - 100% theo thời gian thực
 */

export type LofiStyle = 'chill-cafe' | 'dreamy-night' | 'pastel-cute';

export const LOFI_STYLE_OPTIONS: Array<{
  id: LofiStyle;
  name: string;
  icon: string;
  desc: string;
}> = [
  {
    id: 'chill-cafe',
    name: 'Lofi Chill Cafe',
    icon: '☕',
    desc: 'Rhodes Jazz êm dịu & nhịp trống Chillhop',
  },
  {
    id: 'dreamy-night',
    name: 'Lofi Đêm Thư Giãn',
    icon: '🌙',
    desc: 'Piano ấm áp & giai điệu sâu lắng',
  },
  {
    id: 'pastel-cute',
    name: 'Lofi Kẹo Ngọt',
    icon: '🌸',
    desc: 'Kalimba trong trẻo & nhịp điệu dễ thương',
  },
];

class GameSoundService {
  private ctx: AudioContext | null = null;
  private unlockListenersBound = false;

  // Cấu hình Âm thanh & Nhạc nền Lofi
  private muted = false;
  private bgmEnabled = true;
  private bgmVolume = 40; // 0 - 100
  private sfxVolume = 80; // 0 - 100
  private lofiStyle: LofiStyle = 'chill-cafe';

  // Node điều khiển âm lượng tổng cho nhạc nền (để kéo thanh trượt mượt tức thì)
  private bgmMasterGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  // Bộ lập lịch (Lookahead Scheduler) cho Lofi BGM
  private isBgmRunning = false;
  private schedulerTimer: ReturnType<typeof setInterval> | null = null;
  private nextStepTime = 0;
  private currentStep = 0; // 0..63 (4 ô nhịp x 16 bước 1/16)

  constructor() {
    this.bindAutoUnlock();
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {
        // Sẽ tự động resume ở lần tương tác kế tiếp
      });
    }
    return this.ctx;
  }

  private ensureBgmMasterGain(ctx: AudioContext): GainNode {
    if (!this.bgmMasterGain) {
      this.bgmMasterGain = ctx.createGain();
      this.bgmMasterGain.gain.setValueAtTime(this.computeEffectiveBgmGain(), ctx.currentTime);
      this.bgmMasterGain.connect(ctx.destination);
    }
    return this.bgmMasterGain;
  }

  private ensureNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer) return this.noiseBuffer;
    const bufferSize = ctx.sampleRate * 1.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    // Tạo Pink/Warm Noise cho tiếng Snare chổi & Vinyl Lofi
    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  private bindAutoUnlock() {
    if (typeof window === 'undefined' || this.unlockListenersBound) return;
    this.unlockListenersBound = true;

    const unlock = () => {
      const ctx = this.getContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().then(() => {
          this.syncBgmPlaybackState();
        }).catch(() => {});
      } else if (ctx) {
        this.syncBgmPlaybackState();
      }
    };

    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
  }

  private computeEffectiveBgmGain(): number {
    if (this.muted || !this.bgmEnabled || this.bgmVolume <= 0) return 0.0001;
    // Quy đổi 0..100 sang đường cong âm lượng tự nhiên (max ~0.48 để không lấn tiếng MC/Streamer)
    const normalized = Math.max(0, Math.min(100, this.bgmVolume)) / 100;
    return Math.max(0.0001, Math.pow(normalized, 1.35) * 0.48);
  }

  private computeEffectiveSfxMultiplier(): number {
    if (this.muted || this.sfxVolume <= 0) return 0;
    return Math.max(0, Math.min(100, this.sfxVolume)) / 100;
  }

  private updateMasterGainSmoothly() {
    if (!this.ctx || !this.bgmMasterGain) return;
    const target = this.computeEffectiveBgmGain();
    this.bgmMasterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.06);
  }

  // ============================================================================
  // PUBLIC API ĐIỀU KHIỂN ÂM LƯỢNG & NHẠC NỀN LOFI
  // ============================================================================

  public setMuted(muted: boolean) {
    this.muted = muted;
    this.updateMasterGainSmoothly();
    this.syncBgmPlaybackState();
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setBgmEnabled(enabled: boolean) {
    this.bgmEnabled = enabled;
    this.updateMasterGainSmoothly();
    this.syncBgmPlaybackState();
  }

  public isBgmEnabled(): boolean {
    return this.bgmEnabled;
  }

  public setBgmVolume(volume: number) {
    this.bgmVolume = Math.max(0, Math.min(100, Math.round(volume)));
    if (this.bgmVolume > 0 && !this.bgmEnabled) {
      this.bgmEnabled = true;
    }
    this.updateMasterGainSmoothly();
    this.syncBgmPlaybackState();
  }

  public getBgmVolume(): number {
    return this.bgmVolume;
  }

  public setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(100, Math.round(volume)));
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public setLofiStyle(style: LofiStyle) {
    if (['chill-cafe', 'dreamy-night', 'pastel-cute'].includes(style)) {
      this.lofiStyle = style;
      // Làm mới hợp âm ở đầu ô nhịp gần nhất
      this.currentStep = this.currentStep - (this.currentStep % 16);
    }
  }

  public getLofiStyle(): LofiStyle {
    return this.lofiStyle;
  }

  public startBgm() {
    this.bgmEnabled = true;
    this.syncBgmPlaybackState();
  }

  public stopBgm() {
    if (this.schedulerTimer) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    this.isBgmRunning = false;
    this.updateMasterGainSmoothly();
  }

  public syncBgmPlaybackState() {
    const shouldPlay = !this.muted && this.bgmEnabled && this.bgmVolume > 0;
    if (!shouldPlay) {
      if (this.schedulerTimer) {
        clearInterval(this.schedulerTimer);
        this.schedulerTimer = null;
      }
      this.isBgmRunning = false;
      this.updateMasterGainSmoothly();
      return;
    }

    const ctx = this.getContext();
    if (!ctx) return;
    this.ensureBgmMasterGain(ctx);
    this.updateMasterGainSmoothly();

    if (!this.isBgmRunning) {
      this.isBgmRunning = true;
      this.nextStepTime = ctx.currentTime + 0.08;
      this.schedulerTimer = setInterval(() => this.scheduleBgmSteps(), 90);
    }
  }

  // ============================================================================
  // BỘ TỔNG HỢP NHẠC NỀN LOFI CHILLHOP (PROCEDURAL LO-FI ENGINE)
  // ============================================================================

  private getStepDuration(): number {
    // Độ dài 1 nốt móc kép (1/16) theo phong cách Lofi
    if (this.lofiStyle === 'dreamy-night') return 0.22; // ~68 BPM
    if (this.lofiStyle === 'pastel-cute') return 0.185; // ~81 BPM
    return 0.2; // ~75 BPM chuẩn Lofi Chillhop
  }

  private scheduleBgmSteps() {
    if (!this.ctx || !this.isBgmRunning) return;
    if (this.ctx.state === 'suspended') return;

    const lookahead = 0.24;
    while (this.nextStepTime < this.ctx.currentTime + lookahead) {
      const step = this.currentStep % 64;
      const stepDur = this.getStepDuration();
      // Tạo độ trễ Swing đặc trưng của Lofi Hip-Hop cho các nốt móc kép lẻ
      const swingOffset = step % 2 === 1 ? stepDur * 0.16 : 0;
      this.triggerLofiStep(step, this.nextStepTime + swingOffset, stepDur);

      this.nextStepTime += stepDur;
      this.currentStep = (this.currentStep + 1) % 64;
    }
  }

  private triggerLofiStep(step: number, time: number, stepDur: number) {
    if (!this.ctx) return;
    const master = this.ensureBgmMasterGain(this.ctx);
    const barIndex = Math.floor(step / 16); // 0, 1, 2, 3
    const stepInBar = step % 16; // 0..15

    // Dữ liệu hòa thanh (Hợp âm Jazz 7th/9th, Bass và Giai điệu) theo từng Style
    const styleData = this.getStyleMusicalData(barIndex);

    // 1. Hợp âm Rhodes / Piano / Kalimba ở phách đầu mỗi ô nhịp (stepInBar === 0)
    // và điểm nhẹ thêm ở phách lơi (stepInBar === 10)
    if (stepInBar === 0) {
      this.playLofiChord(styleData.chord, time, stepDur * 14.5, 1.0, master);
    } else if (stepInBar === 10 && this.lofiStyle !== 'dreamy-night') {
      this.playLofiChord(styleData.chord, time, stepDur * 5.0, 0.48, master);
    }

    // 2. Âm trầm Warm Sub-Bass (Phách 1, Phách 2 rưỡi, Phách 4)
    if (stepInBar === 0) {
      this.playWarmSubBass(styleData.bass, time, stepDur * 5.5, 0.95, master);
    } else if (stepInBar === 6) {
      this.playWarmSubBass(styleData.bass, time, stepDur * 3.2, 0.65, master);
    } else if (stepInBar === 12) {
      this.playWarmSubBass(styleData.bassFifth, time, stepDur * 3.5, 0.72, master);
    }

    // 3. Nhịp trống Lofi Boom-Bap (Soft Kick, Brushed Snare, Dusty Hi-Hat)
    this.triggerLofiDrums(stepInBar, barIndex, time, master);

    // 4. Giai điệu Lofi không lời (Dreamy Bell / Rhodes Lead / Kalimba)
    const melodyNote = styleData.melody[stepInBar];
    if (melodyNote && melodyNote > 0) {
      this.playLofiMelodyNote(melodyNote, time, stepDur * 3.2, master);
    }
  }

  private getStyleMusicalData(barIndex: number): {
    chord: number[];
    bass: number;
    bassFifth: number;
    melody: Record<number, number>;
  } {
    if (this.lofiStyle === 'dreamy-night') {
      // Vòng hợp âm: Am9 -> Fmaj7 -> Cmaj9 -> G6
      const progressions = [
        {
          chord: [220.0, 261.63, 329.63, 392.0, 493.88], // Am9 (A3, C4, E4, G4, B4)
          bass: 110.0, // A2
          bassFifth: 164.81, // E3
          melody: { 2: 659.25, 6: 587.33, 10: 523.25, 14: 493.88 },
        },
        {
          chord: [174.61, 220.0, 261.63, 329.63, 392.0], // Fmaj9 (F3, A3, C4, E4, G4)
          bass: 87.31, // F2
          bassFifth: 130.81, // C3
          melody: { 0: 523.25, 6: 659.25, 12: 587.33 },
        },
        {
          chord: [261.63, 329.63, 392.0, 493.88, 587.33], // Cmaj9 (C4, E4, G4, B4, D5)
          bass: 130.81, // C3
          bassFifth: 98.0, // G2
          melody: { 4: 783.99, 8: 659.25, 12: 523.25 },
        },
        {
          chord: [196.0, 246.94, 293.66, 329.63, 392.0], // G6 (G3, B3, D4, E4, G4)
          bass: 98.0, // G2
          bassFifth: 146.83, // D3
          melody: { 2: 587.33, 6: 523.25, 10: 493.88, 14: 440.0 },
        },
      ];
      return progressions[barIndex % 4];
    }

    if (this.lofiStyle === 'pastel-cute') {
      // Vòng hợp âm tươi sáng: Cmaj9 -> Am7 -> Dm9 -> G13
      const progressions = [
        {
          chord: [261.63, 329.63, 392.0, 493.88, 587.33], // Cmaj9
          bass: 130.81, // C3
          bassFifth: 196.0, // G3
          melody: { 0: 659.25, 3: 783.99, 6: 1046.5, 10: 880.0, 14: 783.99 },
        },
        {
          chord: [220.0, 261.63, 329.63, 392.0, 523.25], // Am7
          bass: 110.0, // A2
          bassFifth: 164.81, // E3
          melody: { 2: 880.0, 6: 783.99, 10: 659.25, 12: 523.25 },
        },
        {
          chord: [293.66, 349.23, 440.0, 523.25, 659.25], // Dm9
          bass: 146.83, // D3
          bassFifth: 110.0, // A2
          melody: { 0: 698.46, 4: 880.0, 8: 783.99, 12: 659.25 },
        },
        {
          chord: [196.0, 293.66, 349.23, 440.0, 523.25], // G9sus4
          bass: 98.0, // G2
          bassFifth: 146.83, // D3
          melody: { 2: 783.99, 6: 880.0, 10: 783.99, 14: 659.25 },
        },
      ];
      return progressions[barIndex % 4];
    }

    // Mặc định: 'chill-cafe' (Vòng Rhodes Jazz kinh điển: Fmaj9 -> Em7 -> Dm9 -> Cmaj9)
    const progressions = [
      {
        chord: [174.61, 220.0, 261.63, 329.63, 392.0], // Fmaj9 (F3, A3, C4, E4, G4)
        bass: 87.31, // F2
        bassFifth: 130.81, // C3
        melody: { 2: 523.25, 6: 659.25, 10: 587.33, 14: 523.25 },
      },
      {
        chord: [164.81, 196.0, 246.94, 293.66, 392.0], // Em7 (E3, G3, B3, D4, G4)
        bass: 82.41, // E2
        bassFifth: 123.47, // B2
        melody: { 4: 587.33, 8: 493.88, 12: 392.0 },
      },
      {
        chord: [146.83, 174.61, 220.0, 261.63, 329.63], // Dm9 (D3, F3, A3, C4, E4)
        bass: 73.42, // D2
        bassFifth: 110.0, // A2
        melody: { 2: 440.0, 6: 523.25, 10: 659.25, 14: 587.33 },
      },
      {
        chord: [130.81, 164.81, 196.0, 246.94, 293.66], // Cmaj9 (C3, E3, G3, B3, D4)
        bass: 65.41, // C2
        bassFifth: 98.0, // G2
        melody: { 0: 523.25, 6: 493.88, 10: 392.0, 14: 440.0 },
      },
    ];
    return progressions[barIndex % 4];
  }

  private playLofiChord(
    freqs: number[],
    time: number,
    duration: number,
    velocity: number,
    destination: AudioNode
  ) {
    if (!this.ctx) return;
    const ctx = this.ctx;

    // Lọc Low-Pass ấm áp đặc trưng của đĩa than / băng từ Lofi
    const chordFilter = ctx.createBiquadFilter();
    chordFilter.type = 'lowpass';
    const cutoff = this.lofiStyle === 'pastel-cute' ? 1350 : 880;
    chordFilter.frequency.setValueAtTime(cutoff, time);
    chordFilter.Q.setValueAtTime(0.8, time);
    chordFilter.connect(destination);

    freqs.forEach((freq, idx) => {
      // Rải nhẹ các nốt hợp âm (Strum 18ms mỗi nốt) để giống tay đàn thật
      const noteStart = time + idx * 0.018;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      // Detune nhẹ tạo hiệu ứng Chorus / Tape Wobble ấm áp
      osc1.frequency.setValueAtTime(freq, noteStart);
      osc2.frequency.setValueAtTime(freq * 1.0025, noteStart);

      const noteAmp = 0.055 * velocity;
      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.linearRampToValueAtTime(noteAmp, noteStart + 0.045);
      gain.gain.exponentialRampToValueAtTime(noteAmp * 0.45, noteStart + duration * 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + duration);

      const triMix = ctx.createGain();
      triMix.gain.setValueAtTime(0.32, noteStart);

      osc1.connect(gain);
      osc2.connect(triMix);
      triMix.connect(gain);
      gain.connect(chordFilter);

      osc1.start(noteStart);
      osc1.stop(noteStart + duration + 0.03);
      osc2.start(noteStart);
      osc2.stop(noteStart + duration + 0.03);
    });
  }

  private playWarmSubBass(
    freq: number,
    time: number,
    duration: number,
    velocity: number,
    destination: AudioNode
  ) {
    if (!this.ctx) return;
    const ctx = this.ctx;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(240, time);

    const amp = 0.16 * velocity;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(amp, time + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    osc.start(time);
    osc.stop(time + duration + 0.02);
  }

  private playLofiMelodyNote(
    freq: number,
    time: number,
    duration: number,
    destination: AudioNode
  ) {
    if (!this.ctx) return;
    const ctx = this.ctx;

    const osc = ctx.createOscillator();
    const harmonic = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    harmonic.type = 'triangle';
    harmonic.frequency.setValueAtTime(freq * 2, time);

    const harmGain = ctx.createGain();
    harmGain.gain.setValueAtTime(this.lofiStyle === 'pastel-cute' ? 0.18 : 0.08, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.065, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    harmonic.connect(harmGain);
    harmGain.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    osc.start(time);
    osc.stop(time + duration + 0.02);
    harmonic.start(time);
    harmonic.stop(time + duration + 0.02);
  }

  private triggerLofiDrums(
    stepInBar: number,
    barIndex: number,
    time: number,
    destination: AudioNode
  ) {
    if (!this.ctx) return;
    const ctx = this.ctx;

    // 1. Tiếng Trống Kick Lofi trầm ấm (Phách 1, phách 2 lơi, phách 3)
    const isKickStep =
      stepInBar === 0 ||
      (stepInBar === 7 && barIndex % 2 === 0) ||
      stepInBar === 8 ||
      (stepInBar === 14 && barIndex === 3);

    if (isKickStep) {
      const kickOsc = ctx.createOscillator();
      const kickGain = ctx.createGain();
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(115, time);
      kickOsc.frequency.exponentialRampToValueAtTime(42, time + 0.09);

      const kickAmp = this.lofiStyle === 'dreamy-night' ? 0.14 : 0.22;
      kickGain.gain.setValueAtTime(0.0001, time);
      kickGain.gain.linearRampToValueAtTime(kickAmp, time + 0.006);
      kickGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);

      kickOsc.connect(kickGain);
      kickGain.connect(destination);
      kickOsc.start(time);
      kickOsc.stop(time + 0.2);
    }

    // 2. Tiếng Snare / Rimshot Lofi dịu nhẹ ở Phách 2 (step 4) và Phách 4 (step 12)
    if (stepInBar === 4 || stepInBar === 12) {
      const noiseBuf = this.ensureNoiseBuffer(ctx);
      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = noiseBuf;

      const snareFilter = ctx.createBiquadFilter();
      snareFilter.type = 'bandpass';
      snareFilter.frequency.setValueAtTime(1100, time);
      snareFilter.Q.setValueAtTime(1.4, time);

      const snareGain = ctx.createGain();
      const snareAmp = this.lofiStyle === 'dreamy-night' ? 0.09 : 0.16;
      snareGain.gain.setValueAtTime(0.0001, time);
      snareGain.gain.linearRampToValueAtTime(snareAmp, time + 0.005);
      snareGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.13);

      noiseSrc.connect(snareFilter);
      snareFilter.connect(snareGain);
      snareGain.connect(destination);

      noiseSrc.start(time, Math.random() * 0.5, 0.15);

      // Thân tiếng gõ gỗ (Rim/Body)
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      bodyOsc.type = 'triangle';
      bodyOsc.frequency.setValueAtTime(210, time);
      bodyOsc.frequency.exponentialRampToValueAtTime(115, time + 0.045);

      bodyGain.gain.setValueAtTime(0.0001, time);
      bodyGain.gain.linearRampToValueAtTime(snareAmp * 0.45, time + 0.003);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.055);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(destination);
      bodyOsc.start(time);
      bodyOsc.stop(time + 0.06);
    }

    // 3. Tiếng Hi-Hat / Shaker mảnh nhẹ mỗi nốt móc đơn (step chẵn + chút đảo phách)
    if (stepInBar % 2 === 0 || stepInBar === 15) {
      const noiseBuf = this.ensureNoiseBuffer(ctx);
      const hatSrc = ctx.createBufferSource();
      hatSrc.buffer = noiseBuf;

      const hatFilter = ctx.createBiquadFilter();
      hatFilter.type = 'highpass';
      hatFilter.frequency.setValueAtTime(4200, time);

      const hatGain = ctx.createGain();
      const hatAmp = stepInBar % 4 === 0 ? 0.045 : 0.028;
      hatGain.gain.setValueAtTime(0.0001, time);
      hatGain.gain.linearRampToValueAtTime(hatAmp, time + 0.003);
      hatGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.042);

      hatSrc.connect(hatFilter);
      hatFilter.connect(hatGain);
      hatGain.connect(destination);

      hatSrc.start(time, Math.random() * 0.8, 0.05);
    }
  }

  // ============================================================================
  // HIỆU ỨNG ÂM THANH GAME SHOW (SFX: ĐẾM NGƯỢC & TRẢ LỜI ĐÚNG)
  // ============================================================================

  /**
   * Phát âm thanh "Tích - Tách" đếm ngược mỗi giây.
   */
  public playCountdownTick(remainingSeconds: number) {
    const sfxMult = this.computeEffectiveSfxMultiplier();
    if (sfxMult <= 0) return;

    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const isTick = remainingSeconds % 2 === 0;
    const isUrgent = remainingSeconds <= 5 && remainingSeconds > 0;

    // 1. Âm "Tích - Tách" cơ học (Woodblock / Studio Clock Click)
    const tickOsc = ctx.createOscillator();
    const tickFilter = ctx.createBiquadFilter();
    const tickGain = ctx.createGain();

    tickOsc.type = 'triangle';
    const startFreq = isTick ? 1320 : 960;
    const endFreq = isTick ? 420 : 310;
    tickOsc.frequency.setValueAtTime(startFreq, now);
    tickOsc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.045);

    tickFilter.type = 'bandpass';
    tickFilter.frequency.setValueAtTime(isTick ? 1200 : 880, now);
    tickFilter.Q.setValueAtTime(3.2, now);

    const peakVolume = (isUrgent ? 0.34 : 0.24) * sfxMult;
    tickGain.gain.setValueAtTime(0.0001, now);
    tickGain.gain.linearRampToValueAtTime(peakVolume, now + 0.004);
    tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);

    tickOsc.connect(tickFilter);
    tickFilter.connect(tickGain);
    tickGain.connect(ctx.destination);

    tickOsc.start(now);
    tickOsc.stop(now + 0.07);

    // Lớp transient sắc nét ở đầu tiếng gõ đồng hồ
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'sine';
    clickOsc.frequency.setValueAtTime(isTick ? 2600 : 1950, now);
    clickOsc.frequency.exponentialRampToValueAtTime(600, now + 0.018);

    clickGain.gain.setValueAtTime(0.0001, now);
    clickGain.gain.linearRampToValueAtTime((isUrgent ? 0.16 : 0.11) * sfxMult, now + 0.002);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);

    clickOsc.start(now);
    clickOsc.stop(now + 0.025);

    // 2. Nếu còn <= 5 giây: bồi thêm nhịp pulse đếm ngược hồi hộp
    if (isUrgent) {
      const pulseOsc = ctx.createOscillator();
      const pulseGain = ctx.createGain();

      pulseOsc.type = 'sine';
      const urgentFreq = remainingSeconds === 1 ? 1046.5 : 880;
      pulseOsc.frequency.setValueAtTime(urgentFreq, now);

      pulseGain.gain.setValueAtTime(0.0001, now);
      pulseGain.gain.linearRampToValueAtTime(0.14 * sfxMult, now + 0.01);
      pulseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      pulseOsc.connect(pulseGain);
      pulseGain.connect(ctx.destination);

      pulseOsc.start(now);
      pulseOsc.stop(now + 0.17);
    }
  }

  /**
   * Phát âm thanh "Câu Đúng / Chúc Mừng" khi công bố đáp án và có người trả lời đúng
   */
  public playCorrectAnswer() {
    const sfxMult = this.computeEffectiveSfxMultiplier();
    if (sfxMult <= 0) return;

    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [
      { freq: 523.25, delay: 0.0, duration: 0.28, gain: 0.22 * sfxMult }, // C5
      { freq: 659.25, delay: 0.09, duration: 0.32, gain: 0.24 * sfxMult }, // E5
      { freq: 783.99, delay: 0.18, duration: 0.38, gain: 0.26 * sfxMult }, // G5
      { freq: 1046.5, delay: 0.28, duration: 0.65, gain: 0.32 * sfxMult }, // C6
    ];

    for (const note of notes) {
      const startTime = now + note.delay;

      const oscMain = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      const noteGain = ctx.createGain();

      oscMain.type = 'triangle';
      oscMain.frequency.setValueAtTime(note.freq, startTime);

      oscHarmonic.type = 'sine';
      oscHarmonic.frequency.setValueAtTime(note.freq * 2, startTime);

      const harmonicGain = ctx.createGain();
      harmonicGain.gain.setValueAtTime(0.28, startTime);

      noteGain.gain.setValueAtTime(0.0001, startTime);
      noteGain.gain.linearRampToValueAtTime(note.gain, startTime + 0.015);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + note.duration);

      oscMain.connect(noteGain);
      oscHarmonic.connect(harmonicGain);
      harmonicGain.connect(noteGain);
      noteGain.connect(ctx.destination);

      oscMain.start(startTime);
      oscMain.stop(startTime + note.duration + 0.02);
      oscHarmonic.start(startTime);
      oscHarmonic.stop(startTime + note.duration + 0.02);
    }
  }

  /**
   * Phát âm thanh bắt đầu trận đấu / mở câu hỏi
   */
  public playStartMatch() {
    const sfxMult = this.computeEffectiveSfxMultiplier();
    if (sfxMult <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [
      { freq: 523.25, delay: 0, dur: 0.1 },
      { freq: 659.25, delay: 0.08, dur: 0.1 },
      { freq: 783.99, delay: 0.16, dur: 0.2 },
      { freq: 1046.5, delay: 0.26, dur: 0.4 },
    ];
    for (const n of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.freq, now + n.delay);
      gain.gain.setValueAtTime(0.24 * sfxMult, now + n.delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.delay + n.dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.delay);
      osc.stop(now + n.delay + n.dur);
    }
  }

  /**
   * Tiếng giật / kéo dây trong Kéo Co
   */
  public playPullRope() {
    const sfxMult = this.computeEffectiveSfxMultiplier();
    if (sfxMult <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(170, now + 0.14);
    gain.gain.setValueAtTime(0.28 * sfxMult, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  /**
   * Tiếng mở lật ô chữ cái Đuổi Hình Bắt Chữ
   */
  public playRevealTile() {
    const sfxMult = this.computeEffectiveSfxMultiplier();
    if (sfxMult <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(1700, now + 0.08);
    gain.gain.setValueAtTime(0.25 * sfxMult, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  /**
   * Tiếng kết thúc vinh danh chiến thắng (Fanfare)
   */
  public playVictoryFanfare() {
    const sfxMult = this.computeEffectiveSfxMultiplier();
    if (sfxMult <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const fanfare = [
      { freq: 523.25, time: 0, dur: 0.12 },
      { freq: 659.25, time: 0.12, dur: 0.12 },
      { freq: 783.99, time: 0.24, dur: 0.12 },
      { freq: 1046.5, time: 0.36, dur: 0.4 },
      { freq: 880.0, time: 0.78, dur: 0.15 },
      { freq: 1046.5, time: 0.95, dur: 0.6 },
    ];
    for (const n of fanfare) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.freq, now + n.time);
      gain.gain.setValueAtTime(0.3 * sfxMult, now + n.time);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.time);
      osc.stop(now + n.time + n.dur);
    }
  }
}

export const soundFX = new GameSoundService();
