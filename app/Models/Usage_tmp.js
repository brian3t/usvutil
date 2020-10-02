'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Usage_tmp extends Model {
  static get table () {
    return 'usage_tmp'
  }
}

module.exports = Usage_tmp
