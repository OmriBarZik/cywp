const { Docker } = require('../docker')
// const Container = require('./container')

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

module.exports = { CreateMysqlContainer }
