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
 * @returns {import('../docker/container')} return when mysql database ready.
 * @example
 * async function foo () {
 *  const mysql = await setupDatabase(3306);
 * }
 */
async function SetupDatabase () {
  const mysql = await CreateMysqlContainer('main', true)

  if ('running' !== await mysql.status()) {
    await mysql.start()
  }

  let mysqlReady = false

  while (!mysqlReady) {
    if (await mysql.isHealthy()) { mysqlReady = true }

    await sleep(1000)
  }

  return mysql
}

/**
 * @param {string} name - the name of the container, the real container name will be cywp-<YOUR NAME>-wordpress
 * @param {number} port - the expose port of the wordpress site
 * @param {import('../docker/container')} mysql - the mysql container that the site will connect to.
 * @param {string} version - WordPress container version.
 * @param {[{host: string, docker: string}]} volumes - additional volumes to add local files to the container.
 * @returns {import('../docker/container')} Wordpress Container.
 * @example
 * async function foo () {
 * const mysql = await setupDatabase();
 * const wordpress = await SetupSite('my-site', 8000, mysql)
 * }
 */
async function SetupSite (name, port, mysql, version, volumes) {
  const wordpress = await CreateWordpressContainer(name, port, mysql, version, volumes, true)

  if ('running' !== await wordpress.status()) {
    await wordpress.start()
  }

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
