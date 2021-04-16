const checkConfig = require('./config')
const { SetupDatabase, SetupSite, setupNetwork } = require('./workflow/environment')
const Plugin = require('./wp-cli/plugin')
const Theme = require('./wp-cli/theme')

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

  const network = await setupNetwork()
  console.log('created docker network')

  console.log('started: creating mysql container')
  const mysql = await SetupDatabase()
  console.log('finished: creating mysql container')

  console.log('started: creating wordpress container')
  const volumes = [].concat(config.env.cywpLocalPlugins, config.env.cywpThemePath)
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

  if (config.env.cywpRemotePlugins.length) {
    await installPlugins(plugin, config.env.cywpRemotePlugins)
  }

  if (config.env.cywpLocalPlugins.length) {
    const pluginList = config.env.cywpLocalPlugins.map(({ ...plugin }) => plugin.name)
    plugin.activate(pluginList)
  }
  console.log('finished: creating wordpress container')

  on('after:run', async () => {
    await wordpress.rm(true)
    await mysql.rm(true)
    await network.rm()
  })

  return config
}

module.exports = runner
