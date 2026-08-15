const p = require('puppeteer-core');
const c = require('@sparticuz/chromium').default;
(async () => {
  const exe = await c.executablePath();
  const b = await p.launch({ executablePath: exe, headless: 'new', args: [...c.args, '--no-sandbox', '--disable-gpu'] });
  const pg = await b.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  await pg.setViewport({ width: 1440, height: 900 });
  await pg.goto('http://localhost:8080/', { waitUntil: 'networkidle0', timeout: 180000 });
  await new Promise(r => setTimeout(r, 4000));
  const gate = await pg.evaluate(() => document.querySelector('.gate-title')?.textContent);
  console.log('GATE:', gate);
  await pg.screenshot({ path: '/tmp/preview-gate.png' });
  console.log('errors:', errs.length ? errs.slice(0, 3) : 'NONE');
  await b.close();
})();
