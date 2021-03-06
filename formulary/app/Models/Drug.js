'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Drug extends Model {
  static createdAtColumn = false
  static updatedAtColumn = false

  static get table () {
    return 'drug_raw'
  }
}

module.exports = Drug
