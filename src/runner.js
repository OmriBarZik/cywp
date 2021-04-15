const checkConfig = require('./config')
const { SetupDatabase, SetupSite, setupNetwork } = require('./workflow/environment')

/**
 * @type {Cypress.PluginConfig}
 */
async function runner (on, config) {
  config = checkConfig(config)

  const network = await setupNetwork()
  console.log('created docker network')

  console.log('started: creating mysql container')
  const mysql = await SetupDatabase()
  console.log('finished: creating mysql container')

  console.log('started: creating wordpress container')
  const wordpress = await SetupSite(config.env.cywpWordpressTheme, config.env.cywpWordpressPort, mysql)
  console.log('finished: creating wordpress container')

  on('after:run', async () => {
    await wordpress.rm(true)
    await mysql.rm(true)
    await network.rm()
  })

  return config
}

module.exports = runner
