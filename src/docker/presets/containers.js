const Container = require('../container') // eslint-disable-line no-unused-vars
const { Docker } = require('../docker')

/**
 * Create mysql continer.
 *
 * @param {string} name - The name of the container.
 * @param {number} port - The port expose to the host.
 * @param {boolean} run - should the container run at the instance of creation.
 * @returns {Promise<Container>} retrun promise for mysql continer object.
 */
function CreateMysqlContainer (name, port, run = false) {
  CheckParameters(name, port)

  return Docker.prototype.CreateContainer({
    image: 'mysql:5.7',
    name: `cywp-${name}-mysql`,
    network: 'cywp-network',
    exposePorts: [
      { host: port, docker: 3306 },
    ],
    environmentVariables: [
      { name: 'MYSQL_ROOT_PASSWORD', value: 'cywp' },
    ],
    healthCommand: 'mysqladmin ping --silent', // eslint-disable-line spellcheck/spell-checker
  }, run)
}

/**
 * Create wordpress continer.
 *
 * @param {string} name - The name of the container.
 * @param {number} port - The port expose to the host.
 * @param {string} mysqlName - The name of the mysql container.
 * @param {number} mysqlPort - The mysql port expose to the host.
 * @param {boolean} run - should the container run at the instance of creation.
 * @returns {Promise<Container>} retrun promise for WordPress continer object.
 */
function CreateWordpressContainer (name, port, mysqlName, mysqlPort, run = false) {
  CheckParameters(name, port)
  CheckParameters(mysqlName, mysqlPort)

  return Docker.prototype.CreateContainer({
    exposePorts: [{ docker: 80, host: port }],
    environmentVariables: [
      { name: 'WORDPRESS_DB_HOST', value: `${mysqlName}:${mysqlPort}` },
      { name: 'WORDPRESS_DB_PASSWORD', value: 'cywp' },
      { name: 'WORDPRESS_DB_NAME', value: 'cywp-twentyseventeen-db' },
    ],
    volumes: [
      { host: 'cywp-twentyseventeen-volume', docker: '/var/www/html' },
    ],
    image: 'wordpress',
    network: 'cywp-network',
    name: `cywp-${name}-wordpress`,
  }, run)
}

/**
 * Create wordpress cli container.
 *
 * @param {Container} wordpress - WordPress docker container based from.
 * @param {string[]} commands - commands to pass to the container.
 * @returns {Promise<Container>} retrun promise for WordPress continer object.
 */
function CreateWordpressCliContainer (wordpress, commands) {
  return Docker.prototype.CreateContainer({
    environmentVariables: [
      { name: 'HOST_PORT', value: wordpress.options.exposePorts[0].host },
    ],
    volumes: wordpress.options.volumes,
    image: 'wordpress:cli',
    network: wordpress.options.network,
    name: `${wordpress.options.name}-cli`,
    commands: commands,
  }, true)
}

/**
 * Check user Parameters.
 *
 * @param {string} name - The name of the container - should be string.
 * @param {number} port - The port expose to the host - should be an integer.
 */
function CheckParameters (name, port) {
  if ('string' !== typeof name) {
    throw new TypeError('name must be a valid string!')
  }
  if (!Number.isInteger(port)) {
    throw new TypeError('port to expose must be an integer!')
  }
}

module.exports = { CreateMysqlContainer, CreateWordpressContainer, CreateWordpressCliContainer }