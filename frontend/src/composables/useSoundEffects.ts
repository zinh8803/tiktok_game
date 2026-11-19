import { ref, watch } from 'vue';
import { soundFX } from '../services/sound';

const soundEnabled = ref<boolean>(!soundFX.isMuted());
const soundVolume = ref<number>(soundFX.getSfxVolume() / 100);

export function useSoundEffects() {
  watch(soundEnabled, (enabled) => {
    soundFX.setMuted(!enabled);
  });

  watch(soundVolume, (vol) => {
    soundFX.setSfxVolume(Math.round(vol * 100));
  });

  function toggleSound() {
    soundEnabled.value = !soundEnabled.value;
  }

  function setVolume(val: number) {
    soundVolume.value = Math.max(0, Math.min(1, val));
  }

  function playTick(remaining = 10) {
    soundFX.playCountdownTick(remaining);
  }

  function playUrgentTick() {
    soundFX.playCountdownTick(3);
  }

  function playCorrect() {
    soundFX.playCorrectAnswer();
  }

  function playStart() {
    soundFX.playStartMatch();
  }

  function playPull() {
    soundFX.playPullRope();
  }

  function playRevealTile() {
    soundFX.playRevealTile();
  }

  function playVictory() {
    soundFX.playVictoryFanfare();
  }

  return {
    soundEnabled,
    soundVolume,
    toggleSound,
    setVolume,
    playTick,
    playUrgentTick,
    playCorrect,
    playStart,
    playPull,
    playRevealTile,
    playVictory,
  };
}
