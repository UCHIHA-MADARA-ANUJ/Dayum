/* HTML → PDF via headless Chrome. Usage: node html2pdf.js <in.html> <out.pdf> */
"use strict";
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium').default;
const fs = require('fs');
const path = require('path');

(async () => {
  const [inFile, outFile] = process.argv.slice(2);
  if (!inFile || !outFile) { console.error('usage: node html2pdf.js <in> <out>'); process.exit(1); }
  const html = fs.readFileSync(inFile, 'utf8');
  const exe = await chromium.executablePath();
  const browser = await puppeteer.launch({ executablePath: exe, headless: 'new', args: [...chromium.args, '--no-sandbox', '--disable-gpu'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 900));
  await page.pdf({
    path: outFile,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  console.log('PDF written:', outFile, fs.statSync(outFile).size, 'bytes');
  await browser.close();
})();
