require('./types')
const { CreateWordpressCliContainer } = require('../docker/presets/containers')
const { CheckIfArrayOrString } = require('./util')

/**
 * Manage wordpress theme through wp cli.
 */
class Theme {
  /**
   * Constructor for the Theme object.
   *
   * @param {import('../docker/container')} site - the wordpress site to work on.
   */
  constructor (site) {
    this.site = site
  }

  /**
   * Run wp theme command on a wp cli continer that connect to the site provied in the constructor.
   *
   * @param {string[]} commands - commands passing to wp theme.
   * @returns {Promise<RunInContainerOutput>} The output of the command.
   */
  wpTheme (commands) {
    const args = ['wp', 'theme'].concat(commands)

    return CreateWordpressCliContainer(this.site, args)
  }

  /**
   * Activates a theme.
   *
   * @param {string} theme - The theme to activate.
   * @returns {Promise<RunInContainerOutput>} The output of the command
   */
  activate (theme) {
    return this.wpTheme(['activate', theme])
  }

  /**
   * Deletes one or more themes.
   *
   * @param {string|string[]|'all'} theme - One or more themes to delete, use 'all' to delete all except active theme.
   * @param {boolean} force - To delete active theme use this.
   * @returns {Promise<RunInContainerOutput>} The output of the command.
   * @example ```js
   * const theme = new Theme(WordPress)
   *
   * //delete one theme
   * theme.delete('Twenty Twenty')
   *
   * // Delete all themes
   * theme.delete('all')
   * ```
   */
  delete (theme, force = false) {
    theme = CheckIfArrayOrString(theme, 'theme')

    const deleteArgs = ['delete']

    if (force) { deleteArgs.push('--force') }

    if ('all' === theme[0]) { theme = ['--all'] }

    deleteArgs.push.apply(deleteArgs, theme)

    return this.wpTheme(deleteArgs)
  }

  /**
   * Get theme data.
   *
   * @param {string} theme - The theme to get.
   * @returns {Promise<ThemeGetObject>}  Current theme data.
   */
  get (theme) {
    return this.wpTheme(['get', '--format=json', theme])
      .then((output) => JSON.parse(output.stdout))
  }

  /**
   * @param {string | Array} theme - One or more themes to install. Accepts a theme slug, the path to a local zip file, or a URL to a remote zip file.
   * @param {boolean} activate - If set, the theme will be activated immediately after install.
   * @param {string} version - Get that particular version from wordpress.org, instead of the stable version.
   * @returns {Promise<RunInContainerOutput>} The output of the command.
   */
  install (theme, activate, version) {
    theme = CheckIfArrayOrString(theme, 'theme')

    const installArgs = ['install', '--force']

    if (activate) {
      if (1 < theme.length) {
        throw new Error('To use activate there must be at only one theme given.')
      }

      installArgs.push('--activate')
    }

    if (version) {
      if (1 < theme.length) {
        throw new Error('To use version there must be at only one theme given.')
      }

      installArgs.push(`--version=${version}`)
    }

    installArgs.push.apply(installArgs, theme)

    return this.wpTheme(installArgs)
  }

  /**
   * Checks if a given theme is active.
   *
   * @param {string} theme - The theme to check.
   * @returns {Promise<boolean>} Whether theme is active.
   */
  isActive (theme) {
    return this.wpTheme(['is-active', theme])
      .then(() => true)
      .catch(() => Promise.resolve(false))
  }

  /**
   * Checks if a given theme is installed.
   *
   * @param {string} theme - The theme to check.
   * @returns {Promise<boolean>} Whether theme is installed.
   */
  isInstalled (theme) {
    return this.wpTheme(['is-installed', theme])
      .then(() => true)
      .catch(() => Promise.resolve(false))
  }

  /**
   * Return list of themes installed in the wordpress site and there data.
   *
   * @param {ThemeListFiltersObject} [filters] - Filter results based on the value of a field.
   * @returns {Promise<ThemeListFiltersObject[]>} - List of themes installed in the wordpress site.
   */
  list (filters = {}) {
    const listArgs = [
      'list',
      '--fields=name,status,update,version,update_version,update_package,update_id,title,description',
      '--format=json',
    ]

    if ('object' !== typeof filters) {
      throw new TypeError('filters must be an object')
    }

    for (const filtersField in filters) {
      listArgs.push(`--${filtersField}=${filters[filtersField]}`)
    }

    return this.wpTheme(listArgs)
      .then((output) => JSON.parse(output.stdout))
  }

  /**
   * Gets the path to a theme or to the theme directory.
   *
   * @param {string} theme - The theme to get the path to.
   * @returns {Promise<string>} Path to a theme or to the theme directory.
   */
  path (theme) {
    const pathArgs = ['path']

    if (theme) { pathArgs.push('--dir', theme) }

    return this.wpTheme(pathArgs)
  }
}

module.exports = Theme
