/**
 * High-reliability Web Audio API chime synthesizer for medication alerts.
 * Operates offline, zero external asset dependencies, zero CORS issues.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playReminderSound(tone: 'gentle' | 'chime' | 'bell' | 'radar' = 'chime') {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (tone === 'gentle') {
      // Soft gentle two-tone chime (F5 -> A5 -> C6)
      const freqs = [698.46, 880.0, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        gain.gain.setValueAtTime(0, now + idx * 0.15);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.15 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 0.85);
      });
    } else if (tone === 'bell') {
      // Warm dual-bell ding (E5 & B5)
      [659.25, 987.77].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.2);

        gain.gain.setValueAtTime(0, now + i * 0.2);
        gain.gain.linearRampToValueAtTime(0.28, now + i * 0.2 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.2 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.2);
        osc.stop(now + i * 0.2 + 1.25);
      });
    } else if (tone === 'radar') {
      // Rhythmic attention alert
      [800, 1000, 800, 1000].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.18);

        gain.gain.setValueAtTime(0, now + i * 0.18);
        gain.gain.linearRampToValueAtTime(0.2, now + i * 0.18 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.18);
        osc.stop(now + i * 0.18 + 0.16);
      });
    } else {
      // Default: 'chime' (Classic friendly healthcare double-bell)
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);

        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.3, now + i * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.95);
      });
    }

    // Also trigger mobile vibration if available
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200]);
      } catch {
        // Ignored if blocked by browser policy
      }
    }
  } catch (err) {
    console.warn('Audio reminder playback note:', err);
  }
}
