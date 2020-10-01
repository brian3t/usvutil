'use strict'

const { Command } = require('@adonisjs/ace')

class UsageAcc extends Command {
  static get signature () {
    return 'usage:acc'
  }

  static get description () {
    return 'Tell something helpful about this command'
  }

  async handle (args, options) {
    this.info('Dummy implementation for usage:acc command')
    console.log(`do sth here`)
  }
}

module.exports = UsageAcc
