/* Generates the OBSIDIAN pitch deck as pixel-perfect HTML slides (13), then it's
   converted to PDF via html2pdf.js. Renders are base64-embedded. */
"use strict";
const fs = require("fs");
const path = require("path");

const REND = path.join(__dirname, "..", "deliverables", "renders");
const OUT = path.join(__dirname, "..", "deliverables", "deck");

const b64 = (name) => {
  const p = path.join(REND, name);
  return fs.readFileSync(p).toString("base64");
};
const bg = (name) => `url('data:image/png;base64,${b64(name)}')`;

const CSS = `
@page{size:13.333in 7.5in;margin:0}
*{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
@font-face{font-family:'Cinzel';src:url('file:///home/user/Dayum/obsidian-command/app/fonts/cinzel-latin-900-normal.woff2') format('woff2');font-weight:900}
@font-face{font-family:'Cinzel';src:url('file:///home/user/Dayum/obsidian-command/app/fonts/cinzel-latin-700-normal.woff2') format('woff2');font-weight:700}
@font-face{font-family:'Cinzel';src:url('file:///home/user/Dayum/obsidian-command/app/fonts/cinzel-latin-400-normal.woff2') format('woff2');font-weight:400}
@font-face{font-family:'PlexMono';src:url('file:///home/user/Dayum/obsidian-command/app/fonts/ibm-plex-mono-latin-400-normal.woff2') format('woff2');font-weight:400}
@font-face{font-family:'PlexMono';src:url('file:///home/user/Dayum/obsidian-command/app/fonts/ibm-plex-mono-latin-700-normal.woff2') format('woff2');font-weight:700}
html,body{width:13.333in;height:7.5in;background:#06060a;color:#eae6da;font-family:'PlexMono',monospace}
.slide{width:13.333in;height:7.5in;position:relative;overflow:hidden;page-break-after:always;display:flex;flex-direction:column;background:#06060a}
.slide:last-child{page-break-after:auto}
.bgimg{position:absolute;inset:0;background-size:cover;background-position:center}
.veil{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(6,6,10,.30) 0%,rgba(6,6,10,.88) 100%)}
.pad{padding:0.55in 0.6in 0.42in;position:relative;flex:1;display:flex;flex-direction:column;min-height:0}
.kicker{font-size:10pt;font-weight:700;letter-spacing:.28em;color:#ff2a44;text-transform:uppercase}
.kbar{width:0.55in;height:2.5pt;background:#e01e37;margin:5pt 0 9pt}
.t1{font-family:'Cinzel',serif;font-weight:900;font-size:34pt;line-height:1.02;color:#eae6da;letter-spacing:.01em;text-transform:uppercase}
.t1 .accent{color:#ff2a44}
.hrule{height:1px;background:linear-gradient(90deg,#e01e37,transparent);margin:14pt 0 18pt}
.ftr{position:absolute;left:0.6in;right:0.6in;bottom:0.22in;display:flex;justify-content:space-between;font-size:7pt;letter-spacing:.22em;color:#3a3a4a;text-transform:uppercase;border-top:1px solid #1e1e2e;padding-top:6pt}
.ftr .pg{color:#5e5e6e}
.p{color:#9494a2;font-size:10.5pt;line-height:1.65}
.p.hi{color:#eae6da}
.red{color:#ff2a44}.amber{color:#f4a300}.green{color:#3ddc84}.ice{color:#9fb4d8}.dim{color:#5e5e6e}
.row{display:flex;gap:14pt;align-items:center}
.spread{justify-content:space-between}
/* cards */
.cards{display:grid;gap:10pt;flex:1;min-height:0}
.c2{grid-template-columns:1fr 1fr}
.c3{grid-template-columns:1fr 1fr 1fr}
.c4{grid-template-columns:1fr 1fr 1fr 1fr}
.card{background:#0b0b12;border:1px solid #222234;padding:14pt 15pt;position:relative;display:flex;flex-direction:column;gap:6pt;overflow:hidden}
.card .t{font-family:'Cinzel',serif;font-weight:700;font-size:11.5pt;letter-spacing:.12em;color:#eae6da;text-transform:uppercase}
.card .t .num{color:#ff2a44;margin-right:6pt}
.card .d{font-size:8.5pt;color:#9494a2;line-height:1.5}
.card .bar{position:absolute;left:0;top:0;bottom:0;width:3pt;background:#e01e37}
.card.amber .bar{background:#f4a300}.card.green .bar{background:#3ddc84}.card.ice .bar{background:#9fb4d8}
/* chips */
.chips{display:flex;gap:6pt;flex-wrap:wrap}
.chip{border:1px solid #33334a;padding:4pt 10pt;font-size:7.5pt;letter-spacing:.14em;color:#9fb4d8;text-transform:uppercase;background:#0b0b12}
.chip.red{border-color:#7a0e1e;color:#ff2a44;background:rgba(224,30,55,.07)}
/* stats */
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10pt;flex:1;min-height:0}
.stat{background:#0b0b12;border:1px solid #222234;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6pt;position:relative;overflow:hidden}
.stat .v{font-family:'Cinzel',serif;font-weight:900;font-size:40pt;color:#ff2a44;line-height:1}
.stat .l{font-size:10pt;font-weight:700;letter-spacing:.16em;color:#eae6da;text-transform:uppercase;font-family:'Cinzel',serif}
.stat .s{font-size:7.5pt;color:#5e5e6e;letter-spacing:.08em}
/* check list */
.checks{display:flex;flex-direction:column;gap:9pt}
.check{display:flex;gap:10pt;align-items:flex-start;background:#0b0b12;border:1px solid #222234;padding:10pt 12pt}
.check .mk{color:#3ddc84;font-size:11pt;font-weight:700}
.check .tx{font-size:9.5pt;color:#9494a2;line-height:1.5}
/* table rows */
.rows{display:flex;flex-direction:column;gap:9pt;flex:1;min-height:0}
.trow{display:flex;align-items:center;gap:12pt;background:#0b0b12;border:1px solid #222234;padding:10pt 14pt}
.trow .tag{font-size:7pt;letter-spacing:.2em;color:#ff2a44;border:1px solid #7a0e1e;padding:3pt 8pt;text-transform:uppercase}
.trow .tt{font-family:'Cinzel',serif;font-weight:700;font-size:13pt;color:#eae6da;text-transform:uppercase;width:2.4in}
.trow .td{font-size:8.5pt;color:#9494a2}
/* wireframes */
.wf{background:#07070d;border:1px solid #33334a;position:relative;overflow:hidden}
.wf-app{display:flex;flex-direction:column}
.wf-app .wf-top{height:22pt;border-bottom:1px solid #1e1e2e;background:#0a0a12;display:flex;align-items:center;padding:0 10pt}
.wf-app .wf-top b{font-family:'Cinzel',serif;font-size:8pt;letter-spacing:.2em}
.wf-app .wf-body{display:flex;flex:1;min-height:0}
.wf-app .wf-side{width:18%;border-right:1px solid #1e1e2e;background:#0a0a12;padding:8pt 6pt;display:flex;flex-direction:column;gap:5pt}
.wf-app .wf-side i{height:11pt;border:1px solid #1e1e2e;background:#0e0e18}
.wf-app .wf-side i.on{border-color:#e01e37;background:rgba(224,30,55,.12)}
.wf-app .wf-main{flex:1;padding:10pt;display:flex;flex-direction:column;gap:8pt}
.wf-app .wf-main .t{font-family:'Cinzel',serif;font-size:9pt;letter-spacing:.14em;color:#eae6da}
.wf-app .wf-main .ln{height:9pt;background:#10101c;border:1px solid #1e1e2e}
.wf-app .wf-main .ln.w{width:70%}
/* radar */
.wf-radar{position:relative;background:#06060c;border:1px solid #33334a}
.wf-radar .disc{position:absolute;border-radius:50%;border:1px solid rgba(224,30,55,.25)}
.wf-radar .heat{position:absolute;border-radius:50%;background:rgba(224,30,55,.14)}
.wf-radar .heat.a{background:rgba(244,163,0,.13)}
.wf-radar .blip{position:absolute;width:7pt;height:7pt;border-radius:50%;background:#ff2a44;border:1px solid #ff2a44}
.wf-radar .blip.a{background:#f4a300;border-color:#f4a300}
.wf-radar .blip.s{background:#9494a2;border-color:#9494a2}
.wf-radar .sweep{position:absolute;left:50%;top:50%;width:1.5pt;height:42%;background:linear-gradient(180deg,#ff2a44,rgba(255,42,68,0));transform-origin:top;transform:rotate(0deg)}
.wf-radar .info{position:absolute;right:7pt;top:7pt;width:32%;background:#0a0a12;border:1px solid #222234;padding:8pt}
.wf-radar .info b{font-family:'Cinzel',serif;font-size:7pt;letter-spacing:.16em;color:#ff2a44}
.wf-radar .info .l{height:6pt;background:#14141f;margin-top:5pt}
.wf-radar .cap{position:absolute;left:8pt;bottom:7pt;font-size:6pt;letter-spacing:.2em;color:#3a3a4a;text-transform:uppercase}
/* kanban */
.wf-kan{display:flex;gap:7pt}
.wf-kan .col{flex:1;background:#08080e;border:1px solid #1e1e2e;padding:7pt;display:flex;flex-direction:column;gap:6pt}
.wf-kan .col h{font-size:6pt;letter-spacing:.14em;color:#5e5e6e;text-transform:uppercase;border-bottom:1px solid #1e1e2e;padding-bottom:4pt}
.wf-kan .cd{height:34pt;background:#0e0e16;border:1px solid #33334a;border-left:3pt solid #ff2a44}
.wf-kan .cd.a{border-left-color:#f4a300}.wf-kan .cd.g{border-left-color:#3ddc84}
/* terminal */
.wf-term{background:#04040a;border:1px solid #33334a;padding:10pt 12pt;font-size:7pt;line-height:1.8;color:#9494a2}
.wf-term b{font-family:'Cinzel',serif;font-size:8pt;letter-spacing:.2em;color:#eae6da}
.wf-term .g{color:#3ddc84}.wf-term .r{color:#ff2a44}.wf-term .a{color:#f4a300}
/* chat */
.wf-chat{background:#07070d;border:1px solid #33334a;padding:9pt 10pt;display:flex;flex-direction:column;gap:6pt}
.wf-chat b{font-family:'Cinzel',serif;font-size:8pt;letter-spacing:.18em}
.wf-chat .m{align-self:flex-start;max-width:70%;background:#0e0e16;border:1px solid #33334a;padding:7pt 9pt;font-size:7pt;color:#eae6da}
.wf-chat .m.mine{align-self:flex-end;border-color:#5a101c;background:rgba(224,30,55,.1)}
.wf-chat .in{border:1px solid #222234;background:#0a0a12;padding:6pt 8pt;font-size:6.5pt;color:#3a3a4a;margin-top:auto}
/* broadcast */
.wf-bcast{background:#07070d;border:1px solid #33334a;padding:9pt 10pt;display:flex;flex-direction:column;gap:7pt}
.wf-bcast b{font-family:'Cinzel',serif;font-size:8pt;letter-spacing:.18em}
.wf-bcast .paper{background:#0b0b12;border:1px solid #1e1e2e;padding:10pt;font-size:7.5pt;color:#9494a2;line-height:1.7;flex:1}
.wf-bcast .send{align-self:center;border:1px solid #e01e37;background:rgba(224,30,55,.1);color:#eae6da;font-size:7.5pt;letter-spacing:.2em;padding:6pt 18pt;text-transform:uppercase;font-family:'Cinzel',serif}
/* steps */
.steps{display:grid;grid-template-columns:1fr 1fr;gap:7pt;flex:1;min-height:0;align-content:start}
.step{display:flex;gap:9pt;align-items:center;background:#0b0b12;border:1px solid #222234;padding:8pt 11pt}
.step .n{width:20pt;height:20pt;border:1px solid #e01e37;color:#ff2a44;font-size:9pt;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:700}
.step .tx b{font-family:'Cinzel',serif;font-size:9.5pt;letter-spacing:.12em;color:#eae6da;text-transform:uppercase}
.step .tx s{display:block;font-size:7.5pt;color:#9494a2}
/* renders grid */
.rgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:9pt;flex:1;min-height:0}
.rcell{border:1px solid #222234;background:#0b0b12;overflow:hidden;display:flex;flex-direction:column}
.rcell img{width:100%;flex:1;object-fit:cover;min-height:0}
.rcell .cap{font-size:6.5pt;letter-spacing:.18em;color:#5e5e6e;text-transform:uppercase;padding:5pt 8pt;border-top:1px solid #1e1e2e;text-align:center}
/* swatches */
.sws{display:grid;grid-template-columns:repeat(5,1fr);gap:8pt}
.sw{height:58pt;border:1px solid #33334a;padding:5pt 7pt;display:flex;flex-direction:column;justify-content:flex-end;font-size:6.5pt;color:#eae6da;text-shadow:0 1px 3px #000}
.sw small{font-size:5.5pt;opacity:.75;letter-spacing:.08em}
/* team */
.team{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12pt;flex:1;min-height:0}
.member{background:#0b0b12;border:1px solid #222234;display:flex;flex-direction:column;align-items:center;text-align:center;padding:20pt 16pt;gap:7pt;position:relative;overflow:hidden}
.member .bar{position:absolute;top:0;left:0;right:0;height:3pt;background:linear-gradient(90deg,#e01e37,#7a0e1e)}
.member .ava{width:64pt;height:64pt;border-radius:50%;border:1.5pt solid #e01e37;display:flex;align-items:center;justify-content:center;font-family:'Cinzel',serif;font-size:18pt;color:#ff2a44;background:radial-gradient(circle at 30% 30%,#161624,#07070c)}
.member .nm{font-family:'Cinzel',serif;font-weight:700;font-size:13pt;letter-spacing:.1em;text-transform:uppercase}
.member .rl{font-size:6.5pt;letter-spacing:.22em;color:#ff2a44;text-transform:uppercase}
.member .bio{font-size:8pt;color:#9494a2;line-height:1.6}
/* roadmap */
.road{display:flex;flex-direction:column;gap:10pt;flex:1;min-height:0;justify-content:center}
.road .step2{display:flex;gap:12pt;align-items:center;background:#0b0b12;border:1px solid #222234;padding:12pt 16pt}
.road .step2 .n{width:24pt;height:24pt;border:1px solid #e01e37;color:#ff2a44;font-size:11pt;display:flex;align-items:center;justify-content:center;font-weight:700}
.road .step2 .tx b{font-family:'Cinzel',serif;font-size:12pt;letter-spacing:.12em;text-transform:uppercase;color:#eae6da}
.road .step2 .tx s{display:block;font-size:8.5pt;color:#9494a2;margin-top:2pt}
/* sigil */
.sigil{width:120pt;height:120pt;filter:drop-shadow(0 0 22pt rgba(224,30,55,.5))}
.sigil.sm{width:70pt;height:70pt}
.sigil.lg{width:150pt;height:150pt}
.center{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;flex:1;position:relative}
/* compare */
.cmp{display:grid;grid-template-columns:1fr 1fr;gap:12pt;flex:1;min-height:0}
.cmp .side{background:#0b0b12;border:1px solid #222234;padding:16pt;display:flex;flex-direction:column;gap:10pt}
.cmp .side.win{border-color:#e01e37;background:rgba(224,30,55,.04)}
.cmp .side h3{font-family:'Cinzel',serif;font-size:13pt;letter-spacing:.14em;text-transform:uppercase}
.cmp .side.win h3{color:#ff2a44}
.cmp .side .it{display:flex;gap:9pt;align-items:flex-start}
.cmp .side .it .m{font-size:11pt;font-weight:700}
.cmp .side .it .x{color:#5e5e6e;font-size:9pt;line-height:1.5}
.cmp .side.win .it .x{color:#eae6da}
.cover-title{font-family:'Cinzel',serif;font-weight:900;font-size:58pt;letter-spacing:.24em;text-indent:.24em;color:#eae6da;text-shadow:0 0 60pt rgba(224,30,55,.5)}
.cover-sub{font-size:12pt;letter-spacing:.42em;text-indent:.42em;color:#ff2a44;font-weight:700;text-transform:uppercase;margin-top:12pt}
.cover-line{width:5.2in;height:1px;background:linear-gradient(90deg,transparent,#e01e37,transparent);margin:20pt auto}
.cover-meta{font-size:9pt;letter-spacing:.24em;color:#5e5e6e;text-transform:uppercase;line-height:2}
`;

const SIGIL = `<svg class="sigil" viewBox="0 0 100 100"><defs><radialGradient id="g" cx="50%" cy="50%" r="60%"><stop offset="0%" stop-color="#ff2a44"/><stop offset="70%" stop-color="#7a0e1e"/><stop offset="100%" stop-color="#2a050c"/></radialGradient></defs><path d="M50 3 61 24 84 16 76 39 97 50 76 61 84 84 61 76 50 97 39 76 16 84 24 61 3 50 24 39 16 16 39 24z" fill="url(#g)" stroke="#e01e37" stroke-width="1.5"/><circle cx="50" cy="50" r="16" fill="none" stroke="#eae6da" stroke-width="2"/><circle cx="50" cy="50" r="7" fill="#e01e37"/></svg>`;
const SIGIL_SM = SIGIL.replace('class="sigil"', 'class="sigil sm"');

const header = (k, t1, acc) => `
  <div class="kicker">${k}</div>
  <div class="kbar"></div>
  <div class="t1">${t1}${acc ? ` <span class="accent">${acc}</span>` : ""}</div>
  <div class="hrule"></div>`;

const footer = (sec, n) => `
  <div class="ftr"><span>OBSIDIAN · ${sec}</span><span class="pg">${String(n).padStart(2, "0")}</span></div>`;

const slides = [];

/* 01 — COVER */
slides.push(`
<div class="slide">
  <div class="bgimg" style="background-image:${bg("sigil.png")}"></div>
  <div class="veil"></div>
  <div class="center">
    ${SIGIL.replace('class="sigil"', 'class="sigil lg"')}
    <div class="cover-title">OBSIDIAN</div>
    <div class="cover-sub">The Empire's Nervous System</div>
    <div class="cover-line"></div>
    <div class="cover-meta">A classified command portal for the post-Order-66 hunt<br/>Anuj Phulera · Aarav Choudhary · Jeehaan Kwatra<br/>TS '26 Creative Prelims · Path 2 — The Empire</div>
  </div>
</div>`);

/* 02 — PROBLEM */
slides.push(`
<div class="slide">
  <div class="pad">
    ${header("The Problem", "The galaxy is", "scattered.")}
    <div class="row" style="gap:26pt;flex:1;min-height:0;align-items:stretch">
      <div style="flex:1;display:flex;flex-direction:column;gap:10pt">
        <p class="hi" style="font-size:12pt;line-height:1.7">Order 66 fell. Hundreds of Jedi survive across a thousand worlds — rebuilding, recruiting, learning to vanish.</p>
        <p style="font-size:10pt">The Empire has legions — but no eyes.</p>
        <div class="chips" style="margin-top:auto">
          <span class="chip red">9 targets</span><span class="chip">10 sectors</span><span class="chip">6 hunters</span><span class="chip red">0 coordination</span>
        </div>
      </div>
      <div class="cards c2" style="flex:1.4">
        <div class="card"><div class="bar"></div><div class="t">Fragmented Intel</div><div class="d">reports filed into a void — no single picture of the galaxy</div></div>
        <div class="card amber"><div class="bar"></div><div class="t">Isolated Hunters</div><div class="d">six Inquisitors, six separate hunts — no shared channel</div></div>
        <div class="card amber"><div class="bar"></div><div class="t">No Recruit Defense</div><div class="d">the Order recruits through refugee networks, unchecked</div></div>
        <div class="card"><div class="bar"></div><div class="t">No Decision Layer</div><div class="d">sightings sit in ledgers while targets slip away</div></div>
      </div>
    </div>
    ${footer("Problem", 2)}
  </div>
</div>`);

/* 03 — SOLUTION */
slides.push(`
<div class="slide">
  <div class="pad">
    ${header("The Solution", "One nervous", "system.")}
    <p style="font-size:11pt;line-height:1.6;margin-bottom:16pt">OBSIDIAN turns a disorganized purge into a single hunting organism — every sector, probe and citizen a sensor in the Emperor's hand.</p>
    <div class="cards c4" style="flex:1">
      <div class="card"><div class="bar"></div><div class="t" style="font-size:24pt;color:#ff2a44">01</div><div class="t">Track</div><div class="d">radar, probes, sightings — one live grid</div></div>
      <div class="card"><div class="bar"></div><div class="t" style="font-size:24pt;color:#ff2a44">02</div><div class="t">Plan</div><div class="d">intel escalates into dispatch — one board</div></div>
      <div class="card"><div class="bar"></div><div class="t" style="font-size:24pt;color:#ff2a44">03</div><div class="t">Command</div><div class="d">every Inquisitor on one encrypted channel</div></div>
      <div class="card"><div class="bar"></div><div class="t" style="font-size:24pt;color:#ff2a44">04</div><div class="t">Disrupt</div><div class="d">counter-recruitment at broadcast scale</div></div>
    </div>
    <div class="row spread" style="margin-top:14pt">
      <span class="chip red">Passphrase Gate</span><span style="color:#5e5e6e">→</span><span class="chip">Typed Boot</span><span style="color:#5e5e6e">→</span><span class="chip">Clearance Alpha-7</span><span style="color:#5e5e6e">→</span><span class="chip red">Full Network</span>
    </div>
    ${footer("Solution", 3)}
  </div>
</div>`);

/* 04 — WHY NOW */
slides.push(`
<div class="slide">
  <div class="pad">
    ${header("Why Now · The Moment", "The window is", "open.")}
    <div class="row" style="gap:24pt;flex:1;min-height:0;align-items:stretch">
      <div style="flex:1;display:flex;flex-direction:column;gap:8pt">
        <p style="font-size:10.5pt;line-height:1.65">The brief hands us the moment: post-Order 66, survivors scattered, Empire uncoordinated. Whoever builds the nervous system first wins the galaxy.</p>
        <div class="trow"><span class="tag">TAM</span><span class="tt">The Galaxy</span><span class="td">a thousand worlds, unchecked</span></div>
        <div class="trow"><span class="tag" style="color:#f4a300;border-color:#6b4a08">SAM</span><span class="tt">The Empire</span><span class="td">ten sectors, eight legions</span></div>
        <div class="trow"><span class="tag" style="color:#eae6da;border-color:#33334a">SOM</span><span class="tt">The Hunt</span><span class="td">nine classified targets, now</span></div>
      </div>
      <div style="flex:1.1;display:flex;flex-direction:column;gap:8pt">
        <div class="kicker" style="font-size:8.5pt">Why OBSIDIAN Wins The Window</div>
        <div class="checks">
          <div class="check"><span class="mk">✓</span><span class="tx">Demoable live — judges operate it, not read about it</span></div>
          <div class="check"><span class="mk">✓</span><span class="tx">Original — zero canon, zero templates, zero stock</span></div>
          <div class="check"><span class="mk">✓</span><span class="tx">Complete — app, deck, film, 3D, design system</span></div>
          <div class="check"><span class="mk">✓</span><span class="tx">Offline-first — runs anywhere, forever</span></div>
        </div>
      </div>
    </div>
    ${footer("Why Now", 4)}
  </div>
</div>`);

/* 05 — PRODUCT */
slides.push(`
<div class="slide">
  <div class="pad">
    ${header("The Product", "Twelve modules.", "One hunt.")}
    <div class="cards c3" style="flex:1">
      ${["Command Deck|hero status board","Galaxy Tracker|radar + probe drops","Wanted Dossiers|9 psychoprofiled targets","Intelligence|probe / ISB feed","Operations|kanban hunt dispatch","Interdiction|propaganda studio","Inquisitor Uplink|encrypted comms","Imperial Archive|7 lore documents","Terminal|working mainframe shell","Manifesto|the Emperor's case","Hunt Metrics|purge completion","Standards|in-app design system"].map((x, i) => {
        const [t, d] = x.split("|");
        return `<div class="card"><div class="t"><span class="num">${String(i + 1).padStart(2, "0")}</span>${t}</div><div class="d">${d}</div></div>`;
      }).join("")}
    </div>
    <div class="kicker" style="text-align:center;margin-top:12pt;font-size:8pt;color:#5e5e6e">EVERY MODULE IS LIVE AND OPERABLE — NOT A MOCKUP</div>
    ${footer("Product", 5)}
  </div>
</div>`);

/* 06 — JOURNEY */
slides.push(`
<div class="slide">
  <div class="pad">
    ${header("The Product · Journey", "Three minutes to", "demonstrate it all.")}
    <div class="row" style="gap:24pt;flex:1;min-height:0;align-items:stretch">
      <div style="flex:1.4;display:flex;flex-direction:column;gap:9pt">
        <div class="wf wf-app" style="flex:1">
          <div class="wf-top"><b>OBSIDIAN</b></div>
          <div class="wf-body">
            <div class="wf-side"><i class="on"></i><i></i><i></i><i></i></div>
            <div class="wf-main">
              <div class="t">GALAXY TRACKER</div>
              <div class="wf wf-radar" style="flex:1">
                <div class="heat" style="left:12%;top:12%;width:22%;height:44%"></div>
                <div class="heat a" style="left:34%;top:52%;width:16%;height:32%"></div>
                <div class="sweep"></div>
                <div class="blip" style="left:18%;top:24%"></div>
                <div class="blip" style="left:32%;top:16%"></div>
                <div class="blip a" style="left:26%;top:48%"></div>
                <div class="blip a" style="left:48%;top:44%"></div>
                <div class="blip s" style="left:56%;top:22%"></div>
                <div class="info"><b>SIGHTING</b><div class="l"></div><div class="l"></div><div class="l"></div></div>
                <div class="cap">RADAR SWEEP · LIVE</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;gap:7pt">
        <div class="kicker" style="font-size:8.5pt">9-Step Demo</div>
        <div class="steps">
          ${["Gate|click to initialize","Boot|typed sequence, beeps","Passphrase|FOR THE EMPIRE","Deck|giant hero + live HUD","Tracker|click a blip → dossier","Ops|drag card to ACTIVE","Terminal|cat targets.log","Standards|the design system"].map((x, i) => {
            const [t, d] = x.split("|");
            return `<div class="step"><div class="n">${i + 1}</div><div class="tx"><b>${t}</b><s>${d}</s></div></div>`;
          }).join("")}
        </div>
      </div>
    </div>
    ${footer("Product", 6)}
  </div>
</div>`);

/* 07 — PROOF */
slides.push(`
<div class="slide">
  <div class="pad">
    ${header("Proof · Traction", "Built,", "not promised.")}
    <div class="stats">
      ${[["12", "Working Modules", "one login, one network"], ["9", "Original Jedi", "psychoprofiled"], ["8", "3D Scenes", "custom raytracer"], ["62s", "Promo Film", "original score"], ["100+", "Intel Reports", "generated live"], ["0", "External Assets", "everything in-house"]].map(([v, l, s]) => `
        <div class="stat"><div class="v">${v}</div><div class="l">${l}</div><div class="s">${s}</div></div>`).join("")}
    </div>
    <div class="row spread" style="margin-top:14pt">
      <span class="chip red">Terminal runs a real filesystem</span>
      <span class="chip">Inquisitors reply in-character</span>
      <span class="chip red">Board drags &amp; drops</span>
      <span class="chip">Film assembled by pipeline</span>
    </div>
    ${footer("Proof", 7)}
  </div>
</div>`);

/* 08 — COMPETITION */
slides.push(`
<div class="slide">
  <div class="pad">
    ${header("Competitive Landscape", "The old way", "vs. the network.")}
    <div class="cmp">
      <div class="side">
        <h3 style="color:#5e5e6e">THE OLD EMPIRE</h3>
        <div class="it"><span class="m" style="color:#5e5e6e">✗</span><span class="x">reports vanish into ledgers</span></div>
        <div class="it"><span class="m" style="color:#5e5e6e">✗</span><span class="x">six hunters, six separate hunts</span></div>
        <div class="it"><span class="m" style="color:#5e5e6e">✗</span><span class="x">recruitment lanes wide open</span></div>
        <div class="it"><span class="m" style="color:#5e5e6e">✗</span><span class="x">sightings never become strikes</span></div>
      </div>
      <div class="side win">
        <h3>OBSIDIAN</h3>
        <div class="it"><span class="m" style="color:#3ddc84">✓</span><span class="x">one live galactic grid</span></div>
        <div class="it"><span class="m" style="color:#3ddc84">✓</span><span class="x">one encrypted channel, one doctrine</span></div>
        <div class="it"><span class="m" style="color:#3ddc84">✓</span><span class="x">counter-recruitment broadcasts</span></div>
        <div class="it"><span class="m" style="color:#3ddc84">✓</span><span class="x">intel escalates into hunts</span></div>
      </div>
    </div>
    <div class="kicker" style="text-align:center;margin-top:13pt;font-size:8pt;color:#5e5e6e">THE EMPIRE DOES NOT COMPETE WITH BETTER LEGIONS — IT COMPETES WITH BETTER COORDINATION</div>
    ${footer("Competition", 8)}
  </div>
</div>`);

/* 09 — 3D */
slides.push(`
<div class="slide">
  <div class="pad">
    ${header("Craft · Visual Identity", "3D — a raytracer", "we wrote ourselves.")}
    <p style="font-size:10pt;margin-bottom:13pt">Eight scenes, one vectorized numpy raytracer built from scratch — no external 3D software, no stock renders.</p>
    <div class="rgrid">
      ${[["sigil.png", "The Sigil"], ["warship.png", "Warship"], ["helmet.png", "Helmet"], ["planet.png", "Planet"], ["probe.png", "Probe"], ["throne.png", "Throne"], ["blade.png", "Blade"], ["citadel.png", "Citadel"]].map(([f, c]) => `
        <div class="rcell"><img src="data:image/png;base64,${b64(f)}"/><div class="cap">${c}</div></div>`).join("")}
    </div>
    ${footer("Craft · 3D", 9)}
  </div>
</div>`);

/* 10 — BRAND */
slides.push(`
<div class="slide">
  <div class="pad">
    ${header("Craft · Iron Protocol", "One design", "system.")}
    <div class="sws">
      ${[["#050507", "BASE"], ["#0b0b12", "PANEL"], ["#1e1e2e", "HAIRLINE"], ["#e8e4d8", "BONE"], ["#8a8a94", "STEEL"], ["#e01e37", "ACTION"], ["#ff2a44", "ALERT"], ["#7a0e1e", "DEEP"], ["#f4a300", "WARN"], ["#3ddc84", "POS"]].map(([c, l]) => `<div class="sw" style="background:${c}">${c}<small>${l}</small></div>`).join("")}
    </div>
    <div class="row" style="margin-top:16pt;gap:20pt;align-items:flex-end">
      <div style="flex:1">
        <div class="kicker" style="font-size:8pt">Typography</div>
        <div style="font-family:'Cinzel',serif;font-weight:900;font-size:26pt;letter-spacing:.06em;margin-top:6pt">ORDER IS PEACE</div>
        <div style="font-size:8.5pt;color:#9494a2;margin-top:6pt">SIGHTING LOG // SECTOR 9 // 02:41:07 · AUTHENTICATE · DISPATCH · HUNT</div>
      </div>
      <div style="flex:1">
        <div class="kicker" style="font-size:8pt">Motion &amp; Tone</div>
        <div style="font-size:8.5pt;color:#9494a2;line-height:1.8;margin-top:6pt">Scramble titles · magnetic buttons · count-ups · radar sweep · WebAudio UI sounds · absolute, institutional, merciless</div>
      </div>
    </div>
    ${footer("Craft · Brand", 10)}
  </div>
</div>`);

/* 11 — TEAM */
slides.push(`
<div class="slide">
  <div class="pad">
    ${header("The Team", "Three operatives.", "One doctrine.")}
    <div class="team">
      <div class="member"><div class="bar"></div><div class="ava">AP</div><div class="nm">Anuj Phulera</div><div class="rl">Developer · AI · Backend</div><div class="bio">Builds the engine — zero-latency systems, the AI that makes the hunt computable.</div></div>
      <div class="member"><div class="bar"></div><div class="ava">AC</div><div class="nm">Aarav Choudhary</div><div class="rl">Vision · Marketing · Ideas</div><div class="bio">Saw the decay of the old order and imagined something absolute. Engineers the narrative.</div></div>
      <div class="member"><div class="bar"></div><div class="ava">JK</div><div class="nm">Jeehaan Kwatra</div><div class="rl">Design · Media · Pitch</div><div class="bio">Forges the aesthetic — every pixel, every frame, every blade of the sigil.</div></div>
    </div>
    <div class="kicker" style="text-align:center;margin-top:13pt;font-size:8pt;color:#5e5e6e">IDEATION · ENGINEERING · DESIGN · FILM · PITCH — ALL IN-HOUSE</div>
    ${footer("Team", 11)}
  </div>
</div>`);

/* 12 — ROADMAP */
slides.push(`
<div class="slide">
  <div class="pad">
    ${header("The Road Ahead", "The net", "expands.")}
    <div class="road">
      ${[["02", "Probe Mesh", "fleet-wide probe telemetry with live alerts"], ["03", "Voice Command", "talk to the mainframe — the terminal listens"], ["04", "Sector Simulation", "AI-generated Jedi behavior patterns for training"], ["05", "Citizen Network", "anonymous tip portal feeding the intelligence grid"]].map(([n, t, d]) => `
        <div class="step2"><div class="n">${n}</div><div class="tx"><b>${t}</b><s>${d}</s></div></div>`).join("")}
    </div>
    ${footer("Roadmap", 12)}
  </div>
</div>`);

/* 13 — CLOSE */
slides.push(`
<div class="slide">
  <div class="bgimg" style="background-image:${bg("throne.png")}"></div>
  <div class="veil"></div>
  <div class="center">
    ${SIGIL_SM}
    <div class="cover-title" style="font-size:40pt">THE HUNT NEVER ENDS</div>
    <div class="cover-sub" style="font-size:10pt;letter-spacing:.34em;text-indent:.34em">Until the last ember is cold</div>
    <div class="cover-line"></div>
    <div class="cover-meta">OBSIDIAN · Imperial Security Network<br/>Anuj Phulera · Aarav Choudhary · Jeehaan Kwatra<br/>TS '26 Creative Prelims</div>
    <div class="chip red" style="margin-top:14pt;font-size:8pt">PASSPHRASE: FOR THE EMPIRE — TRY THE DEMO</div>
  </div>
</div>`);

const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${CSS}</style></head><body>${slides.join("")}</body></html>`;

fs.writeFileSync(path.join(OUT, "deck.html"), html);
console.log("deck.html written:", (html.length / 1024).toFixed(0), "KB ·", slides.length, "slides");
