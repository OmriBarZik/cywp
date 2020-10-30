const Container = require('../docker/container') // eslint-disable-line no-unused-vars
const { CreateWordpressCliContainer } = require('../docker/presets/containers')

/**
 * Manage wordpress theme through wp cli.
 */
class Theme {
  /**
   * Constructor for the Theme object
   *
   * @param {Container} site - the wordpress site to work on.
   */
  constructor (site) {
    this.site = site
  }

  /**
   *
   * @param {string[]} commands -
   * @returns {Promise<RunInContainerOutput>} the wordperss cli container.
   */
  wpTheme (commands) {
    const args = ['wp', 'theme'].concat(commands)

    return CreateWordpressCliContainer(this.site, args)
  }

  /**
   * Activates a theme.
   *
   * @param {string} theme - The theme to activate.
   * @returns {Promise<RunInContainerOutput>} the wordperss cli container.
   */
  activate (theme) {
    return this.wpTheme(['activate', theme])
  }

  /**
   * Deletes one or more themes.
   *
   * @param {string|string[]|'all'} theme - One or more themes to delete, use 'all' to delete all except active theme.
   * @param {boolean} force - To delete active theme use this.
   * @returns {Promise<RunInContainerOutput>} the wordperss cli container.
   *
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
    if ('string' === typeof theme) {
      theme = [theme]
    }

    if (!Array.isArray(theme)) {
      throw new TypeError('theme must be an array or a string')
    }

    const args = ['delete']

    if (force) { args.push('--force') }

    if ('all' === theme[0]) { theme = ['--all'] }

    args.push.apply(args, theme)

    return this.wpTheme(args)
  }

  /**
   * Get theme data.
   *
   * @param {string} theme - The theme to get.
   * @returns {Promise<ThemeGetObject>} The wordpress cli container.
   */
  get (theme) {
    return this.wpTheme(['get', '--format=json', theme])
      .then((output) => JSON.parse(output.stdout))
  }

  install () {
  }

  isActive () {
  }

  isInstalled () {
  }

  list () {
  }

  path () {
  }

  search () {
  }

  status () {
  }
}

module.exports = Theme
