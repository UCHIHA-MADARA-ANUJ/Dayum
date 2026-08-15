/* ═══════════════════════════════════════════════════════════
   OBSIDIAN FX ENGINE — cinematic effects layer
   Custom cursor · magnetic elements · scramble text · word
   reveals · shutter transitions · matrix rain · glitch · audio
   ═══════════════════════════════════════════════════════════ */
"use strict";

/* ── WebAudio UI sound (tiny synth blips, no files) ────── */
const FXAudio = (() => {
  let ctx = null, enabled = true;
  function ac(){
    if (!ctx){
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){ return null; }
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function blip(freq, dur, type, vol, when=0){
    if (!enabled) return;
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
  return {
    unlock(){ ac(); enabled = true; },
    hover(){ blip(1250, 0.06, "sine", 0.05); },
    click(){ blip(880, 0.09, "triangle", 0.09); blip(1320, 0.07, "sine", 0.05, 0.02); },
    bootLine(){ blip(520 + Math.random()*300, 0.05, "square", 0.03); },
    success(){ blip(660, 0.12, "sine", 0.08); blip(990, 0.16, "sine", 0.07, 0.09); },
    deny(){ blip(140, 0.25, "sawtooth", 0.1); blip(110, 0.3, "sawtooth", 0.08, 0.12); },
    sweep(){ blip(220, 0.5, "sawtooth", 0.04); blip(440, 0.4, "sine", 0.03, 0.1); },
    toggle(){ enabled = !enabled; }
  };
})();

/* ── Custom cursor (dot + ring, blend difference) ───────── */
const Cursor = (() => {
  let dot, ring, x=0, y=0, rx=0, ry=0, hover=false, visible=false;
  function build(){
    if (window.matchMedia("(max-width:768px)").matches) return;
    dot = document.createElement("div"); dot.className = "fx-cursor fx-cursor-dot";
    ring = document.createElement("div"); ring.className = "fx-cursor fx-cursor-ring";
    document.body.appendChild(dot); document.body.appendChild(ring);
    document.addEventListener("mousemove", e => {
      x = e.clientX; y = e.clientY;
      if (!visible){ visible = true; dot.style.opacity = ring.style.opacity = "1"; }
      const t = e.target;
      hover = !!(t.closest && (t.closest("button,a,.nav-item,.poster,.kan-card,.row,.doc-list-item,.sector,.blip,input,select,textarea") ));
      dot.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) scale(${hover ? 2.2 : 1})`;
      ring.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) scale(${hover ? 1.7 : 1})`;
      ring.style.borderColor = hover ? "var(--red2)" : "rgba(224,30,55,.5)";
    });
    document.addEventListener("mousedown", () => { if (dot) dot.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) scale(.7)`; });
    document.addEventListener("mouseup", () => { if (dot) dot.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) scale(1)`; });
    document.addEventListener("mouseleave", () => { visible = false; dot.style.opacity = ring.style.opacity = "0"; });
    (function loop(){
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
      if (ring) ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%) scale(${hover ? 1.7 : 1})`;
      requestAnimationFrame(loop);
    })();
  }
  return { init: build };
})();

/* ── Magnetic elements (buttons pull toward cursor) ─────── */
function initMagnetic(){
  $$(".btn, .gate-btn, .nav-item").forEach(el => {
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width/2)) * 0.22;
      const dy = (e.clientY - (r.top + r.height/2)) * 0.22;
      el.style.transform = `translate(${dx}px,${dy}px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });
}

/* ── Scramble / decrypt text ────────────────────────────── */
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>/\\|";
function scrambleText(el, text){
  if (!el) return;
  let iteration = 0;
  const maxIter = text.length;
  const iv = setInterval(() => {
    el.textContent = text.split("").map((ch, i) => {
      if (ch === " " || ch === "·" || ch === "—") return ch;
      if (i < iteration) return text[i];
      return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }).join("");
    iteration += 1.2;
    if (iteration >= maxIter) { clearInterval(iv); el.textContent = text; }
  }, 26);
}
function scrambleIn(el){
  const text = el.textContent.trim();
  el.textContent = text.replace(/./g, "█");
  setTimeout(() => scrambleText(el, text), 180);
}

/* ── Word-stagger reveal (TextReveal) ───────────────────── */
function revealWords(el){
  if (!el || el.dataset.revealed) return;
  el.dataset.revealed = "1";
  const text = el.textContent.trim();
  el.textContent = "";
  el.classList.add("fx-reveal-wrap");
  text.split(" ").forEach((w, i) => {
    const mask = document.createElement("span");
    mask.className = "fx-reveal-mask";
    const inner = document.createElement("span");
    inner.className = "fx-reveal-word";
    inner.textContent = w;
    inner.style.transitionDelay = (i * 0.045) + "s";
    mask.appendChild(inner);
    el.appendChild(mask);
    el.appendChild(document.createTextNode(" "));
  });
  requestAnimationFrame(() => {
    $$(".fx-reveal-word", el).forEach(w => w.classList.add("show"));
  });
}

/* ── 5-column shutter transition ────────────────────────── */
function shutterTransition(){
  FXAudio.sweep();
  const cols = 5;
  const wrap = document.createElement("div");
  wrap.className = "fx-shutter";
  for (let i = 0; i < cols; i++){
    const c = document.createElement("div");
    c.className = "fx-shutter-col";
    c.style.transitionDelay = (i * 0.045) + "s";
    wrap.appendChild(c);
  }
  document.body.appendChild(wrap);
  requestAnimationFrame(() => wrap.classList.add("go"));
  setTimeout(() => { wrap.classList.remove("go"); }, 700);
  setTimeout(() => wrap.remove(), 1100);
}

/* ── Matrix rain (imperial red/white) ───────────────────── */
function matrixRain(canvas){
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H;
  const chars = "█▓▒░01X78@#$%&*OBSIDIANEMPIREORDER";
  let cols, drops;
  function resize(){
    W = canvas.width = canvas.offsetWidth || window.innerWidth;
    H = canvas.height = canvas.offsetHeight || window.innerHeight;
    const fs = 15;
    cols = Math.floor(W / fs);
    drops = Array.from({length: cols}, () => Math.random() * -80);
  }
  resize();
  window.addEventListener("resize", resize);
  (function draw(){
    ctx.fillStyle = "rgba(5,5,9,0.10)";
    ctx.fillRect(0, 0, W, H);
    ctx.font = "15px monospace";
    for (let i = 0; i < cols; i++){
      const ch = chars[Math.floor(Math.random() * chars.length)];
      const y = drops[i] * 15;
      if (y > 0 && y < H){
        ctx.fillStyle = Math.random() > 0.94 ? "#ff2a44" : (Math.random() > 0.5 ? "rgba(232,228,216,.75)" : "rgba(224,30,55,.55)");
        ctx.fillText(ch, i * 15, y);
      }
      if (y > H + 20 && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    requestAnimationFrame(draw);
  })();
}

/* ── Film grain + scanline band (CSS handles visuals) ───── */
function addFilm(){
  const noise = document.createElement("div");
  noise.className = "fx-noise";
  document.body.appendChild(noise);
  const band = document.createElement("div");
  band.className = "fx-scanline";
  document.body.appendChild(band);
}

/* ── Boot FX: kick audio + beep on every line ───────────── */
function bootBeeps(intervalMs){
  const iv = setInterval(() => { FXAudio.bootLine(); }, intervalMs);
  return iv;
}

/* ── Global init ────────────────────────────────────────── */
function initFX(){
  addFilm();
  Cursor.init();
  initMagnetic();
  // hover blips on interactive elements
  document.addEventListener("mouseover", e => {
    if (e.target.closest && e.target.closest("button,.nav-item,.poster,.kan-card,.row")) FXAudio.hover();
  });
  // click blips
  document.addEventListener("click", e => {
    if (e.target.closest && e.target.closest("button,.nav-item")) FXAudio.click();
  });
  // unlock audio on first interaction
  document.addEventListener("pointerdown", () => FXAudio.unlock(), { once: true });
  document.addEventListener("keydown", () => FXAudio.unlock(), { once: true });
}
