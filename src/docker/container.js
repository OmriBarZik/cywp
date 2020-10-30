require('./types')
const { spawn } = require('child_process')
const { ReturnPromise, CleanInspect } = require('./util')

class Container {
  /**
   * Create and run a new docker container.
   *
   * @param {ContainerOptions} options the docker container options
   */
  constructor (options) {
    this.options = options
  }

  /**
   * Start the container.
   *
   * @returns {Promise<Container>} Return the current container.
   */
  start () {
    const start = spawn('docker', ['container', 'start', this.options.id])

    return ReturnPromise(start, () => {
      this.options.status = 'started'
      return this
    })
  }

  /**
   * Remove the continer
   *
   * @param {boolean} force Force the removal of a running container.
   * @param {boolean} volumes Remove anonymous volumes associated with the container.
   * @returns {Promise<Container>} Return the current container.
   */
  rm (force = false, volumes = true) {
    const rmArgs = ['container', 'rm']

    if (force) { rmArgs.push('--force') }
    if (volumes) { rmArgs.push('--volumes') }

    rmArgs.push(this.options.id)

    const rm = spawn('docker', rmArgs)

    return ReturnPromise(rm, () => {
      this.options.status = 'removed'
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
    const stopArgs = ['container', 'stop']

    stopArgs.push('--time', time)

    stopArgs.push(this.options.id)

    const stop = spawn('docker', stopArgs)

    return ReturnPromise(stop, () => {
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
    const logsArgs = ['container', 'logs']
    let stdout = ''
    let stderr = ''

    if (options.since) { logsArgs.push('--since', options.since) }
    if (options.tail) { logsArgs.push('--tail', options.tail) }
    if (options.timeStamps) { logsArgs.push('--timestamps') } // eslint-disable-line spellcheck/spell-checker

    logsArgs.push(this.options.id)

    const logs = spawn('docker', logsArgs)

    logs.stdout.on('data', (data) => {
      stdout += data
    })

    logs.stderr.on('data', (data) => {
      stderr += data
    })

    return new Promise((resolve, reject) => {
      logs.on('close', (code) => {
        if (code) {
          reject(stderr)
          return
        }
        resolve({
          stdout: stdout,
          stderr: stderr,
          container: this,
        })
      })
    })
  }

  /**
   * inspect the container.
   *
   * @param {string} [format] - Format the output using the given Go template.
   * @returns {Promise<string|object>} container info.
   */
  inspect (format) {
    const inspectArgs = ['container', 'inspect']
    let stdout = ''

    if (format) { inspectArgs.push('--format', format) }

    inspectArgs.push(this.options.id)

    const inspect = spawn('docker', inspectArgs)

    inspect.stdout.on('data', (data) => {
      stdout += data
    })

    return ReturnPromise(inspect, () => {
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
    if (!this.options.health.command) {
      throw new Error('options.health.command must be defined to use IsHealthy')
    }

    return this.inspect('{{.State.Health.Status}}')
      .then(status => 'healthy' === status)
  }
}

module.exports = Container
