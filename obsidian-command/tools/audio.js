/* OBSIDIAN audio engine — synthesizes all music & SFX as WAV. */
"use strict";
const fs = require("fs");
const path = require("path");

const SR = 44100;
const OUT = path.join(__dirname, "..", "deliverables", "video");

function wav(name, samples){
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + samples.length * 2, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(samples.length * 2, 40);
  for (let i = 0; i < samples.length; i++){
    let v = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE((v * 32767) | 0, 44 + i * 2);
  }
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log("wrote", name, (samples.length / SR).toFixed(1) + "s");
}

const TAU = Math.PI * 2;
function tone(freq, dur, {type="sine", vol=0.3, attack=0.01, release=0.05, detune=0, vibrato=0, vibratoRate=5} = {}){
  const n = Math.floor(dur * SR);
  const out = new Float32Array(n);
  const step = freq * TAU / SR, dstep = detune * TAU / SR;
  let phase = 0, dphase = 0;
  for (let i = 0; i < n; i++){
    const env = Math.min(1, i / (attack * SR)) * Math.min(1, (n - i) / (release * SR));
    const vib = 1 + vibrato * Math.sin(vibratoRate * TAU * i / SR);
    phase += step * vib; dphase += dstep * vib;
    let v;
    if (type === "sine") v = Math.sin(phase);
    else if (type === "saw") v = 2 * ((phase / TAU) % 1) - 1;
    else if (type === "square") v = Math.sin(phase) > 0 ? 1 : -1;
    else if (type === "triangle") v = 2 * Math.abs(2 * ((phase / TAU) % 1) - 1) - 1;
    else v = Math.sin(phase) + 0.5 * Math.sin(phase * 2) + 0.3 * Math.sin(phase * 3);
    out[i] = v * env * vol;
  }
  return out;
}

function mix(...tracks){
  const len = Math.max(...tracks.map(t => t.length));
  const out = new Float32Array(len);
  for (const t of tracks) for (let i = 0; i < t.length; i++) out[i] += t[i];
  return out;
}
function concat(...tracks){ const out = new Float32Array(tracks.reduce((a,t)=>a+t.length,0)); let o=0; for (const t of tracks){ out.set(t,o); o+=t.length; } return out; }
function pad(track, seconds){ const out = new Float32Array(track.length + seconds*SR); out.set(track); return out; }
function slice(track, from, to){ return track.slice(from*SR, Math.min(track.length, to*SR)); }
function lowpass(samples, cutoff){
  const out = new Float32Array(samples.length);
  const rc = 1 / (TAU * cutoff); const dt = 1 / SR; const a = dt / (rc + dt);
  out[0] = samples[0];
  for (let i = 1; i < samples.length; i++) out[i] = out[i-1] + a * (samples[i] - out[i-1]);
  return out;
}
function fadeIn(samples, sec){ const n = sec*SR; for (let i=0;i<n && i<samples.length;i++) samples[i]*=i/n; return samples; }
function fadeOut(samples, sec){ const n = sec*SR; for (let i=0;i<n && i<samples.length;i++) samples[samples.length-1-i]*=i/n; return samples; }

const DUR = 78;
const drone = lowpass(mix(
  tone(55, DUR, {type:"saw", vol:0.16, detune:0.7, vibrato:0.004, vibratoRate:0.1}),
  tone(55.5, DUR, {type:"saw", vol:0.14, detune:-0.6}),
  tone(82.5, DUR, {type:"triangle", vol:0.10}),
  tone(110, DUR, {type:"sine", vol:0.07, vibrato:0.006, vibratoRate:0.07})
), 340);
const padA = lowpass(mix(
  tone(110, DUR, {type:"triangle", vol:0.05, vibrato:0.003, vibratoRate:0.13}),
  tone(164.8, DUR, {type:"triangle", vol:0.035}),
  tone(220, DUR, {type:"sine", vol:0.03})
), 500);
const padB = lowpass(mix(
  tone(98, DUR, {type:"triangle", vol:0.05}),
  tone(146.8, DUR, {type:"triangle", vol:0.035}),
  tone(196, DUR, {type:"sine", vol:0.03})
), 500);
const pads = slice(concat(padA, slice(padB, 0, DUR/2), slice(padA, 0, DUR/4)), 0, DUR);

let beats = new Float32Array(0);
for (let t = 0; t < DUR; t += 1.15){
  const thump = concat(
    tone(52, 0.14, {type:"sine", vol:0.5, attack:0.005, release:0.09}),
    tone(40, 0.2, {type:"sine", vol:0.3, attack:0.004, release:0.15})
  );
  beats = concat(beats, pad(thump, 1.15 - 0.34));
}
beats = slice(beats, 0, DUR);

let ticks = new Float32Array(0);
for (let t = 0; t < DUR; t += 0.575){
  const tick = tone(6200, 0.012, {type:"square", vol:0.05, attack:0.001, release:0.01});
  ticks = concat(ticks, pad(tick, 0.575 - 0.012));
}
ticks = slice(ticks, 0, DUR);
fadeIn(ticks, 10);

const score = fadeOut(fadeIn(mix(drone, pads, beats, ticks), 2), 4);
wav("score.wav", score);

wav("boom.wav", fadeOut(tone(38, 2.2, {type:"sine", vol:0.9, attack:0.002, release:1.6}) , 0.4));
wav("alarm.wav", fadeOut(mix(tone(880, 0.5, {type:"square", vol:0.2}), tone(660, 0.5, {type:"square", vol:0.15})), 0.1));
wav("blip.wav", tone(1250, 0.07, {type:"sine", vol:0.35, attack:0.002, release:0.05}));
const whooshN = Math.floor(0.8*SR); const whoosh = new Float32Array(whooshN);
{
  let ph = 0;
  for (let i=0;i<whooshN;i++){
    const p = i/whooshN;
    const env = Math.sin(Math.PI*p);
    ph += (200 + 1400*p) * TAU / SR;
    whoosh[i] = (Math.sin(ph)*0.5 + (Math.random()*2-1)*0.6) * env * 0.35;
  }
}
wav("whoosh.wav", fadeOut(whoosh, 0.15));
wav("riser.wav", fadeOut(tone(60, 3.2, {type:"saw", vol:0.28, vibrato:0.02, vibratoRate:22}), 0.5));
wav("probe.wav", concat(tone(980,0.05,{type:"sine",vol:0.3}), pad(tone(1450,0.06,{type:"sine",vol:0.3}),0.12), tone(1180,0.05,{type:"sine",vol:0.3})));
wav("heartbeat.wav", concat(tone(52,0.14,{type:"sine",vol:0.55,attack:0.005,release:0.09}), pad(tone(40,0.2,{type:"sine",vol:0.35,attack:0.004,release:0.15}),0.2)));
wav("static.wav", fadeOut(new Float32Array(0.5*SR).map(()=>Math.random()*2-1).map((v,i)=>v*(i<0.02*SR?i/(0.02*SR):1)*0.35), 0.2));
console.log("audio done");
