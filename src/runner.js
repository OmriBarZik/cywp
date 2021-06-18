const checkConfig = require('./config')
const { SetupDatabase, setupNetwork } = require('./workflow/environment')
const { unsafeVerify } = require('./verify')
const { CreateWordpress, logger, pullDockerImages } = require('./workflow/util')
const Plugin = require('./wp-cli/plugin')
const Theme = require('./wp-cli/theme')
const User = require('./wp-cli/user')
const WPCLI = require('./wp-cli')

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
