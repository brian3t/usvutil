'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Plan2 extends Model {
  static get table () {
    return 'plan2'
  }
}

module.exports = Plan2
