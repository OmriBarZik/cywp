const { existsSync, readFileSync } = require('fs')
const { resolve, join } = require('path')

let globalQuite = false

/**
 * print message on the console.
 *
 * @param {string} message message to print.
 */
function log (message) {
  if (!globalQuite) {
    console.log(message)
  }
}

/**
 * checks if version is a valid version. i.g (x.y.z)
 *
 * @param {string} version checks if valid version.
 * @returns {boolean} If a valid version.
 */
function validateVersion (version) {
  return /^\d+(\.\d+){0,2}$/.test(version) || 'latest' === version
}

/**
 * checks and set the wordpress version.
 *
 * @param {string} wordpressVersion raw user wordpress version.
 * @returns {string} validate wordpress version.
 */
function setWordpressVersion (wordpressVersion) {
  if (!wordpressVersion) {
    log('wordpress version not found, using latest')
    return 'latest'
  }

  if (!validateVersion(wordpressVersion)) {
    throw new Error('invalid wordpress version! please check \'wordpressVersion\' and try again.')
  }

  return wordpressVersion
}

/**
 * checks and validate wordpress port.
 *
 * @param {string | number} wordpressPort raw user wordpress port.
 * @returns {number} validate wordpress port.
 */
function setWordpressPort (wordpressPort) {
  if (!wordpressPort) {
    log('wordpress port was not provided using default port 8000')
    return 8000
  }

  if (!Number.isInteger(+wordpressPort)) {
    throw new Error('invalid wordpress port! please check \'wordpressPort\' and try again')
  }

  return +wordpressPort
}

/**
 * checks and validate wordpress theme.
 *
 * @param {string} wordpressTheme raw user wordpress theme.
 * @returns {string} validate wordpress theme.
 */
function setWordpressTheme (wordpressTheme) {
  if (!wordpressTheme) {
    log('wordpress theme was not provided using default theme twentytwenty')
    return 'twentytwenty'
  }

  return wordpressTheme
}

/**
 * checks and validate wordpress theme version.
 *
 * @param {string} themeVersion raw user wordpress theme version.
 * @returns {string} validate wordpress theme version.
 */
function SetWordpressThemeVersion (themeVersion) {
  if (!themeVersion) {
    return 'latest'
  }

  if (!validateVersion(themeVersion)) {
    throw new Error('invalid theme version! please check \'wordpressThemeVersion\' and try again.')
  }

  return themeVersion
}

/**
 * checks and validate wordpress theme path.
 *
 * @param {string} wordpressThemePath - raw user wordpress theme path.
 * @param {string} wordpressTheme - name of the wordpress theme.
 * @returns {{host: string, docker: string}[]} docker volume object.
 */
function setWordpressThemePath (wordpressThemePath, wordpressTheme) {
  if (!wordpressThemePath) {
    return []
  }

  if (!existsSync(wordpressThemePath)) {
    throw new Error('invalid theme path! please check \'wordpressThemePath\' and try again.')
  }

  return [{ host: resolve(wordpressThemePath), docker: `/var/www/html/wp-content/themes/${wordpressTheme}:ro` }]
}

/**
 * @typedef RemotePlugin
 * @type {object}
 * @property {string} name - name of the plugin.
 * @property {string} version - version of the plugin.
 */
/**
 * @typedef LocalPlugin - local plugin arguments.
 * @type {object}
 * @property {string} host - path on local machine.
 * @property {string} docker - path on docker container.
 * @property {string} name - name of the plugin.
 */
/**
 * checks and validate wordpress plugins.
 *
 * @param {object} wordpressPlugins raw user wordpress plugins.
 * @returns {{local: LocalPlugin[], remote: RemotePlugin[]}} tuple.
 */
function setWordpressPlugins (wordpressPlugins) {
  const plugins = { local: [], remote: [] }

  if (!wordpressPlugins) {
    return plugins
  }

  for (const plugin in wordpressPlugins) {
    const pluginData = wordpressPlugins[plugin]

    if (!existsSync(pluginData)) {
      if (!validateVersion(pluginData)) {
        throw new Error(`invalid plugin version! please check "wordpressPlugins": {"${plugin}": "${pluginData}"} and try again.`)
      }

      plugins.remote.push({ name: plugin, version: pluginData })
      continue
    }

    const pluginDir = resolve(pluginData)
    const pluginFile = join(pluginDir, `${plugin}.php`)

    if (!existsSync(pluginFile)) {
      throw new Error(`${plugin}.php is not found in ${pluginDir}. pleas provide a valid plugin path and try again.`)
    }

    // eslint-disable-next-line spellcheck/spell-checker
    const re = new RegExp(`Plugin Name:.*(${plugin}|${plugin.replace(/-/, ' ')}|${plugin.replace(/ /, '-')})`, 'ig')

    if (!readFileSync(pluginFile).toString().match(re)) {
      throw new Error(`${pluginFile} must be a valid plugin, please note that the plugin name matches the cypress.json config.`)
    }

    plugins.local.push({ host: pluginDir, docker: `/var/www/html/wp-content/plugins/${plugin}:ro`, name: plugin })
  }

  return plugins
}

/**
 * checks and setup all cywp settings.
 *
 * @param {Cypress.ConfigOptions} config the original cypress config.
 * @param {boolean} quiet if to print warning messages
 * @returns {Cypress.ConfigOptions} Update Config.
 */
function checkConfig (config, quiet) {
  const configJson = require(config.configFile)

  globalQuite = quiet

  const cywpConfig = {
    cywpWordpressVersion: setWordpressVersion(configJson.wordpressVersion),
    cywpWordpressPort: setWordpressPort(configJson.wordpressPort),
    cywpTheme: setWordpressTheme(configJson.wordpressTheme),
    cywpThemeVersion: SetWordpressThemeVersion(configJson.wordpressThemeVersion),
    cywpPlugins: setWordpressPlugins(configJson.wordpressPlugins),
  }

  cywpConfig.cywpThemePath = setWordpressThemePath(configJson.wordpressThemePath, cywpConfig.cywpTheme)

  cywpConfig.cywpWordpressName = `cywp-${cywpConfig.cywpTheme}-wordpress`

  Object.assign(config.env, cywpConfig)

  config.baseUrl = `http://localhost:${config.env.cywpWordpressPort}`

  return config
}

module.exports = checkConfig
