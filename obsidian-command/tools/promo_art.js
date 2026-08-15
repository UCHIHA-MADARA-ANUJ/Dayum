/* Promotional poster + banner — 1920x1080 poster, 1500x500 banner */
"use strict";
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium').default;
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'deliverables', 'promo');
const REND = path.join(__dirname, '..', 'deliverables', 'renders');

function b64(p){ return fs.readFileSync(p).toString('base64'); }

const CSS = `
  * { margin:0; padding:0; box-sizing:border-box; }
  @font-face{font-family:'Cinzel';src:url('file:///home/user/Dayum/obsidian-command/app/fonts/cinzel-latin-900-normal.woff2') format('woff2');font-weight:900}
  @font-face{font-family:'Cinzel';src:url('file:///home/user/Dayum/obsidian-command/app/fonts/cinzel-latin-700-normal.woff2') format('woff2');font-weight:700}
  @font-face{font-family:'PlexMono';src:url('file:///home/user/Dayum/obsidian-command/app/fonts/ibm-plex-mono-latin-400-normal.woff2') format('woff2')}
  .poster { width:1920px; height:1080px; position:relative; overflow:hidden; background:#050507; }
  .bg { position:absolute; inset:0; background-size:cover; background-position:center; filter:brightness(.6) saturate(1.1); }
  .veil { position:absolute; inset:0; background:radial-gradient(ellipse at center, rgba(3,3,6,.15) 0%, rgba(3,3,6,.85) 100%); }
  .scan { position:absolute; inset:0; background:repeating-linear-gradient(0deg, rgba(255,255,255,.02) 0 1px, transparent 1px 3px); }
  .frame { position:absolute; inset:36px; border:1px solid rgba(224,30,55,.55); }
  .frame::before { content:""; position:absolute; top:-2px; left:60px; right:60px; height:2px; background:linear-gradient(90deg,transparent,#e01e37,transparent); }
  .emblem { position:absolute; top:70px; left:70px; width:110px; height:110px; filter:drop-shadow(0 0 22px rgba(224,30,55,.55)); }
  .tag { position:absolute; top:96px; right:70px; font-family:'PlexMono',monospace; font-size:16px; letter-spacing:.42em; color:#c02838; text-transform:uppercase; }
  .center { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; }
  h1 { font-family:'Cinzel',serif; font-weight:900; font-size:150px; letter-spacing:.28em; text-indent:.28em; color:#f2efe4; text-shadow:0 0 80px rgba(224,30,55,.8), 0 6px 30px rgba(0,0,0,.9); }
  .sub { font-family:'PlexMono',monospace; font-size:22px; letter-spacing:.5em; text-indent:.5em; color:#c8c8d2; margin-top:20px; text-transform:uppercase; }
  .sub2 { font-family:'PlexMono',monospace; font-size:14px; letter-spacing:.4em; text-indent:.4em; color:#e02038; margin-top:14px; text-transform:uppercase; }
  .line { width:640px; height:2px; margin:34px 0; background:linear-gradient(90deg,transparent,#e01e37,transparent); box-shadow:0 0 24px rgba(224,30,55,.7); }
  .foot { position:absolute; bottom:64px; left:0; right:0; text-align:center; font-family:'PlexMono',monospace; font-size:13px; letter-spacing:.4em; color:#7a7a88; text-transform:uppercase; }
  .banner { width:1500px; height:500px; position:relative; overflow:hidden; background:#050507; display:flex; align-items:center; }
  .bbg { position:absolute; inset:0; background-size:cover; background-position:center; filter:brightness(.55); }
  .bveil { position:absolute; inset:0; background:linear-gradient(90deg, rgba(5,5,7,.85) 0%, rgba(5,5,7,.35) 70%, rgba(5,5,7,.6) 100%); }
  .bsigil { width:120px; height:120px; margin:0 50px 0 70px; flex-shrink:0; filter:drop-shadow(0 0 26px rgba(224,30,55,.6)); }
  .btitle { font-family:'Cinzel',serif; font-weight:900; font-size:72px; letter-spacing:.24em; color:#f2efe4; text-shadow:0 0 50px rgba(224,30,55,.7); }
  .bsub { font-family:'PlexMono',monospace; font-size:16px; letter-spacing:.4em; color:#9aa0ac; margin-top:12px; text-transform:uppercase; }
  .bbar { width:5px; height:110px; background:#e01e37; margin-left:56px; box-shadow:0 0 24px rgba(224,30,55,.8); flex-shrink:0; }
`;

const sigil = `<svg viewBox="0 0 100 100"><defs><radialGradient id="g"><stop offset="0" stop-color="#ff2a44"/><stop offset="70%" stop-color="#7a0e1e"/><stop offset="100%" stop-color="#2a050c"/></radialGradient></defs><path d="M50 3 61 24 84 16 76 39 97 50 76 61 84 84 61 76 50 97 39 76 16 84 24 61 3 50 24 39 16 16 39 24z" fill="url(#g)" stroke="#e01e37" stroke-width="1.5"/><circle cx="50" cy="50" r="14" fill="none" stroke="#e8e4d8" stroke-width="2"/><circle cx="50" cy="50" r="6" fill="#e01e37"/></svg>`;

(async () => {
  const exe = await chromium.executablePath();
  const browser = await puppeteer.launch({ executablePath: exe, headless: 'new', args: [...chromium.args, '--no-sandbox','--disable-gpu'] });
  const page = await browser.newPage();

  // POSTER
  await page.setViewport({ width: 1920, height: 1080 });
  const poster = `<!DOCTYPE html><html><head><style>${CSS}</style></head><body>
  <div class="poster">
    <div class="bg" style="background-image:url('data:image/png;base64,${b64(path.join(REND,'throne.png'))}')"></div>
    <div class="veil"></div><div class="scan"></div>
    <div class="frame"></div>
    <div class="emblem">${sigil}</div>
    <div class="tag">TS '26 · Creative Prelims</div>
    <div class="center">
      <h1>OBSIDIAN</h1>
      <div class="line"></div>
      <div class="sub">Imperial Security Network</div>
      <div class="sub2">The hunt never ends</div>
    </div>
    <div class="foot">Passphrase: FOR THE EMPIRE · Clearance Alpha-7 · Twelve Blades, One Purpose</div>
  </div></body></html>`;
  await page.setContent(poster, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT, 'poster.png') });
  console.log('poster done');

  // BANNER
  await page.setViewport({ width: 1500, height: 500 });
  const banner = `<!DOCTYPE html><html><head><style>${CSS}</style></head><body>
  <div class="banner">
    <div class="bbg" style="background-image:url('data:image/png;base64,${b64(path.join(REND,'warship.png'))}')"></div>
    <div class="bveil"></div>
    <div class="bsigil">${sigil}</div>
    <div class="bbar"></div>
    <div>
      <div class="btitle">OBSIDIAN</div>
      <div class="bsub">Imperial Security Network · The Hunt Never Ends</div>
    </div>
  </div></body></html>`;
  await page.setContent(banner, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT, 'banner.png') });
  console.log('banner done');
  await browser.close();
})();
