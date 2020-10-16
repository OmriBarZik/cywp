require('../types')
const { spawn } = require('child_process')
const { ReturnPromise } = require('../util')

class Container {
  /**
   * Create and run a new docker contianer.
   *
   * @param {ContainerOptions} options the docker container options
   */
  constructor (options) {
    this.options = options
  }

  /**
   * Start the contianer.
   *
   * @returns {Promise<Container>} Return the current conitner.
   */
  start () {
    const start = spawn('docker', ['container', 'start', this.options.dockerId])

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
   * @returns {Promise<Container>} Return the current conitner.
   */
  rm (force = false, volumes = true) {
    const rmArgs = ['container', 'rm']

    if (force) { rmArgs.push('--force') }
    if (volumes) { rmArgs.push('--volumes') }

    rmArgs.push(this.options.dockerId)

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
   * @returns {Promise<Container>} Return the current conitner.
   */
  stop (time = 10) {
    const stopArgs = ['container', 'stop']

    stopArgs.push('--time', time)

    stopArgs.push(this.options.dockerId)

    const stop = spawn('docker', stopArgs)

    return ReturnPromise(stop, () => {
      this.options.status = 'stoped'
      return this
    })
  }

  /**
   * Return the container logs
   *
   * @param {object} options - options object for logs.
   * @param {string} options.since - Show logs since timestamp (e.g. 2020-01-02T13:23:37) or relative (e.g. 42m for 42 minutes)
   * @param {string} options.tail - Number of lines to show from the end of the logs (default "all")
   * @param {boolean} options.timestamps - show timestamps.
   * @returns {string} Return the container logs.
   */
  logs (options = {}) {
    const logsAgrs = ['container', 'logs']
    let stdout = ''

    if (options.since) { logsAgrs.push('--since', options.since) }
    if (options.tail) { logsAgrs.push('--tail', options.tail) }
    if (options.timestamps) { logsAgrs.push('--timestamps') }

    logsAgrs.push(this.options.dockerId)

    const logs = spawn('docker', logsAgrs)

    logs.stdout.on('data', (data) => {
      stdout += data
    })

    return ReturnPromise(logs, () => stdout)
  }

  /**
   * inspect the continer.
   *
   * @param {string} [format] Format the output using the given Go template.
   * @returns {Promise<string|object>} continer info.
   */
  inspect (format) {
    const inspectArgs = ['container', 'inspect']
    let stdout = ''

    if (format) { inspectArgs.push('--format', format) }

    inspectArgs.push(this.options.dockerId)

    const inspect = spawn('docker', inspectArgs)

    inspect.stdout.on('data', (data) => {
      stdout += data
    })

    return ReturnPromise(inspect, () => {
      stdout = stdout.replace(/\r?\n|\r/g, '')
      try {
        return JSON.parse(stdout)[0]
      } catch (e) {
        return stdout
      }
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
}

module.exports = Container
