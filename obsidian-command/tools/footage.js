/* App footage recorder v3 — CDP screencast, drives the Next.js app. */
"use strict";
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium').default;
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'deliverables', 'video', 'footage');
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) fs.unlinkSync(path.join(OUT, f));
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const exe = await chromium.executablePath();
  const browser = await puppeteer.launch({ executablePath: exe, headless: 'new', args: [...chromium.args, '--no-sandbox', '--disable-gpu', '--mute-audio'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.log('[pageerror]', String(e).slice(0, 180)));

  await page.goto('http://localhost:8082/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.evaluate(() => { localStorage.clear(); });
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 90000 });
  await sleep(1600);

  // start screencast
  const client = await page.createCDPSession();
  let frame = 0;
  const t0 = Date.now();
  client.on('Page.screencastFrame', async ({ data, sessionId }) => {
    fs.writeFileSync(path.join(OUT, `f${String(frame).padStart(4, '0')}.jpg`), Buffer.from(data, 'base64'));
    frame++;
    await client.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
  await client.send('Page.startScreencast', { format: 'jpeg', quality: 75, maxWidth: 1440, maxHeight: 900, everyNthFrame: 1 });

  const clickNav = async (i) => { await page.evaluate((ii) => document.querySelectorAll('.nav-item')[ii]?.click(), i); await sleep(600); };
  const seq = async (label, ms) => { await sleep(ms); console.log(`  [${((Date.now() - t0) / 1000).toFixed(1)}s] ${label}`); };

  await seq("gate", 900);
  await page.evaluate(() => { const b = document.querySelector('.gate-btn'); if (b) b.click(); });
  await page.waitForFunction(() => !!document.querySelector('.boot-pass input'), { timeout: 25000 }).catch(() => {});
  await seq("boot sequence", 3600);
  await page.evaluate(() => {
    const i = document.querySelector('.boot-pass input');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(i, 'FOR THE EMPIRE'); i.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('.boot-pass .btn').click();
  });
  await page.waitForFunction(() => document.querySelectorAll('.nav-item').length === 12, { timeout: 25000 }).catch(() => {});
  await seq("command deck live", 4000);

  await clickNav(1);
  await seq("galaxy tracker", 2200);
  await page.evaluate(() => { const b = document.querySelector('.blip'); if (b) b.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  await seq("sighting panel", 1400);
  await clickNav(2);
  await seq("wanted dossiers", 1500);
  await page.evaluate(() => { const p = document.querySelector('.poster'); if (p) p.click(); });
  await seq("dossier modal", 1400);
  await page.evaluate(() => { const x = document.querySelector('.modal-x'); if (x) x.click(); });
  await seq("modal closed", 500);
  await clickNav(4);
  await seq("operations board", 1500);
  await clickNav(5);
  await seq("interdiction", 1000);
  await page.evaluate(() => { const b = [...document.querySelectorAll('.btn')].find(x => x.textContent.includes('COMPOSE')); if (b) b.click(); });
  await seq("composing", 2500);
  await page.evaluate(() => { const b = [...document.querySelectorAll('.btn')].find(x => x.textContent.includes('TRANSMIT') && !x.disabled); if (b) b.click(); });
  await seq("transmitted", 1200);
  await clickNav(6);
  await seq("comms", 1200);
  await page.type('.chat-input input', 'Report status on the Torvane grid.');
  await page.keyboard.press('Enter');
  await seq("reply", 2300);
  await clickNav(8);
  await seq("terminal", 1000);
  const type = async (t) => { await page.type('.term-input input', t); await page.keyboard.press('Enter'); await sleep(600); };
  await type('help');
  await type('cat targets.log');
  await type('scan kess');
  await seq("terminal output", 1500);
  await clickNav(11);
  await seq("standards", 1300);

  await client.send('Page.stopScreencast').catch(() => {});
  const dur = (Date.now() - t0) / 1000;
  console.log(`DONE: ${frame} frames over ${dur.toFixed(1)}s (${(frame / dur).toFixed(1)}fps)`);
  await browser.close();
})();
