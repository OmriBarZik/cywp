const checkConfig = require('./config')
// const { Docker } = require('./docker/docker')
const { SetupDatabase, SetupSite, setupNetwork } = require('./workflow/environment')

/**
 * @type {Cypress.PluginConfig}
 */
async function runner (on, config) {
  // const docker = new Docker()

  /** @type {import('./docker/network')} */
  let network
  /** @type {import('./docker/container')} */
  let mysql
  /** @type {import('./docker/container')} */
  let wordpress

  config = checkConfig(config)

  try {
    network = await setupNetwork()
    console.log('created docker network')
    mysql = await SetupDatabase()
    console.log('created mysql container')
    wordpress = await SetupSite(config.env.cywpWordpressName, config.env.cywpWordpressPort, mysql)
    console.log('created wordpress container')
  } catch (error) {
    console.log(error)
  }

  on('after:run', async () => {
    await wordpress.rm(true)
    await mysql.rm(true)
    await network.rm()
  })

  return config
}

module.exports = runner
