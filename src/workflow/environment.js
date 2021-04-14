const { Docker } = require('../docker/docker')
const { CreateMysqlContainer, CreateWordpressContainer } = require('../docker/presets/containers')
const { InitSite } = require('./sites-management')
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
 * async function foo () {
 *  const mysql = await setupDatabase(3306);
 * }
 */
async function SetupDatabase () {
  const mysql = await CreateMysqlContainer('main', true)

  let mysqlReady = false

  while (!mysqlReady) {
    if (await mysql.isHealthy()) { mysqlReady = true }

    await sleep(1000)
  }

  return mysql
}

/**
 * @param {string} name -
 * @param {number} port -
 * @param {import('../docker/container')} mysql -
 * @returns {import('../docker/container')} Wordpress Container.
 *
 * @example
 * async function foo () {
 *  const mysql = await setupDatabase(3306);
 *  const wordpress = await SetupSite('my-site', 8000, mysql)
 * }
 */
async function SetupSite (name, port, mysql) {
  const wordpress = await CreateWordpressContainer(name, port, mysql, true)

  const dbName = wordpress.options.environmentVariables.find(env => 'WORDPRESS_DB_NAME' === env.name).value
  const mysqlPassword = mysql.options.environmentVariables.find(env => 'MYSQL_ROOT_PASSWORD' === env.name).value

  await mysql.exec(['mysql', '-u', 'root', `-p${mysqlPassword}`, '-e', `CREATE DATABASE IF NOT EXISTS \`${dbName}\``])

  let wordpressReady = false

  while (!wordpressReady) {
    if (await wordpress.isHealthy()) { wordpressReady = true }

    await sleep(1000)
  }

  await InitSite(wordpress)

  return wordpress
}

module.exports = { setupNetwork, SetupDatabase, SetupSite }
