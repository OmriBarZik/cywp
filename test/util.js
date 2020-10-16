require('../src/docker/types')
const { Docker } = require('../src/docker/docker')
const { spawnSync } = require('child_process')

const containerIds = {}

let originalCreateContainer

/**
 *  Init Tests configuration
 *
 * @param {string} suiteName - Test suites name.
 * @returns {TestCreateContainer} - the modified function of CreateContainer.
 */
function InitTestCreateContainer (suiteName) {
  originalCreateContainer = Docker.prototype.CreateContainer

  containerIds[suiteName] = []

  /**
   * Create a docker container
   *
   * @param {ContainerOptions} option - docker container options
   * @param {boolean} run - should the container run at the instance of creation.
   * @returns {import('../src/docker/containers/container')} return container object
   */
  const CreateContainer = async function (option, run) {
    const container = await originalCreateContainer(option, run)
    containerIds[suiteName].push(container.options.dockerId)

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
  spawnSync('docker', ['rm', '-f', '-v'].concat(GetContainerIds(suiteName)))
}

/**
 * Get the container ids.
 *
 * @param {string} suiteName - Test suites name.
 * @returns {Array} The containers ids array
 */
function GetContainerIds (suiteName) {
  return containerIds[suiteName]
}

module.exports = { GetContainerIds: GetContainerIds, DeleteContainers, CleanTestCreateContainer, InitTestCreateContainer }
