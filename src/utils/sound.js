// Lightweight notification sounds via Web Audio (no audio file assets needed).
// Browsers block audio until the first user gesture on the page — we lazily
// create/resume the AudioContext on the first click/keypress so sounds fired
// later by background socket events (new message, new order) actually play,
// even while the tab isn't focused.
let ctx;

const getContext = () => {
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
};

if (typeof window !== 'undefined') {
  const unlock = () => getContext();
  window.addEventListener('click', unlock, { once: true });
  window.addEventListener('keydown', unlock, { once: true });
}

const beep = (freq, startAt, duration = 0.15, volume = 0.15) => {
  const audioCtx = getContext();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, startAt);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(startAt);
  osc.stop(startAt + duration);
};

// Single short chime — new chat message.
export const playMessageSound = () => {
  const audioCtx = getContext();
  if (!audioCtx) return;
  beep(880, audioCtx.currentTime);
};

// Two-tone alert — new order / important notification.
export const playOrderSound = () => {
  const audioCtx = getContext();
  if (!audioCtx) return;
  beep(660, audioCtx.currentTime, 0.16);
  beep(880, audioCtx.currentTime + 0.17, 0.22);
};
