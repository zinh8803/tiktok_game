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

class StageScene extends Phaser.Scene {
  private graphics!: Phaser.GameObjects.Graphics;
  private ambientParticles: FloatingParticle[] = [];
  private burstParticles: BurstParticle[] = [];
  private elapsed = 0;
  private primaryColor = 0x00f0ff;
  private secondaryColor = 0x9333ea;
  private spotlightIntensity = 0.14;

  constructor() {
    super({ key: 'StageScene' });
  }

  create() {
    this.graphics = this.add.graphics();
    const w = this.scale.width;
    const h = this.scale.height;

    this.ambientParticles = Array.from({ length: 42 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -0.25 - Math.random() * 0.45,
      radius: 1.5 + Math.random() * 2.8,
      alpha: 0.15 + Math.random() * 0.4,
      color: Math.random() > 0.45 ? 0x00f0ff : 0xc084fc,
    }));

    this.scale.on('resize', () => {
      // Responsive stage resize
    });
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

  public spawnFireworks(count = 3) {
    const w = this.scale.width;
    const h = this.scale.height;
    const palette = [0x00f0ff, 0xfacc15, 0xc084fc, 0x34d399, 0xfb7185];

    for (let b = 0; b < count; b++) {
      const cx = w * (0.2 + Math.random() * 0.6);
      const cy = h * (0.18 + Math.random() * 0.38);
      const color = palette[b % palette.length];

      for (let i = 0; i < 36; i++) {
        const angle = (Math.PI * 2 * i) / 36 + (Math.random() - 0.5) * 0.15;
        const speed = 2.2 + Math.random() * 5.2;
        this.burstParticles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 0.06,
          size: 3 + Math.random() * 3.5,
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
    const palette = [0xfacc15, 0x00f0ff, 0xf59e0b, 0x34d399, 0xe879f9];

    for (let i = 0; i < 75; i++) {
      this.burstParticles.push({
        x: Math.random() * w,
        y: -15 - Math.random() * 60,
        vx: (Math.random() - 0.5) * 3.2,
        vy: 2 + Math.random() * 4.2,
        gravity: 0.035,
        size: 5 + Math.random() * 5,
        alpha: 1,
        color: palette[i % palette.length],
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.15,
        shape: 'rect',
      });
    }
  }

  update(_time: number, delta: number) {
    this.elapsed += delta * 0.001;
    const w = this.scale.width;
    const h = this.scale.height;

    this.graphics.clear();

    // 1. Sweeping studio spotlights from top corners
    const leftAngle = Math.sin(this.elapsed * 0.8) * 0.18;
    const rightAngle = Math.cos(this.elapsed * 0.7) * 0.18;

    this.graphics.fillStyle(this.primaryColor, this.spotlightIntensity * 0.45);
    this.graphics.beginPath();
    this.graphics.moveTo(w * 0.15, 0);
    this.graphics.lineTo(w * (0.35 + leftAngle), h);
    this.graphics.lineTo(w * (0.05 + leftAngle), h);
    this.graphics.closePath();
    this.graphics.fillPath();

    this.graphics.fillStyle(this.secondaryColor, this.spotlightIntensity * 0.45);
    this.graphics.beginPath();
    this.graphics.moveTo(w * 0.85, 0);
    this.graphics.lineTo(w * (0.95 + rightAngle), h);
    this.graphics.lineTo(w * (0.65 + rightAngle), h);
    this.graphics.closePath();
    this.graphics.fillPath();

    // 2. Subtle stage horizon lines at the bottom
    const horizonY = h * 0.82;
    this.graphics.lineStyle(1, this.primaryColor, 0.12);
    for (let i = 0; i < 5; i++) {
      const y = horizonY + i * ((h - horizonY) / 5);
      this.graphics.lineBetween(0, y, w, y);
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

    // 4. Fireworks & Confetti burst particles
    for (let i = this.burstParticles.length - 1; i >= 0; i--) {
      const bp = this.burstParticles[i];
      bp.x += bp.vx;
      bp.y += bp.vy;
      bp.vy += bp.gravity;
      bp.rotation += bp.vRot;
      bp.alpha -= 0.011;

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

  public triggerFireworks(count = 3) {
    this.scene?.spawnFireworks(count);
  }

  public triggerConfetti() {
    this.scene?.spawnConfettiShower();
  }

  public destroy() {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
      this.scene = null;
    }
  }
}

