const checkConfig = require('./config')
const { SetupDatabase, setupNetwork } = require('./workflow/environment')
const { unsafeVerify } = require('./verify')
const { CreateWordpress, logger, preperTasks, pullDockerImages } = require('./workflow/util')

/**
 * @type {Cypress.PluginConfig}
 */
async function runner (on, config) {
  config = checkConfig(config)

  await logger('Verifying Docker', unsafeVerify)

  await logger('Pulling Docker Images', () => pullDockerImages(config.env.cywpWordpressVersion, config.env.skip_pull))

  const network = await logger('Creating Docker Network', setupNetwork)

  const mysql = await logger('Creating Mysql Container', SetupDatabase)

  const wordpress = await logger('Creating WordPress Container', () => CreateWordpress(mysql, config.env))

  on('after:run', async () => {
    await wordpress.rm(true, true, true)
    await mysql.rm(true)
    await network.rm()
  })

  on('task', preperTasks(wordpress, mysql))

  return config
}

module.exports = runner
