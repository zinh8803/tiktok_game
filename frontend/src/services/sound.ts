/**
 * Bộ tổng hợp âm thanh Game Show (Web Audio API)
 * Không phụ thuộc file âm thanh ngoài, độ trễ bằng 0, tự động mở khóa AudioContext.
 */

class GameSoundService {
  private ctx: AudioContext | null = null;
  private unlockListenersBound = false;

  constructor() {
    this.bindAutoUnlock();
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

  private bindAutoUnlock() {
    if (typeof window === 'undefined' || this.unlockListenersBound) return;
    this.unlockListenersBound = true;

    const unlock = () => {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    };

    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
  }

  /**
   * Phát âm thanh "Tích - Tách" đếm ngược mỗi giây.
   * - Giây chẵn: "Tích" (cao, sắc nét)
   * - Giây lẻ: "Tách" (trầm ấm hơn)
   * - 5 giây cuối (<= 5s): Kết hợp âm báo gấp rút của trường quay Game Show
   */
  public playCountdownTick(remainingSeconds: number) {
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

    const peakVolume = isUrgent ? 0.34 : 0.24;
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
    clickGain.gain.linearRampToValueAtTime(isUrgent ? 0.16 : 0.11, now + 0.002);
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
      // Giây cuối cùng (1s) cao hơn để báo sắp khóa đáp án
      const urgentFreq = remainingSeconds === 1 ? 1046.5 : 880;
      pulseOsc.frequency.setValueAtTime(urgentFreq, now);

      pulseGain.gain.setValueAtTime(0.0001, now);
      pulseGain.gain.linearRampToValueAtTime(0.14, now + 0.01);
      pulseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      pulseOsc.connect(pulseGain);
      pulseGain.connect(ctx.destination);

      pulseOsc.start(now);
      pulseOsc.stop(now + 0.17);
    }
  }

  /**
   * Phát âm thanh "Câu Đúng / Chúc Mừng" khi công bố đáp án và có người trả lời đúng
   * Giai điệu chuông ngân (Chime Arpeggio C5 - E5 - G5 - C6) tươi sáng chuẩn Game Show
   */
  public playCorrectAnswer() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [
      { freq: 523.25, delay: 0.0, duration: 0.28, gain: 0.22 }, // C5
      { freq: 659.25, delay: 0.09, duration: 0.32, gain: 0.24 }, // E5
      { freq: 783.99, delay: 0.18, duration: 0.38, gain: 0.26 }, // G5
      { freq: 1046.5, delay: 0.28, duration: 0.65, gain: 0.32 }, // C6
    ];

    for (const note of notes) {
      const startTime = now + note.delay;

      // Âm chính (Sine + Triangle bell)
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
}

export const soundFX = new GameSoundService();

