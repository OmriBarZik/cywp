require('../src/docker/types')
const { Docker } = require('../src/docker/docker')
const { spawnSync } = require('child_process')

const containerIds = {}
const volumeIds = {}

let originalCreateContainer

/**
 *  Init Tests configuration
 *
 * @param {string} suiteName - Test suites name.
 * @returns {TestCreateContainer} - the modified function of CreateContainer.
 */
function InitTestCreateContainer(suiteName) {
  originalCreateContainer = Docker.prototype.CreateContainer
  originalCreateContainer = originalCreateContainer.bind(new Docker())

  containerIds[suiteName] = []
  volumeIds[suiteName] = []

  /**
   * Create a docker container
   *
   * @param {ContainerOptions} option - docker container options
   * @param {boolean} run - should the container run at the instance of creation.
   * @returns {import('../src/docker/container')} return container object
   */
  const CreateContainer = async function (option, run) {
    const container = await originalCreateContainer(option, run)
    containerIds[suiteName].push(container.options.id)

    if (container.options.volumes) {
      volumeIds[suiteName].push.apply(
        volumeIds[suiteName],
        container.options.volumes.map((item) => item.host)
      )
    }

    return container
  }

  Docker.prototype.CreateContainer = CreateContainer

  return CreateContainer
}

/**
 * @param {string} suiteName - Test suites name.
 */
function CleanTestCreateContainer(suiteName) {
  DeleteContainers(suiteName)

  Docker.prototype.CreateContainer = originalCreateContainer
}

/**
 * Delete all containers for given test run.
 *
 * @param {string} suiteName - name of the test run.
 */
function DeleteContainers(suiteName) {
  spawnSync('docker', ['rm', '-f', '-v'].concat(GetContainerIds(suiteName)))
  spawnSync('docker', ['volume', 'rm', '-f'].concat(volumeIds[suiteName]))
}

/**
 * Get the container ids.
 *
 * @param {string} suiteName - Test suites name.
 * @returns {Array} The containers ids array
 */
function GetContainerIds(suiteName) {
  return containerIds[suiteName]
}

module.exports = {
  GetContainerIds: GetContainerIds,
  DeleteContainers,
  CleanTestCreateContainer,
  InitTestCreateContainer
}
