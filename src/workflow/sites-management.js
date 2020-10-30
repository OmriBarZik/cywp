const { CreateWordpressCliContainer } = require('../docker/presets/containers')

/**
 * Run wordpress cli command to initialize the wordpress sits.
 *
 * @param {import('../docker/container')} wordpress the wordpress container to initialize.
 * @returns {Promise<RunInContainerOutput>} wordpress cli container.
 */
function InitSite (wordpress) {
  return CreateWordpressCliContainer(wordpress, [
    'wp',
    'core',
    'install',
    `--title=${wordpress.options.name}`,
    '--admin_user=admin',
    '--admin_password=password',
    `--admin_email=${wordpress.options.name}@cywp.local`,
    '--skip-email',
    `--url=http://localhost:${wordpress.options.exposePorts[0].host}`,
  ])
}

module.exports = { InitSite }
