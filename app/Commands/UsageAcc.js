'use strict'

const { Command } = require('@adonisjs/ace')
const Database = use('Database')
const Usage = use('App/Models/Usage')

class UsageAcc extends Command {
  static get signature () {
    return 'usage:acc'
  }

  static get description () {
    return 'Tell something helpful about this command'
  }

  async handle (args, options) {
    this.info('Dummy implementation for usage:acc command')
    console.log(`accumulating usage table`)

    select sum(count) sumcount, ip,agent, max(created_at), max(updated_at) from `usage`
    group by ip,agent



    // Without the following line, the command will not exit!
    Database.close()
  }
}

module.exports = UsageAcc
