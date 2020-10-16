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
  }, run)
}

/**
 * Create wordpress continer.
 *
 * @param {string} name - The name of the container.
 * @param {number} port - The port expose to the host.
 * @param {boolean} run - should the container run at the instance of creation.
 * @returns {Promise<Container>} retrun promise for WordPress continer object.
 */
function CreateWordpressContainer (name, port, run = false) {
  CheckParameters(name, port)

  return Docker.prototype.CreateContainer({
    exposePorts: [{ docker: 80, host: port }],
    environmentVariables: [
      { name: 'WORDPRESS_DB_HOST', value: 'cywp-mysql:3306' },
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

module.exports = { CreateMysqlContainer, CreateWordpressContainer }
