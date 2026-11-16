import Phaser from 'phaser';

interface FloatingParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: number;
}

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  size: number;
  alpha: number;
  color: number;
  rotation: number;
  vRot: number;
  shape: 'circle' | 'rect';
}

interface ShockwaveRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: number;
  lineWidth: number;
}

class StageScene extends Phaser.Scene {
  private graphics!: Phaser.GameObjects.Graphics;
  private ambientParticles: FloatingParticle[] = [];
  private burstParticles: BurstParticle[] = [];
  private shockwaveRings: ShockwaveRing[] = [];
  private elapsed = 0;
  private primaryColor = 0xff75a0;
  private secondaryColor = 0xa855f7;
  private spotlightIntensity = 0.22;
  private spotlightBoostUntil = 0;
  private visualStyle: 'cute' | 'modern' | 'galaxy' | 'luxury' = 'cute';

  constructor() {
    super({ key: 'StageScene' });
  }

  create() {
    this.graphics = this.add.graphics();
    this.rebuildAmbientParticles();

    this.scale.on('resize', () => {
      // Responsive stage resize
    });
  }

  private getStylePalette(): number[] {
    if (this.visualStyle === 'cute') {
      return [0xff6b9d, 0xc084fc, 0x38bdf8, 0xfbbf24, 0x34d399];
    }
    if (this.visualStyle === 'modern') {
      return [0x38bdf8, 0x818cf8, 0xf472b6, 0x2dd4bf, 0xfacc15];
    }
    if (this.visualStyle === 'luxury') {
      return [0xfacc15, 0xfbbf24, 0xf59e0b, 0xfef08a, 0x38bdf8];
    }
    return [0x00f0ff, 0xc084fc, 0xfacc15, 0x34d399, 0xfb7185];
  }

  private rebuildAmbientParticles() {
    const w = this.scale?.width || 1080;
    const h = this.scale?.height || 1920;
    const palette = this.getStylePalette();
    const isCute = this.visualStyle === 'cute';

    this.ambientParticles = Array.from({ length: isCute ? 36 : 42 }, (_, idx) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -0.25 - Math.random() * 0.45,
      radius: isCute ? 3 + Math.random() * 5 : 1.5 + Math.random() * 2.8,
      alpha: isCute ? 0.18 + Math.random() * 0.28 : 0.15 + Math.random() * 0.4,
      color: palette[idx % palette.length],
    }));
  }

  public setVisualStyle(style: 'cute' | 'modern' | 'galaxy' | 'luxury') {
    this.visualStyle = style;
    if (style === 'cute') {
      this.primaryColor = 0xff75a0;
      this.secondaryColor = 0xa78bfa;
      this.spotlightIntensity = 0.11;
    } else if (style === 'modern') {
      this.primaryColor = 0x38bdf8;
      this.secondaryColor = 0x6366f1;
      this.spotlightIntensity = 0.15;
    } else if (style === 'luxury') {
      this.primaryColor = 0xfacc15;
      this.secondaryColor = 0xd97706;
      this.spotlightIntensity = 0.16;
    } else {
      this.primaryColor = 0x00f0ff;
      this.secondaryColor = 0x9333ea;
      this.spotlightIntensity = 0.16;
    }
    this.rebuildAmbientParticles();
  }

  public setThemeMode(mode: 'WAITING' | 'QUESTION' | 'URGENT' | 'REVEAL' | 'VICTORY') {
    if (mode === 'WAITING') {
      this.primaryColor = 0x00f0ff;
      this.secondaryColor = 0x9333ea;
      this.spotlightIntensity = 0.13;
    } else if (mode === 'QUESTION') {
      this.primaryColor = 0x00f0ff;
      this.secondaryColor = 0x7e22ce;
      this.spotlightIntensity = 0.16;
    } else if (mode === 'URGENT') {
      this.primaryColor = 0xf43f5e;
      this.secondaryColor = 0xf59e0b;
      this.spotlightIntensity = 0.2;
    } else if (mode === 'REVEAL') {
      this.primaryColor = 0x10b981;
      this.secondaryColor = 0xfacc15;
      this.spotlightIntensity = 0.18;
    } else if (mode === 'VICTORY') {
      this.primaryColor = 0xfacc15;
      this.secondaryColor = 0x00f0ff;
      this.spotlightIntensity = 0.22;
    }
  }

  public spawnFireworks(count = 5) {
    const w = this.scale.width;
    const h = this.scale.height;
    const palette = [0x00f0ff, 0xfacc15, 0xff4785, 0xc084fc, 0x34d399, 0xfb7185];
    this.spotlightBoostUntil = this.elapsed + 4.0;

    for (let b = 0; b < count; b++) {
      const cx = w * (0.14 + Math.random() * 0.72);
      const cy = h * (0.2 + Math.random() * 0.55);
      const color = palette[b % palette.length];

      this.shockwaveRings.push({
        x: cx,
        y: cy,
        radius: 10,
        maxRadius: Math.min(w, h) * 0.36,
        alpha: 0.9,
        color,
        lineWidth: 4,
      });

      for (let i = 0; i < 48; i++) {
        const angle = (Math.PI * 2 * i) / 48 + (Math.random() - 0.5) * 0.15;
        const speed = 2.8 + Math.random() * 6.8;
        this.burstParticles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 0.055,
          size: 4 + Math.random() * 4.5,
          alpha: 1,
          color,
          rotation: 0,
          vRot: 0,
          shape: 'circle',
        });
      }
    }
  }

  public spawnConfettiShower() {
    const w = this.scale.width;
    const h = this.scale.height;
    const palette = [0xfacc15, 0x00f0ff, 0xff4785, 0xf59e0b, 0x34d399, 0xe879f9];
    this.spotlightBoostUntil = this.elapsed + 4.5;

    this.shockwaveRings.push({
      x: w * 0.5,
      y: h * 0.45,
      radius: 16,
      maxRadius: Math.max(w, h) * 0.55,
      alpha: 0.95,
      color: 0xfacc15,
      lineWidth: 5,
    });

    for (let i = 0; i < 110; i++) {
      this.burstParticles.push({
        x: Math.random() * w,
        y: -15 - Math.random() * 120,
        vx: (Math.random() - 0.5) * 4.2,
        vy: 2.5 + Math.random() * 5.2,
        gravity: 0.035,
        size: 6 + Math.random() * 6,
        alpha: 1,
        color: palette[i % palette.length],
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.18,
        shape: 'rect',
      });
    }
  }

  public triggerStageGiftEffect(effectType = 'FIREWORKS') {
    this.spotlightBoostUntil = this.elapsed + 4.8;
    const w = this.scale.width;
    const h = this.scale.height;

    // Vòng sóng hào quang lan tỏa từ chính giữa sân khấu
    this.shockwaveRings.push({
      x: w * 0.5,
      y: h * 0.46,
      radius: 18,
      maxRadius: Math.max(w, h) * 0.65,
      alpha: 0.95,
      color: effectType === 'SHARED_HINT' ? 0xfacc15 : 0x00f0ff,
      lineWidth: 6,
    });

    if (effectType === 'CONFETTI_SHOWER') {
      this.spawnConfettiShower();
      setTimeout(() => this.spawnConfettiShower(), 900);
    } else if (effectType === 'STAGE_LIGHTS' || effectType === 'SHARED_HINT') {
      this.spawnFireworks(4);
      this.spawnConfettiShower();
    } else {
      this.spawnFireworks(5);
      setTimeout(() => this.spawnFireworks(4), 650);
      setTimeout(() => this.spawnFireworks(4), 1350);
    }
  }

  update(_time: number, delta: number) {
    this.elapsed += delta * 0.001;
    const w = this.scale.width;
    const h = this.scale.height;
    const isBoosted = this.elapsed < this.spotlightBoostUntil;

    this.graphics.clear();

    // 1. Sweeping studio spotlights from top & bottom corners
    const speedMult = isBoosted ? 3.2 : 0.85;
    const leftAngle = Math.sin(this.elapsed * speedMult) * (isBoosted ? 0.34 : 0.18);
    const rightAngle = Math.cos(this.elapsed * (speedMult * 0.9)) * (isBoosted ? 0.34 : 0.18);
    const beamAlpha = isBoosted ? 0.32 : this.spotlightIntensity * 0.55;

    this.graphics.fillStyle(this.primaryColor, beamAlpha);
    this.graphics.beginPath();
    this.graphics.moveTo(w * 0.12, 0);
    this.graphics.lineTo(w * (0.4 + leftAngle), h);
    this.graphics.lineTo(w * (0.04 + leftAngle), h);
    this.graphics.closePath();
    this.graphics.fillPath();

    this.graphics.fillStyle(this.secondaryColor, beamAlpha);
    this.graphics.beginPath();
    this.graphics.moveTo(w * 0.88, 0);
    this.graphics.lineTo(w * (0.96 + rightAngle), h);
    this.graphics.lineTo(w * (0.6 + rightAngle), h);
    this.graphics.closePath();
    this.graphics.fillPath();

    if (isBoosted) {
      this.graphics.fillStyle(0xfacc15, 0.24);
      this.graphics.beginPath();
      this.graphics.moveTo(0, h * 0.92);
      this.graphics.lineTo(w * (0.65 - leftAngle), 0);
      this.graphics.lineTo(w * (0.35 - leftAngle), 0);
      this.graphics.closePath();
      this.graphics.fillPath();

      this.graphics.fillStyle(0xff4785, 0.24);
      this.graphics.beginPath();
      this.graphics.moveTo(w, h * 0.92);
      this.graphics.lineTo(w * (0.65 - rightAngle), 0);
      this.graphics.lineTo(w * (0.35 - rightAngle), 0);
      this.graphics.closePath();
      this.graphics.fillPath();
    }

    // 2. Subtle stage horizon lines at the bottom (skip in cute pastel mode)
    if (this.visualStyle !== 'cute') {
      const horizonY = h * 0.82;
      this.graphics.lineStyle(1, this.primaryColor, 0.12);
      for (let i = 0; i < 5; i++) {
        const y = horizonY + i * ((h - horizonY) / 5);
        this.graphics.lineBetween(0, y, w, y);
      }
    }

    // 3. Ambient floating particles
    for (const p of this.ambientParticles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) {
        p.y = h + 10;
        p.x = Math.random() * w;
      }
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;

      this.graphics.fillStyle(p.color, p.alpha);
      this.graphics.fillCircle(p.x, p.y, p.radius);
    }

    // 4. Shockwave rings
    for (let i = this.shockwaveRings.length - 1; i >= 0; i--) {
      const ring = this.shockwaveRings[i];
      ring.radius += (ring.maxRadius - ring.radius) * 0.08 + 5;
      ring.alpha -= 0.018;
      if (ring.alpha <= 0 || ring.radius >= ring.maxRadius) {
        this.shockwaveRings.splice(i, 1);
        continue;
      }
      this.graphics.lineStyle(ring.lineWidth, ring.color, Math.max(0, ring.alpha));
      this.graphics.strokeCircle(ring.x, ring.y, ring.radius);
    }

    // 5. Fireworks & Confetti burst particles
    for (let i = this.burstParticles.length - 1; i >= 0; i--) {
      const bp = this.burstParticles[i];
      bp.x += bp.vx;
      bp.y += bp.vy;
      bp.vy += bp.gravity;
      bp.rotation += bp.vRot;
      bp.alpha -= 0.0095;

      if (bp.alpha <= 0 || bp.y > h + 40) {
        this.burstParticles.splice(i, 1);
        continue;
      }

      this.graphics.fillStyle(bp.color, Math.max(0, bp.alpha));
      if (bp.shape === 'circle') {
        this.graphics.fillCircle(bp.x, bp.y, bp.size);
      } else {
        this.graphics.fillRect(bp.x - bp.size / 2, bp.y - bp.size / 2, bp.size, bp.size * 0.65);
      }
    }
  }
}

export class PhaserStageController {
  private game: Phaser.Game | null = null;
  private scene: StageScene | null = null;

  public mount(container: HTMLElement) {
    if (this.game) {
      this.destroy();
    }

    const scene = new StageScene();
    this.scene = scene;

    this.game = new Phaser.Game({
      type: Phaser.CANVAS,
      parent: container,
      width: container.clientWidth || 1920,
      height: container.clientHeight || 1080,
      transparent: true,
      scene: [scene],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      audio: {
        noAudio: true,
      },
      banner: false,
    });
  }

  public setMode(mode: 'WAITING' | 'QUESTION' | 'URGENT' | 'REVEAL' | 'VICTORY') {
    this.scene?.setThemeMode(mode);
  }

  public setVisualStyle(style: 'cute' | 'modern' | 'galaxy' | 'luxury') {
    this.scene?.setVisualStyle(style);
  }

  public triggerFireworks(count = 3) {
    this.scene?.spawnFireworks(count);
  }

  public triggerConfetti() {
    this.scene?.spawnConfettiShower();
  }

  public triggerStageGiftEffect(effectType = 'FIREWORKS') {
    this.scene?.triggerStageGiftEffect(effectType);
  }

  public destroy() {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
      this.scene = null;
    }
  }
}

