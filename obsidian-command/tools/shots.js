/* Screenshot harness — captures every OBSIDIAN section. */
"use strict";
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium').default;
const path = require('path');

const ROUTES = ['boot','command','tracker','dossiers','intel','ops','interdiction','comms','archive','standards'];
const want = process.argv.slice(2);
const targets = want.length && want[0] !== 'all' ? want : ROUTES;

(async () => {
  const exe = await chromium.executablePath();
  const browser = await puppeteer.launch({
    executablePath: exe,
    headless: 'new',
    args: [...chromium.args, '--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-software-rasterizer','--mute-audio']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.log('  [pageerror]', String(e).slice(0, 300)));

  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 900));

  for (const r of targets) {
    const file = path.join(__dirname, '..', 'deliverables', 'promo', `shot-${r}.png`);
    if (r === 'boot') {
      await page.screenshot({ path: file });
    } else {
      await page.evaluate(() => { try { localStorage.setItem('obsidian.session','true'); } catch(e){} });
      await page.reload({ waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 600));
      await page.evaluate((rr) => { if (window.route) route(rr); }, r);
      await new Promise(r => setTimeout(r, 1200));
      await page.screenshot({ path: file });
    }
    console.log('captured', r);
  }
  await browser.close();
})();
