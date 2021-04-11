const debug = require('debug')('cywp:cypress')
const checkConfig = require('./config')
// const { Docker } = require('./docker/docker')
const { SetupDatabase, SetupSite, setupNetwork } = require('./workflow/environment')

/**
 * @type {Cypress.PluginConfig}
 */
function runner (on, config) {
  // const docker = new Docker()

  /** @type {import('./docker/network')} */
  let network
  /** @type {import('./docker/container')} */
  let mysql
  /** @type {import('./docker/container')} */
  let wordpress

  config = checkConfig(config)

  on('before:browser:launch', async () => {
    console.log('hello')
    network = await setupNetwork()
    debug('created docker network')
    mysql = await SetupDatabase(3306)
    debug('created mysql container ')
    wordpress = await SetupSite(config.env.cywpWordpressName, config.env.cywpWordpressPort, mysql)
    debug('created wordpress container ')
  })

  on('after:run', async () => {
    await wordpress.rm(true)
    await mysql.rm(true)
    await network.rm()
  })

  return config
}

module.exports = runner
