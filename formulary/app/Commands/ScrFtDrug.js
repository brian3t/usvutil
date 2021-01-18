'use strict'

const {Command} = require('@adonisjs/ace')
const axios = require('axios').default
const mm = require('moment')
const Database = use('Database')
const FTIP_URL = 'https://lookup.decisionresourcesgroup.com/lookup/all_drugs.json' //optional: ?v=2021y1m3d
const Drug = use('App/Models/Drug')

class ScrFtDrug extends Command {
  static get signature(){
    return 'scr_ft_drug'
  }

  static get description(){
    return 'Scrape Fingertip Drugs'
  }

  async handle(args, options){
    try {
      this.info('Scrape Fingertip Drugs')
      let drugs = await axios.get(FTIP_URL)
      if (! drugs || drugs.status !== 200 || ! drugs.data || ! drugs.data.data) return
      drugs = drugs.data.data
      await drugs.forEach(async (drug, i) => {//for each block in results slider
        try {
          let payload = {id: drug.id, name: drug.name}
          let drug_m = await Drug.findOrCreate(payload, payload)
          if (! drug_m instanceof Drug) return false
          /** @type Drug drug_m **/
          drug_m.name = drug.name
          await drug_m.save()
        }
        catch (e){
          console.error(`error: `, e)
        }
      })
      console.log(`After 300 secs we close db, so that process exit; no matter what is running. Time's up!`)
      setTimeout(() => {//asdf
        Database.close()
      }, 300*1000)
    } catch (e) {
      console.error(`error 43: `, e)
    }
  }
}

module.exports = ScrFtDrug
