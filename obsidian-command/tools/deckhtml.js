/* OBSIDIAN PITCH DECK v6 — art-directed, human. 
   Varied layouts per slide · handwriting (Caveat) · marker highlights ·
   wobbly sketch cards · sticky notes · tape · Anton impact type.
   No repeated template, no AI-uniformity. */
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
@font-face{font-family:'Anton';src:url('${F}anton-latin-400-normal.woff2') format('woff2');font-weight:400}
@font-face{font-family:'Playfair';src:url('${F}playfair-display-latin-400-normal.woff2') format('woff2');font-weight:400}
@font-face{font-family:'Playfair';src:url('${F}playfair-display-latin-600-normal.woff2') format('woff2');font-weight:600}
@font-face{font-family:'Playfair';src:url('${F}playfair-display-latin-700-normal.woff2') format('woff2');font-weight:700}
@font-face{font-family:'Playfair';src:url('${F}playfair-display-latin-900-normal.woff2') format('woff2');font-weight:900}
@font-face{font-family:'Playfair';src:url('${F}playfair-display-latin-400-italic.woff2') format('woff2');font-weight:400;font-style:italic}
@font-face{font-family:'Playfair';src:url('${F}playfair-display-latin-700-italic.woff2') format('woff2');font-weight:700;font-style:italic}
@font-face{font-family:'Inter';src:url('${F}inter-latin-400-normal.woff2') format('woff2');font-weight:400}
@font-face{font-family:'Inter';src:url('${F}inter-latin-500-normal.woff2') format('woff2');font-weight:500}
@font-face{font-family:'Inter';src:url('${F}inter-latin-600-normal.woff2') format('woff2');font-weight:600}
@font-face{font-family:'Inter';src:url('${F}inter-latin-700-normal.woff2') format('woff2');font-weight:700}
@font-face{font-family:'Caveat';src:url('${F}caveat-latin-400-normal.woff2') format('woff2');font-weight:400}
@font-face{font-family:'Caveat';src:url('${F}caveat-latin-700-normal.woff2') format('woff2');font-weight:700}
@font-face{font-family:'PlexMono';src:url('${F}ibm-plex-mono-latin-400-normal.woff2') format('woff2');font-weight:400}

:root{
  --paper:#F6F3EA; --card:#FBFAF4; --ink:#201B14; --ink2:#4A4338;
  --muted:#8F8776; --hair:#E2DBC9; --red:#C1121F; --red-d:#8F0D18;
  --plate:#131110; --cream:#F6F3EA;
}
html,body{width:13.333in;height:7.5in;background:var(--paper);color:var(--ink);font-family:'Inter',sans-serif}
.slide{width:13.333in;height:7.5in;position:relative;overflow:hidden;page-break-after:always;background:var(--paper)}
.slide:last-child{page-break-after:auto}
/* type helpers */
.anton{font-family:'Anton',sans-serif;font-weight:400;text-transform:uppercase;letter-spacing:.005em}
.pf{font-family:'Playfair',serif}
.pf-i{font-family:'Playfair',serif;font-style:italic}
.hand{font-family:'Caveat',cursive;font-weight:700}
.mono{font-family:'PlexMono',monospace}
.red{color:var(--red)}
.mut{color:var(--muted)}
/* handwritten squiggle underline */
.u{position:relative;display:inline-block}
.u svg{position:absolute;left:0;right:0;bottom:-0.06em;width:100%;height:0.32em}
/* marker highlight */
.mk{position:relative;display:inline-block;padding:0 .08em}
.mk::after{content:"";position:absolute;left:-0.05em;right:-0.05em;top:0.55em;height:0.42em;background:rgba(193,18,31,.22);transform:rotate(-0.6deg);z-index:-1;border-radius:2px}
/* wobbly sketch card */
.wb{border:2px solid var(--ink);border-radius:255px 15px 225px 15px/15px 225px 15px 255px;background:var(--card)}
.wb2{border:2px solid var(--ink);border-radius:15px 225px 15px 255px/255px 15px 225px 15px;background:var(--card)}
/* sticky note */
.sticky{background:#FFF3B0;border:1px solid #E4D58A;box-shadow:2px 4px 10px rgba(32,27,20,.14);padding:14pt 16pt;position:relative;font-family:'Caveat',cursive;font-weight:700;color:#4A3F1E}
.sticky::before{content:"";position:absolute;top:-8pt;left:50%;transform:translateX(-50%) rotate(-2deg);width:64pt;height:12pt;background:rgba(226,213,138,.6);border:1px solid rgba(180,165,90,.35)}
/* tape */
.tape{position:absolute;width:52pt;height:14pt;background:rgba(226,213,138,.65);border-left:1px dashed rgba(160,145,80,.5);border-right:1px dashed rgba(160,145,80,.5);z-index:3}
/* sketch arrow */
.sarrow{position:relative}
.sarrow svg{position:absolute;top:50%;left:0;width:100%;height:40pt;transform:translateY(-50%);overflow:visible}
/* layout */
.pad{padding:0.6in 0.85in;position:relative;height:100%;display:flex;flex-direction:column}
.full{position:absolute;inset:0}
.bgimg{position:absolute;inset:0;background-size:cover;background-position:center}
.veil{position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,17,16,.85) 0%,rgba(18,17,16,.45) 50%,rgba(18,17,16,.92) 100%)}
.dark .anton{color:var(--cream)}
.dark .pf-i{color:#D9D2C2}
.dark .mono{color:#9A9284}
.dark .hand{color:#F6F3EA}
/* page marker */
.pgmark{position:absolute;bottom:0.34in;left:0.85in;font-family:'PlexMono',monospace;font-size:7.5pt;letter-spacing:.24em;color:var(--muted)}
.pgmark b{color:var(--red)}
/* ============ SLIDE 1 : COVER ============ */
.cov{position:absolute;inset:0;padding:0.6in 0.85in;display:flex;flex-direction:column;justify-content:space-between}
.cov .top{display:flex;justify-content:space-between;align-items:center;font-family:'PlexMono',monospace;font-size:8pt;letter-spacing:.26em;color:var(--ink)}
.cov .top .dot{display:inline-block;width:6pt;height:6pt;background:var(--red);border-radius:50%;margin-right:8pt}
.cov .big{font-family:'Anton',sans-serif;font-size:118pt;line-height:.9;letter-spacing:.002em;text-transform:uppercase;color:var(--ink)}
.cov .mid{display:flex;align-items:flex-end;justify-content:space-between}
.cov .sub{font-family:'Playfair',serif;font-style:italic;font-weight:700;font-size:22pt;color:var(--red);max-width:5.5in;line-height:1.25}
.cov .sub .mk::after{background:rgba(193,18,31,.18)}
.cov .note{position:absolute;top:1.35in;right:0.95in;transform:rotate(3deg)}
.cov .bot{display:flex;justify-content:space-between;border-top:2px solid var(--ink);padding-top:10pt;font-family:'PlexMono',monospace;font-size:8pt;letter-spacing:.2em;color:var(--ink2);text-transform:uppercase}
/* ============ SLIDE 2 : PROBLEM ============ */
.ghost{position:absolute;font-family:'Anton',sans-serif;font-size:240pt;line-height:1;color:rgba(32,27,20,.045);text-transform:uppercase;letter-spacing:.01em;white-space:nowrap;top:50%;left:0.6in;transform:translateY(-50%)}
.p2 .left{position:relative;z-index:2;max-width:7.4in}
.p2 .l1{font-family:'Anton',sans-serif;font-size:64pt;line-height:.95;text-transform:uppercase}
.p2 .l2{font-family:'Playfair',serif;font-style:italic;font-weight:700;font-size:19pt;color:var(--red);margin-top:10pt;max-width:6.6in;line-height:1.35}
.p2 .items{margin-top:22pt;display:flex;flex-direction:column;gap:0;max-width:7.2in}
.p2 .it{display:flex;gap:14pt;align-items:baseline;border-bottom:1.5px solid var(--ink);padding:9pt 2pt}
.p2 .it:first-child{border-top:1.5px solid var(--ink)}
.p2 .it .n{font-family:'Caveat',cursive;font-weight:700;font-size:20pt;color:var(--red);width:0.5in;flex-shrink:0;transform:rotate(-4deg)}
.p2 .it .t{font-family:'Playfair',serif;font-weight:700;font-size:14pt}
.p2 .it .d{font-size:9.5pt;color:var(--ink2);margin-left:auto;text-align:right;max-width:3.6in}
.p2 .note{position:absolute;right:0.9in;top:1.5in;transform:rotate(-2.5deg);z-index:3}
/* ============ SLIDE 3 : SOLUTION ============ */
.p3 .cards{display:flex;gap:0.42in;margin-top:26pt;position:relative;z-index:2;align-items:stretch}
.p3 .card{flex:1;padding:20pt 18pt;position:relative;transform:rotate(var(--r,0deg))}
.p3 .card:nth-child(1){--r:-1.2deg}
.p3 .card:nth-child(2){--r:0.8deg}
.p3 .card:nth-child(3){--r:-0.6deg}
.p3 .card:nth-child(4){--r:1.1deg}
.p3 .card .n{font-family:'Caveat',cursive;font-weight:700;font-size:26pt;color:var(--red)}
.p3 .card .t{font-family:'Anton',sans-serif;font-size:21pt;text-transform:uppercase;margin-top:2pt}
.p3 .card .d{font-size:9.5pt;color:var(--ink2);line-height:1.55;margin-top:6pt}
.p3 .flow{margin-top:20pt;display:flex;align-items:center;gap:10pt;font-family:'PlexMono',monospace;font-size:8pt;letter-spacing:.18em;color:var(--ink2)}
.p3 .flow .arr{color:var(--red);font-size:14pt}
.p3 .note{position:absolute;left:0.9in;top:0.9in;transform:rotate(-2deg)}
/* ============ SLIDE 4 : WHY NOW ============ */
.p4 .l1{font-family:'Anton',sans-serif;font-size:58pt;line-height:.95;text-transform:uppercase}
.p4 .cols{display:flex;gap:0.7in;margin-top:24pt;align-items:stretch;position:relative;z-index:2}
.p4 .col{flex:1}
.p4 .bars{margin-top:14pt;display:flex;flex-direction:column;gap:14pt}
.p4 .bar{display:flex;align-items:center;gap:12pt}
.p4 .bar .lab{font-family:'PlexMono',monospace;font-size:8pt;letter-spacing:.18em;color:var(--red);width:0.75in;flex-shrink:0}
.p4 .bar .track{flex:1;height:34pt;border:2px solid var(--ink);position:relative;background:var(--card);border-radius:3px}
.p4 .bar .fill{position:absolute;inset:0;background:var(--ink);width:var(--w)}
.p4 .bar .fill.hl{background:var(--red)}
.p4 .bar .tl{font-size:8.5pt;color:var(--ink2);margin-top:3pt}
.p4 .checks{margin-top:14pt;display:flex;flex-direction:column}
.p4 .ch{display:flex;gap:10pt;align-items:baseline;padding:7pt 0;border-bottom:1.5px solid var(--ink)}
.p4 .ch .m{font-family:'Caveat',cursive;font-weight:700;font-size:17pt;color:var(--red)}
.p4 .ch .tx{font-size:10.5pt;color:var(--ink2)}
/* ============ SLIDE 5 : PRODUCT SKETCH ============ */
.p5 .cols{display:flex;gap:0.5in;margin-top:16pt;align-items:stretch;flex:1;min-height:0}
.p5 .sketch{flex:1.15;position:relative;background:var(--card);border:2px solid var(--ink);border-radius:4px;padding:14pt;min-height:4.35in}
.p5 .sketch .top{display:flex;justify-content:space-between;align-items:center;gap:8pt;border-bottom:1.5px solid var(--ink);padding-bottom:8pt}
.p5 .sketch .top b{font-family:'Anton',sans-serif;font-size:11pt;letter-spacing:.05em;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.p5 .sketch .body{display:flex;margin-top:10pt;gap:10pt;height:3.3in}
.p5 .sketch .side{width:17%;border:1.5px solid var(--ink);padding:6pt;display:flex;flex-direction:column;gap:6pt;background:var(--paper)}
.p5 .sketch .side i{height:16pt;border:1.5px solid var(--ink)}
.p5 .sketch .side i.on{background:var(--red)}
.p5 .sketch .main{flex:1;border:1.5px solid var(--ink);padding:10pt;display:flex;flex-direction:column;gap:8pt;position:relative}
.p5 .sketch .main .t{font-family:'Playfair',serif;font-weight:700;font-size:11pt}
.p5 .sketch .main .ln{height:12pt;border:1.5px solid var(--ink)}
.p5 .sketch .main .ln.w{width:65%}
.p5 .sketch .main .radar{flex:1;border:1.5px solid var(--ink);margin-top:4pt;position:relative;background:var(--paper)}
.p5 .sketch .main .radar .c1{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:60%;height:60%;border:1.5px solid var(--ink);border-radius:50%}
.p5 .sketch .main .radar .c2{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:32%;height:32%;border:1.5px solid var(--ink);border-radius:50%}
.p5 .sketch .main .radar .sweep{position:absolute;left:50%;top:50%;width:2pt;height:48%;background:var(--red);transform-origin:top;transform:rotate(-30deg)}
.p5 .sketch .main .radar .bl{position:absolute;width:7pt;height:7pt;background:var(--red);border-radius:50%}
.p5 .ann{position:absolute;font-family:'Caveat',cursive;font-weight:700;font-size:13pt;color:var(--red);line-height:1.15;white-space:nowrap}
.p5 .list{flex:0.85;display:flex;flex-direction:column;justify-content:center;gap:0}
.p5 .li{display:flex;gap:8pt;align-items:baseline;border-bottom:1.5px solid var(--ink);padding:4.5pt 2pt}
.p5 .li .n{font-family:'Caveat',cursive;font-weight:700;font-size:14pt;color:var(--red);width:0.36in;flex-shrink:0}
.p5 .li .t{font-family:'Playfair',serif;font-weight:700;font-size:11.5pt}
.p5 .li .d{font-size:7.8pt;color:var(--muted);margin-left:auto;text-align:right}
/* ============ SLIDE 6 : DEMO STICKIES ============ */
.p6 .notes{display:grid;grid-template-columns:1fr 1fr;gap:0.5in 0.6in;margin-top:30pt;position:relative;z-index:2}
.p6 .sticky{font-size:14pt;line-height:1.5}
.p6 .sticky .big{font-size:19pt;color:var(--red)}
.p6 .sticky .sub{font-size:12.5pt;color:#6B5E2E}
.p6 .sticky:nth-child(1){transform:rotate(-1.8deg)}
.p6 .sticky:nth-child(2){transform:rotate(1.2deg)}
.p6 .sticky:nth-child(3){transform:rotate(-0.8deg)}
.p6 .sticky:nth-child(4){transform:rotate(1.6deg)}
.p6 .sticky .num{font-family:'PlexMono',monospace;font-size:9pt;letter-spacing:.14em;color:#8A7A3A;display:block;margin-bottom:4pt}
/* ============ SLIDE 7 : PROOF ============ */
.p7 .nums{display:grid;grid-template-columns:repeat(3,1fr);margin-top:30pt;gap:0 0.6in;position:relative;z-index:2}
.p7 .ncell{display:flex;flex-direction:column;gap:4pt;border-bottom:2.5px solid var(--ink);padding:14pt 0 10pt}
.p7 .ncell .v{font-family:'Anton',sans-serif;font-size:86pt;line-height:.85;text-transform:uppercase}
.p7 .ncell .l{font-size:11pt;font-weight:700;letter-spacing:.02em}
.p7 .ncell .s{font-size:9pt;color:var(--muted)}
.p7 .ncell .handnote{font-family:'Caveat',cursive;font-weight:700;font-size:13pt;color:var(--red);margin-top:2pt;transform:rotate(-1deg)}
/* ============ SLIDE 8 : COMPETITION ============ */
.p8 .cmp{display:flex;gap:0.7in;margin-top:26pt;position:relative;z-index:2}
.p8 .side{flex:1}
.p8 .side h3{font-family:'Anton',sans-serif;font-size:24pt;text-transform:uppercase;margin-bottom:10pt}
.p8 .it{display:flex;gap:12pt;align-items:baseline;padding:9pt 2pt;border-bottom:1.5px solid var(--ink)}
.p8 .it .m{font-family:'Caveat',cursive;font-weight:700;font-size:19pt;width:0.4in;flex-shrink:0;transform:rotate(-5deg)}
.p8 .it .x{font-size:11pt;color:var(--ink2)}
.p8 .lose .m{color:var(--muted)}
.p8 .lose .x{color:var(--muted)}
.p8 .win .m{color:var(--red)}
.p8 .win{border:2px solid var(--ink);border-radius:255px 15px 225px 15px/15px 225px 15px 255px;padding:18pt 20pt;background:var(--card);transform:rotate(0.6deg)}
.p8 .note{position:absolute;right:0.9in;top:0.8in;transform:rotate(2deg)}
/* ============ SLIDE 9 : 3D SPREAD ============ */
.p9 .spread{display:flex;gap:0.45in;margin-top:16pt}
.p9 .feature{flex:1;position:relative;border:2px solid var(--ink);background:var(--plate);overflow:hidden;height:3.35in}
.p9 .feature img{width:100%;height:100%;object-fit:cover}
.p9 .feature .cap{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(19,17,16,.85));color:var(--cream);padding:16pt 12pt 9pt;font-family:'Caveat',cursive;font-weight:700;font-size:14pt}
.p9 .strip{display:grid;grid-template-columns:repeat(6,1fr);gap:0.3in;margin-top:0.3in}
.p9 .cell{border:1.5px solid var(--ink);background:var(--plate);height:1.35in;overflow:hidden;position:relative;transform:rotate(var(--r,0deg))}
.p9 .cell:nth-child(odd){--r:-1deg}
.p9 .cell:nth-child(even){--r:1deg}
.p9 .cell img{width:100%;height:100%;object-fit:cover}
.p9 .cell .cap{position:absolute;bottom:0;left:0;right:0;background:rgba(19,17,16,.8);color:var(--cream);font-family:'PlexMono',monospace;font-size:6pt;letter-spacing:.14em;padding:3pt 6pt;text-transform:uppercase}
.p9 .note{position:absolute;right:0.95in;top:0.55in;transform:rotate(2.5deg);z-index:3}
/* ============ SLIDE 10 : BRAND ============ */
.p10 .chips{display:flex;gap:0.42in;margin-top:26pt;flex-wrap:wrap}
.p10 .chip{width:1.5in;height:1.05in;border:2px solid var(--ink);position:relative;padding:8pt;display:flex;flex-direction:column;justify-content:flex-end;font-family:'PlexMono',monospace;font-size:7pt}
.p10 .chip:nth-child(odd){transform:rotate(-1.2deg)}
.p10 .chip:nth-child(even){transform:rotate(1deg)}
.p10 .chip small{font-size:6pt;opacity:.75;margin-top:2pt}
.p10 .type{margin-top:24pt;display:flex;gap:0.6in;align-items:flex-end}
.p10 .type>div{flex:1}
.p10 .lab{font-family:'PlexMono',monospace;font-size:7pt;letter-spacing:.2em;color:var(--muted);text-transform:uppercase;margin-bottom:6pt}
.p10 .note{position:absolute;right:0.9in;top:0.55in;transform:rotate(-2deg);z-index:3}
/* ============ SLIDE 11 : TEAM POLAROIDS ============ */
.p11 .pols{display:flex;gap:0.7in;margin-top:26pt;justify-content:center;position:relative;z-index:2}
.p11 .pol{width:3.1in;background:var(--card);border:1.5px solid var(--ink);padding:12pt 12pt 16pt;position:relative;box-shadow:3px 5px 14px rgba(32,27,20,.12)}
.p11 .pol:nth-child(1){transform:rotate(-2.2deg)}
.p11 .pol:nth-child(2){transform:rotate(1.4deg)}
.p11 .pol:nth-child(3){transform:rotate(-1deg)}
.p11 .pol .photo{height:1.7in;border:1.5px solid var(--ink);display:flex;align-items:center;justify-content:center;background:var(--paper);position:relative;overflow:hidden}
.p11 .pol .photo .ini{font-family:'Playfair',serif;font-weight:900;font-size:52pt;color:rgba(193,18,31,.85)}
.p11 .pol .nm{font-family:'Caveat',cursive;font-weight:700;font-size:20pt;margin-top:9pt;text-align:center}
.p11 .pol .rl{font-family:'PlexMono',monospace;font-size:7pt;letter-spacing:.18em;color:var(--muted);text-align:center;text-transform:uppercase;margin-top:3pt}
.p11 .pol .bio{font-size:8.5pt;color:var(--ink2);line-height:1.55;text-align:center;margin-top:7pt}
/* ============ SLIDE 12 : ROADMAP ============ */
.p12 .road{position:relative;margin-top:36pt;z-index:2}
.p12 .path{position:absolute;top:26pt;left:0.4in;right:0.4in;border-top:3px dashed var(--ink);z-index:0}
.p12 .stops{display:flex;justify-content:space-between;position:relative}
.p12 .stop{display:flex;flex-direction:column;align-items:center;width:2.2in;text-align:center}
.p12 .stop .dot{width:20pt;height:20pt;border:3px solid var(--red);background:var(--paper);border-radius:50%;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;font-family:'PlexMono',monospace;font-size:8pt;color:var(--red);font-weight:700}
.p12 .stop .t{font-family:'Playfair',serif;font-weight:700;font-size:13pt;margin-top:9pt}
.p12 .stop .d{font-size:8.5pt;color:var(--muted);margin-top:3pt;line-height:1.5}
.p12 .stop:nth-child(2){transform:translateY(14pt)}
.p12 .stop:nth-child(3){transform:translateY(4pt)}
.p12 .stop:nth-child(4){transform:translateY(18pt)}
/* ============ SLIDE 13 : CLOSE ============ */
.c13{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;flex-direction:column;z-index:2}
.c13 .big{font-family:'Anton',sans-serif;font-size:74pt;text-transform:uppercase;color:var(--cream);line-height:1}
.c13 .em{font-family:'Playfair',serif;font-style:italic;font-weight:700;color:#E8484F;font-size:24pt;margin-top:10pt}
.c13 .pass{margin-top:26pt;border:2px solid #E8484F;color:var(--cream);font-family:'PlexMono',monospace;font-size:10pt;letter-spacing:.2em;padding:9pt 20pt;display:inline-block;transform:rotate(-1deg)}
.c13 .team{margin-top:34pt;font-family:'PlexMono',monospace;font-size:8pt;letter-spacing:.22em;color:#B5AD9E;text-transform:uppercase;line-height:2}
/* ghost page number scribble */
.scratch{position:absolute;right:0.8in;bottom:0.32in;font-family:'Caveat',cursive;font-weight:700;font-size:15pt;color:var(--muted);transform:rotate(-3deg)}
`;

const slides = [];

/* 01 COVER — magazine, asymmetric, note */
slides.push(`
<div class="slide">
  <div class="full" style="background-image:${bg("sigil.png")};background-size:cover;background-position:center;opacity:.22"></div>
  <div class="cov">
    <div class="top"><span><span class="dot"></span>OBSIDIAN · SECURITY NETWORK</span><span>TS '26 CREATIVE PRELIMS</span></div>
    <div>
      <div class="big">OBSIDIAN</div>
      <div style="height:14pt"></div>
      <div class="sub">the empire's <span class="mk">nervous system</span> — a classified portal for the post-Order-66 hunt.</div>
    </div>
    <div class="note wb" style="padding:10pt 14pt;max-width:3.2in;transform:rotate(2.5deg)">
      <div style="font-family:'Caveat',cursive;font-weight:700;font-size:15pt;line-height:1.35">built in a day.<br/>demoed in three minutes.<br/>judged on everything.</div>
    </div>
    <div class="bot">
      <span>Anuj Phulera · Aarav Choudhary · Jeehaan Kwatra</span>
      <span>Path 2 — The Empire</span>
      <span style="color:var(--red)">PASSPHRASE: FOR THE EMPIRE</span>
    </div>
  </div>
</div>`);

/* 02 PROBLEM — giant ghost word + ruled list + sticky */
slides.push(`
<div class="slide p2">
  <div class="ghost">SCATTERED.</div>
  <div class="pad">
    <div style="position:relative;flex:1;display:flex;flex-direction:column;justify-content:center">
      <div class="left">
        <div class="l1">The galaxy is<br/>scattered.</div>
        <div class="l2">Order 66 fell. Hundreds of Jedi survive across a thousand worlds — rebuilding, recruiting, learning to vanish. The Empire has legions, but <span class="mk">no eyes.</span></div>
        <div class="items">
          <div class="it"><span class="n">one</span><div class="t">Fragmented intelligence</div><div class="d">reports filed into a void — no single picture of the galaxy</div></div>
          <div class="it"><span class="n">two</span><div class="t">Isolated hunters</div><div class="d">six Inquisitors, six separate hunts, no shared channel</div></div>
          <div class="it"><span class="n">three</span><div class="t">Open recruitment lanes</div><div class="d">the Order recruits through refugee networks, unchecked</div></div>
          <div class="it"><span class="n">four</span><div class="t">No decision layer</div><div class="d">sightings sit in ledgers while targets slip away</div></div>
        </div>
      </div>
      <div class="note sticky" style="max-width:2.6in"><span style="font-size:18pt">no grid = no hunt</span><br/><span style="font-size:12pt;font-weight:400;color:#6B5E2E">every target is somebody's problem — and nobody's responsibility.</span></div>
    </div>
    <div class="pgmark"><b>01</b> / THE PROBLEM</div>
  </div>
</div>`);

/* 03 SOLUTION — 4 sketch cards + handwritten arrows */
slides.push(`
<div class="slide p3">
  <div class="pad">
    <div style="position:relative;flex:1;display:flex;flex-direction:column;justify-content:center">
      <div style="font-family:'Anton',sans-serif;font-size:56pt;line-height:.95;text-transform:uppercase">One nervous <span class="red">system.</span></div>
      <div style="font-family:'Playfair',serif;font-style:italic;font-size:15pt;color:var(--ink2);margin-top:8pt;max-width:7.5in">every sector, probe and citizen becomes a sensor in the Emperor's hand.</div>
      <div class="cards">
        <div class="card wb"><div class="n">1</div><div class="t">Track</div><div class="d">live radar of ten sectors, probe drops, sighting logs — one grid</div></div>
        <div class="card wb2"><div class="n">2</div><div class="t">Plan</div><div class="d">intel escalates into dispatch — one board, planning to containment</div></div>
        <div class="card wb"><div class="n">3</div><div class="t">Command</div><div class="d">every Inquisitor on one encrypted channel, answering in character</div></div>
        <div class="card wb2"><div class="n">4</div><div class="t">Disrupt</div><div class="d">sector-wide broadcasts that starve the Order of recruits</div></div>
      </div>
      <div class="flow">
        <span style="color:var(--red);font-weight:700">GATE</span><span class="arr">→</span>
        <span>TYPED BOOT</span><span class="arr">→</span>
        <span>PASSPHRASE</span><span class="arr">→</span>
        <span style="color:var(--red);font-weight:700">CLEARANCE ALPHA-7</span><span class="arr">→</span>
        <span>FULL NETWORK</span>
      </div>
      <div class="note wb" style="padding:8pt 12pt;max-width:2.5in"><div style="font-family:'Caveat',cursive;font-weight:700;font-size:14pt">track → plan → command → disrupt</div></div>
    </div>
    <div class="pgmark"><b>02</b> / THE SOLUTION</div>
  </div>
</div>`);

/* 04 WHY NOW — sketch bar chart + checks */
slides.push(`
<div class="slide p4">
  <div class="pad">
    <div style="position:relative;flex:1;display:flex;flex-direction:column;justify-content:center">
      <div style="font-family:'Anton',sans-serif;font-size:52pt;line-height:.95;text-transform:uppercase">The window is <span class="mk">open.</span></div>
      <div style="font-family:'Playfair',serif;font-style:italic;font-size:14pt;color:var(--ink2);margin-top:8pt;max-width:7in">whoever builds the nervous system first, wins the galaxy.</div>
      <div class="cols">
        <div class="col">
          <div class="bars">
            <div><div class="bar"><span class="lab">TAM</span><div class="track"><div class="fill" style="--w:96%"></div></div></div><div class="tl">the galaxy — a thousand worlds, unchecked</div></div>
            <div><div class="bar"><span class="lab">SAM</span><div class="track"><div class="fill" style="--w:62%"></div></div></div><div class="tl">the empire — ten sectors, eight legions</div></div>
            <div><div class="bar"><span class="lab">SOM</span><div class="track"><div class="fill hl" style="--w:18%"></div></div></div><div class="tl">the hunt — nine classified targets, now</div></div>
          </div>
        </div>
        <div class="col">
          <div class="checks">
            <div class="ch"><span class="m">✓</span><span class="tx">demoable live — judges operate it, they don't read about it</span></div>
            <div class="ch"><span class="m">✓</span><span class="tx">original — zero canon, zero templates, zero stock assets</span></div>
            <div class="ch"><span class="m">✓</span><span class="tx">complete — app, deck, film, 3D engine, design system</span></div>
            <div class="ch"><span class="m">✓</span><span class="tx">offline-first — runs anywhere, forever</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="pgmark"><b>03</b> / WHY NOW</div>
  </div>
</div>`);

/* 05 PRODUCT — annotated sketch + ruled list */
slides.push(`
<div class="slide p5">
  <div class="pad">
    <div style="font-family:'Anton',sans-serif;font-size:44pt;line-height:.95;text-transform:uppercase">Twelve modules. <span class="red">One hunt.</span></div>
    <div class="cols">
      <div class="sketch">
        <div class="top"><b>OBSIDIAN — GALAXY TRACKER</b><span class="mono" style="font-size:6.5pt;letter-spacing:.14em;color:var(--muted)">LIVE</span></div>
        <div class="body">
          <div class="side"><i class="on"></i><i></i><i></i><i></i><i></i></div>
          <div class="main">
            <div class="t">RADAR GRID — SECTOR 9</div>
            <div class="ln w"></div>
            <div class="ln"></div>
            <div class="radar">
              <div class="c1"></div><div class="c2"></div>
              <div class="sweep"></div>
              <div class="bl" style="left:32%;top:30%"></div>
              <div class="bl" style="left:58%;top:22%"></div>
              <div class="bl" style="left:44%;top:56%"></div>
              <div class="bl" style="left:66%;top:62%"></div>
            </div>
          </div>
        </div>
        <div class="ann" style="left:auto;right:-0.35in;top:0.5in;transform:rotate(3deg)">radar sweep ↑<br/>click a blip → dossier</div>
        <div class="ann" style="left:-0.3in;top:2.1in;transform:rotate(-3deg)">drag hunts<br/>across the board</div>
      </div>
      <div class="list">
        ${["Command Deck","Galaxy Tracker","Wanted Dossiers","Intelligence","Operations","Interdiction","Inquisitor Uplink","Imperial Archive","Terminal","Manifesto","Hunt Metrics","Standards"].map((t, i) => `
          <div class="li"><span class="n">${String(i + 1).padStart(2, "0")}</span><div class="t">${t}</div><div class="d">${["hero status board","radar + probe drops","9 psychoprofiled targets","probe / ISB feed","kanban dispatch","propaganda studio","encrypted comms","7 lore documents","working mainframe shell","the Emperor's case","purge completion","in-app design system"][i]}</div></div>`).join("")}
      </div>
    </div>
    <div class="pgmark"><b>04</b> / THE PRODUCT</div>
  </div>
</div>`);

/* 06 DEMO — sticky notes */
slides.push(`
<div class="slide p6">
  <div class="pad">
    <div style="font-family:'Anton',sans-serif;font-size:48pt;line-height:.95;text-transform:uppercase">The demo, <span class="red">three minutes.</span></div>
    <div style="font-family:'Playfair',serif;font-style:italic;font-size:14pt;color:var(--ink2);margin-top:8pt">a judge goes from the gate to the design system — everything real, everything clickable.</div>
    <div class="notes">
      <div class="sticky"><span class="num">STEP 01–02</span><span class="big">The entrance.</span><br/><span class="sub">click to initialize → the terminal types itself → passphrase: FOR THE EMPIRE</span></div>
      <div class="sticky"><span class="num">STEP 03–04</span><span class="big">The command deck.</span><br/><span class="sub">giant hero type, live HUD — then the tracker: click a blip, open a dossier</span></div>
      <div class="sticky"><span class="num">STEP 05–06</span><span class="big">Make it happen.</span><br/><span class="sub">file the target to operations, drag the card to ACTIVE, transmit propaganda to Torvane</span></div>
      <div class="sticky"><span class="num">STEP 07–09</span><span class="big">The flex.</span><br/><span class="sub">message an Inquisitor (he answers) · cat targets.log in the terminal · open the design system</span></div>
    </div>
    <div class="pgmark"><b>05</b> / THE JOURNEY</div>
  </div>
</div>`);

/* 07 PROOF — giant numbers */
slides.push(`
<div class="slide p7">
  <div class="pad">
    <div style="font-family:'Anton',sans-serif;font-size:52pt;line-height:.95;text-transform:uppercase">Built, <span class="red">not promised.</span></div>
    <div class="nums">
      <div class="ncell"><div class="v">12</div><div class="l">Working modules</div><div class="s">one login, one network</div><div class="handnote">every single one clickable</div></div>
      <div class="ncell"><div class="v">9</div><div class="l">Original Jedi</div><div class="s">psychoprofiled, printable warrants</div><div class="handnote">zero canon characters</div></div>
      <div class="ncell"><div class="v">8</div><div class="l">3D scenes</div><div class="s">custom raytracer, written by us</div><div class="handnote">we wrote the renderer</div></div>
      <div class="ncell"><div class="v">62s</div><div class="l">Promo film</div><div class="s">original score + voiceover</div><div class="handnote">every sound synthesized</div></div>
      <div class="ncell"><div class="v">100+</div><div class="l">Intel reports</div><div class="s">generated live on demand</div><div class="handnote">the galaxy never sleeps</div></div>
      <div class="ncell"><div class="v">0</div><div class="l">External assets</div><div class="s">no templates, no stock, no canon</div><div class="handnote">everything is ours</div></div>
    </div>
    <div class="pgmark"><b>06</b> / PROOF</div>
  </div>
</div>`);

/* 08 COMPETITION — sketch table */
slides.push(`
<div class="slide p8">
  <div class="pad">
    <div style="font-family:'Anton',sans-serif;font-size:46pt;line-height:.95;text-transform:uppercase">The old way <span class="red">vs the network.</span></div>
    <div class="cmp">
      <div class="side lose">
        <h3>The old empire</h3>
        <div class="it"><span class="m">✗</span><span class="x">Reports vanish into ledgers</span></div>
        <div class="it"><span class="m">✗</span><span class="x">Six hunters, six separate hunts</span></div>
        <div class="it"><span class="m">✗</span><span class="x">Recruitment lanes wide open</span></div>
        <div class="it"><span class="m">✗</span><span class="x">Sightings never become strikes</span></div>
      </div>
      <div class="side win">
        <h3 style="color:var(--red)">OBSIDIAN</h3>
        <div class="it"><span class="m">✓</span><span class="x">One live galactic grid</span></div>
        <div class="it"><span class="m">✓</span><span class="x">One encrypted channel, one doctrine</span></div>
        <div class="it"><span class="m">✓</span><span class="x">Counter-recruitment broadcasts</span></div>
        <div class="it"><span class="m">✓</span><span class="x">Intel escalates into hunts</span></div>
      </div>
    </div>
    <div class="note wb" style="padding:8pt 14pt;max-width:3.4in"><div style="font-family:'Caveat',cursive;font-weight:700;font-size:14pt">we don't out-legion the empire. we out-coordinate it.</div></div>
    <div class="pgmark"><b>07</b> / COMPETITION</div>
  </div>
</div>`);

/* 09 3D — magazine spread */
slides.push(`
<div class="slide p9">
  <div class="pad">
    <div style="font-family:'Anton',sans-serif;font-size:42pt;line-height:.95;text-transform:uppercase">3D — <span class="red">our own raytracer.</span></div>
    <div style="font-family:'Playfair',serif;font-style:italic;font-size:13pt;color:var(--ink2);margin-top:6pt;max-width:8in">eight scenes from a vectorized numpy renderer built from scratch. no blender, no maya, no stock.</div>
    <div class="spread">
      <div class="feature" style="transform:rotate(-0.6deg)"><img src="data:image/png;base64,${b64("blade.png")}"/><div class="cap">the blade — every frame ours</div></div>
      <div class="feature" style="transform:rotate(0.6deg)"><img src="data:image/png;base64,${b64("citadel.png")}"/><div class="cap">the citadel — the Emperor's seat</div></div>
    </div>
    <div class="strip">
      ${[["sigil.png","SIGIL"],["warship.png","WARSHIP"],["helmet.png","HELMET"],["planet.png","PLANET"],["probe.png","PROBE"],["throne.png","THRONE"]].map(([f, c]) => `<div class="cell"><img src="data:image/png;base64,${b64(f)}"/><div class="cap">${c}</div></div>`).join("")}
    </div>
    <div class="note wb" style="padding:8pt 12pt"><div style="font-family:'Caveat',cursive;font-weight:700;font-size:14pt">no external software —<br/>the renderer is our code</div></div>
    <div class="pgmark"><b>08</b> / CRAFT · 3D</div>
  </div>
</div>`);

/* 10 BRAND — swatch chips + type */
slides.push(`
<div class="slide p10">
  <div class="pad">
    <div style="font-family:'Anton',sans-serif;font-size:42pt;line-height:.95;text-transform:uppercase">Iron <span class="red">Protocol.</span></div>
    <div style="font-family:'Playfair',serif;font-style:italic;font-size:13pt;color:var(--ink2);margin-top:6pt">paper, ink, one red. the design system behind the network.</div>
    <div class="chips">
      ${[["#F6F3EA","PAPER","ink text"],["#201B14","INK","type"],["#C1121F","IMPERIAL","one accent"],["#8F8776","MUTED","secondary"],["#FBFAF4","CARD","surfaces"]].map(([c, l, s]) => `<div class="chip" style="background:${c};color:${c === "#F6F3EA" || c === "#FBFAF4" ? "#201B14" : "#F6F3EA"}">${c}<small>${l} — ${s}</small></div>`).join("")}
    </div>
    <div class="type">
      <div><div class="lab">Display — Anton</div><div style="font-family:'Anton',sans-serif;font-size:34pt;text-transform:uppercase;line-height:1">Order is peace</div></div>
      <div><div class="lab">Editorial — Playfair Italic</div><div style="font-family:'Playfair',serif;font-style:italic;font-weight:700;font-size:19pt;color:var(--red)">the hunt never ends</div></div>
      <div><div class="lab">Body — Inter</div><div style="font-size:12pt;color:var(--ink2);font-weight:500">Authenticate · Dispatch · Hunt</div></div>
      <div><div class="lab">Data — Plex Mono</div><div style="font-family:'PlexMono',monospace;font-size:9pt;color:var(--muted)">SIGHTING // SECTOR 9 // 02:41</div></div>
    </div>
    <div class="note wb" style="padding:8pt 12pt"><div style="font-family:'Caveat',cursive;font-weight:700;font-size:14pt">one red. that's the rule.</div></div>
    <div class="pgmark"><b>09</b> / CRAFT · BRAND</div>
  </div>
</div>`);

/* 11 TEAM — polaroids */
slides.push(`
<div class="slide p11">
  <div class="pad">
    <div style="font-family:'Anton',sans-serif;font-size:46pt;line-height:.95;text-transform:uppercase">Three operatives. <span class="red">One doctrine.</span></div>
    <div class="pols">
      <div class="pol"><div class="tape" style="top:-7pt;left:50%;transform:translateX(-50%) rotate(-3deg)"></div><div class="photo"><span class="ini">AP</span></div><div class="nm">Anuj Phulera</div><div class="rl">Developer · AI · Backend</div><div class="bio">Builds the engine — zero-latency systems, the AI that makes the hunt computable.</div></div>
      <div class="pol"><div class="tape" style="top:-7pt;left:50%;transform:translateX(-50%) rotate(2deg)"></div><div class="photo"><span class="ini">AC</span></div><div class="nm">Aarav Choudhary</div><div class="rl">Vision · Marketing · Ideas</div><div class="bio">Saw the decay of the old order and imagined something absolute. Engineers the narrative.</div></div>
      <div class="pol"><div class="tape" style="top:-7pt;left:50%;transform:translateX(-50%) rotate(-1.5deg)"></div><div class="photo"><span class="ini">JK</span></div><div class="nm">Jeehaan Kwatra</div><div class="rl">Design · Media · Pitch</div><div class="bio">Forges the aesthetic — every pixel, every frame, every blade of the sigil.</div></div>
    </div>
    <div style="text-align:center;margin-top:30pt;font-family:'Caveat',cursive;font-weight:700;font-size:14pt;color:var(--muted);transform:rotate(-1deg)">ideation · engineering · design · film · pitch — all in-house</div>
    <div class="pgmark"><b>10</b> / THE TEAM</div>
  </div>
</div>`);

/* 12 ROADMAP — dotted path */
slides.push(`
<div class="slide p12">
  <div class="pad">
    <div style="font-family:'Anton',sans-serif;font-size:46pt;line-height:.95;text-transform:uppercase">The net <span class="red">expands.</span></div>
    <div class="road">
      <div class="path"></div>
      <div class="stops">
        <div class="stop"><div class="dot">2</div><div class="t">Probe Mesh</div><div class="d">fleet-wide probe telemetry with live alerts</div></div>
        <div class="stop"><div class="dot">3</div><div class="t">Voice Command</div><div class="d">talk to the mainframe — the terminal listens</div></div>
        <div class="stop"><div class="dot">4</div><div class="t">Sector Simulation</div><div class="d">AI-generated Jedi behavior for training</div></div>
        <div class="stop"><div class="dot">5</div><div class="t">Citizen Network</div><div class="d">anonymous tip portal feeding the grid</div></div>
      </div>
    </div>
    <div class="pgmark"><b>11</b> / ROADMAP</div>
  </div>
</div>`);

/* 13 CLOSE — dark plate */
slides.push(`
<div class="slide dark">
  <div class="bgimg" style="background-image:${bg("throne.png")}"></div>
  <div class="veil"></div>
  <div class="c13">
    <div class="big">The hunt never ends.</div>
    <div class="em">until the last ember is cold.</div>
    <div class="pass">PASSPHRASE: FOR THE EMPIRE — TRY THE DEMO</div>
    <div class="team">OBSIDIAN · IMPERIAL SECURITY NETWORK<br/>Anuj Phulera · Aarav Choudhary · Jeehaan Kwatra<br/>TS '26 Creative Prelims</div>
  </div>
</div>`);

const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${CSS}</style></head><body>${slides.join("")}</body></html>`;
fs.writeFileSync(path.join(OUT, "deck.html"), html);
console.log("deck.html:", (html.length / 1024).toFixed(0), "KB ·", slides.length, "slides");
