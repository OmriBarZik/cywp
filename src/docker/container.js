require('./types')
const { spawn } = require('child_process')
const { ReturnPromise, CleanInspect } = require('./util')

class Container {
  /**
   * Create and run a new docker container.
   *
   * @param {ContainerOptions} options the docker container options
   * @param {import('./volume')[]} volumes array of docker volumes.
   */
  constructor (options, volumes) {
    this.options = options
    this.volumes = volumes
  }

  /**
   * @param {string[]} args - docker container arguments
   * @param {(stdout: string, stderr: string) => any} callback - callback that deterred what to return when the process is successful.
   * @returns {Promise} return what said to return form the callback
   */
  dockerContainer (args, callback) {
    args = ['container'].concat(args)

    const container = spawn('docker', args)

    return ReturnPromise(container, callback)
  }

  /**
   * Start the container.
   *
   * @returns {Promise<Container>} Return the current container.
   */
  start () {
    const startArgs = ['start', this.options.id]

    return this.dockerContainer(startArgs, () => {
      this.options.status = 'started'
      return this
    })
  }

  /**
   * Remove the continer
   *
   * @param {boolean} force Force the removal of a running container.
   * @param {boolean} anonymousVolumes Remove anonymous volumes associated with the container.
   * @param {boolean} externalVolumes Remove external volumes associated with the container.
   * @returns {Promise<Container>} Return the current container.
   */
  rm (force = false, anonymousVolumes = true, externalVolumes) {
    const rmArgs = ['rm']

    if (force) { rmArgs.push('--force') }
    if (anonymousVolumes) { rmArgs.push('--volumes') }

    rmArgs.push(this.options.id)

    return this.dockerContainer(rmArgs, async () => {
      this.options.status = 'removed'

      if (externalVolumes) {
        await Promise.all(this.volumes.slice().map(volume => volume.rm()))
      }

      return this
    })
  }

  /**
   * Stop the continer.
   *
   * @param {number} time Seconds to wait for stop before stopping the container.
   * @returns {Promise<Container>} Return the current container.
   */
  stop (time = 10) {
    const stopArgs = ['stop']

    if (0 > time) {
      throw new Error('time must be bigger then 0')
    }

    stopArgs.push('--time', time)
    stopArgs.push(this.options.id)

    return this.dockerContainer(stopArgs, () => {
      this.options.status = 'stopped'
      return this
    })
  }

  /**
   * Return the container logs
   *
   * @param {object} options - options object for logs.
   * @param {string} options.since - Show logs since timestamp (e.g. 2020-01-02T13:23:37) or relative (e.g. 42m for 42 minutes)
   * @param {string} options.tail - Number of lines to show from the end of the logs (default "all")
   * @param {boolean} options.timeStamps - show time stamps.
   * @returns {Promise<{stdout: string, stderr: string, container: Container}}>} Return Promise for container logs.
   */
  logs (options = {}) {
    const logsArgs = ['logs']

    if (options.since) { logsArgs.push('--since', options.since) }
    if (options.tail) { logsArgs.push('--tail', options.tail) }
    if (options.timeStamps) { logsArgs.push('--timestamps') } // eslint-disable-line spellcheck/spell-checker

    logsArgs.push(this.options.id)

    return this.dockerContainer(logsArgs, (stdout, stderr) => {
      return {
        stdout: stdout,
        stderr: stderr,
        container: this,
      }
    })
  }

  /**
   * inspect the container.
   *
   * @param {string} [format] - Format the output using the given Go template.
   * @returns {Promise<string|object>} container info.
   */
  inspect (format) {
    const inspectArgs = ['inspect']

    if (format) { inspectArgs.push('--format', format) }

    inspectArgs.push(this.options.id)

    return this.dockerContainer(inspectArgs, (stdout) => {
      return CleanInspect(stdout)
    })
  }

  /**
   * retrun the status of the container.
   *
   * @returns {Promise<string>} the status of the container.
   */
  status () {
    return this.inspect('{{.State.Status}}').then(status => {
      this.options.status = status
      return status
    })
  }

  /**
   * Checks if the container is healthy or not.
   *
   * @returns {Promise<boolean>} if the continer is healthy or not
   */
  isHealthy () {
    if (!this.options.health) {
      throw new Error('options.health.command must be defined to use IsHealthy')
    }

    return this.inspect('{{.State.Health.Status}}')
      .then(status => 'healthy' === status)
  }

  /**
   * Run commands in a running container.
   *
   * @param {Array} commands - Commands to run.
   * @returns {Promise<RunInContainerOutput>} Return the current container.
   */
  exec (commands) {
    if (!Array.isArray(commands)) {
      throw new Error('commands must be an array')
    }

    const execArgs = ['exec']

    execArgs.push(this.options.id)

    execArgs.push.apply(execArgs, commands)

    return this.dockerContainer(execArgs, (stdout, stderr) => {
      return { stdout: stdout, stderr: stderr }
    })
  }
}

module.exports = Container
