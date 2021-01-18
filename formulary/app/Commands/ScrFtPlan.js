/**
 * Scrape ALL plans from fingertip
 * This is not used in production. This data doesn't have stateid.
 * We use scrape_plan_by_state instead
 */

'use strict'

const {Command} = require('@adonisjs/ace')
const axios = use('axios').default
const _ = use('lodash')
const mm = use('moment')
const Database = use('Database')
const FTIP_URL = 'https://lookup.decisionresourcesgroup.com/lookup/all_plans.json?state_id='
const Plan2 = use('App/Models/Plan2')

class ScrFtPlan extends Command {
  static get signature(){
    return 'scr_ft_plan'
  }

  static get description(){
    return 'Scrape Fingertip Plans'
  }

  async handle(args, options){
    try {
      this.info('Scrape Fingertip Plans')
      let plans = await axios.get(FTIP_URL)
      if (! plans || plans.status !== 200 || ! plans.data || ! plans.data.data) return
      plans = plans.data.data
      plans = JSON.parse(plans)
      if (! (_.isObject(plans))) return
      await _.forIn(plans, async (plans_in_type, cur_type) => {//for each block in results slider
        await plans_in_type.forEach(async (plan,i) => {
          let payload = {id: plan.id, name: plan.name, lives: plan.lives, type: cur_type}
          let plan_m = await Plan2.findOrCreate({id: plan.id}, payload)
          if (! plan_m instanceof Plan2) return false
          /** @type Drug drug_m **/
          plan_m.name = plan.name
          plan_m.lives = plan.lives
          await plan_m.save()
        })
      })
      console.log(`After 300 secs we close db, so that process exit; no matter what is running. Time's up!`)
      setTimeout(() => {
        Database.close()
      }, 300 * 1000)
    } catch (e) {
      console.error(`error 45: `, e)
    }
  }
}

module.exports = ScrFtPlan
