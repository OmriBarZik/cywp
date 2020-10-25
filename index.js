const { CreateWordpressContainer } = require('./src/docker/presets/containers')
const { setupDatabase } = require('./src/workflow/environment')
const { InitSite } = require('./src/workflow/sites-management')

/**
 * Main process function.
 */
async function start () {
  // const network = await setupNetwork()

  const mysql = await setupDatabase(3306)

  console.log('mysql')

  const wordpress = await CreateWordpressContainer('pop', 8001, mysql, true)

  console.log('wordpress')

  const cli = await InitSite(wordpress)

  console.log(cli.options.status)
}

start()
