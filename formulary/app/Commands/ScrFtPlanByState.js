/**
 * Scrape plans by State from fingertip
 * This is used in production
 */

'use strict'

const {Command} = require('@adonisjs/ace')
const axios = use('axios').default
const _ = use('lodash')
const mm = use('moment')
const Database = use('Database')
const FTIP_URL = 'https://lookup.decisionresourcesgroup.com/lookup/plans.json?state_id=' //must concat state_id here
// const State = use('App/Models/State')
const Plan2State = use('App/Models/Plan2State')
const STATES = [1, 2, 3, 4, 6, 7, 8, 9, 10, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 28, 29, 30, 31, 32, 33, 34
  , 35, 36, 37, 38, 39, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 55, 56, 57, 58]

class ScrFtPlanByState extends Command {
  static get signature(){
    return 'scr_ft_plan_by_state'
  }

  static get description(){
    return 'Scrape Fingertip Plans By State'
  }

  async handle(args, options){
    try {
      this.info('Scrape Fingertip Plans By State')
      STATES.forEach(async ( STATE) => {
        let plans = await axios.get(`${FTIP_URL}${STATE}`)
        if (! plans || plans.status !== 200 || ! plans.data || ! plans.data.data) return
        plans = plans.data.data
        plans = JSON.parse(plans)
        if (! (_.isObject(plans))) return
        await _.forIn(plans, async (plans_in_type, cur_type) => {//for each block in results slider
          await plans_in_type.forEach(async (plan, i) => {
            let payload = {plan2_id: plan.id, state_id: STATE}
            let plan2_state_m = await Plan2State.findOrCreate(payload, payload)
            if (! plan2_state_m instanceof Plan2State) return false
            /** @type Plan2State plan_m */
            plan2_state_m.plan2_id = plan.id
            plan2_state_m.state_id = STATE
            await plan2_state_m.save()
          })
        })
      })

      console.log(`After 400 secs we close db, so that process exit; no matter what is running. Time's up!`)
      setTimeout(() => {
        Database.close()
      }, 400 * 1000)
    } catch (e) {
      console.error(`error 45: `, e)
    }
  }
}

module.exports = ScrFtPlanByState
