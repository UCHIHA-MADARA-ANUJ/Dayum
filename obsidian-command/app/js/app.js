/* ═══════════════════════════════════════════════════════════
   OBSIDIAN — application core
   ═══════════════════════════════════════════════════════════ */
"use strict";

/* ── helpers ─────────────────────────────────────────── */
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; } }

function toast(msg, kind="ok"){
  const t = document.createElement("div");
  t.className = "toast toast-" + kind;
  t.innerHTML = `<span>${kind === "ok" ? "◈" : "▲"}</span> ${esc(msg)}`;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add("show"), 20);
  setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 400); }, 3400);
}

function openModal(html){
  $("#modalRoot").innerHTML = `<div class="modal-back"><div class="modal">${html}</div></div>`;
  const back = $("#modalRoot .modal-back");
  back.addEventListener("click", e => { if (e.target === back) closeModal(); });
  return back;
}
function closeModal(){ $("#modalRoot").innerHTML = ""; }
function modalShell(title, body, foot=""){
  return `<div class="modal-head"><h2>${title}</h2><button class="modal-x" data-close>✕</button></div>
          <div class="modal-body">${body}</div>
          ${foot ? `<div class="modal-foot">${foot}</div>` : ""}`;
}
document.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeModal(); });

/* ── sigils (original geometric glyphs) ──────────────── */
function sigilSVG(type, color, size=88){
  const s = size, c = color;
  const paths = {
    flame: `<path d="M${s*.5} ${s*.12}C${s*.62} ${s*.34} ${s*.74} ${s*.46} ${s*.72} ${s*.62}C${s*.7} ${s*.78} ${s*.58} ${s*.88} ${s*.5} ${s*.88}C${s*.42} ${s*.88} ${s*.3} ${s*.78} ${s*.28} ${s*.62}C${s*.26} ${s*.46} ${s*.38} ${s*.34} ${s*.5} ${s*.12}Z" fill="${c}" opacity=".85"/><path d="M${s*.5} ${s*.44}C${s*.56} ${s*.52} ${s*.6} ${s*.6} ${s*.58} ${s*.68}C${s*.56} ${s*.76} ${s*.5} ${s*.8} ${s*.5} ${s*.8}C${s*.5} ${s*.8} ${s*.44} ${s*.76} ${s*.42} ${s*.68}C${s*.4} ${s*.6} ${s*.44} ${s*.52} ${s*.5} ${s*.44}Z" fill="#050507"/>`,
    shield: `<path d="M${s*.5} ${s*.1} L${s*.84} ${s*.22} V${s*.52} Q${s*.84} ${s*.78} ${s*.5} ${s*.9} Q${s*.16} ${s*.78} ${s*.16} ${s*.52} V${s*.22} Z" fill="none" stroke="${c}" stroke-width="${s*.06}"/><path d="M${s*.5} ${s*.22} V${s*.78}" stroke="${c}" stroke-width="${s*.04}"/><path d="M${s*.34} ${s*.34} H${s*.66} M${s*.34} ${s*.46} H${s*.66} M${s*.34} ${s*.58} H${s*.6}" stroke="${c}" stroke-width="${s*.035}" stroke-linecap="round"/>`,
    wind: `<path d="M${s*.14} ${s*.4} H${s*.6} Q${s*.78} ${s*.4} ${s*.78} ${s*.5} Q${s*.78} ${s*.6} ${s*.6} ${s*.6} H${s*.3}" fill="none" stroke="${c}" stroke-width="${s*.05}" stroke-linecap="round"/><path d="M${s*.22} ${s*.62} H${s*.52} Q${s*.68} ${s*.62} ${s*.68} ${s*.7} Q${s*.68} ${s*.78} ${s*.52} ${s*.78} H${s*.36}" fill="none" stroke="${c}" stroke-width="${s*.05}" stroke-linecap="round"/><circle cx="${s*.62}" cy="${s*.32}" r="${s*.07}" fill="${c}"/>`,
    scroll: `<rect x="${s*.28}" y="${s*.14}" width="${s*.44}" height="${s*.72}" fill="none" stroke="${c}" stroke-width="${s*.05}"/><path d="M${s*.28} ${s*.22} H${s*.72} M${s*.28} ${s*.34} H${s*.72} M${s*.28} ${s*.46} H${s*.72} M${s*.28} ${s*.58} H${s*.6}" stroke="${c}" stroke-width="${s*.035}" stroke-linecap="round"/><circle cx="${s*.7}" cy="${s*.72}" r="${s*.05}" fill="${c}"/>`,
    bolt: `<path d="M${s*.56} ${s*.12} L${s*.34} ${s*.54} H${s*.48} L${s*.42} ${s*.88} L${s*.66} ${s*.44} H${s*.52} Z" fill="${c}"/>`,
    shade: `<circle cx="${s*.5}" cy="${s*.5}" r="${s*.34}" fill="none" stroke="${c}" stroke-width="${s*.05}"/><path d="M${s*.5} ${s*.16} A${s*.34} ${s*.34} 0 0 0 ${s*.5} ${s*.84} Z" fill="${c}" opacity=".7"/><circle cx="${s*.5}" cy="${s*.44}" r="${s*.05}" fill="#050507"/>`,
    staff: `<path d="M${s*.36} ${s*.14} V${s*.86}" stroke="${c}" stroke-width="${s*.05}" stroke-linecap="round"/><circle cx="${s*.36}" cy="${s*.26}" r="${s*.09}" fill="${c}"/><path d="M${s*.44} ${s*.78} H${s*.6} V${s*.66} H${s*.44} Z" fill="${c}"/><path d="M${s*.5} ${s*.86} H${s*.66} V${s*.74} H${s*.5} Z" fill="${c}" opacity=".6"/>`,
    eye: `<path d="M${s*.14} ${s*.5} Q${s*.5} ${s*.26} ${s*.86} ${s*.5} Q${s*.5} ${s*.74} ${s*.14} ${s*.5} Z" fill="none" stroke="${c}" stroke-width="${s*.05}"/><circle cx="${s*.5}" cy="${s*.5}" r="${s*.12}" fill="${c}"/><circle cx="${s*.5}" cy="${s*.5}" r="${s*.045}" fill="#050507"/>`,
    blade: `<path d="M${s*.5} ${s*.12} L${s*.56} ${s*.5} L${s*.5} ${s*.88} L${s*.44} ${s*.5} Z" fill="${c}"/><path d="M${s*.24} ${s*.6} L${s*.4} ${s*.56} M${s*.76} ${s*.6} L${s*.6} ${s*.56}" stroke="${c}" stroke-width="${s*.04}" stroke-linecap="round"/>`
  };
  const d = paths[type] || paths.flame;
  const ring = `<circle cx="${s/2}" cy="${s/2}" r="${s*.42}" fill="none" stroke="#2a2a3e" stroke-width="${s*.03}"/>`;
  return `<svg class="p-sigil" viewBox="0 0 ${s} ${s}" aria-hidden="true">${ring}${d}</svg>`;
}

/* ── poster SVG ──────────────────────────────────────── */
function posterSVG(t, {huge=false}={}){
  const w = huge ? 620 : 215, h = huge ? 820 : 300;
  const sig = sigilSVG(t.sigil, t.color, huge ? 180 : 90);
  const stars = [];
  const rnd = mulberry32(t.id.length * 97 + 13);
  for (let i = 0; i < 40; i++) stars.push(`<circle cx="${rnd()*w}" cy="${rnd()*h}" r="1" fill="#3a3a46" opacity="${.2+rnd()*.5}"/>`);
  const rot = t.sigil === "bolt" ? 0 : (t.id.length % 5) * 7 - 14;
  return `<svg class="print-poster" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="background:radial-gradient(ellipse at 50% 28%,#141420,#07070c)">
    <defs><linearGradient id="lg${t.id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#e01e37"/><stop offset="1" stop-color="#7a0e1e"/>
    </linearGradient></defs>
    ${stars.join("")}
    <rect x="${w*.04}" y="${h*.04}" width="${w*.92}" height="${h*.92}" fill="none" stroke="#2a2a3e" stroke-width="2"/>
    <rect x="${w*.055}" y="${h*.055}" width="${w*.89}" height="${h*.89}" fill="none" stroke="#1e1e2e" stroke-width="1"/>
    <text x="${w/2}" y="${h*.13}" text-anchor="middle" font-family="Georgia,serif" font-size="${huge?34:13}" font-weight="900" letter-spacing="${huge?10:4}" fill="#e8e4d8">WANTED</text>
    <text x="${w/2}" y="${h*.175}" text-anchor="middle" font-family="Georgia,serif" font-size="${huge?11:4.5}" letter-spacing="${huge?5:2}" fill="#8a8a94">IMPERIAL SECURITY BUREAU — SECTOR WARRANT</text>
    <g transform="translate(${w/2} ${h*.29}) rotate(${rot})" opacity=".96">${sig.replace('class="p-sigil"','')}</g>
    <text x="${w/2}" y="${h*.47}" text-anchor="middle" font-family="Georgia,serif" font-size="${huge?30:11.5}" font-weight="700" letter-spacing="${huge?8:3}" fill="#e8e4d8">${t.name}</text>
    <text x="${w/2}" y="${h*.505}" text-anchor="middle" font-family="Georgia,serif" font-size="${huge?15:6}" letter-spacing="${huge?6:2.5}" fill="${t.color}">${t.epithet}</text>
    <line x1="${w*.2}" y1="${h*.545}" x2="${w*.8}" y2="${h*.545}" stroke="url(#lg${t.id})" stroke-width="${huge?3:1}"/>
    <text x="${w/2}" y="${h*.595}" text-anchor="middle" font-family="monospace" font-size="${huge?14:5.5}" fill="#f4a300">REWARD ${t.reward} CREDITS</text>
    <text x="${w/2}" y="${h*.635}" text-anchor="middle" font-family="monospace" font-size="${huge?10:4}" letter-spacing="${huge?3:1}" fill="#8a8a94">LAST SEEN: ${t.lastSeen}</text>
    <text x="${w/2}" y="${h*.665}" text-anchor="middle" font-family="monospace" font-size="${huge?10:4}" letter-spacing="${huge?3:1}" fill="#8a8a94">THREAT LEVEL: ${t.threat}</text>
    <rect x="${w*.3}" y="${h*.7}" width="${w*.4}" height="${huge?26:10}" fill="none" stroke="#e01e37" stroke-width="${huge?2:1}"/>
    <text x="${w/2}" y="${h*.718}" text-anchor="middle" font-family="monospace" font-size="${huge?9:3.6}" fill="#e01e37" letter-spacing="${huge?2:1}">${t.status}</text>
    <text x="${w/2}" y="${h*.78}" text-anchor="middle" font-family="monospace" font-size="${huge?8:3.2}" fill="#5a5a66" letter-spacing="${huge?2:1}">DEAD OR ALIVE — THE EMPEROR DECIDES</text>
    <text x="${w/2}" y="${h*.92}" text-anchor="middle" font-family="Georgia,serif" font-size="${huge?13:5}" letter-spacing="${huge?6:2.5}" fill="#3a3a46">OBSIDIAN · IMPERIAL SECURITY NETWORK</text>
  </svg>`;
}

/* ── GATE + BOOT SEQUENCE ──────────────────────────── */
let booted = false;

function initBoot(){
  initFX();
  matrixRain($("#gateMatrix"));
  if (Store.get("session", false)) { enterApp(); return; }
  initGalaxy();
  const gate = $("#gate");
  $("#gateBtn").addEventListener("click", startBoot);
  gate.addEventListener("click", e => { if (e.target.closest(".gate-btn")) return; startBoot(); });
}
function startBoot(){
  if (booted) return; booted = true;
  FXAudio.unlock();
  shutterTransition();
  const gate = $("#gate");
  gate.style.transition = "opacity .5s";
  gate.style.opacity = "0";
  setTimeout(() => gate.classList.add("hidden"), 520);
  window.__bootBeeps = bootBeeps(900);
  runBootSequence();
}
function runBootSequence(){
  const boot = $("#boot");
  boot.classList.remove("hidden");
  const lines = [
    { t:"OBSIDIAN CORE v1.0.0 — IMPERIAL SECURITY NETWORK", c:"sys" },
    { t:"MOUNTING SECTOR MAPS .................... OK", c:"ok" },
    { t:"DECRYPTING INQUISITOR CHANNELS .......... OK", c:"ok" },
    { t:"CALIBRATING PROBE NETWORK ................ OK", c:"ok" },
    { t:"LOADING TARGET DOSSIERS ................. [ 9 ]", c:"warn" },
    { t:"SYNCING GALACTIC GRID .................. [ 10 ]", c:"warn" },
    { t:"SECURITY PROTOCOL: ENCRYPTION AES-7 · ZERO-KEY", c:"sys" },
    { t:"CLEARANCE CHECK REQUIRED — ENTER PASSPHRASE", c:"amber" }
  ];
  const log = $("#bootLines");
  const prog = $("#bootProgBar");
  let i = 0;
  function typeNext(){
    if (i >= lines.length){
      finishBoot();
      return;
    }
    const ln = lines[i];
    const div = document.createElement("div");
    div.className = ln.c;
    div.innerHTML = '<span class="cursor"></span>';
    log.appendChild(div);
    const txt = ln.t; let j = 0;
    const iv = setInterval(() => {
      div.textContent = txt.slice(0, j);
      div.classList.add("cursor");
      if (j >= txt.length){
        clearInterval(iv);
        div.classList.remove("cursor");
        prog.style.width = (((i + 1) / lines.length) * 100) + "%";
        i++;
        setTimeout(typeNext, 130 + Math.random() * 180);
      } else {
        j += 2 + Math.floor(Math.random() * 3);
      }
    }, 14);
  }
  typeNext();
}
function finishBoot(){
  const wrap = $("#bootPassWrap");
  wrap.classList.remove("hidden");
  const input = $("#bootPass");
  input.focus();
  $("#bootGo").addEventListener("click", tryAuth);
  input.addEventListener("keydown", e => { if (e.key === "Enter") tryAuth(); });
  function tryAuth(){
    const v = input.value.trim();
    const status = $("#bootStatus");
    if (!v){
      status.textContent = "PASSPHRASE REQUIRED";
      status.classList.add("err");
      return;
    }
    status.classList.remove("err");
    status.textContent = "VERIFYING CREDENTIALS…";
    $("#bootGo").disabled = true;
    setTimeout(() => {
      if (v.toUpperCase() === OBS.passphrase){
        status.textContent = "✓ CLEARANCE GRANTED";
        status.style.color = "var(--green)";
        FXAudio.success();
        if (window.__bootBeeps) clearInterval(window.__bootBeeps);
        Store.set("session", true);
        setTimeout(enterApp, 650);
      } else {
        status.textContent = "✗ ACCESS DENIED — INCIDENT LOGGED";
        status.classList.add("err");
        FXAudio.deny();
        const boot = $("#boot");
        boot.classList.add("boot-shake");
        setTimeout(() => boot.classList.remove("boot-shake"), 550);
        input.value = "";
        $("#bootGo").disabled = false;
      }
    }, 1400);
  }
}

/* ── GALACTIC CANVAS (starfield + nebula drift) ──────── */
let galCtx = null, galStars = [], galShots = [];
function initGalaxy(){
  const cv = $("#galaxy");
  if (!cv) return;
  galCtx = cv.getContext("2d");
  let W, H;
  function resize(){
    W = cv.width = window.innerWidth;
    H = cv.height = window.innerHeight;
    galStars = [];
    const n = Math.floor((W * H) / 2600);
    for (let i = 0; i < n; i++){
      galStars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() < .88 ? Math.random() * 0.9 + 0.2 : Math.random() * 1.6 + 0.8,
        tw: Math.random() * Math.PI * 2, ts: 0.4 + Math.random() * 1.4,
        vx: (Math.random() - .5) * 0.06, vy: (Math.random() - .5) * 0.06,
        hue: Math.random() < .12 ? "224,30,55" : Math.random() < .2 ? "159,180,216" : "255,255,255"
      });
    }
  }
  resize();
  window.addEventListener("resize", resize);
  function frame(){
    const ctx = galCtx; if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    // nebula glows
    const t = Date.now() / 1000;
    const g1 = ctx.createRadialGradient(W*0.2, H*0.25, 0, W*0.2, H*0.25, W*0.45);
    g1.addColorStop(0, "rgba(80,10,26,0.10)"); g1.addColorStop(1, "rgba(80,10,26,0)");
    ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
    const g2 = ctx.createRadialGradient(W*0.85, H*0.75, 0, W*0.85, H*0.75, W*0.4);
    g2.addColorStop(0, "rgba(20,24,60,0.12)"); g2.addColorStop(1, "rgba(20,24,60,0)");
    ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
    // stars
    for (const s of galStars){
      s.tw += 0.016 * s.ts;
      const a = 0.3 + 0.7 * Math.abs(Math.sin(s.tw));
      s.x += s.vx; s.y += s.vy;
      if (s.x < -4) s.x = W + 4; if (s.x > W + 4) s.x = -4;
      if (s.y < -4) s.y = H + 4; if (s.y > H + 4) s.y = -4;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + s.hue + "," + a + ")";
      ctx.fill();
    }
    // occasional shooting star
    if (Math.random() < 0.004){
      galShots.push({ x: Math.random() * W * 0.7 + W * 0.2, y: Math.random() * H * 0.3, vx: 9 + Math.random() * 6, vy: 3 + Math.random() * 2, life: 1 });
    }
    for (let i = galShots.length - 1; i >= 0; i--){
      const sh = galShots[i];
      sh.x += sh.vx; sh.y += sh.vy; sh.life -= 0.02;
      if (sh.life <= 0){ galShots.splice(i, 1); continue; }
      const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 7, sh.y - sh.vy * 7);
      grad.addColorStop(0, "rgba(255,255,255," + (0.8 * sh.life) + ")");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = grad; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(sh.x, sh.y); ctx.lineTo(sh.x - sh.vx * 7, sh.y - sh.vy * 7); ctx.stroke();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ── WELCOME OVERLAY ─────────────────────────────────── */
function showWelcome(){
  const w = $("#welcome");
  w.classList.remove("hidden");
  $("#welcomeTitle").textContent = "WELCOME, OPERATIVE " + OBS.operative;
  const subs = ["DECRYPTING INTERFACE…", "LOADING SECTOR GRID…", "CALIBRATING RADAR…"];
  let i = 0;
  const iv = setInterval(() => { if (i < subs.length){ $("#welcomeSub").textContent = subs[i]; i++; } }, 700);
  setTimeout(() => { clearInterval(iv); w.classList.add("hidden"); }, 3400);
}

/* ── VIEW TRANSITION FX ───────────────────────────────── */
function sweepFx(){
  const el = $("#sweep");
  el.classList.remove("go"); void el.offsetWidth;
  el.classList.add("go");
  setTimeout(() => el.classList.remove("go"), 650);
}
function glitchTitle(){
  const t = $("#view .page-title");
  if (!t) return;
  const txt = t.textContent.trim();
  if (!t.classList.contains("glitchy")){
    t.classList.add("glitchy");
    t.setAttribute("data-text", txt);
  }
  t.classList.remove("go"); void t.offsetWidth;
  t.classList.add("go");
  setTimeout(() => t.classList.remove("go"), 600);
}
function animateCounters(){
  $$("#view .stat-value").forEach(el => {
    const txt = el.textContent.trim();
    const m = txt.match(/(\d[\d,.]*)/);
    if (!m) return;
    const target = parseFloat(m[1].replace(/,/g, ""));
    const prefix = txt.slice(0, m.index);
    const suffix = txt.slice(m.index + m[0].length);
    if (target < 1) return;
    const dur = 900; const t0 = performance.now();
    function step(now){
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = prefix + val.toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

/* ── ROUTER ──────────────────────────────────────────── */
const NAV = [
  { id:"command", label:"Command Deck",   icon:'<path d="M3 21h18M5 21V10l7-6 7 6v11M9 21v-6h6v6"/>' },
  { id:"tracker", label:"Galaxy Tracker", icon:'<circle cx="12" cy="12" r="8"/><path d="M2 12h4m12 0h4M12 2v4m0 12v4"/>' },
  { id:"dossiers",label:"Wanted Dossiers",icon:'<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/>' },
  { id:"intel",  label:"Intelligence",   icon:'<circle cx="12" cy="12" r="3"/><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/>' },
  { id:"ops",    label:"Operations",     icon:'<path d="M12 2l9 5-9 5-9-5z"/><path d="M3 12l9 5 9-5M3 17l9 5 9-5"/>' },
  { id:"interdiction", label:"Interdiction", icon:'<path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="8"/>' },
  { id:"comms",  label:"Inquisitor Comms", icon:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>' },
  { id:"archive",label:"Archive",        icon:'<path d="M4 4h16v16H4z"/><path d="M4 9h16M9 4v5"/>' },
  { id:"standards", label:"Standards",   icon:'<path d="M12 2l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9L9.5 7z"/>' }
];
let current = "command";

function buildNav(){
  $("#nav").innerHTML = NAV.map(n =>
    `<button class="nav-item" data-nav="${n.id}">
       <svg viewBox="0 0 24 24">${n.icon}</svg><span>${n.label}</span>
     </button>`).join("");
  $$("#nav .nav-item").forEach(b => b.addEventListener("click", () => route(b.dataset.nav)));
}
function route(id){
  if (!id) id = "command";
  current = id;
  $$("#nav .nav-item").forEach(b => b.classList.toggle("active", b.dataset.nav === id));
  const n = NAV.find(x => x.id === id);
  $("#tbPath").textContent = "/" + (n ? n.label.toUpperCase().replace(/ /g,"_") : id.toUpperCase());
  const view = $("#view");
  view.classList.remove("view-enter"); void view.offsetWidth; view.classList.add("view-enter");
  sweepFx();
  shutterTransition();
  ({ command:renderCommand, tracker:renderTracker, dossiers:renderDossiers, intel:renderIntel,
     ops:renderOps, interdiction:renderInterdiction, comms:renderComms, archive:renderArchive,
     standards:renderStandards }[id])();
  setTimeout(() => {
    const title = $("#view .page-title");
    if (title && !title.dataset.fx){
      title.dataset.fx = "1";
      scrambleIn(title);
      setTimeout(() => title.classList.add("fx-glitch"), 700 + title.textContent.length * 30);
      title.setAttribute("data-text", title.textContent.trim());
    }
    const sub = $("#view .page-sub");
    if (sub) revealWords(sub);
    animateCounters();
    $$("#view .stat-value").forEach(el => el.classList.add("fx-outline"));
  }, 120);
  window.scrollTo(0,0);
}

/* ── shell bits ──────────────────────────────────────── */
function enterApp(){
  $("#boot").classList.add("hidden");
  $("#gate").classList.add("hidden");
  $("#app").classList.remove("hidden");
  $("#sideUser").textContent = OBS.operative;
  loadStore();
  initGalaxy();
  if (!window.__fxInited){ initFX(); window.__fxInited = true; }
  showWelcome();
  buildNav();
  setInterval(() => {
    const d = new Date();
    $("#tbClock").textContent = d.toLocaleTimeString("en-GB");
  }, 1000);
  route("command");
}
$("#logout")?.addEventListener("click", () => { Store.set("session", false); location.reload(); });

/* ── COMMAND DECK ────────────────────────────────────── */
function renderCommand(){
  const hot = SECTORS.filter(s => s.status === "HOT").length;
  const tick = [...TICKER_LINES, ...TICKER_LINES].map(l => `<span>${esc(l)}</span>`).join("");
  const recent = [...INTEL].slice(0, 5);
  const activeOps = OPS.filter(o => o.status === "ACTIVE");
  const pri1 = activeOps.filter(o => o.pri === 1).length;

  $("#view").innerHTML = `
  <div class="section-head">
    <div><h1 class="page-title">Command <span class="accent">Deck</span></h1>
    <div class="page-sub">Order 66 · Post-Purge Operations · Imperial Hunt Command</div></div>
    <div class="actions">
      <button class="btn btn-red" onclick="route('tracker')">◈ OPEN GALAXY TRACKER</button>
      <button class="btn" onclick="route('interdiction')">◆ LAUNCH PROPAGANDA</button>
    </div>
  </div>

  <div class="ticker mb"><div class="ticker-inner">${tick}</div></div>

  <div class="grid g-4 mb">
    <div class="stat"><div class="stat-label">ACTIVE HUNTS</div><div class="stat-value red">${activeOps.length}</div><div class="stat-note">PRIORITY 1: ${pri1}</div></div>
    <div class="stat"><div class="stat-label">JEDI CONTAINED</div><div class="stat-value">${TARGETS.length - TARGETS.filter(t=>t.status.startsWith("PRIORITY")).length}</div><div class="stat-note">EXECUTED OR CAPTURED</div></div>
    <div class="stat"><div class="stat-label">CONFIRMED SIGHTINGS</div><div class="stat-value amber">${SIGHTINGS.filter(s=>s.status==="CONFIRMED").length}</div><div class="stat-note">LAST 72 STANDARD HOURS</div></div>
    <div class="stat"><div class="stat-label">HOT SECTORS</div><div class="stat-value green">${hot}</div><div class="stat-note">LEGIONS ON ALERT</div></div>
  </div>

  <div class="grid g-2 mb">
    <div class="panel">
      <div class="panel-head"><h3>SECTOR THREAT INDEX</h3><span class="tag">LIVE</span></div>
      <div class="panel-body" style="padding:18px 22px 8px">
        ${SECTORS.slice().sort((a,b)=>b.threat-a.threat).map(s => `
          <div class="flex spread mb" style="margin-bottom:14px">
            <span class="mono" style="font-size:11px;letter-spacing:.14em;color:var(--steel);width:120px">${s.name}</span>
            <div style="flex:1;height:8px;background:var(--bg2);border:1px solid var(--line)"><div style="width:${s.threat}%;height:100%;background:linear-gradient(90deg,var(--red3),${s.threat>75?'var(--red2)':'var(--amber)'});box-shadow:0 0 8px ${s.threat>75?'rgba(255,42,68,.5)':'rgba(244,163,0,.3)'}"></div></div>
            <span class="mono" style="font-size:11px;color:${s.threat>75?'var(--red2)':'var(--amber)'};width:34px;text-align:right">${s.threat}</span>
          </div>`).join("")}
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:18px">
      <div class="panel">
        <div class="panel-head"><h3>RECENT INTELLIGENCE</h3><button class="btn btn-ghost btn-sm" onclick="route('intel')">OPEN FEED →</button></div>
        <div class="row-list">
          ${recent.map(i => `
            <div class="row">
              <div class="r-main"><div class="r-title">${esc(i.txt)}</div>
              <div class="r-sub">${esc(i.src)} · ${esc(i.time)}</div></div>
              <div class="r-right"><span class="badge ${i.status==='CONFIRMED'?'badge-red':i.status==='DISPUTED'?'badge-amber':'badge'}">${esc(i.status)}</span></div>
            </div>`).join("")}
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><h3>ORDER 66 STATUS</h3><span class="tag badge badge-red">ENFORCED</span></div>
        <div class="panel-body" style="display:flex;align-items:center;gap:20px">
          <svg viewBox="0 0 100 100" style="width:74px;height:74px;flex-shrink:0">
            <path d="M50 3 61 24 84 16 76 39 97 50 76 61 84 84 61 76 50 97 39 76 16 84 24 61 3 50 24 39 16 16 39 24z" fill="none" stroke="#e01e37" stroke-width="2"/>
            <circle cx="50" cy="50" r="14" fill="none" stroke="#e8e4d8" stroke-width="2"/>
            <circle cx="50" cy="50" r="6" fill="#e01e37"/>
          </svg>
          <div style="font-size:13px;line-height:1.7;color:var(--steel)">Directive 66 remains in force. The purge is <b class="red">incomplete</b>. <span class="mono" style="font-size:10px">SURVIVORS: ${TARGETS.filter(t=>t.status.startsWith("PRIORITY")).length} CLASSIFIED TARGETS · HUNT CONTINUES INDEFINITELY</span></div>
        </div>
      </div>
    </div>
  </div>

  <div class="grid g-2">
    <div class="panel">
      <div class="panel-head"><h3>ACTIVE OPERATIONS</h3><button class="btn btn-ghost btn-sm" onclick="route('ops')">DISPATCH BOARD →</button></div>
      <div class="row-list">
        ${activeOps.map(o => { const t = targetById(o.target); return `
          <div class="row">
            <div class="r-main"><div class="r-title">${esc(o.name)} <span class="badge ${o.pri===1?'badge-red':o.pri===2?'badge-amber':'badge'}">P${o.pri}</span></div>
            <div class="r-sub">TARGET: ${t ? esc(t.name) : "—"} · ${esc(o.squad)}</div></div>
            <div class="r-right"><button class="btn btn-ghost btn-sm" onclick="openDossier('${o.target}')">DOSSIER</button></div>
          </div>`; }).join("")}
        ${activeOps.length ? "" : `<div class="empty-state"><span class="es-icon">◈</span>NO ACTIVE OPERATIONS</div>`}
      </div>
    </div>
    <div class="panel">
      <div class="panel-head"><h3>EMPEROR'S MANDATE</h3><span class="tag badge badge-amber">LIVE FEED</span></div>
      <div class="panel-body" style="font-size:14px;line-height:1.8;color:#c9c5b8;font-style:italic">
        "They scattered like embers from a fire. But embers still burn — and a single spark, left untended, can consume a world. <b style="color:var(--bone)">Find the sparks.</b> Stomp them out. And when the galaxy is dark and cold and quiet, only then will you know peace — my peace."
        <div class="mono mt" style="font-size:10px;color:var(--dim);letter-spacing:.2em">— THE EMPEROR, SECTOR 2 CYCLE 4</div>
      </div>
    </div>
  </div>`;
}

/* ── GALAXY TRACKER ──────────────────────────────────── */
function renderTracker(){
  const W = 1200, H = 700;
  const rnd = mulberry32(42);
  const stars = [];
  for (let i = 0; i < 420; i++) stars.push(`<circle cx="${rnd()*W}" cy="${rnd()*H}" r="${rnd()<.85?0.6:1.3}" fill="${rnd()<.7?'#2c2c3a':'#3f3f52'}" opacity="${.25+rnd()*.55}"/>`);
  const galaxyStars = [];
  for (let i = 0; i < 300; i++){
    const a = rnd()*Math.PI*2, r = Math.sqrt(rnd())*W*0.34;
    const x = W/2 + Math.cos(a)*r + (rnd()-.5)*60;
    const y = H/2 + Math.sin(a)*r*0.42 + (rnd()-.5)*40;
    galaxyStars.push(`<circle cx="${x}" cy="${y}" r="${.4+rnd()*.9}" fill="${rnd()<.5?'#4a4a62':'#5a4a5a'}" opacity="${.3+rnd()*.5}"/>`);
  }
  const sectorPos = { torvane:[382,235], myrrah:[560,200], velaros:[430,390], ostrak:[210,430], hearth:[620,330], kess:[720,360], bellhaven:[800,150], nyxaris:[920,300], dorn:[150,180], valdris:[1040,520] };
  const sweep = `<g class="sweep"><path d="M600 350 L600 60 A290 290 0 0 1 856 179 Z" fill="rgba(224,30,55,.10)"/></g>`;
  const heat = SECTORS.map(s => { const [x,y] = sectorPos[s.id]; const r = 60 + s.threat*0.5; return `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#heatGrad)" opacity="${s.threat/120}"/>`; }).join("");
  const sectorLabels = SECTORS.map(s => {
    const [x,y] = sectorPos[s.id];
    const cls = s.status === "HOT" ? "red" : s.status === "WATCH" ? "amber" : "dim";
    return `<g class="sector" data-sector="${s.id}">
      <polygon points="${x-9},${y} ${x-4.5},${y-8} ${x+4.5},${y-8} ${x+9},${y} ${x+4.5},${y+8} ${x-4.5},${y+8}" fill="none" stroke="${s.status==='HOT'?'#e01e37':'#2a2a3e'}" stroke-width="1.2"/>
      <text x="${x}" y="${y+26}" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="var(--${cls})">${s.name}</text>
    </g>`;
  }).join("");
  const blips = SIGHTINGS.map(s => {
    const t = targetById(s.target);
    const [x,y] = sectorPos[s.sector];
    const bx = x + (s.x - .5) * 240, by = y + (s.y - .5) * 160;
    const col = s.status === "CONFIRMED" ? "#ff2a44" : s.status === "SUSPECTED" ? "#f4a300" : "#8a8a94";
    return `<g class="blip" data-sighting="${s.id}" transform="translate(${bx} ${by})">
      <circle class="pulse" r="5" fill="${col}" opacity=".85"/>
      <circle r="4" fill="${col}"/>
      <circle r="9" fill="none" stroke="${col}" stroke-width="1" opacity=".5"/>
      <path d="M-14 0H-9M9 0H14M0-14V-9M0 9V14" stroke="${col}" stroke-width="1.2"/>
    </g>`;
  }).join("");

  $("#view").innerHTML = `
  <div class="section-head">
    <div><h1 class="page-title">Galaxy <span class="accent">Tracker</span></h1>
    <div class="page-sub">Live surveillance grid · Probe network · Sector command</div></div>
    <div class="actions">
      <button class="btn btn-red" onclick="openSighting()">＋ LOG SIGHTING</button>
      <button class="btn" onclick="seedDrop()">⟳ SIMULATE PROBE DROP</button>
    </div>
  </div>

  <div class="map-wrap" style="max-height:640px">
    <div class="map-hud">
      <button class="btn btn-ghost btn-sm" data-filter="all" onclick="mapFilter('all')">ALL</button>
      <button class="btn btn-ghost btn-sm" data-filter="CONFIRMED" onclick="mapFilter('CONFIRMED')">CONFIRMED</button>
      <button class="btn btn-ghost btn-sm" data-filter="SUSPECTED" onclick="mapFilter('SUSPECTED')">SUSPECTED</button>
    </div>
    <div class="map-legend"><b>■</b> CONFIRMED &nbsp;<b style="color:var(--amber)">■</b> SUSPECTED &nbsp;<b style="color:var(--dim)">■</b> DISPUTED<br>CLICK A BLIP FOR DETAILS · CLICK A SECTOR TO SELECT</div>
    <div class="map-info" id="mapInfo"></div>
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" style="min-height:560px">
      <defs>
        <radialGradient id="heatGrad"><stop offset="0" stop-color="#e01e37"/><stop offset="1" stop-color="rgba(224,30,55,0)"/></radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="transparent"/>
      ${stars.join("")}${galaxyStars.join("")}${heat}${sweep}${sectorLabels}${blips}
    </svg>
  </div>

  <div class="panel mt">
    <div class="panel-head"><h3>SIGHTING LOG</h3><span class="tag">${SIGHTINGS.length} RECORDS</span></div>
    <div class="row-list" id="sightingLog">
      ${SIGHTINGS.slice().reverse().map(s => { const t = targetById(s.target), sec = sectorById(s.sector); return `
        <div class="row">
          <div class="r-main"><div class="r-title">${t ? esc(t.name) : "UNKNOWN"} <span class="dim" style="font-weight:400">— ${t ? esc(t.epithet) : ""}</span></div>
          <div class="r-sub">${esc(sec.name)} · ${esc(s.when)} · REPORTED BY PROBE GRID</div></div>
          <div class="r-right"><span class="badge ${s.status==='CONFIRMED'?'badge-red':s.status==='SUSPECTED'?'badge-amber':'badge'}">${esc(s.status)}</span>
          <button class="btn btn-ghost btn-sm" onclick="openDossier('${s.target}')">DOSSIER</button></div>
        </div>`; }).join("")}
    </div>
  </div>`;

  $$("#view .blip").forEach(b => b.addEventListener("click", () => {
    const s = SIGHTINGS.find(x => x.id === b.dataset.sighting);
    if (!s) return;
    const t = targetById(s.target), sec = sectorById(s.sector);
    const info = $("#mapInfo");
    info.innerHTML = `
      <h4 style="color:var(--red2)">${t ? esc(t.name) : "UNKNOWN"} — ${t ? esc(t.epithet) : ""}</h4>
      <div class="mi-row"><b>SECTOR</b> ${esc(sec.name)} · ${esc(sec.garrison)}</div>
      <div class="mi-row"><b>REPORTED</b> ${esc(s.when)}</div>
      <div class="mi-row"><b>STATUS</b> ${esc(s.status)}</div>
      <div class="mi-row"><b>REWARD</b> <span style="color:var(--amber)">${t ? t.reward : "—"} CREDITS</span></div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn btn-red btn-sm" onclick="openDossier('${s.target}')">DOSSIER</button>
        <button class="btn btn-ghost btn-sm" onclick="closeMapInfo()">DISMISS</button>
      </div>`;
    info.classList.add("show");
  }));
  $$("#view .sector").forEach(sg => sg.addEventListener("click", () => {
    const s = sectorById(sg.dataset.sector);
    const tgt = SIGHTINGS.filter(x => x.sector === s.id).map(x => targetById(x.target)).filter(Boolean);
    const info = $("#mapInfo");
    info.innerHTML = `
      <h4>${esc(s.name)} <span class="badge ${s.status==='HOT'?'badge-red':s.status==='WATCH'?'badge-amber':'badge'}">${s.status}</span></h4>
      <div class="mi-row"><b>GARRISON</b> ${esc(s.garrison)}</div>
      <div class="mi-row"><b>THREAT INDEX</b> ${s.threat}/100</div>
      <div class="mi-row"><b>INTEL</b> ${esc(s.note)}</div>
      <div class="mi-row"><b>JEDI PRESENCE</b> ${tgt.length ? tgt.map(t=>esc(t.name)).join(", ") : "NONE LOGGED"}</div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn btn-red btn-sm" onclick="openSighting('${s.id}')">＋ LOG SIGHTING</button>
        <button class="btn btn-ghost btn-sm" onclick="dispatchTo('${s.id}')">DISPATCH PATROL</button>
      </div>`;
    info.classList.add("show");
  }));
}
function closeMapInfo(){ $("#mapInfo")?.classList.remove("show"); }
function mapFilter(f){
  $$("#view .blip").forEach(b => {
    const s = SIGHTINGS.find(x => x.id === b.dataset.sighting);
    b.style.display = (f === "all" || s.status === f) ? "" : "none";
  });
  $$("#view .map-hud .btn").forEach(b => b.classList.toggle("btn-red", b.dataset.filter === f));
}
function openSighting(sectorId){
  const secOpts = SECTORS.map(s => `<option value="${s.id}" ${s.id===sectorId?"selected":""}>${s.name}</option>`).join("");
  const tgtOpts = TARGETS.filter(t=>t.status.startsWith("PRIORITY")).map(t => `<option value="${t.id}">${t.name} — ${t.epithet}</option>`).join("");
  openModal(modalShell("LOG SIGHTING", `
    <div class="field"><label>Sector</label><select id="sSec">${secOpts}</select></div>
    <div class="field"><label>Subject</label><select id="sTgt">${tgtOpts}</select></div>
    <div class="field"><label>Classification</label>
      <select id="sSt"><option>CONFIRMED</option><option>SUSPECTED</option><option>DISPUTED</option></select></div>
    <div class="field"><label>Time reported</label><input id="sWhen" value="JUST NOW"></div>`,
    `<button class="btn btn-ghost" data-close>CANCEL</button>
     <button class="btn btn-red" onclick="submitSighting()">FILE REPORT</button>`));
}
function submitSighting(){
  const s = { id: R.uid("s"), sector: $("#sSec").value, target: $("#sTgt").value,
    when: $("#sWhen").value || "JUST NOW", status: $("#sSt").value,
    x: 0.2 + Math.random()*0.6, y: 0.2 + Math.random()*0.6 };
  SIGHTINGS.push(s); saveStore();
  closeModal(); toast("SIGHTING FILED — PROBE GRID UPDATED"); route("tracker");
}
function seedDrop(){
  const t = R.pick(TARGETS.filter(x => x.status.startsWith("PRIORITY")));
  const s = R.pick(SECTORS);
  SIGHTINGS.push({ id: R.uid("s"), sector: s.id, target: t.id, when: "JUST NOW",
    status: R.pick(["CONFIRMED","SUSPECTED","SUSPECTED"]), x: Math.random(), y: Math.random() });
  saveStore(); toast(`PROBE DROP: SIGNATURE MATCHES ${t.name} IN ${s.name}`); route("tracker");
}
function dispatchTo(sectorId){
  const s = sectorById(sectorId);
  OPS.push({ id: R.uid("o"), name: opName(), target: R.pick(TARGETS).id, sector: sectorId,
    squad: R.pick(SQUADS), pri: s.threat > 70 ? 1 : 2, status: "PLANNING",
    note: `Patrol dispatched to ${s.name} after sector selection.` });
  saveStore(); closeMapInfo(); toast(`OPERATION CREATED FOR ${s.name}`); route("ops");
}

/* ── DOSSIERS ────────────────────────────────────────── */
function renderDossiers(){
  $("#view").innerHTML = `
  <div class="section-head">
    <div><h1 class="page-title">Wanted <span class="accent">Dossiers</span></h1>
    <div class="page-sub">${TARGETS.filter(t=>t.status.startsWith("PRIORITY")).length} active targets · Imperial Security Bureau</div></div>
    <div class="actions">
      <button class="btn btn-red" onclick="printAllPosters()">⎙ PRINT ALL POSTERS</button>
    </div>
  </div>
  <div class="poster-grid">
    ${TARGETS.map(t => `
      <div class="poster" onclick="openDossier('${t.id}')">
        <div class="p-img">
          <span class="badge ${t.threatN>=4?'badge-red':t.threatN===3?'badge-amber':'badge'} p-threat">${esc(t.threat)}</span>
          ${sigilSVG(t.sigil, t.color)}
          <div class="p-loc">${esc(t.lastSeen)}</div>
        </div>
        <div class="p-name">${esc(t.name)}</div>
        <div class="p-epithet">${esc(t.epithet)}</div>
        <div class="p-reward">◈ ${t.reward} CREDITS</div>
      </div>`).join("")}
  </div>
  <div class="empty-state mt" style="border:1px dashed var(--line);border-radius:2px">
    <span class="es-icon">◈</span>REWARD VALID UPON DELIVERY — DEAD OR ALIVE. THE EMPEROR DECIDES.
  </div>`;
}
function openDossier(id){
  const t = targetById(id); if (!t) return;
  openModal(modalShell(`TARGET DOSSIER — ${t.status}`, `
    <div style="display:flex;gap:20px;flex-wrap:wrap">
      <div style="text-align:center;flex-shrink:0;margin:0 auto">
        ${sigilSVG(t.sigil, t.color, 120)}
        <div style="font-family:var(--font-display);font-weight:800;font-size:17px;letter-spacing:.14em;margin-top:10px">${esc(t.name)}</div>
        <div class="mono" style="font-size:10px;letter-spacing:.24em;color:${t.color};margin-top:4px">${esc(t.epithet)}</div>
        <div style="margin-top:10px"><span class="badge ${t.threatN>=4?'badge-red':t.threatN===3?'badge-amber':'badge'}">THREAT: ${esc(t.threat)}</span></div>
        <div class="mono" style="font-size:11px;color:var(--amber);margin-top:10px">◈ ${t.reward} CREDITS</div>
      </div>
      <div style="flex:1;min-width:260px">
        <div class="mi-row" style="font-family:var(--font-mono);font-size:10px;color:var(--dim);margin-bottom:6px"><b style="color:var(--bone)">LAST SEEN</b><br>${esc(t.lastSeen)}</div>
        <div class="mi-row" style="font-family:var(--font-mono);font-size:10px;color:var(--dim);margin-bottom:6px"><b style="color:var(--bone)">KNOWN ABILITIES</b><br>${t.abilities.map(a=>`▸ ${esc(a)}`).join("<br>")}</div>
        <div class="mi-row" style="font-family:var(--font-mono);font-size:10px;color:var(--dim);margin-bottom:6px"><b style="color:var(--bone)">KNOWN ASSOCIATES</b><br>${t.associates.map(a=>`▸ ${esc(a)}`).join("<br>")}</div>
        <div class="mi-row" style="font-family:var(--font-mono);font-size:10px;color:var(--dim)"><b style="color:var(--bone)">OPERATIONAL NOTES</b><br>${esc(t.notes)}</div>
      </div>
    </div>`,
    `<button class="btn btn-ghost" data-close>CLOSE</button>
     <button class="btn btn-ghost" onclick="printPoster('${t.id}')">⎙ PRINT POSTER</button>
     <button class="btn btn-red" onclick="fileToOps('${t.id}')">FILE TO OPERATIONS</button>`));
}
function fileToOps(id){
  const t = targetById(id);
  OPS.push({ id: R.uid("o"), name: opName(), target: id, sector: R.pick(SECTORS).id,
    squad: R.pick(SQUADS), pri: Math.min(t.threatN, 3), status: "PLANNING",
    note: `Filed from dossier. Reward ${t.reward} credits approved.` });
  saveStore(); closeModal(); toast(`OPERATION CREATED — TARGET ${t.name}`); route("ops");
}
function printPoster(id){
  const t = targetById(id);
  $("#view").innerHTML = `<div id="printPoster">${posterSVG(t, {huge:true})}</div>
    <div class="no-print" style="text-align:center;margin-top:20px">
      <button class="btn btn-red" onclick="window.print()">⎙ PRINT POSTER</button>
      <button class="btn" onclick="route('dossiers')">← BACK TO DOSSIERS</button>
    </div>`;
}
function printAllPosters(){
  $("#view").innerHTML = `<div class="no-print" style="text-align:center;margin-bottom:20px">
      <button class="btn btn-red" onclick="window.print()">⎙ PRINT ${TARGETS.length} POSTERS</button>
      <button class="btn" onclick="route('dossiers')">← BACK</button></div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:20px">
      ${TARGETS.map(t=>`<div>${posterSVG(t,{huge:true})}</div>`).join("")}
    </div>`;
}

/* ── INTEL ───────────────────────────────────────────── */
function renderIntel(){
  $("#view").innerHTML = `
  <div class="section-head">
    <div><h1 class="page-title">Intelligence <span class="accent">Feed</span></h1>
    <div class="page-sub">Probe droid network · ISB assets · Signal intercepts</div></div>
    <div class="actions">
      <button class="btn btn-red" onclick="simulateDrop()">⟳ SIMULATE PROBE DROP</button>
    </div>
  </div>
  <div class="panel">
    <div class="panel-head"><h3>INCOMING REPORTS</h3><span class="tag">${INTEL.length} RECORDS · AUTO-UPDATING</span></div>
    <div class="row-list" id="intelFeed">
      ${INTEL.slice().reverse().map(renderIntelItem).join("")}
    </div>
  </div>`;
  bindIntel();
}
function renderIntelItem(i){
  const cls = i.status === "CONFIRMED" ? "confirmed" : "";
  return `<div class="row intel-item ${cls}" data-id="${i.id}">
    <div class="r-main">
      <div class="i-head">
        <span class="i-src">◈ ${esc(i.src)}</span>
        <span class="i-time">${esc(i.time)}</span>
        <span class="badge ${i.status==='CONFIRMED'?'badge-red':i.status==='DISPUTED'?'badge-amber':i.status==='UNVERIFIED'?'badge':'badge-ice'}">${esc(i.status)}</span>
      </div>
      <div class="i-body">${esc(i.txt)}</div>
      <div class="i-foot">
        <button class="btn btn-ghost btn-sm" onclick="intelAction('${i.id}','escalate')">▲ ESCALATE TO OPERATIONS</button>
        <button class="btn btn-ghost btn-sm" onclick="intelAction('${i.id}','confirm')">✓ MARK CONFIRMED</button>
        <button class="btn btn-ghost btn-sm" onclick="intelAction('${i.id}','dismiss')">✕ DISMISS</button>
      </div>
    </div>
  </div>`;
}
function bindIntel(){
  $$("#view .intel-item .i-body").forEach(el => {
    const words = el.textContent.split(" ");
    el.innerHTML = words.map(w => (w.length > 5 && Math.random() < 0.12) ? `<span class="redact">${esc(w)}</span>` : esc(w)).join(" ");
  });
}
function intelAction(id, act){
  const i = INTEL.find(x => x.id === id); if (!i) return;
  if (act === "escalate"){
    OPS.push({ id: R.uid("o"), name: opName(), target: R.pick(TARGETS).id, sector: R.pick(SECTORS).id,
      squad: R.pick(SQUADS), pri: R.int(1,3), status: "PLANNING", note: `Escalated from intel report ${esc(i.src)}.` });
    saveStore(); toast("REPORT ESCALATED — OPERATION CREATED");
  } else if (act === "confirm"){
    i.status = "CONFIRMED"; saveStore(); toast("REPORT MARKED CONFIRMED");
  } else {
    i.status = "DISCREDITED"; saveStore(); toast("REPORT DISCREDITED");
  }
  route("intel");
}
function simulateDrop(){
  const tpl = R.pick(INTEL_TEMPLATES);
  const sec = R.pick(SECTORS);
  const tgt = R.pick(TARGETS);
  let txt = tpl.txt
    .replace(/\{sector\}/g, sec.name)
    .replace(/\{subject\}/g, tgt.name + " (" + tgt.epithet + ")")
    .replace(/\{conf\}/g, R.pick(["MODERATE","HIGH","HIGH","LOW"]));
  INTEL.push({ id: R.uid("i"), src: tpl.src, time: "JUST NOW", status: "UNVERIFIED", txt });
  saveStore(); route("intel");
  const items = $$("#view .intel-item"); const last = items[0];
  if (last){
    const body = last.querySelector(".i-body");
    body.classList.add("typing-cursor");
    setTimeout(() => body.classList.remove("typing-cursor"), 1600);
  }
}

/* ── OPS KANBAN ──────────────────────────────────────── */
function renderOps(){
  const cols = ["PLANNING","ACTIVE","CONTAINED","FAILED"];
  $("#view").innerHTML = `
  <div class="section-head">
    <div><h1 class="page-title">Operations <span class="accent">Board</span></h1>
    <div class="page-sub">Hunt dispatch · Squad assignment · Purge coordination</div></div>
    <div class="actions"><button class="btn btn-red" onclick="openNewOp()">＋ NEW OPERATION</button></div>
  </div>
  <div class="kanban">
    ${cols.map(c => {
      const items = OPS.filter(o => o.status === c);
      return `<div class="kan-col" data-col="${c}">
        <div class="kan-head"><span class="k-name">${c}</span><span class="k-count">${items.length}</span></div>
        <div class="kan-body">${items.map(opCard).join("")}</div>
      </div>`;
    }).join("")}
  </div>`;
  bindKanban();
}
function opCard(o){
  const t = targetById(o.target);
  return `<div class="kan-card pri-${o.pri}" draggable="true" data-id="${o.id}">
    <button class="kc-del" onclick="delOp('${o.id}')" title="Delete">✕</button>
    <div class="kc-name">${esc(o.name)}</div>
    <div class="kc-sub">TGT: ${t ? esc(t.name) : "—"}<br>SEC: ${sectorById(o.sector)?.name || "—"} · ${esc(o.squad)}<br>${esc(o.note || "")}</div>
    <div style="margin-top:8px;display:flex;gap:6px">
      <span class="badge ${o.pri===1?'badge-red':o.pri===2?'badge-amber':'badge'}">P${o.pri}</span>
      ${t ? `<button class="btn btn-ghost btn-sm" onclick="openDossier('${o.target}')">FILE</button>` : ""}
    </div>
  </div>`;
}
function bindKanban(){
  let dragEl = null;
  $$("#view .kan-card").forEach(card => {
    card.addEventListener("dragstart", e => { dragEl = card; card.classList.add("dragging"); e.dataTransfer.effectAllowed = "move"; });
    card.addEventListener("dragend", () => { card.classList.remove("dragging"); dragEl = null; $$("#view .kan-col").forEach(c=>c.classList.remove("drag-over")); });
  });
  $$("#view .kan-col").forEach(col => {
    col.addEventListener("dragover", e => { e.preventDefault(); col.classList.add("drag-over"); });
    col.addEventListener("dragleave", () => col.classList.remove("drag-over"));
    col.addEventListener("drop", e => {
      e.preventDefault(); col.classList.remove("drag-over");
      if (!dragEl) return;
      const op = OPS.find(o => o.id === dragEl.dataset.id);
      if (op){ op.status = col.dataset.col; saveStore(); route("ops"); toast(`OPERATION MOVED TO ${col.dataset.col}`); }
    });
  });
}
function delOp(id){
  OPS = OPS.filter(o => o.id !== id); saveStore(); route("ops");
}
function openNewOp(){
  const tgtOpts = TARGETS.map(t => `<option value="${t.id}">${t.name} — ${t.epithet}</option>`).join("");
  const secOpts = SECTORS.map(s => `<option value="${s.id}">${s.name}</option>`).join("");
  const sqOpts = SQUADS.map(s => `<option>${s}</option>`).join("");
  openModal(modalShell("NEW HUNT OPERATION", `
    <div class="field"><label>Codename</label><input id="opName" value="${opName()}"></div>
    <div class="field"><label>Target</label><select id="opTarget">${tgtOpts}</select></div>
    <div class="field"><label>Sector</label><select id="opSector">${secOpts}</select></div>
    <div class="field"><label>Squad</label><select id="opSquad">${sqOpts}</select></div>
    <div class="field"><label>Priority</label><select id="opPri"><option value="1">1 — CRITICAL</option><option value="2">2 — HIGH</option><option value="3">3 — STANDARD</option></select></div>
    <div class="field"><label>Notes</label><textarea id="opNote" placeholder="Operational notes…"></textarea></div>`,
    `<button class="btn btn-ghost" data-close>CANCEL</button>
     <button class="btn btn-red" onclick="submitOp()">AUTHORIZE OPERATION</button>`));
}
function submitOp(){
  OPS.push({ id: R.uid("o"), name: $("#opName").value || opName(), target: $("#opTarget").value,
    sector: $("#opSector").value, squad: $("#opSquad").value, pri: +$("#opPri").value,
    status: "PLANNING", note: $("#opNote").value || "No additional notes." });
  saveStore(); closeModal(); toast("OPERATION AUTHORIZED"); route("ops");
}

/* ── INTERDICTION ────────────────────────────────────── */
let pendingBroadcast = null;
function renderInterdiction(){
  $("#view").innerHTML = `
  <div class="section-head">
    <div><h1 class="page-title">Interdiction <span class="accent">Division</span></h1>
    <div class="page-sub">Counter-recruitment · Propaganda broadcast · Loyalty enforcement</div></div>
  </div>
  <div class="grid g-2 mb">
    <div class="panel">
      <div class="panel-head"><h3>BROADCAST STUDIO</h3><span class="tag badge badge-red">RECRUITMENT DISRUPTION</span></div>
      <div class="panel-body">
        <div class="field"><label>Propaganda template</label>
          <select id="pbTpl">${PROP_TEMPLATES.map(t=>`<option value="${t.id}">${esc(t.name)}</option>`).join("")}</select></div>
        <div class="field"><label>Target sector</label>
          <select id="pbSec">${SECTORS.map(s=>`<option>${s.name}</option>`).join("")}</select></div>
        <button class="btn btn-red" onclick="composeBroadcast()">✎ COMPOSE TRANSMISSION</button>
        <div class="bcast-out mt" id="bcastOut">SELECT A TEMPLATE AND SECTOR TO COMPOSE A SECTOR-WIDE TRANSMISSION.</div>
        <div class="mt" style="text-align:center" id="bcastPosterWrap"></div>
        <div class="mt" style="display:flex;gap:10px;justify-content:center">
          <button class="btn" id="bcastSend" disabled onclick="transmitBroadcast()">▶ TRANSMIT TO ${SECTORS[0].name}</button>
        </div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:18px">
      <div class="panel">
        <div class="panel-head"><h3>BROADCAST LOG</h3><span class="tag">${BROADCASTS.length} TRANSMISSIONS</span></div>
        <div class="panel-body" style="max-height:240px;overflow-y:auto">
          ${BROADCASTS.slice().reverse().map(b => `<div class="log-item"><span class="t">${esc(b.t)}</span> — ${esc(b.txt)}</div>`).join("") || '<div class="empty-state">NO TRANSMISSIONS</div>'}
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><h3>RECRUITMENT INTERCEPTS</h3><span class="tag badge badge-green">NET PROTECTED</span></div>
        <div class="panel-body">
          <div class="grid g-4" style="margin-bottom:14px">
            <div class="stat"><div class="stat-label">INTERCEPTS</div><div class="stat-value green" style="font-size:28px">${R.int(140,190)}</div></div>
            <div class="stat"><div class="stat-label">TURNED AWAY</div><div class="stat-value amber" style="font-size:28px">${R.int(30,60)}</div></div>
            <div class="stat"><div class="stat-label">CITIZEN TIPS</div><div class="stat-value red" style="font-size:28px">${R.int(2000,4000)}</div></div>
            <div class="stat"><div class="stat-label">CELLS DESTROYED</div><div class="stat-value" style="font-size:28px">${R.int(8,20)}</div></div>
          </div>
          <div class="log-item"><b>HIGHLIGHT:</b> Pledge drive on <b>TORVANE</b> produced 312 citizen reports in one cycle. Three suspected recruiters detained. The net holds.</div>
          <div class="log-item"><b>HIGHLIGHT:</b> Shadow Cell safehouse exposed via loyalty pledge cross-referencing. Two operatives captured.</div>
        </div>
      </div>
    </div>
  </div>`;
  $("#pbTpl").addEventListener("change", () => { $("#bcastOut").textContent = "TEMPLATE LOADED — SELECT SECTOR AND COMPOSE."; $("#bcastSend").disabled = true; });
  $("#pbSec").addEventListener("change", () => { $("#bcastSend").disabled = true; });
}
function composeBroadcast(){
  const tpl = PROP_TEMPLATES.find(t => t.id === $("#pbTpl").value);
  const sec = $("#pbSec").value;
  const text = tpl.text.replace(/\{sector\}/g, sec);
  const out = $("#bcastOut");
  out.innerHTML = ""; let i = 0;
  const iv = setInterval(() => {
    out.textContent = text.slice(0, i); i += 2;
    if (i > text.length){ clearInterval(iv); $("#bcastSend").disabled = false; }
  }, 8);
  const slogan = R.pick(PROP_SLOGANS);
  $("#bcastPosterWrap").innerHTML = posterForBroadcast(slogan, sec);
  pendingBroadcast = { tpl: tpl.name, sec, text };
}
function posterForBroadcast(slogan, sector){
  return `<svg class="bcast-poster" viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" style="background:radial-gradient(ellipse at 50% 20%,#161620,#060609)">
    <defs><linearGradient id="bg1" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e01e37"/><stop offset="1" stop-color="#7a0e1e"/></linearGradient></defs>
    <rect x="8" y="8" width="464" height="284" fill="none" stroke="#2a2a3e" stroke-width="1.5"/>
    <path d="M240 40 256 72 290 60 278 94 310 108 276 118 268 152 244 124 220 152 212 118 178 108 210 94 198 60 232 72z" fill="#e01e37" opacity=".9"/>
    <text x="240" y="180" text-anchor="middle" font-family="Georgia,serif" font-weight="900" font-size="30" letter-spacing="8" fill="#e8e4d8">${slogan}</text>
    <line x1="120" y1="200" x2="360" y2="200" stroke="url(#bg1)" stroke-width="2"/>
    <text x="240" y="228" text-anchor="middle" font-family="monospace" font-size="13" letter-spacing="4" fill="#8a8a94">IMPERIAL BROADCAST — SECTOR ${sector}</text>
    <text x="240" y="252" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="3" fill="#5a5a66">REPORT SUSPICIOUS ACTIVITY TO YOUR LOCAL GARRISON</text>
    <text x="240" y="278" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="6" fill="#3a3a46">OBSIDIAN · IMPERIAL SECURITY NETWORK</text>
  </svg>`;
}
function transmitBroadcast(){
  if (!pendingBroadcast) return;
  BROADCASTS.push({ id: R.uid("b"), t: "CYCLE " + R.int(2,9) + " — " + R.int(0,23) + ":" + String(R.int(0,59)).padStart(2,"0"), txt: pendingBroadcast.tpl + " transmitted to " + pendingBroadcast.sec + "." });
  saveStore();
  toast(`TRANSMISSION SENT — SECTOR ${pendingBroadcast.sec} NOW RECEIVING`);
  renderInterdiction();
}

/* ── COMMS ───────────────────────────────────────────── */
function renderComms(){
  $("#view").innerHTML = `
  <div class="section-head">
    <div><h1 class="page-title">Inquisitor <span class="accent">Uplink</span></h1>
    <div class="page-sub">Encrypted channel · End-to-end classified</div></div>
  </div>
  <div class="panel chat">
    <div class="panel-head">
      <h3>CHANNEL: INQUISITOR COUNCIL</h3>
      <div style="display:flex;gap:10px;align-items:center">
        <select id="chInq" style="background:var(--bg2);border:1px solid var(--line2);color:var(--bone);font-family:var(--font-mono);font-size:10px;padding:6px 10px;outline:none">
          ${INQUISITORS.map(i=>`<option value="${i.id}">${i.name} — ${i.callsign}</option>`).join("")}
        </select>
        <span class="badge badge-red">● ENCRYPTED</span>
      </div>
    </div>
    <div class="chat-log" id="chatLog"></div>
    <div class="chat-input">
      <input id="chatMsg" placeholder="TYPE TRANSMISSION…" autocomplete="off">
      <button class="btn btn-red" onclick="sendMsg()">SEND ⏎</button>
    </div>
  </div>`;
  renderChat();
  $("#chatMsg").addEventListener("keydown", e => { if (e.key === "Enter") sendMsg(); });
}
function renderChat(){
  const log = $("#chatLog");
  log.innerHTML = COMMS.map(m => {
    if (m.who === "sys") return `<div class="msg sys">◈ ${esc(m.text)}</div>`;
    const inq = INQUISITORS.find(i => i.id === m.who);
    const mine = m.mine;
    return `<div class="msg ${mine ? "mine" : "them"}">
      <div class="m-meta">${mine ? "YOU — OPERATIVE " + OBS.operative : (inq ? inq.name : "UNKNOWN") + " · " + (inq ? inq.callsign : "")}</div>
      ${esc(m.text)}
    </div>`;
  }).join("");
  log.scrollTop = log.scrollHeight;
}
function sendMsg(){
  const input = $("#chatMsg"); const v = input.value.trim();
  if (!v) return;
  const inqId = $("#chInq").value;
  COMMS.push({ who: "me", mine: true, text: v });
  input.value = "";
  saveStore(); renderChat();
  const log = $("#chatLog");
  const ty = document.createElement("div");
  ty.className = "msg sys typing"; ty.textContent = "◈ ENCRYPTING + TRANSMITTING…";
  log.appendChild(ty); log.scrollTop = log.scrollHeight;
  setTimeout(() => {
    ty.remove();
    const inq = INQUISITORS.find(i => i.id === inqId);
    const reply = R.pick(inq.replies);
    COMMS.push({ who: inqId, text: reply });
    saveStore(); renderChat();
  }, 1100 + Math.random() * 900);
}

/* ── ARCHIVE ─────────────────────────────────────────── */
function renderArchive(){
  $("#view").innerHTML = `
  <div class="section-head">
    <div><h1 class="page-title">Imperial <span class="accent">Archive</span></h1>
    <div class="page-sub">Official records · Restricted documents · Doctrine</div></div>
  </div>
  <div class="grid" style="grid-template-columns:300px 1fr;gap:18px">
    <div class="panel" style="align-self:start">
      <div class="panel-head"><h3>DOCUMENTS</h3><span class="tag">${DOCS.length} FILES</span></div>
      <div class="row-list" id="docList">
        ${DOCS.map(d => `
          <div class="doc-list-item" onclick="openDoc('${d.id}')">
            <div class="d-title">${esc(d.title)}</div>
            <div class="d-meta">${esc(d.cls)} · ${esc(d.date)}</div>
          </div>`).join("")}
      </div>
    </div>
    <div id="docReader"></div>
  </div>`;
  openDoc(DOCS[0].id);
}
function openDoc(id){
  const d = DOCS.find(x => x.id === id); if (!d) return;
  const reader = $("#docReader");
  const stamp = d.cls === "TOP SECRET" ? `<div class="stamp">TOP SECRET</div>` : (d.cls === "RESTRICTED" ? `<div class="stamp" style="color:var(--amber);border-color:var(--amber)">RESTRICTED</div>` : "");
  reader.innerHTML = `
    <div class="doc-reader">
      ${stamp}
      <h2>${esc(d.title)}</h2>
      <div class="dr-meta">CLASSIFICATION: ${esc(d.cls)} · ISSUED: ${esc(d.date)} · OBSIDIAN RECORDS DIVISION</div>
      ${d.body.split("\n\n").map(p => `<p>${esc(p)}</p>`).join("")}
      <div class="dr-meta" style="margin-top:26px">— END OF DOCUMENT — · HUNT CONTINUES</div>
    </div>`;
}

/* ── STANDARDS (design system) ───────────────────────── */
function renderStandards(){
  const swatches = [
    ["#050507","OBSIDIAN BLACK — BASE"],["#0b0b12","PANEL"],["#10101a","PANEL RAISED"],
    ["#1e1e2e","HAIRLINE"],["#2a2a3e","HAIRLINE HI"],["#e8e4d8","BONE — PRIMARY TEXT"],
    ["#8a8a94","STEEL — SECONDARY"],["#5a5a66","DIM — META"],["#e01e37","IMPERIAL RED — ACTION"],
    ["#ff2a44","CRIMSON GLOW — ALERT"],["#7a0e1e","RED DEEP — BORDERS"],["#f4a300","AMBER — WARNING"],
    ["#3ddc84","GREEN — POSITIVE"],["#9fb4d8","ICE — DATA"]
  ];
  $("#view").innerHTML = `
  <div class="section-head">
    <div><h1 class="page-title">Imperial <span class="accent">Standards</span></h1>
    <div class="page-sub">Design system · Typography · Components — OBSIDIAN v${OBS.version}</div></div>
  </div>

  <div class="grid g-2 mb">
    <div class="panel">
      <div class="panel-head"><h3>COLOR — THE IRON PROTOCOL</h3><span class="tag">14 TOKENS</span></div>
      <div class="panel-body">
        <div class="grid g-4" style="gap:8px">
          ${swatches.map(([c,n]) => `<div><div class="swatch" style="background:${c};border:1px solid var(--line2)">${c}</div><div class="mono" style="font-size:8.5px;color:var(--dim);margin-top:4px;line-height:1.4">${n}</div></div>`).join("")}
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-head"><h3>TYPOGRAPHY</h3><span class="tag">3 FAMILIES</span></div>
      <div class="panel-body">
        <div class="type-spec"><div class="ts-label">CINZEL 900 · DISPLAY · 40PX</div><div style="font-size:40px;letter-spacing:.1em">ORDER IS PEACE</div></div>
        <div class="type-spec"><div class="ts-label">CINZEL 700 · SECTION TITLES · 15PX</div><div style="font-size:15px;letter-spacing:.22em">COMMAND DECK</div></div>
        <div class="type-spec"><div class="ts-label">RAJDHANI 600 · UI · 13PX</div><div style="font-size:15px;letter-spacing:.14em;font-weight:600;text-transform:uppercase">Authenticate · Dispatch · Hunt</div></div>
        <div class="type-spec"><div class="ts-label">PLEX MONO 400 · DATA · 11PX</div><div style="font-size:11px;letter-spacing:.18em;color:var(--steel)">SIGHTING LOG // SECTOR 9 // 02:41:07</div></div>
      </div>
    </div>
  </div>

  <div class="grid g-2 mb">
    <div class="panel">
      <div class="panel-head"><h3>COMPONENTS</h3><span class="tag">PRIMARY SET</span></div>
      <div class="panel-body">
        <div class="comp-row"><button class="btn btn-red">PRIMARY ACTION</button><button class="btn">SECONDARY</button><button class="btn btn-ghost">GHOST</button><button class="btn btn-danger">DANGER</button><button class="btn btn-sm">SMALL</button></div>
        <div class="comp-row"><span class="badge badge-red">PRIORITY 1</span><span class="badge badge-amber">WATCH</span><span class="badge badge-green">CONTAINED</span><span class="badge badge-ice">INTEL</span><span class="badge">UNVERIFIED</span></div>
        <div class="comp-row"><div class="stat" style="min-width:160px"><div class="stat-label">SAMPLE STAT</div><div class="stat-value red" style="font-size:30px">66</div></div></div>
        <div class="comp-row"><div class="ticker" style="max-width:420px"><div class="ticker-inner"><span>THE HUNT NEVER ENDS</span><span>ORDER IS PEACE</span><span>REPORT SUSPICIOUS ACTIVITY</span></div></div></div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-head"><h3>EMBLEM — OBSIDIAN SIGIL</h3><span class="tag">ORIGINAL MARK</span></div>
      <div class="panel-body" style="display:flex;align-items:center;gap:26px;flex-wrap:wrap">
        <svg viewBox="0 0 100 100" style="width:120px;height:120px">
          <path d="M50 3 61 24 84 16 76 39 97 50 76 61 84 84 61 76 50 97 39 76 16 84 24 61 3 50 24 39 16 16 39 24z" fill="url(#emg)" stroke="#e01e37" stroke-width="1.5"/>
          <defs><radialGradient id="emg"><stop offset="0" stop-color="#ff2a44"/><stop offset="70%" stop-color="#7a0e1e"/><stop offset="100%" stop-color="#2a050c"/></radialGradient></defs>
          <circle cx="50" cy="50" r="14" fill="none" stroke="#e8e4d8" stroke-width="2"/>
          <circle cx="50" cy="50" r="6" fill="#e01e37"/>
        </svg>
        <div style="font-size:13px;line-height:1.8;color:var(--steel)">
          The OBSIDIAN sigil — twelve blades around the all-seeing core.<br>
          Used on: boot sequence, posters, broadcasts, classified documents.<br>
          <span class="mono" style="font-size:10px;color:var(--dim)">RULES: never recolor core · never rotate 90° · minimum size 24px</span>
        </div>
      </div>
    </div>
  </div>

  <div class="panel">
    <div class="panel-head"><h3>MOTION & TONE</h3><span class="tag">SPEC</span></div>
    <div class="panel-body" style="font-size:13.5px;line-height:1.9;color:var(--steel)">
      <b class="bone" style="color:var(--bone)">Motion:</b> boots at 1750ms · blip pulses 1.8s · radar sweep 9s linear · ticker 40s loop · view transitions 280ms ease.<br>
      <b class="bone" style="color:var(--bone)">Tone:</b> absolute, institutional, merciless. Every screen communicates surveillance, order, and inevitability.<br>
      <b class="bone" style="color:var(--bone)">Voice:</b> short declarative sentences. Data before adjectives. The Empire does not explain — it commands.<br>
      <b class="bone" style="color:var(--bone)">Accessibility:</b> AA contrast on all text · keyboard operable · focus rings via border-color shift.
    </div>
  </div>`;
}

/* ── boot ────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => initBoot());
