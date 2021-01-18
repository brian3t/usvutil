'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Drug extends Model {
  static get table () {
    return 'drug'
  }
}

module.exports = Drug
