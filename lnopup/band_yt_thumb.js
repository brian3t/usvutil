const axios = require('axios');
const fetch = require('node-fetch');
const _ = require('lodash');
const moment = require('moment');
const puppeteer = require('puppeteer');

const DEBUG = false
const DEBUG_MAX_BANDS = 1
const API_URL = 'http://api.lnoapi/v1/'
// const API_URL = 'https://api.lnoapi/v1/'
const ppt_opt_debug = {
  headless: false,
  slowMo: 800,
  devtools: true
};

(async () => {
  const query_url = `${API_URL}band?cols=id,name,ytlink_first,youtube&qr=` + JSON.stringify([['not', {ytlink_first: null}], {ytlink_first_tnail: null}])
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

  let ytlink_first_tnail, is_thumb_valid, update_url, i = 0
  for await (const band of bands) {
    await page.goto(`https://youtube.com/watch?v=` + band.ytlink_first)
    ytlink_first_tnail = await page.$eval("head > meta[property='og:image']", element => element.content)
    console.log(`thumbnail: `, ytlink_first_tnail)
    is_thumb_valid = await fetch(ytlink_first_tnail, {method: 'HEAD'})
    is_thumb_valid = is_thumb_valid?.ok

    update_url = `${API_URL}band/${band.id}`
    if (! is_thumb_valid) { // noinspection ES6MissingAwait
      axios.patch(update_url, {yt_scr_status: 'thumb failed'})
    } else { // noinspection ES6MissingAwait
      axios.patch(update_url, {ytlink_first_tnail, yt_scr_status: 'thumb success'})
    }

    if (i === 0) { // noinspection ES6MissingAwait
      page.screenshot({path: `./tmp/${now}.png`})
    }
    i++
  }

  if (! DEBUG) await browser.close();
})();
