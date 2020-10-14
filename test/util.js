require('../src/docker/types')
const { Docker } = require('../src/docker/docker')
const { spawnSync } = require('child_process')

const containerIDs = {}

let originalCreateContainer

/**
 *  Init Tests configertion
 *
 * @param {string} suiteName - Test suites name.
 * @returns {TestCreateContainer} - the modifed function of CreateContainer.
 */
function InitTestCreateContainer (suiteName) {
  originalCreateContainer = Docker.prototype.CreateContainer

  containerIDs[suiteName] = []

  /**
   * Create a docker container
   *
   * @param {ContainerOptions} option - docker container options
   * @param {boolean} run - should the container run at the instance of creation.
   * @returns {import('../src/docker/containers/container')} return continer object
   */
  const CreateContainer = async function (option, run) {
    const container = await originalCreateContainer(option, run)
    containerIDs[suiteName].push(container.options.dockerId)

    return container
  }

  Docker.prototype.CreateContainer = CreateContainer

  return CreateContainer
}

/**
 * @param {string} suiteName - Test suites name.
 */
function CleanTestCreateContainer (suiteName) {
  DeleteContainers(suiteName)

  Docker.prototype.CreateContainer = originalCreateContainer
}

/**
 * Delete all containers for given test run.
 *
 * @param {string} suiteName - name of the test run.
 */
function DeleteContainers (suiteName) {
  spawnSync('docker', ['rm', '-f'].concat(GetContinerIDs(suiteName)))
}

/**
 * Get the container ids.
 *
 * @param {string} suiteName - Test suites name.
 * @returns {Array} The containers ids array
 */
function GetContinerIDs (suiteName) {
  return containerIDs[suiteName]
}

module.exports = { GetContinerIDs, DeleteContainers, CleanTestCreateContainer, InitTestCreateContainer }
