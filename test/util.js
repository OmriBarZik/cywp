const { Docker } = require('../src/docker/docker')
require('../src/docker/types')

const containerIDs = {}

/**
   * Create a docker container
   * @param {string} test - Test suites name.
   * @param {ContainerOptions} options - docker container options
   * @param {boolean} run - should the container run at the instance of creation.
   * @returns {Promise<Container>} return promise for continer object
   */
async function CreateContainer (test, option, run = false) {
  if (typeof undefined === typeof containerIDs[test]) {
    containerIDs[test] = []
  }

  const container = await Docker.prototype.CreateContainer(option, run)
  containerIDs[test].push(container.options.dockerId)

  return container
}

/**
 * Get the container ids.
 * @param {string} test - Test suites name.
 * @returns {Array} The containers ids array
 */
function GetContinerIDs (test) {
  return containerIDs[test]
}

module.exports = { CreateContainer, GetContinerIDs }
