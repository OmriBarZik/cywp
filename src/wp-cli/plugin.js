require('./types')
const { CreateWordpressCliContainer } = require('../docker/presets/containers')
const { CheckIfArrayOrString } = require('./util')

/**
 * Manage wordpress plugins through wp cli.
 */
class Plugin {
  /**
   * Constructor for the Plugin object
   *
   * @param {import('../docker/container')} site - the wordpress site to work on.
   */
  constructor (site) {
    this.site = site
  }

  /**
   * Run wp plugin command on a wp cli continer that connected to the site provied in the constructor.
   *
   * @param {string[]} commands - commands passing to wp plugin
   * @returns {Promise<RunInContainerOutput>} The output of the command
   */
  wpPlugin (commands) {
    const args = ['wp', 'plugin'].concat(commands)

    return CreateWordpressCliContainer(this.site, args)
  }

  /**
   * Activate one or more plugins.
   *
   * @param {string|string[]|'all'} plugin - One or more plugins to activate, use 'all' to activate all plugins.
   * @returns {Promise<RunInContainerOutput>} The output of the command.
   * @example ```js
   * const plugin = new Plugin(WordPress)
   *
   * //Activate one plugin
   * plugin.activate('elementor')
   *
   * //Activate all plugins
   * plugin.activate('all')
   * ```
   */
  activate (plugin) {
    plugin = CheckIfArrayOrString(plugin, 'plugin')

    const activateArgs = ['activate']

    if ('all' === plugin[0]) { plugin = ['--all'] }

    activateArgs.push.apply(activateArgs, plugin)

    return this.wpPlugin(activateArgs)
  }

  /**
   * Deactivate one or more plugins.
   *
   * @param {string|string[]|'all'} plugin - One or more plugins to deactivate, use 'all' to deactivate all plugins.
   * @param {boolean} uninstall - Uninstall the plugin after deactivation.
   * @returns {Promise<RunInContainerOutput>} The output of the command.
   * @example ```js
   * const plugin = new Plugin(WordPress)
   *
   * //Deactivate one plugin
   * plugin.deactivate('elementor')
   *
   * //Deactivate all plugins
   * plugin.deactivate('all')
   * ```
   */
  deactivate (plugin, uninstall) {
    plugin = CheckIfArrayOrString(plugin, 'plugin')

    const deactivateArgs = ['deactivate']

    if (uninstall) { deactivateArgs.push('--uninstall') }

    if ('all' === plugin[0]) { plugin = ['--all'] }

    deactivateArgs.push.apply(deactivateArgs, plugin)

    return this.wpPlugin(deactivateArgs)
  }

  /**
   * Deletes one or more plugins.
   *
   * @param {string|string[]|'all'} plugin - One or more plugins to delete, use 'all' to delete all plugins.
   * @returns {Promise<RunInContainerOutput>} The output of the command.
   * @example ```js
   * const plugin = new Plugin(WordPress)
   *
   * //Delete one plugin
   * plugin.delete('Twenty Twenty')
   *
   * //Delete all plugins
   * plugin.delete('all')
   * ```
   */
  delete (plugin) {
    plugin = CheckIfArrayOrString(plugin, 'plugin')

    const deleteArgs = ['delete']

    if ('all' === plugin[0]) { plugin = ['--all'] }

    deleteArgs.push.apply(deleteArgs, plugin)

    return this.wpPlugin(deleteArgs)
  }

  /**
   * Get plugin data.
   *
   * @param {string} plugin - The plugin to get.
   * @returns {Promise<PluginGetObject>} Current plugin data.
   */
  get (plugin) {
    return this.wpPlugin(['get', '--format=json', plugin])
      .then((output) => JSON.parse(output.stdout))
  }

  /**
   * Installs one or more plugins.
   *
   * @param {string | string[]} plugin - One or more plugins to install. Accepts a plugin slug, the path to a local zip file, or a URL to a remote zip file.
   * @param {boolean} activate - If set, the plugin will be activated immediately after install.
   * @param {string} version - Get that particular version from wordpress.org, instead of the stable version.
   * @returns {Promise<RunInContainerOutput>} The output of the command.
   */
  install (plugin, activate, version) {
    plugin = CheckIfArrayOrString(plugin, 'plugin')

    const installArgs = ['install', '--force']

    if (activate) {
      if (1 < plugin.length) {
        throw new Error('To use activate there must be at only one plugin given.')
      }

      installArgs.push('--activate')
    }

    if (version) {
      if (1 < plugin.length) {
        throw new Error('To use version there must be at only one plugin given.')
      }

      installArgs.push(`--version=${version}`)
    }

    installArgs.push.apply(installArgs, plugin)

    return this.wpPlugin(installArgs)
  }

  /**
   * Checks if a given plugin is active.
   *
   * @param {string} plugin - The plugin to check.
   * @returns {Promise<boolean>} Whether plugin is active
   */
  isActive (plugin) {
    return this.wpPlugin(['is-active', plugin])
      .then(() => true)
      .catch(() => Promise.resolve(false))
  }

  /**
   * Checks if a given plugin is installed.
   *
   * @param {string} plugin - The plugin to check.
   * @returns {Promise<boolean>} Whether plugin is installed
   */
  isInstalled (plugin) {
    return this.wpPlugin(['is-installed', plugin])
      .then(() => true)
      .catch(() => Promise.resolve(false))
  }

  /**
   * Return list of plugin installed in the wordpress site and there data.
   *
   * @param {PluginListFiltersObject} [filters] - Filter results based on the value of a field.
   * @returns {Promise<PluginListFiltersObject[]>} - List of plugin installed in the wordpress site.
   */
  list (filters = {}) {
    const listArgs = [
      'list',
      '--fields=name,status,update,version,update_version,update_package,update_id,title,description,file',
      '--format=json',
    ]

    if ('object' !== typeof filters) {
      throw new TypeError('filters must be an object')
    }

    for (const filtersField in filters) {
      listArgs.push(`--${filtersField}=${filters[filtersField]}`)
    }

    return this.wpPlugin(listArgs)
      .then((output) => JSON.parse(output.stdout))
  }

  /**
   * Gets the path to a plugin or to the plugin directory.
   *
   * @param {string} plugin - The plugin to get the path to.
   * @returns {Promise<RunInContainerOutput>} Path to a plugin or to the plugin directory.
   */
  path (plugin) {
    const pathArgs = ['path']

    if (plugin) { pathArgs.push('--dir', plugin) }

    return this.wpPlugin(pathArgs)
  }

  /**
   * Uninstalls one or more plugins.
   *
   * @param {string|string[]|'all'} plugin - One or more plugins to uninstall.
   * @returns {Promise<RunInContainerOutput>} Path to a plugin or to the plugin directory
   * @example ```js
   * const plugin = new Plugin(WordPress)
   *
   * //Uninstall one plugin
   * plugin.uninstall('elementor')
   *
   * //Uninstall all plugins
   * plugin.uninstall('all')
   * ```
   */
  uninstall (plugin) {
    plugin = CheckIfArrayOrString(plugin, 'plugin')

    const deleteArgs = ['delete', '--deactivate']

    if ('all' === plugin[0]) { plugin = ['--all'] }

    deleteArgs.push.apply(deleteArgs, plugin)

    return this.wpPlugin(deleteArgs)
  }
}

module.exports = Plugin
