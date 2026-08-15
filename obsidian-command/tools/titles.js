/* Title cards for the OBSIDIAN film — 1920x1080 in headless Chrome */
"use strict";
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium').default;
const path = require('path');

const R = path.join(__dirname, '..', 'deliverables', 'renders');
const OUT = path.join(__dirname, '..', 'deliverables', 'video');

const CSS = `
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1920px; height:1080px; overflow:hidden; background:#000; }
  .card { position:relative; width:1920px; height:1080px; display:flex; flex-direction:column;
          align-items:center; justify-content:center; text-align:center; }
  .bg { position:absolute; inset:0; background-size:cover; background-position:center; }
  .veil { position:absolute; inset:0; background:radial-gradient(ellipse at center, rgba(3,3,6,.55) 0%, rgba(3,3,6,.92) 100%); }
  .scan { position:absolute; inset:0; background:repeating-linear-gradient(0deg, rgba(255,255,255,.025) 0 1px, transparent 1px 3px); }
  .emblem { width:130px; height:130px; margin-bottom:34px; filter:drop-shadow(0 0 26px rgba(224,30,55,.6)); }
  h1 { font-family:'Cinzel',Georgia,serif; font-weight:900; color:#e8e4d8; letter-spacing:.34em; text-indent:.34em;
       font-size:104px; text-shadow:0 0 60px rgba(224,30,55,.55), 0 4px 24px rgba(0,0,0,.9); }
  .line { width:560px; height:2px; margin:38px 0; background:linear-gradient(90deg, transparent, #e01e37, transparent); box-shadow:0 0 18px rgba(224,30,55,.7); }
  .sub { font-family:'PlexMono',monospace; font-size:22px; letter-spacing:.5em; text-indent:.5em; color:#8a8a94; text-transform:uppercase; }
  .sub.red { color:#e01e37; }
  .foot { position:absolute; bottom:56px; left:0; right:0; text-align:center; font-family:'PlexMono',monospace;
          font-size:15px; letter-spacing:.42em; text-indent:.42em; color:#5a5a66; text-transform:uppercase; }
  .tag { position:absolute; top:52px; left:0; right:0; text-align:center; font-family:'PlexMono',monospace;
         font-size:16px; letter-spacing:.5em; text-indent:.5em; color:#7a0e1e; text-transform:uppercase; }
  .end-title { font-family:'Cinzel',Georgia,serif; font-weight:900; color:#e8e4d8; font-size:66px; letter-spacing:.34em; text-indent:.34em; text-shadow:0 0 40px rgba(224,30,55,.5); }
  .end-team { font-family:'Cinzel',Georgia,serif; font-size:30px; letter-spacing:.28em; text-indent:.28em; color:#8a8a94; margin-top:14px; }
  @font-face{font-family:'Cinzel';src:url('file:///home/user/Dayum/obsidian-command/app/fonts/cinzel-latin-900-normal.woff2') format('woff2');font-weight:900}
  @font-face{font-family:'Cinzel';src:url('file:///home/user/Dayum/obsidian-command/app/fonts/cinzel-latin-700-normal.woff2') format('woff2');font-weight:700}
  @font-face{font-family:'PlexMono';src:url('file:///home/user/Dayum/obsidian-command/app/fonts/ibm-plex-mono-latin-400-normal.woff2') format('woff2')}
`;

const EMBLEM = `<svg class="emblem" viewBox="0 0 100 100"><defs><radialGradient id="g"><stop offset="0" stop-color="#ff2a44"/><stop offset="70%" stop-color="#7a0e1e"/><stop offset="100%" stop-color="#2a050c"/></radialGradient></defs><path d="M50 3 61 24 84 16 76 39 97 50 76 61 84 84 61 76 50 97 39 76 16 84 24 61 3 50 24 39 16 16 39 24z" fill="url(#g)" stroke="#e01e37" stroke-width="1.5"/><circle cx="50" cy="50" r="14" fill="none" stroke="#e8e4d8" stroke-width="2"/><circle cx="50" cy="50" r="6" fill="#e01e37"/></svg>`;

function card(bgFile, inner){
  return `<div class="card">
    <div class="bg" style="background-image:url('file://${path.join(R, bgFile)}')"></div>
    <div class="veil"></div><div class="scan"></div>
    ${inner}
  </div>`;
}

const CARDS = {
  "card-order66.png": card("planet.png", `
    <div class="tag">IMPERIAL BROADCAST — CLASSIFIED</div>
    ${EMBLEM}
    <h1>ORDER 66</h1>
    <div class="line"></div>
    <div class="sub">The Final Order · Execute Without Hesitation</div>
    <div class="foot">OBSIDIAN · IMPERIAL SECURITY NETWORK</div>`),
  "card-obsidian.png": card("sigil.png", `
    ${EMBLEM}
    <h1 style="font-size:120px">OBSIDIAN</h1>
    <div class="line"></div>
    <div class="sub red">Imperial Security Network</div>
    <div class="sub" style="margin-top:18px;font-size:17px">Jedi Apprehension Division</div>
    <div class="foot">TWELVE BLADES · ONE PURPOSE</div>`),
  "card-hunt.png": card("warship.png", `
    ${EMBLEM}
    <h1 style="font-size:74px;line-height:1.25">THE HUNT<br><span style="color:#e01e37">NEVER ENDS</span></h1>
    <div class="line"></div>
    <div class="sub">Sector by sector · World by world</div>
    <div class="foot">UNTIL THE LAST EMBER IS COLD</div>`),
  "card-end.png": card("throne.png", `
    <div class="tag">TS '26 · CREATIVE PRELIMS</div>
    ${EMBLEM}
    <div class="end-title">OBSIDIAN</div>
    <div class="end-team">TEAM <span style="color:#e8e4d8">________</span></div>
    <div class="line"></div>
    <div class="sub red">The hunt begins</div>
    <div class="foot">ALL PERSONS, PLACES & RECORDS ARE ORIGINAL CREATIONS OF THE OBSIDIAN UNIVERSE</div>`)
};

(async () => {
  const exe = await chromium.executablePath();
  const browser = await puppeteer.launch({
    executablePath: exe, headless: 'new',
    args: [...chromium.args, '--no-sandbox','--disable-gpu','--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  for (const [file, html] of Object.entries(CARDS)){
    const doc = `<!DOCTYPE html><html><head><style>${CSS}</style></head><body>${html}</body></html>`;
    await page.setContent(doc, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(OUT, file) });
    console.log('card:', file);
  }
  await browser.close();
})();
