/* App footage recorder — drives the real OBSIDIAN app and records frames. */
"use strict";
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium').default;
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'deliverables', 'video', 'footage');
fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const exe = await chromium.executablePath();
  const browser = await puppeteer.launch({
    executablePath: exe, headless: 'new',
    args: [...chromium.args, '--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--mute-audio']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.log('[pageerror]', String(e).slice(0,200)));
  page.on('console', m => { if (m.type()==='error') console.log('[console.error]', m.text().slice(0,200)); });

  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => { localStorage.clear(); });
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(600);

  const frames = [];
  const t0 = Date.now();
  let recording = true;
  const recorder = setInterval(async () => {
    if (!recording) return;
    const t = (Date.now() - t0) / 1000;
    const f = `f${String(frames.length).padStart(4,'0')}.png`;
    await page.screenshot({ path: path.join(OUT, f) }).catch(()=>{});
    frames.push({ f, t });
  }, 110);

  const seq = async (label, ms) => { await sleep(ms); console.log(`  [${((Date.now()-t0)/1000).toFixed(1)}s] ${label}`); };

  await seq("boot screen visible", 2200);
  for (const ch of "FOR THE EMPIRE"){ await page.type('#bootPass', ch); await sleep(85); }
  await seq("passphrase typed", 700);
  await page.click('#bootGo');
  await seq("verifying credentials…", 2600);
  await seq("command deck live", 2200);

  await page.evaluate(() => route('tracker'));
  await seq("galaxy tracker — radar sweep", 2600);
  const blip = await page.$('#view .blip');
  if (blip){ const b = await blip.boundingBox(); if (b) await page.mouse.click(b.x+b.width/2, b.y+b.height/2); }
  await seq("sighting dossier panel", 1500);
  await page.evaluate(() => { closeMapInfo(); });
  await seq("map info dismissed", 500);

  await page.evaluate(() => route('dossiers'));
  await seq("wanted dossiers grid", 1600);
  await page.evaluate(() => openDossier('kade'));
  await seq("target dossier modal", 1600);
  await page.click('#modalRoot [data-close]');
  await seq("modal closed", 400);

  await page.evaluate(() => route('ops'));
  await seq("operations board", 1400);
  const card = await page.evaluateHandle(() => [...document.querySelectorAll('.kan-card')].find(x => x.textContent.includes('COLD EMBER')));
  if (card){
    const cb = await card.asElement().boundingBox().catch(()=>null);
    const cols = await page.$$('.kan-col');
    if (cb && cols.length > 1){
      const tb = await cols[1].boundingBox();
      await page.mouse.move(cb.x+cb.width/2, cb.y+cb.height/2);
      await page.mouse.down();
      await sleep(200);
      await page.mouse.move(tb.x+tb.width/2, tb.y+tb.height/2, { steps: 12 });
      await sleep(250);
      await page.mouse.up();
    }
  }
  await seq("operation reassigned (drag)", 1400);

  await page.evaluate(() => route('interdiction'));
  await seq("interdiction studio", 900);
  await page.select('#pbTpl', 'amnesty');
  await page.select('#pbSec', 'TORVANE');
  await seq("template selected", 500);
  await page.evaluate(() => composeBroadcast());
  await seq("transmission composing…", 2600);
  await page.click('#bcastSend');
  await seq("broadcast transmitted", 1300);

  await page.evaluate(() => route('comms'));
  await seq("inquisitor uplink", 1500);
  await page.type('#chatMsg', "Report status on the Torvane grid.");
  await page.click('.chat-input .btn');
  await seq("transmission sent — reply incoming", 2000);

  await page.evaluate(() => route('standards'));
  await seq("imperial standards", 1400);

  recording = false;
  clearInterval(recorder);
  await page.screenshot({ path: path.join(OUT, `f${String(frames.length).padStart(4,'0')}.png`) });
  frames.push({ f: `f${String(frames.length-1).padStart(4,'0')}.png`, t: (Date.now()-t0)/1000 });

  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(frames, null, 1));
  console.log(`DONE: ${frames.length} frames over ${(frames[frames.length-1].t).toFixed(1)}s`);
  await browser.close();
})();
