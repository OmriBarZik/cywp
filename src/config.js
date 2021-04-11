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
    cywpWordpressPlugins: configJson.wordpressPlugins,
    cywpWordpressTheme: configJson.wordpressTheme,
    cywpWordpressName: 'cywp-tmp-wordpress',
  }

  if (!configJson.wordpressVersion) {
    console.warn('wordpress version not found, using latest')
    cywpConfig.cywpWordpressVersion = 'latest'
  }

  if (!configJson.wordpressTheme) {
    console.warn('wordpress theme was not provided using default theme twentytwenty')
    cywpConfig.cywpWordpressTheme = 'twentytwenty'
  }

  if (!configJson.wordpressPort) {
    console.warn('wordpress port was not provided using default port 8000')
    cywpConfig.cywpWordpressPort = 8000
  }

  cywpConfig.cywpWordpressName = `cywp-${cywpConfig.cywpWordpressTheme}-wordpress`

  Object.assign(config.env, cywpConfig)

  config.baseUrl = `http://localhost:${config.env.cywpWordpressPort}`

  return config
}

module.exports = checkConfig
