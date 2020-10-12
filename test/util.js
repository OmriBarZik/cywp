require('../src/docker/types')
const { Docker } = require('../src/docker/docker')
const { spawnSync } = require('child_process')

const containerIDs = {}

/**
 * Create a docker container
 *
 * @param {string} test - Test suites name.
 * @param {ContainerOptions} option - docker container options
 * @param {boolean} run - should the container run at the instance of creation.
 * @returns {import('../src/docker/containers/container')} return continer object
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
 * Delete all containers for given test run.
 *
 * @param {string} test - name of the test run.
 */
function DeleteContainers (test) {
  spawnSync('docker', ['rm', '-f'].concat(GetContinerIDs(test)))
}

/**
 * Get the container ids.
 *
 * @param {string} test - Test suites name.
 * @returns {Array} The containers ids array
 */
function GetContinerIDs (test) {
  return containerIDs[test]
}

module.exports = { CreateContainer, GetContinerIDs, DeleteContainers }
