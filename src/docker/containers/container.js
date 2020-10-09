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

    return this.ReturnPromise(start, () => { this.options.status = 'started' })
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

    return this.ReturnPromise(rm, () => { this.options.status = 'removed' })
  }

  /**
   * Return the chiild process as promise.
   *
   * @param {import('child_process').ChildProcessWithoutNullStreams} process the child process thats running.
   * @param {Function} callback callback that run in the process is succsesful.
   */
  ReturnPromise (process, callback) {
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

        callback()

        resolve(this)
      })
    })
  }
}

module.exports = Container
