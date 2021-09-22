const { SetupSite } = require('./environment')
const { Docker } = require('../docker/docker')
const Plugin = require('../wp-cli/plugin')
const Theme = require('../wp-cli/theme')
const User = require('../wp-cli/user')
const WPCLI = require('../wp-cli')

/**
 * Display a message at the start and the end of each run.
 *
 * @param {string} message - whats massage to send at the start and the end of each method call.
 * @param {Function} callback - function to run.
 * @returns {any} - callback data
 */
async function logger (message, callback) {
  let data
  try {
    console.log(`started:\t${message}`)

    data = await callback()
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
  for (const item of pluginList) {
    await logger(`Installing ${item.name}`, () => plugin.install(item.name, true, 'latest' === item.version ? '' : item.version))
  }
}

/**
 * pull all docker images that the runner require.
 *
 * @param {string} cywpWordpressVersion - wanted wordpress version.
 * @param {boolean} skipPull - if to skip docker images pull.
 * @returns {void}
 */
async function pullDockerImages (cywpWordpressVersion, skipPull) {
  if (skipPull) {
    return console.log('status:\t\tskipped docker pull')
  }

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

    return theme.install(config.cywpTheme, true, 'latest' === config.cywpThemeVersion ? '' : config.cywpThemeVersion)
  })

  if (config.cywpPlugins.remote.length) {
    await logger('Installing Remote Plugins', () => installPlugins(plugin, config.cywpPlugins.remote))
  }

  if (config.cywpPlugins.local.length) {
    const pluginList = config.cywpPlugins.local.map(({ ...item }) => item.name)

    await logger('Installing Local Plugins', () => plugin.activate(pluginList))
  }

  return wordpress
}

/**
 * preper cypress tasks object
 *
 * @param {import('./docker/container')} wordpress the site to work on.
 * @param {import('./docker/container')} mysql the site to work on.
 * @returns {object} object containing all tasks api.
 */
function preperTasks (wordpress, mysql) {
  const wp = new WPCLI(wordpress)

  const tasks = {
    wordpress: (commands) => wordpress.exec(commands),
    mysql: (commands) => mysql.exec(commands),
    wp: (commands) => wp.wp(commands),
    'wp:plugin': (commands) => wp.plugin.wpPlugin(commands),
    'wp:theme': (commands) => wp.theme.wpTheme(commands),
    'wp:user': (commands) => wp.user.wpUser(commands),
    'wp:user:meta': (commands) => wp.user.Meta.wpUserMeta(commands),
  }

  const filter = (param) => 'constructor' !== param

  Object.getOwnPropertyNames(Plugin.prototype).filter(filter).forEach((item) => {
    tasks[`wp:plugin:${item}`] = (...args) => wp.plugin[item](...args)
  })

  tasks['wp:plugin:install'] = ({ plugin, activate, version }) => wp.plugin.install(plugin, activate, version)
  tasks['wp:plugin:deactivate'] = ({ plugin, uninstall }) => wp.plugin.deactivate(plugin, uninstall)

  Object.getOwnPropertyNames(Theme.prototype).filter(filter).forEach((item) => {
    tasks[`wp:theme:${item}`] = (...args) => wp.theme[item](...args)
  })

  tasks['wp:theme:delete'] = ({ theme, force }) => wp.theme.delete(theme, force)
  tasks['wp:theme:install'] = ({ theme, activate, version }) => wp.theme.install(theme, activate, version)

  Object.getOwnPropertyNames(User.prototype).filter(filter).forEach((item) => {
    tasks[`wp:user:${item}`] = (...args) => wp.user[item](...args)
  })

  tasks['wp:user:addCap'] = ({ user, cap }) => wp.user.addCap(user, cap)
  tasks['wp:user:addRole'] = ({ user, role }) => wp.user.addRole(user, role)
  tasks['wp:user:delete'] = ({ user, reassign }) => wp.user.delete(user, reassign)
  tasks['wp:user:removeCap'] = ({ user, cap }) => wp.user.removeCap(user, cap)
  tasks['wp:user:removeRole'] = ({ user, role }) => wp.user.removeRole(user, role)

  tasks['wp:user:meta:add'] = ({ user, key, value }) => wp.user.Meta.add(user, key, value)
  tasks['wp:user:meta:delete'] = ({ user, key }) => wp.user.Meta.delete(user, key)
  tasks['wp:user:meta:get'] = ({ user, key }) => wp.user.Meta.get(user, key)
  tasks['wp:user:meta:list'] = (user) => wp.user.Meta.add(user)
  tasks['wp:user:meta:update'] = ({ user, key, value }) => wp.user.Meta.update(user, key, value)

  return tasks
}

module.exports = { CreateWordpress, installPlugins, logger, preperTasks, pullDockerImages }
