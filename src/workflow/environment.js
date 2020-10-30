const { Docker } = require('../docker/docker')
const { CreateMysqlContainer } = require('../docker/presets/containers')
const { sleep } = require('../docker/util')

const docker = new Docker()

/**
 * Create and return the main network for cywp projects.
 *
 * @returns {Promise<import('../docker/network')>} the main cywp network.
 */
function setupNetwork () {
  return docker.CreateNetwork('cywp-network')
}

/**
 * Setup mysql container. return the mysql object only when the database is ready.
 *
 * @param {number} port - the mysql port exposed to the host.
 * @returns {import('../docker/container')} return when mysql database ready.
 *
 * @example
 * function foo() {
 *  const mysql = await setupDatabase(3306);
 * }
 */
async function setupDatabase (port) {
  const mysql = await CreateMysqlContainer('main', port, true)

  let mysqlReady = false

  while (!mysqlReady) {
    if (await mysql.isHealthy()) { mysqlReady = true }

    await sleep(1000)
  }

  return mysql
}

module.exports = { setupNetwork, setupDatabase }
