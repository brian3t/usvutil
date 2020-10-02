const {Command} = require('@adonisjs/ace')
const Database = use('Database')
const Usage = use('App/Models/Usage')
const Usage_tmp = use('App/Models/Usage_tmp')
const _ = use('lodash')

class UsageAcc extends Command {
  static get signature(){
    return 'usage:acc'
  }

  static get description(){
    return 'Tell something helpful about this command'
  }

  async handle(args, options){
    this.info('accumulating usage table')

    let usages = await Database.raw(
      'select sum(count) count, ip,agent, max(created_at) created_at, max(updated_at) updated_at from `usage`'
      + ' where created_at > date_sub(CURDATE(), INTERVAL 1 MONTH)'
      + ' group by ip,agent')
    if (! usages || (usages.length < 1) || ! (usages.hasOwnProperty(0))) return
    usages = usages[0]
    // const usage_tmp_created = await Usage_tmp.createMany(usages) zsdf
    await Usage.query().whereRaw('created_at > date_sub(CURDATE(), INTERVAL 1 MONTH)').delete()
    const usage_accu_created = await Usage.createMany(usages)
    // Without the following line, the command will not exit!
    this.info(`${usages.length} rows accumulated, ${usage_accu_created.length} rows generated`)
    Database.close()
  }
}

module.exports = UsageAcc
