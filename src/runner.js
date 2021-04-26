const checkConfig = require('./config')
const { SetupDatabase, SetupSite, setupNetwork } = require('./workflow/environment')
const { unsafeVerify } = require('./verify')
const Plugin = require('./wp-cli/plugin')
const Theme = require('./wp-cli/theme')
const { Docker } = require('./docker/docker')

/**
 * Display a message at the start and the end of each run.
 *
 * @param {string} message - whats massage to send at the start and the end of each method call.
 * @param {Function} callback - function to run.
 * @param {...any} args - callback args.
 * @returns {any} - callback data
 */
async function logger (message, callback, ...args) {
  let data
  try {
    console.log(`started:\t${message}`)

    data = await callback(...args) // eslint-disable-line standard/no-callback-literal

    console.log(`finished:\t${message}`)
  } catch (e) {
    const error = e instanceof Error ? e : new Error(e)

    console.error(`failed:\t\t${message}\n${error}`)
    throw error
  }

  return data
}

/**
 * @param {import('./wp-cli/plugin')} plugin - the site to install the plugin.
 * @param {{name: string, version: string}[]} pluginList - list of plugins to install.
 */
async function installPlugins (plugin, pluginList) {
  console.log(plugin)
  console.log(pluginList)
  for (const item of pluginList) {
    await logger(`Installing ${item.name}`, plugin.install, item.name, true, 'latest' === item.version ? '' : item.version)
  }
}

/**
 * pull all docker images that the runner require.
 *
 * @param {string} cywpWordpressVersion - wanted wordpress version.
 */
async function pullDockerImages (cywpWordpressVersion) {
  const docker = new Docker()
  const finishedPullCallback = (image) => { console.log('pulled:\t\t' + image) }

  await Promise.all([
    docker.pullImage(`wordpress:${cywpWordpressVersion}`).then(finishedPullCallback),
    docker.pullImage('mysql:5.7').then(finishedPullCallback),
    docker.pullImage('wordpress:cli').then(finishedPullCallback),
  ])
}

/**
 * setup the wordpress container.
 *
 * @param {import('./docker/container')} mysql mysql container
 * @param {object} config - cywp config.
 * @returns {import('./docker/container')} fully setup wordpress container.
 */
async function CreateWordpress (mysql, config) {
  const volumes = config.cywpPlugins.local.concat(config.cywpThemePath)
  const wordpress = await SetupSite(config.cywpTheme, config.cywpWordpressPort, mysql, config.cywpWordpressVersion, volumes)

  const plugin = new Plugin(wordpress)
  const theme = new Theme(wordpress)

  await logger('Installing Theme', () => {
    if (config.cywpThemePath.length) {
      return theme.activate(config.cywpTheme)
    }

    return theme.install(config.cywpTheme, true, config.cywpThemeVersion)
  })

  if (config.cywpPlugins.remote.length) {
    await logger('Installing Remote Plugins', installPlugins, plugin, config.cywpPlugins.remote)
  }

  if (config.cywpPlugins.local.length) {
    const pluginList = config.cywpPlugins.local.map(({ ...item }) => item.name)

    await logger('Installing Local Plugins', plugin.activate, pluginList)
  }

  return wordpress
}

/**
 * @type {Cypress.PluginConfig}
 */
async function runner (on, config) {
  config = checkConfig(config)

  await logger('Verifying Docker', unsafeVerify)

  await logger('Pulling Docker Images', pullDockerImages, config.env.cywpWordpressVersion)

  const network = await logger('Creating Docker Network', setupNetwork)

  const mysql = await logger('Creating Mysql Container', SetupDatabase)

  const wordpress = await logger('Creating WordPress Container', CreateWordpress, mysql, config.env)

  on('after:run', async () => {
    await wordpress.rm(true, true, true)
    await mysql.rm(true)
    await network.rm()
  })

  return config
}

module.exports = runner
