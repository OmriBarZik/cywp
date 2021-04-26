const checkConfig = require('./config')
const { SetupDatabase, SetupSite, setupNetwork } = require('./workflow/environment')
const { verify } = require('./verify')
const Plugin = require('./wp-cli/plugin')
const Theme = require('./wp-cli/theme')
const { Docker } = require('./docker/docker')

/**
 * Display a message at the start and the end of each run.
 *
 * @param {string} message - whats massage to send at the start and the end of each method call.
 * @param {Function} callback - function to run.
 * @param {...any} args - callback args.
 */
function logger (message, callback, ...args) {
  console.log(`started:\t${message}`)
  callback(args)
  console.log(`finished:\t${message}`)
}

/**
 * @param {import('./wp-cli/plugin')} plugin - the site to install the plugin.
 * @param {{name: string, version: string}[]} pluginList - list of plugins to install.
 */
async function installPlugins (plugin, pluginList) {
  console.log('started: installing plugins')

  for (const item of pluginList) {
    console.log(`started: installing ${item.name}`)
    try {
      await plugin.install(item.name, true, 'latest' === item.version ? '' : item.version)

      console.log(`finished: installing ${item.name}`)
    } catch (error) {
      console.error(`failed installing ${item.name}`)
    }
  }

  console.log('finished: installing plugins')
}

/**
 * @type {Cypress.PluginConfig}
 */
async function runner (on, config) {
  config = checkConfig(config)

  console.log('Started: Verifying docker')
  const verifyOutput = await verify()
  if (!verifyOutput.verified) {
    throw new Error(verifyOutput.message)
  }
  console.log('Finished: Verifying docker')

  console.log('Started: Pulling docker images')
  const docker = new Docker()
  const finishedPullCallback = (image) => { console.log('pulled ' + image) }

  await Promise.all([
    docker.pullImage('wordpress' + (config.env.cywpWordpressVersion ? `:${config.env.cywpWordpressVersion}` : ''))
      .then(finishedPullCallback),
    docker.pullImage('mysql:5.7')
      .then(finishedPullCallback),
    docker.pullImage('wordpress:cli')
      .then(finishedPullCallback),
  ])
  console.log('Finished: Pulling docker images')

  const network = await setupNetwork()
  console.log('created docker network')

  console.log('started: creating mysql container')
  const mysql = await SetupDatabase()
  console.log('finished: creating mysql container')

  console.log('started: creating wordpress container')
  const volumes = [].concat(config.env.cywpPlugins.local, config.env.cywpThemePath)
  const wordpress = await SetupSite(config.env.cywpTheme, config.env.cywpWordpressPort, mysql, config.env.cywpWordpressVersion, volumes)

  const plugin = new Plugin(wordpress)
  const theme = new Theme(wordpress)

  console.log('started: installing theme')
  if (config.env.cywpThemePath.length) {
    await theme.activate(config.env.cywpTheme)
  } else {
    await theme.install(config.env.cywpTheme, true, config.env.cywpThemeVersion)
  }
  console.log('finished: installing theme')

  if (config.env.cywpPlugins.remote.length) {
    await installPlugins(plugin, config.env.cywpPlugins.remote)
  }

  if (config.env.cywpPlugins.local.length) {
    const pluginList = config.env.cywpPlugins.local.map(({ ...plugin }) => plugin.name)
    await plugin.activate(pluginList)
  }

  console.log('finished: creating wordpress container')

  on('after:run', async () => {
    await wordpress.rm(true, true, true)
    await mysql.rm(true)
    await network.rm()
  })

  return config
}

module.exports = runner
