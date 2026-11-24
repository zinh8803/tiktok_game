import { computed, reactive, type Ref } from 'vue';
import type { Socket } from 'socket.io-client';

export type StagePresetName = 'fullscreen' | 'tiktok-safe-zone' | 'compact';

export interface StageCalibState {
  preset: StagePresetName;
  maxWidth: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  paddingTop: number;
  paddingBottom: number;
  avatarSize: number;
}

const STORAGE_KEY = 'kb_stage_calib_v1';

const DEFAULT_CALIB: StageCalibState = {
  preset: 'fullscreen',
  maxWidth: 760,
  scale: 100,
  offsetX: 0,
  offsetY: 0,
  paddingTop: 20,
  paddingBottom: 24,
  avatarSize: 34,
};

export function useStageCalib(roomCode: Ref<string> | string, getSocket: () => Socket | null) {
  const calib = reactive<StageCalibState>({ ...DEFAULT_CALIB });

  function saveLocal() {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...calib }));
    } catch {
      /* ignore storage errors */
    }
  }

  function loadLocal() {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const p = JSON.parse(raw);
      if (!p || typeof p !== 'object') return;
      if (p.preset === 'fullscreen' || p.preset === 'tiktok-safe-zone' || p.preset === 'compact') {
        calib.preset = p.preset;
      }
      if (p.maxWidth !== undefined) calib.maxWidth = Number(p.maxWidth) || DEFAULT_CALIB.maxWidth;
      if (p.scale !== undefined) calib.scale = Number(p.scale) || DEFAULT_CALIB.scale;
      if (p.offsetX !== undefined) calib.offsetX = Number(p.offsetX) || 0;
      if (p.offsetY !== undefined) calib.offsetY = Number(p.offsetY) || 0;
      if (p.paddingTop !== undefined) calib.paddingTop = Number(p.paddingTop ?? DEFAULT_CALIB.paddingTop);
      if (p.paddingBottom !== undefined) calib.paddingBottom = Number(p.paddingBottom ?? DEFAULT_CALIB.paddingBottom);
      if (p.avatarSize !== undefined) calib.avatarSize = Number(p.avatarSize) || DEFAULT_CALIB.avatarSize;
    } catch {
      /* ignore */
    }
  }

  loadLocal();

  function broadcastCalib() {
    saveLocal();
    const sock = getSocket();
    const code = typeof roomCode === 'string' ? roomCode : roomCode.value;
    sock?.emit('layout.update', {
      roomCode: (code || 'KB2026').toUpperCase(),
      avatarSize: calib.avatarSize,
      stageCalib: { ...calib },
    });
  }

  function applyRemoteConfig(cfg: any) {
    if (!cfg) return;
    if (cfg.stageCalib && typeof cfg.stageCalib === 'object') {
      const s = cfg.stageCalib;
      if (s.preset === 'fullscreen' || s.preset === 'tiktok-safe-zone' || s.preset === 'compact') {
        calib.preset = s.preset;
      }
      if (s.maxWidth !== undefined) calib.maxWidth = Number(s.maxWidth);
      if (s.scale !== undefined) calib.scale = Number(s.scale);
      if (s.offsetX !== undefined) calib.offsetX = Number(s.offsetX);
      if (s.offsetY !== undefined) calib.offsetY = Number(s.offsetY);
      if (s.paddingTop !== undefined) calib.paddingTop = Number(s.paddingTop);
      if (s.paddingBottom !== undefined) calib.paddingBottom = Number(s.paddingBottom);
      if (s.avatarSize !== undefined) calib.avatarSize = Number(s.avatarSize);
      saveLocal();
    } else if (cfg.avatarSize !== undefined) {
      calib.avatarSize = Number(cfg.avatarSize) || DEFAULT_CALIB.avatarSize;
      saveLocal();
    }
  }

  function attachSocket(sock: Socket | null) {
    if (!sock) return;
    sock.on('layout.config', applyRemoteConfig);
  }

  function applyPreset(preset: StagePresetName) {
    calib.preset = preset;
    if (preset === 'fullscreen') {
      calib.maxWidth = 760;
      calib.scale = 100;
      calib.offsetX = 0;
      calib.offsetY = 0;
      calib.paddingTop = 20;
      calib.paddingBottom = 24;
    } else if (preset === 'tiktok-safe-zone') {
      calib.maxWidth = 520;
      calib.scale = 92;
      calib.offsetX = 0;
      calib.offsetY = 0;
      calib.paddingTop = 140;
      calib.paddingBottom = 220;
    } else if (preset === 'compact') {
      calib.maxWidth = 380;
      calib.scale = 85;
      calib.offsetX = 0;
      calib.offsetY = 0;
      calib.paddingTop = 16;
      calib.paddingBottom = 20;
    }
    broadcastCalib();
  }

  function resetCalib() {
    Object.assign(calib, { ...DEFAULT_CALIB });
    broadcastCalib();
  }

  const stageStyle = computed(() => ({
    maxWidth: `${calib.maxWidth}px`,
    paddingTop: `${calib.paddingTop}px`,
    paddingBottom: `${calib.paddingBottom}px`,
    transform: `translate(${calib.offsetX}%, ${calib.offsetY}%) scale(${calib.scale / 100})`,
    transformOrigin: 'top center',
    '--tug-ava-size': `${calib.avatarSize}px`,
  }));

  const embeddedStyle = computed(() => ({
    '--tug-ava-size': `${calib.avatarSize}px`,
  }));

  return {
    calib,
    stageStyle,
    embeddedStyle,
    broadcastCalib,
    applyRemoteConfig,
    attachSocket,
    applyPreset,
    resetCalib,
  };
}
