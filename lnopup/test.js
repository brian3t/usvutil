const puppeteer = require('puppeteer');
const DEBUG = true
const ppt_opt_debug = {
  headless: false,
  slowMo: 800,
  devtools: true
};

(async () => {
  const browser = await puppeteer.launch( ppt_opt_debug );
  const page = await browser.newPage();
  await page.goto('https://google.com');
  await page.screenshot({path: 'tmp/example.png'});

  // await browser.close();
})();
