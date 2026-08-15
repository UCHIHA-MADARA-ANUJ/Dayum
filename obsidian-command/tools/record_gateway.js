/* Record the OBSIDIAN gateway sequence via CDP screencast (fast JPEG frames). */
"use strict";
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium').default;
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'deliverables', 'video', 'gateway');
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) fs.unlinkSync(path.join(OUT, f));

(async () => {
  const exe = await chromium.executablePath();
  const browser = await puppeteer.launch({ executablePath: exe, headless: 'new', args: [...chromium.args, '--no-sandbox', '--disable-gpu', '--mute-audio'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.log('[pageerror]', String(e).slice(0, 150)));

  await page.goto('http://localhost:8080/website/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 900));

  const client = await page.createCDPSession();
  let frame = 0;
  const t0 = Date.now();
  client.on('Page.screencastFrame', async ({ data, sessionId }) => {
    const buf = Buffer.from(data, 'base64');
    fs.writeFileSync(path.join(OUT, `f${String(frame).padStart(4, '0')}.jpg`), buf);
    frame++;
    await client.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
  await client.send('Page.startScreencast', { format: 'jpeg', quality: 80, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 });

  // start the sequence
  await page.mouse.click(960, 540);

  // run until 12.5s of wall time
  while ((Date.now() - t0) / 1000 < 12.5) { await new Promise(r => setTimeout(r, 100)); }
  await client.send('Page.stopScreencast').catch(() => {});
  console.log('gateway frames:', frame, '· dur:', ((Date.now() - t0) / 1000).toFixed(1) + 's');
  await browser.close();
})();
