/* Screenshots of the Next.js OBSIDIAN app for the deck */
"use strict";
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium').default;
const path = require('path');

const OUT = path.join(__dirname, '..', 'deliverables', 'promo');
const IDX = { command: 0, tracker: 1, dossiers: 2, intel: 3, ops: 4, interdiction: 5, comms: 6, archive: 7, terminal: 8, manifesto: 9, metrics: 10, standards: 11 };

(async () => {
  const exe = await chromium.executablePath();
  const browser = await puppeteer.launch({ executablePath: exe, headless: 'new', args: [...chromium.args, '--no-sandbox', '--disable-gpu'] });
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 150)));
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  await page.goto('http://localhost:8080/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2500));
  // gate shot
  await page.screenshot({ path: path.join(OUT, 'shot-gate.png') });
  await page.evaluate(() => document.querySelector('.gate-btn').click());
  await page.waitForFunction(() => !!document.querySelector('.boot-pass input'), { timeout: 20000 });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT, 'shot-boot.png') });
  await page.evaluate(() => {
    const i = document.querySelector('.boot-pass input');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(i, 'FOR THE EMPIRE');
    i.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('.boot-pass .btn').click();
  });
  await page.waitForFunction(() => document.querySelectorAll('.nav-item').length === 12, { timeout: 20000 });
  await new Promise(r => setTimeout(r, 4200));
  await page.screenshot({ path: path.join(OUT, 'shot-command.png') });

  for (const [name, i] of Object.entries(IDX)) {
    if (name === 'command') continue;
    await page.evaluate((ii) => document.querySelectorAll('.nav-item')[ii].click(), i);
    await new Promise(r => setTimeout(r, 1400));
    await page.screenshot({ path: path.join(OUT, 'shot-' + name + '.png') });
  }
  console.log('screens:', errs.length ? errs : 'all clean');
  await browser.close();
})();
