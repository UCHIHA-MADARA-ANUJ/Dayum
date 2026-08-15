"use client";
/* OBSIDIAN WebAudio synth — zero files, all UI sound generated live. */
let ctx = null;

function ac() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; }
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function blip(freq, dur, type, vol, when = 0) {
  const c = ac(); if (!c) return;
  const t = c.currentTime + when;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(c.destination);
  o.start(t); o.stop(t + dur + 0.05);
}

export const audio = {
  unlock() { ac(); },
  hover() { blip(1250, 0.06, "sine", 0.05); },
  click() { blip(880, 0.09, "triangle", 0.09); blip(1320, 0.07, "sine", 0.05, 0.02); },
  bootLine() { blip(520 + Math.random() * 300, 0.05, "square", 0.03); },
  success() { blip(660, 0.12, "sine", 0.08); blip(990, 0.16, "sine", 0.07, 0.09); },
  deny() { blip(140, 0.25, "sawtooth", 0.1); blip(110, 0.3, "sawtooth", 0.08, 0.12); },
  sweep() { blip(220, 0.5, "sawtooth", 0.04); blip(440, 0.4, "sine", 0.03, 0.1); },
};
