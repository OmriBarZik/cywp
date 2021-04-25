const { existsSync, readFileSync } = require('fs')
const { resolve, join } = require('path')

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
    console.info('wordpress version not found, using latest')
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
    console.warn('wordpress port was not provided using default port 8000')
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
    console.warn('wordpress theme was not provided using default theme twentytwenty')
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
 * checks and setup all cywp settings.
 *
 * @param {Cypress.ConfigOptions} config the original cypress config.
 * @returns {Cypress.ConfigOptions} Update Config.
 */
function checkConfig (config) {
  const configJson = require(config.configFile)

  const cywpConfig = {
    cywpWordpressVersion: setWordpressVersion(configJson.wordpressVersion),
    cywpWordpressPort: setWordpressPort(configJson.wordpressPort),
    cywpTheme: setWordpressTheme(configJson.wordpressTheme),
    cywpThemeVersion: SetWordpressThemeVersion(configJson.wordpressThemeVersion),
    cywpWordpressName: 'cywp-tmp-wordpress',
    cywpLocalPlugins: [],
    cywpRemotePlugins: [],
    cywpThemePath: [],
  }

  if (configJson.wordpressPlugins) {
    for (const plugin in configJson.wordpressPlugins) {
      const pathOrVersion = configJson.wordpressPlugins[plugin]

      if (existsSync(pathOrVersion)) {
        const pluginDir = resolve(pathOrVersion)
        const pluginPath = join(pluginDir, `${plugin}.php`)
        if (!existsSync(pluginPath)) {
          throw new Error(`${plugin}.php not found in ${pluginDir}. pleas provide a valid plugin path and try again.`)
        }

        if (!readFileSync(pluginPath).toString().match(new RegExp(`Plugin Name:.*${plugin}`))) {
          throw new Error(pluginPath + 'must be a valid plugin, please note that the plugin name matches the cypress.json config.')
        }

        cywpConfig.cywpLocalPlugins.push({ host: pluginDir, docker: `/var/www/html/wp-content/plugins/${plugin}:ro`, name: plugin })
      } else {
        cywpConfig.cywpRemotePlugins.push({ name: plugin, version: pathOrVersion })
      }
    }
  }

  if (configJson.wordpressThemePath) {
    if (existsSync(configJson.wordpressThemePath)) {
      cywpConfig.cywpThemePath.push({ host: resolve(configJson.wordpressThemePath), docker: `/var/www/html/wp-content/themes/${cywpConfig.cywpTheme}:ro` })
    } else {
      console.error('theme path no good, using default theme - twentytwenty!')
      cywpConfig.cywpTheme = 'twentytwenty'
    }
  }

  cywpConfig.cywpWordpressName = `cywp-${cywpConfig.cywpTheme}-wordpress`

  Object.assign(config.env, cywpConfig)

  config.baseUrl = `http://localhost:${config.env.cywpWordpressPort}`

  return config
}

module.exports = checkConfig
