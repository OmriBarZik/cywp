const { existsSync } = require('fs')
const { resolve } = require('path')

/**
 * checks and setup all cywp settings.
 *
 * @param {Cypress.ConfigOptions} config the original cypress config.
 * @returns {Cypress.ConfigOptions} Update Config.
 */
function checkConfig (config) {
  const configJson = require(config.configFile)

  const cywpConfig = {
    cywpWordpressVersion: configJson.wordpressVersion,
    cywpWordpressPort: configJson.wordpressPort,
    cywpWordpressName: 'cywp-tmp-wordpress',
    cywpLocalPlugins: [],
    cywpRemotePlugins: [],
    cywpTheme: configJson.wordpressTheme,
    cywpThemeVersion: configJson.wordpressThemeVersion,
    cywpThemePath: [],
  }

  if (!configJson.wordpressVersion) {
    console.warn('wordpress version not found, using latest')
    cywpConfig.cywpWordpressVersion = 'latest'
  }

  if (!configJson.wordpressTheme) {
    console.warn('wordpress theme was not provided using default theme twentytwenty')
    cywpConfig.cywpTheme = 'twentytwenty'
  }

  if (!configJson.wordpressPort) {
    console.warn('wordpress port was not provided using default port 8000')
    cywpConfig.cywpWordpressPort = 8000
  }

  if (configJson.wordpressPlugins) {
    for (const plugin in configJson.wordpressPlugins) {
      const pathOrVersion = configJson.wordpressPlugins[plugin]

      if (existsSync(pathOrVersion)) {
        cywpConfig.cywpLocalPlugins.push({ host: resolve(pathOrVersion), docker: `/var/www/html/wp-content/plugins/${plugin}:ro`, name: plugin })
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
