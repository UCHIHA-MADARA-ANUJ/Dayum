/* OBSIDIAN PITCH DECK v5 — editorial "imperial dossier" design.
   Light cream paper · ink type · one deep red · Playfair Display + Inter.
   No dark-neon AI clichés: no glows, no brackets, no scanlines. */
"use strict";
const fs = require("fs");
const path = require("path");

const REND = path.join(__dirname, "..", "deliverables", "renders");
const OUT = path.join(__dirname, "..", "deliverables", "deck");
const F = "file:///home/user/Dayum/obsidian-command/app/fonts/";

const b64 = (name) => fs.readFileSync(path.join(REND, name)).toString("base64");
const bg = (name) => `url('data:image/png;base64,${b64(name)}')`;

const CSS = `
@page{size:13.333in 7.5in;margin:0}
*{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
@font-face{font-family:'Playfair';src:url('${F}playfair-display-latin-400-normal.woff2') format('woff2');font-weight:400}
@font-face{font-family:'Playfair';src:url('${F}playfair-display-latin-500-normal.woff2') format('woff2');font-weight:500}
@font-face{font-family:'Playfair';src:url('${F}playfair-display-latin-600-normal.woff2') format('woff2');font-weight:600}
@font-face{font-family:'Playfair';src:url('${F}playfair-display-latin-700-normal.woff2') format('woff2');font-weight:700}
@font-face{font-family:'Playfair';src:url('${F}playfair-display-latin-800-normal.woff2') format('woff2');font-weight:800}
@font-face{font-family:'Playfair';src:url('${F}playfair-display-latin-900-normal.woff2') format('woff2');font-weight:900}
@font-face{font-family:'Playfair';src:url('${F}playfair-display-latin-400-italic.woff2') format('woff2');font-weight:400;font-style:italic}
@font-face{font-family:'Playfair';src:url('${F}playfair-display-latin-700-italic.woff2') format('woff2');font-weight:700;font-style:italic}
@font-face{font-family:'Inter';src:url('${F}inter-latin-400-normal.woff2') format('woff2');font-weight:400}
@font-face{font-family:'Inter';src:url('${F}inter-latin-500-normal.woff2') format('woff2');font-weight:500}
@font-face{font-family:'Inter';src:url('${F}inter-latin-600-normal.woff2') format('woff2');font-weight:600}
@font-face{font-family:'Inter';src:url('${F}inter-latin-700-normal.woff2') format('woff2');font-weight:700}
@font-face{font-family:'PlexMono';src:url('${F}ibm-plex-mono-latin-400-normal.woff2') format('woff2');font-weight:400}

/* palette */
:root{
  --paper:#F5F2EA; --paper2:#EFEBE0; --ink:#1A1611; --ink2:#3E3830;
  --muted:#8A8274; --hair:#DCD5C6; --red:#B00E27; --red-d:#8C0A1F;
  --plate:#12100C; --cream:#F5F2EA;
}
html,body{width:13.333in;height:7.5in;background:var(--paper);color:var(--ink);font-family:'Inter',sans-serif}
.slide{width:13.333in;height:7.5in;position:relative;overflow:hidden;page-break-after:always;background:var(--paper)}
.slide:last-child{page-break-after:auto}
.pad{padding:0.62in 0.85in 0.5in;position:relative;height:100%;display:flex;flex-direction:column}
/* wordmark + footer */
.wm{position:absolute;top:0.34in;left:0.85in;font-family:'PlexMono',monospace;font-size:8pt;letter-spacing:.3em;color:var(--ink)}
.wm b{color:var(--red)}
.wm .dot{display:inline-block;width:5pt;height:5pt;border-radius:50%;background:var(--red);margin-right:7pt;vertical-align:1pt}
.ftr{position:absolute;left:0.85in;right:0.85in;bottom:0.3in;display:flex;justify-content:space-between;font-family:'PlexMono',monospace;font-size:7pt;letter-spacing:.24em;color:var(--muted);border-top:1px solid var(--hair);padding-top:7pt}
.ftr .red{color:var(--red)}
/* type */
.kick{font-family:'PlexMono',monospace;font-size:8.5pt;letter-spacing:.32em;color:var(--red);text-transform:uppercase;margin-bottom:6pt}
.h1{font-family:'Playfair',serif;font-weight:900;font-size:44pt;line-height:1.02;letter-spacing:-.01em;color:var(--ink)}
.h1 .em{font-style:italic;font-weight:700;color:var(--red)}
.lede{font-size:12.5pt;line-height:1.65;color:var(--ink2);max-width:7.4in;margin-top:12pt}
.lede b{color:var(--ink)}
.small{font-size:9pt;color:var(--muted);line-height:1.6}
.mono{font-family:'PlexMono',monospace}
/* ruled list */
.rlist{border-top:1px solid var(--ink);margin-top:18pt;flex:1;display:flex;flex-direction:column;justify-content:flex-start}
.ritem{display:flex;gap:18pt;align-items:baseline;border-bottom:1px solid var(--hair);padding:11pt 2pt}
.ritem .n{font-family:'Playfair',serif;font-weight:700;font-size:17pt;color:var(--red);width:0.55in;flex-shrink:0}
.ritem .b{flex:1}
.ritem .t{font-family:'Playfair',serif;font-weight:700;font-size:15pt;color:var(--ink);letter-spacing:.01em}
.ritem .d{font-size:10.5pt;color:var(--muted);margin-top:2.5pt;line-height:1.5}
.ritem .meta{font-family:'PlexMono',monospace;font-size:8pt;color:var(--muted);letter-spacing:.12em;text-align:right;flex-shrink:0}
/* two column */
.two{display:flex;gap:0.7in;flex:1;min-height:0}
.two>div{flex:1}
/* big stat grid */
.sgrid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0;border-top:1px solid var(--ink);margin-top:16pt;flex:1}
.scell{padding:20pt 16pt 16pt 2pt;border-bottom:1px solid var(--hair)}
.scell:nth-child(3n+2){padding-left:16pt}
.scell:nth-child(3n+3){padding-left:16pt}
.scell .v{font-family:'Playfair',serif;font-weight:900;font-size:42pt;line-height:1;color:var(--ink)}
.scell .v em{font-style:italic;color:var(--red)}
.scell .l{font-size:10pt;font-weight:600;letter-spacing:.02em;margin-top:8pt;color:var(--ink)}
.scell .s{font-size:8.5pt;color:var(--muted);margin-top:3pt}
/* check list */
.checks{border-top:1px solid var(--ink);margin-top:14pt;display:flex;flex-direction:column}
.check{display:flex;gap:12pt;padding:9pt 2pt;border-bottom:1px solid var(--hair);align-items:baseline}
.check .m{font-family:'Playfair',serif;font-weight:700;color:var(--red);font-size:12pt;width:0.3in;flex-shrink:0}
.check .tx{font-size:10.5pt;color:var(--ink2);line-height:1.5}
/* table rows */
.trows{border-top:1px solid var(--ink);margin-top:14pt;display:flex;flex-direction:column}
.trow{display:flex;align-items:baseline;gap:14pt;padding:10pt 2pt;border-bottom:1px solid var(--hair)}
.trow .tag{font-family:'PlexMono',monospace;font-size:7.5pt;letter-spacing:.2em;color:var(--red);width:0.9in;flex-shrink:0}
.trow .tt{font-family:'Playfair',serif;font-weight:700;font-size:14pt;width:2.3in;flex-shrink:0}
.trow .td{font-size:10pt;color:var(--muted)}
/* cover */
.cover{height:100%;display:flex;flex-direction:column;justify-content:space-between;padding:0.55in 0.85in 0.5in;position:relative}
.cover .top{display:flex;justify-content:space-between;align-items:flex-start}
.cover .top .r{display:flex;gap:14pt;align-items:center}
.cover .big{font-family:'Playfair',serif;font-weight:900;font-size:88pt;line-height:.94;letter-spacing:-.02em;color:var(--ink)}
.cover .big .em{font-style:italic;font-weight:700;color:var(--red)}
.cover .sub{font-size:13pt;letter-spacing:.02em;color:var(--ink2);margin-top:14pt;max-width:6in;line-height:1.5}
.cover .rule{width:2.6in;height:2pt;background:var(--red);margin:14pt 0}
.cover .bot{display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid var(--ink);padding-top:12pt}
.cover .bot .l{font-family:'PlexMono',monospace;font-size:7.5pt;letter-spacing:.2em;color:var(--muted);text-transform:uppercase;line-height:1.9}
.cover .bot .l b{color:var(--ink)}
.sigil{width:64pt;height:64pt}
/* dark plates */
.dark{background:var(--plate);color:var(--cream)}
.dark .bgimg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.5}
.dark .veil{position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,16,12,.92) 0%,rgba(18,16,12,.55) 55%,rgba(18,16,12,.95) 100%)}
.dark .pad{position:relative;z-index:2}
.dark .h1{color:var(--cream)}
.dark .lede{color:#C9C2B4}
.dark .lede b{color:var(--cream)}
.dark .kick{color:var(--red)}
.dark .ritem .t{color:var(--cream)}
.dark .ritem .d{color:#A9A294}
.dark .ftr{border-color:#2E2A22;color:#8A8274}
.dark .wm{color:#C9C2B4}
/* render grid (dark plate) */
.rgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:10pt;flex:1;min-height:0;margin-top:14pt}
.rcell{background:#1B1813;overflow:hidden;display:flex;flex-direction:column}
.rcell img{width:100%;flex:1;object-fit:cover;min-height:0}
.rcell .cap{font-family:'PlexMono',monospace;font-size:6.5pt;letter-spacing:.2em;color:#A9A294;text-transform:uppercase;padding:5pt 8pt;text-align:center;border-top:1px solid #2E2A22}
/* swatches (light) */
.sws{display:grid;grid-template-columns:repeat(5,1fr);gap:10pt;margin-top:16pt}
.sw{height:64pt;border:1px solid var(--hair);padding:6pt 8pt;display:flex;flex-direction:column;justify-content:flex-end;font-family:'PlexMono',monospace;font-size:6.5pt}
.sw small{font-size:5.5pt;opacity:.7;letter-spacing:.08em;display:block;margin-top:2pt}
/* type specimens */
.tspec{margin-top:18pt;border-top:1px solid var(--ink);padding-top:14pt;display:flex;gap:0.6in}
.tspec>div{flex:1}
.tspec .lab{font-family:'PlexMono',monospace;font-size:7pt;letter-spacing:.24em;color:var(--muted);text-transform:uppercase;margin-bottom:8pt}
.tspec .sample1{font-family:'Playfair',serif;font-weight:900;font-size:30pt;color:var(--ink)}
.tspec .sample1 em{color:var(--red);font-style:italic}
.tspec .sample2{font-size:12pt;color:var(--ink2);font-weight:500}
.tspec .sample3{font-family:'PlexMono',monospace;font-size:9.5pt;color:var(--muted)}
/* team */
.team{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0;border-top:1px solid var(--ink);margin-top:16pt;flex:1}
.tm{padding:22pt 20pt 16pt 0;border-bottom:1px solid var(--hair)}
.tm+.tm{padding-left:20pt;border-left:1px solid var(--hair)}
.tm .ini{font-family:'Playfair',serif;font-weight:700;font-size:13pt;color:var(--red);letter-spacing:.14em}
.tm .nm{font-family:'Playfair',serif;font-weight:800;font-size:17pt;margin-top:10pt;color:var(--ink)}
.tm .rl{font-family:'PlexMono',monospace;font-size:7.5pt;letter-spacing:.2em;color:var(--muted);text-transform:uppercase;margin-top:5pt}
.tm .bio{font-size:9.5pt;color:var(--ink2);line-height:1.6;margin-top:10pt}
/* steps */
.steps{display:grid;grid-template-columns:1fr 1fr;gap:0 0.5in;border-top:1px solid var(--ink);margin-top:14pt;flex:1;align-content:start}
.step{display:flex;gap:12pt;padding:9pt 2pt;border-bottom:1px solid var(--hair);align-items:baseline}
.step .n{font-family:'Playfair',serif;font-weight:700;font-size:13pt;color:var(--red);width:0.42in;flex-shrink:0}
.step .tx b{font-family:'Playfair',serif;font-size:12.5pt;color:var(--ink)}
.step .tx s{display:block;font-size:9pt;color:var(--muted);margin-top:2pt}
/* stamp */
.stamp{position:absolute;right:0.85in;top:1.05in;border:1.5pt solid var(--red);color:var(--red);font-family:'PlexMono',monospace;font-size:9pt;letter-spacing:.24em;padding:6pt 14pt;transform:rotate(4deg);text-transform:uppercase;opacity:.85}
/* cmp */
.cmp{display:grid;grid-template-columns:1fr 1fr;gap:0.6in;flex:1;min-height:0;margin-top:16pt}
.cmp .side{border-top:1px solid var(--ink);padding-top:14pt}
.cmp .side h3{font-family:'Playfair',serif;font-weight:800;font-size:17pt;margin-bottom:14pt}
.cmp .side.win h3{color:var(--red)}
.cmp .it{display:flex;gap:10pt;padding:8pt 0;border-bottom:1px solid var(--hair);align-items:baseline}
.cmp .it .m{font-family:'Playfair',serif;font-weight:700;font-size:12pt;width:0.3in;flex-shrink:0}
.cmp .it .x{font-size:10.5pt;color:var(--ink2)}
.cmp .lose .m{color:#B9B2A4}
.cmp .lose .x{color:var(--muted)}
/* roadmap */
.road{border-top:1px solid var(--ink);margin-top:16pt;flex:1;display:flex;flex-direction:column;justify-content:center}
.road .r2{display:flex;gap:14pt;align-items:baseline;padding:13pt 2pt;border-bottom:1px solid var(--hair)}
.road .r2 .n{font-family:'Playfair',serif;font-weight:700;font-size:15pt;color:var(--red);width:0.6in;flex-shrink:0}
.road .r2 .tx b{font-family:'Playfair',serif;font-weight:700;font-size:15pt;color:var(--ink)}
.road .r2 .tx s{display:block;font-size:10pt;color:var(--muted);margin-top:2pt}
`;

const SIGIL = `<svg class="sigil" viewBox="0 0 100 100"><path d="M50 3 61 24 84 16 76 39 97 50 76 61 84 84 61 76 50 97 39 76 16 84 24 61 3 50 24 39 16 16 39 24z" fill="none" stroke="#B00E27" stroke-width="2.5"/><circle cx="50" cy="50" r="15" fill="none" stroke="#1A1611" stroke-width="1.5"/><circle cx="50" cy="50" r="6" fill="#B00E27"/></svg>`;

const wm = `<div class="wm"><span class="dot"></span>OBSIDIAN <b>·</b> SECURITY NETWORK</div>`;
const footer = (sec, n, dark = false) => `
  <div class="ftr"><span>${sec}</span><span>CONFIDENTIAL — ${String(n).padStart(2, "0")} / 13</span><span class="red">THE HUNT NEVER ENDS</span></div>`;

const slides = [];

/* 01 — COVER (light editorial) */
slides.push(`
<div class="slide">
    <div class="cover">
      <div class="top">
        <div class="wm" style="position:static"><span class="dot"></span>OBSIDIAN <b>·</b> SECURITY NETWORK</div>
        <div class="r"><span class="mono" style="font-size:8pt;letter-spacing:.24em;color:var(--muted)">TS '26 · CREATIVE PRELIMS</span>${SIGIL}</div>
      </div>
      <div>
        <div class="big">OBSIDIAN<br/><span class="em">The nervous system</span></div>
        <div class="rule"></div>
        <div class="sub">A classified command portal for the post-Order-66 hunt — tracking, planning, communication and counter-recruitment, coordinated into one organism.</div>
      </div>
      <div class="bot">
        <div class="l"><b>Anuj Phulera</b> · <b>Aarav Choudhary</b> · <b>Jeehaan Kwatra</b><br/>Path 2 — The Empire · Imperial Security Network</div>
        <div class="l" style="text-align:right">PASSPHRASE: FOR THE EMPIRE<br/>CLEARANCE ALPHA-7</div>
      </div>
    </div>
</div>`);

/* 02 — PROBLEM */
slides.push(`
<div class="slide"><div class="pad">
  ${wm}
  <div class="kick">01 — The Problem</div>
  <div class="h1">The galaxy is <span class="em">scattered.</span></div>
  <div class="lede">Order 66 fell. Hundreds of Jedi survive across a thousand worlds — rebuilding, recruiting, learning to vanish. The Empire has legions, but no eyes.</div>
  <div class="rlist">
    <div class="ritem"><div class="n">I.</div><div class="b"><div class="t">Fragmented intelligence</div><div class="d">Reports are filed into a void. No single picture of the galaxy exists.</div></div><div class="meta">10 SECTORS · 0 GRID</div></div>
    <div class="ritem"><div class="n">II.</div><div class="b"><div class="t">Isolated hunters</div><div class="d">Six Inquisitors, six separate hunts. No shared channel, no joint doctrine.</div></div><div class="meta">6 HUNTERS · 0 CHANNEL</div></div>
    <div class="ritem"><div class="n">III.</div><div class="b"><div class="t">Open recruitment lanes</div><div class="d">The Order recruits through refugee networks — and nothing intercepts them.</div></div><div class="meta">RECRUITMENT · LIVE</div></div>
    <div class="ritem"><div class="n">IV.</div><div class="b"><div class="t">No decision layer</div><div class="d">Sightings sit in ledgers while targets slip away. Intel never becomes action.</div></div><div class="meta">INTEL → VOID</div></div>
  </div>
  ${footer("The Problem", 2)}
</div></div>`);

/* 03 — SOLUTION */
slides.push(`
<div class="slide"><div class="pad">
  ${wm}
  <div class="kick">02 — The Solution</div>
  <div class="h1">One nervous <span class="em">system.</span></div>
  <div class="lede">OBSIDIAN fuses a disorganized purge into a single hunting organism — every sector, probe and citizen becomes a sensor in the Emperor's hand.</div>
  <div class="rlist">
    <div class="ritem"><div class="n">01</div><div class="b"><div class="t">Track</div><div class="d">Live radar of ten sectors, probe drops, sighting logs — one grid.</div></div><div class="meta">GALAXY TRACKER</div></div>
    <div class="ritem"><div class="n">02</div><div class="b"><div class="t">Plan</div><div class="d">Intel escalates into dispatch. One board, from planning to containment.</div></div><div class="meta">OPERATIONS</div></div>
    <div class="ritem"><div class="n">03</div><div class="b"><div class="t">Command</div><div class="d">Every Inquisitor on one encrypted channel, answering in character.</div></div><div class="meta">UPLINK</div></div>
    <div class="ritem"><div class="n">04</div><div class="b"><div class="t">Disrupt</div><div class="d">Sector-wide broadcasts that starve the Order of recruits.</div></div><div class="meta">INTERDICTION</div></div>
  </div>
  <div class="mono" style="font-size:8pt;letter-spacing:.2em;color:var(--muted);margin-top:12pt">ACCESS: PASSPHRASE GATE → TYPED BOOT → CLEARANCE ALPHA-7 → FULL NETWORK</div>
  ${footer("The Solution", 3)}
</div></div>`);

/* 04 — WHY NOW */
slides.push(`
<div class="slide"><div class="pad">
  ${wm}
  <div class="kick">03 — Why Now</div>
  <div class="h1">The window is <span class="em">open.</span></div>
  <div class="two" style="margin-top:14pt">
    <div>
      <div class="lede" style="margin-top:0">The brief hands us the moment: survivors scattered, Empire uncoordinated. Whoever builds the nervous system first wins the galaxy.</div>
      <div class="trows">
        <div class="trow"><span class="tag">TAM</span><span class="tt">The Galaxy</span><span class="td">a thousand worlds, unchecked</span></div>
        <div class="trow"><span class="tag" style="color:var(--muted)">SAM</span><span class="tt">The Empire</span><span class="td">ten sectors, eight legions</span></div>
        <div class="trow"><span class="tag" style="color:var(--ink)">SOM</span><span class="tt">The Hunt</span><span class="td">nine classified targets — now</span></div>
      </div>
    </div>
    <div>
      <div class="kick" style="font-size:7.5pt">Why OBSIDIAN wins</div>
      <div class="checks">
        <div class="check"><span class="m">✓</span><span class="tx">Demoable live — judges operate it, they don't read about it</span></div>
        <div class="check"><span class="m">✓</span><span class="tx">Original — zero canon, zero templates, zero stock assets</span></div>
        <div class="check"><span class="m">✓</span><span class="tx">Complete — app, deck, film, 3D engine, design system</span></div>
        <div class="check"><span class="m">✓</span><span class="tx">Offline-first — runs anywhere, forever</span></div>
      </div>
    </div>
  </div>
  ${footer("Why Now", 4)}
</div></div>`);

/* 05 — PRODUCT (12 modules, ruled two-col list) */
slides.push(`
<div class="slide"><div class="pad">
  ${wm}
  <div class="kick">04 — The Product</div>
  <div class="h1">Twelve modules. <span class="em">One hunt.</span></div>
  <div class="lede" style="margin-bottom:6pt">Every module is live and operable — this is the product, not a concept.</div>
  <div class="two" style="margin-top:6pt;gap:0.8in">
    <div class="rlist" style="margin-top:8pt">
      ${["Command Deck","Galaxy Tracker","Wanted Dossiers","Intelligence","Operations","Interdiction"].map((t, i) => `
        <div class="ritem"><div class="n" style="font-size:13pt;width:0.4in">${String(i + 1).padStart(2, "0")}</div><div class="b"><div class="t" style="font-size:13pt">${t}</div><div class="d" style="font-size:9pt">${["hero status board","radar + probe drops","9 psychoprofiled targets","probe / ISB feed","kanban dispatch","propaganda studio"][i]}</div></div></div>`).join("")}
    </div>
    <div class="rlist" style="margin-top:8pt">
      ${["Inquisitor Uplink","Imperial Archive","Terminal","Manifesto","Hunt Metrics","Standards"].map((t, i) => `
        <div class="ritem"><div class="n" style="font-size:13pt;width:0.4in">${String(i + 7).padStart(2, "0")}</div><div class="b"><div class="t" style="font-size:13pt">${t}</div><div class="d" style="font-size:9pt">${["encrypted comms","7 lore documents","working mainframe shell","the Emperor's case","purge completion","in-app design system"][i]}</div></div></div>`).join("")}
    </div>
  </div>
  ${footer("The Product", 5)}
</div></div>`);

/* 06 — JOURNEY */
slides.push(`
<div class="slide"><div class="pad">
  ${wm}
  <div class="kick">05 — The Journey</div>
  <div class="h1">Three minutes to <span class="em">demonstrate it all.</span></div>
  <div class="lede">A nine-step demo that takes a judge from the gate to the design system — everything real, everything clickable.</div>
  <div class="steps">
    ${["Gate — click to initialize","Boot — typed sequence, beeps","Passphrase — FOR THE EMPIRE","Command Deck — hero + live HUD","Galaxy Tracker — click a blip","Operations — drag card to ACTIVE","Terminal — cat targets.log","Standards — the design system"].map((x, i) => {
      const [t, d] = x.split(" — ");
      return `<div class="step"><div class="n">${i + 1}</div><div class="tx"><b>${t}</b><s>${d}</s></div></div>`;
    }).join("")}
  </div>
  ${footer("The Journey", 6)}
</div></div>`);

/* 07 — PROOF */
slides.push(`
<div class="slide"><div class="pad">
  ${wm}
  <div class="kick">06 — Proof</div>
  <div class="h1">Built, <span class="em">not promised.</span></div>
  <div class="sgrid">
    ${[["12", "Working modules", "one login, one network"], ["9", "Original Jedi", "psychoprofiled"], ["8", "3D scenes", "custom raytracer"], ["62s", "Promo film", "original score"], ["100+", "Intel reports", "generated live"], ["0", "External assets", "everything in-house"]].map(([v, l, s]) => `
      <div class="scell"><div class="v">${v}</div><div class="l">${l}</div><div class="s">${s}</div></div>`).join("")}
  </div>
  <div class="mono" style="font-size:8pt;letter-spacing:.18em;color:var(--muted);margin-top:12pt">THE TERMINAL RUNS A REAL FILESYSTEM · INQUISITORS REPLY IN CHARACTER · THE BOARD DRAGS</div>
  ${footer("Proof", 7)}
</div></div>`);

/* 08 — COMPETITION */
slides.push(`
<div class="slide"><div class="pad">
  ${wm}
  <div class="kick">07 — Competition</div>
  <div class="h1">The old way <span class="em">vs. the network.</span></div>
  <div class="cmp">
    <div class="side lose">
      <h3>The old Empire</h3>
      <div class="it"><span class="m">✗</span><span class="x">Reports vanish into ledgers</span></div>
      <div class="it"><span class="m">✗</span><span class="x">Six hunters, six separate hunts</span></div>
      <div class="it"><span class="m">✗</span><span class="x">Recruitment lanes wide open</span></div>
      <div class="it"><span class="m">✗</span><span class="x">Sightings never become strikes</span></div>
    </div>
    <div class="side win">
      <h3>OBSIDIAN</h3>
      <div class="it"><span class="m" style="color:var(--red)">✓</span><span class="x">One live galactic grid</span></div>
      <div class="it"><span class="m" style="color:var(--red)">✓</span><span class="x">One encrypted channel, one doctrine</span></div>
      <div class="it"><span class="m" style="color:var(--red)">✓</span><span class="x">Counter-recruitment broadcasts</span></div>
      <div class="it"><span class="m" style="color:var(--red)">✓</span><span class="x">Intel escalates into hunts</span></div>
    </div>
  </div>
  <div class="mono" style="font-size:8pt;letter-spacing:.14em;color:var(--muted);text-align:center;margin-top:12pt">THE EMPIRE DOES NOT COMPETE WITH BETTER LEGIONS — IT COMPETES WITH BETTER COORDINATION</div>
  ${footer("Competition", 8)}
</div></div>`);

/* 09 — 3D (dark plate) */
slides.push(`
<div class="slide dark">
  <div class="bgimg" style="background-image:${bg("warship.png")}"></div>
  <div class="veil"></div>
  <div class="pad">
    <div class="kick">08 — Craft · 3D</div>
    <div class="h1">A raytracer we <span class="em" style="color:#B00E27">wrote ourselves.</span></div>
    <div class="lede">Eight scenes from a vectorized numpy renderer built from scratch — no external 3D software, no stock renders.</div>
    <div class="rgrid">
      ${[["sigil.png", "Sigil"], ["warship.png", "Warship"], ["helmet.png", "Helmet"], ["planet.png", "Planet"], ["probe.png", "Probe"], ["throne.png", "Throne"], ["blade.png", "Blade"], ["citadel.png", "Citadel"]].map(([f, c]) => `
        <div class="rcell"><img src="data:image/png;base64,${b64(f)}"/><div class="cap">${c}</div></div>`).join("")}
    </div>
    ${footer("Craft · 3D", 9, true)}
  </div>
</div>`);

/* 10 — BRAND (light) */
slides.push(`
<div class="slide"><div class="pad">
  ${wm}
  <div class="kick">09 — Craft · Brand</div>
  <div class="h1">Iron <span class="em">Protocol.</span></div>
  <div class="sws">
    ${[["#F5F2EA", "PAPER", "ink text"], ["#1A1611", "INK", "type"], ["#B00E27", "IMPERIAL", "one accent"], ["#8A8274", "MUTED", "secondary"], ["#EFEBE0", "PAPER HI", "surfaces"]].map(([c, l, s]) => `<div class="sw" style="background:${c};color:${c === "#F5F2EA" || c === "#EFEBE0" ? "#1A1611" : "#F5F2EA"}">${c}<small>${l} · ${s}</small></div>`).join("")}
  </div>
  <div class="tspec">
    <div>
      <div class="lab">Display — Playfair Display</div>
      <div class="sample1">Order <em>is</em> peace.</div>
    </div>
    <div>
      <div class="lab">UI — Inter</div>
      <div class="sample2">Authenticate · Dispatch · Hunt</div>
    </div>
    <div>
      <div class="lab">Data — Plex Mono</div>
      <div class="sample3">SIGHTING LOG // SECTOR 9 // 02:41:07</div>
    </div>
  </div>
  <div class="tspec" style="margin-top:12pt;border-top:1px solid var(--hair);padding-top:10pt">
    <div>
      <div class="lab">Motion</div>
      <div class="sample2" style="font-size:10.5pt;color:var(--ink2);line-height:1.6">Scramble-decode titles · count-up telemetry · radar sweep · WebAudio interface sounds — motion with meaning, never decoration.</div>
    </div>
    <div>
      <div class="lab">Voice</div>
      <div class="sample2" style="font-size:10.5pt;color:var(--ink2);line-height:1.6">Absolute, institutional, merciless. Data before adjectives. The Empire does not explain — it commands.</div>
    </div>
  </div>
  ${footer("Craft · Brand", 10)}
</div></div>`);

/* 11 — TEAM */
slides.push(`
<div class="slide"><div class="pad">
  ${wm}
  <div class="kick">10 — The Team</div>
  <div class="h1">Three operatives. <span class="em">One doctrine.</span></div>
  <div class="team">
    <div class="tm"><div class="ini">OPERATIVE 001</div><div class="nm">Anuj Phulera</div><div class="rl">Developer · AI · Backend</div><div class="bio">Builds the engine — zero-latency systems, the AI that makes the hunt computable.</div></div>
    <div class="tm"><div class="ini">OPERATIVE 002</div><div class="nm">Aarav Choudhary</div><div class="rl">Vision · Marketing · Ideas</div><div class="bio">Saw the decay of the old order and imagined something absolute. Engineers the narrative.</div></div>
    <div class="tm"><div class="ini">OPERATIVE 003</div><div class="nm">Jeehaan Kwatra</div><div class="rl">Design · Media · Pitch</div><div class="bio">Forges the aesthetic — every pixel, every frame, every blade of the sigil.</div></div>
  </div>
  <div class="mono" style="font-size:8pt;letter-spacing:.18em;color:var(--muted);text-align:center;margin-top:12pt">IDEATION · ENGINEERING · DESIGN · FILM · PITCH — ALL IN-HOUSE</div>
  ${footer("The Team", 11)}
</div></div>`);

/* 12 — ROADMAP */
slides.push(`
<div class="slide"><div class="pad">
  ${wm}
  <div class="kick">11 — The Road Ahead</div>
  <div class="h1">The net <span class="em">expands.</span></div>
  <div class="road">
    <div class="r2"><div class="n">02</div><div class="tx"><b>Probe Mesh</b><s>Fleet-wide probe telemetry with live alerts</s></div></div>
    <div class="r2"><div class="n">03</div><div class="tx"><b>Voice Command</b><s>Talk to the mainframe — the terminal listens</s></div></div>
    <div class="r2"><div class="n">04</div><div class="tx"><b>Sector Simulation</b><s>AI-generated Jedi behavior patterns for training</s></div></div>
    <div class="r2"><div class="n">05</div><div class="tx"><b>Citizen Network</b><s>Anonymous tip portal feeding the intelligence grid</s></div></div>
  </div>
  ${footer("The Road Ahead", 12)}
</div></div>`);

/* 13 — CLOSE (dark plate) */
slides.push(`
<div class="slide dark">
  <div class="bgimg" style="background-image:${bg("throne.png")}"></div>
  <div class="veil"></div>
  <div class="pad" style="justify-content:center;align-items:center;text-align:center">
    <div style="max-width:10in">
      <div class="kick" style="text-align:center">TS '26 · Creative Prelims</div>
      <div class="h1" style="font-size:52pt">The hunt never <span class="em" style="color:#B00E27">ends.</span></div>
      <div style="font-family:'Playfair',serif;font-style:italic;font-size:15pt;color:#C9C2B4;margin-top:14pt">Until the last ember is cold.</div>
      <div style="width:2.2in;height:2pt;background:var(--red);margin:22pt auto"></div>
      <div class="mono" style="font-size:9pt;letter-spacing:.26em;color:#A9A294;text-transform:uppercase;line-height:2.2">OBSIDIAN · Imperial Security Network<br/>Anuj Phulera · Aarav Choudhary · Jeehaan Kwatra</div>
      <div style="border:1.5pt solid var(--red);color:var(--cream);display:inline-block;margin-top:20pt;padding:8pt 18pt;font-family:'PlexMono',monospace;font-size:9pt;letter-spacing:.22em">PASSPHRASE: FOR THE EMPIRE — TRY THE DEMO</div>
    </div>
    ${footer("Close", 13, true)}
  </div>
</div>`);

const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${CSS}</style></head><body>${slides.join("")}</body></html>`;
fs.writeFileSync(path.join(OUT, "deck.html"), html);
console.log("deck.html:", (html.length / 1024).toFixed(0), "KB ·", slides.length, "slides");
