const Container = require('./container') // eslint-disable-line no-unused-vars
const { Docker } = require('../docker')

/**
 * Create mysql continer.
 * @param {string} name - The name of the container.
 * @param {number} port - The port expose to the host.
 * @returns {Promise<Container>}
 */
function CreateMysqlContainer (name, port, run = false) {
  return Docker.prototype.CreateContainer({
    image: 'mysql:5.7',
    name: `cywp-${name}-mysql`,
    network: 'cywp-network',
    exposePorts: [
      { host: port, docker: 3306 }
    ],
    environmentVariables: [
      { name: 'MYSQL_ROOT_PASSWORD', value: 'cywp' }
    ]
  }, run)
}

/**
 * Create wordpress continer.
 * @param {string} name - The name of the container.
 * @param {number} port - The port expose to the host.
 * @returns {Promise<Container>}
 */
function CreateWordpressContainer (name, port, run = false) {
  return Docker.prototype.CreateContainer({
    exposePorts: [{ docker: 80, host: port }],
    environmentVariables: [
      { name: 'WORDPRESS_DB_HOST', value: 'cywp-mysql:3306' },
      { name: 'WORDPRESS_DB_PASSWORD', value: 'cywp' },
      { name: 'WORDPRESS_DB_NAME', value: 'cywp-twentyseventeen-db' }
    ],
    volumes: [
      { host: 'cywp-twentyseventeen-volume', docker: '/var/www/html' }
    ],
    image: 'wordpress',
    network: 'cywp-network',
    name: `cywp-${name}-wordpress`
  }, run)
}

module.exports = { CreateMysqlContainer, CreateWordpressContainer }
