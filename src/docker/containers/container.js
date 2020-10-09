require('../types')
const { spawn } = require('child_process')

class Container {
  /**
  * Create and run a new docker contianer.
  * @param {ContainerOptions} options the docker container options
  */
  constructor (options) {
    this.options = options
  }

  /**
   * Start the contianer.
   * @returns {Promise<Container>} Return the current conitner.
   */
  start () {
    const start = spawn('docker', ['container', 'start', this.options.dockerId])

    return this.ReturnPromise(start, () => {
      this.options.status = 'started'
      return this
    })
  }

  /**
   * Remove the continer
   * @returns {Promise<Container>} Return the current conitner.
   */
  rm (force = false, volumes = true) {
    const rmArgs = ['container', 'rm']

    if (force) { rmArgs.push('--force') }
    if (volumes) { rmArgs.push('--volumes') }

    rmArgs.push(this.options.dockerId)

    const rm = spawn('docker', rmArgs)

    return this.ReturnPromise(rm, () => {
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

    const stop = spawn('docker', stopArgs)

    return this.ReturnPromise(stop, () => {
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
  logs (options) {
    const logsAgrs = ['container', 'stop']
    let stdout = ''

    if (options.since) { logsAgrs.push('--since', options.since) }
    if (options.tail) { logsAgrs.push('--tail', options.tail) }
    if (options.timestamps) { logsAgrs.push('--since', options.timestamps) }

    const logs = spawn('docker', logsAgrs)

    logs.stdout.on('data', (data) => {
      stdout += data
    })

    return this.ReturnPromise(logs, () => stdout)
  }

  /**
   * Return the chiild process as promise.
   *
   * @param {import('child_process').ChildProcessWithoutNullStreams} process the child process thats running.
   * @param {Function} callback callback that deterred what to return when the process is succsesful.
   */
  ReturnPromise (process, callback) {
    if ('function' !== typeof callback) {
      throw new TypeError('callback must be a function')
    }

    let stderr = ''

    process.stderr.on('data', (data) => {
      stderr += data
    })

    return new Promise((resolve, reject) => {
      process.on('close', (code) => {
        if (code) {
          reject(stderr)
          return
        }

        resolve(callback())
      })
    })
  }
}

module.exports = Container
