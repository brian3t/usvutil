const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const puppeteer = require('puppeteer');

const DEBUG = true
const DEBUG_MAX_BANDS = 1
const API_URL = 'http://api.lnoapi/v1/'
// const API_URL = 'https://api.lnoapi/v1/'
const ppt_opt_debug = {
  headless: false,
  slowMo: 800,
  devtools: true
};

(async () => {
  const query_url = `${API_URL}band?cols=id,name,ytlink_first,youtube&qr=` + JSON.stringify(['not', {ytlink_first: null}])
  /** @type {Array} **/
  let bands = await axios.get(query_url)
  if (! bands.data) return `API error`
  bands = bands.data
  if (! _.isArray(bands)) return `Need bands`
  if (DEBUG) bands = bands.slice(0, DEBUG_MAX_BANDS)
  // console.log(`bands: `, bands)
  const browser = await puppeteer.launch(ppt_opt_debug)
  const page = await browser.newPage()
  const now = (new moment()).format('MMDD_HHmmss')

  let thumbnail

  for (const band of bands) {
    await page.goto(`https://youtube.com/watch?v=` + band.ytlink_first);
    thumbnail = await page.$eval("head > meta[property='og:image']", element => element.content);
    console.log(`thumbnail: `, thumbnail)
    await page.screenshot({path: `./tmp/${now}.png`});
  }

  if (! DEBUG) await browser.close();
})();
