'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Plan2State extends Model {
  static createdAtColumn = false
  static updatedAtColumn = false
  static get table () {
    return 'plan2_state'
  }
}

module.exports = Plan2State
