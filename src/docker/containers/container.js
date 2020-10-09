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
    let stderr = ''

    const start = spawn('docker', ['container', 'start', this.options.dockerId])

    start.stderr.on('data', (data) => {
      stderr += data
    })

    return this.ReturnPromise(start, stderr, () => { this.options.status = 'started' })
  }

  /**
   * Return the chiild process as promise.
   *
   * @param {import('child_process').ChildProcessWithoutNullStreams} process the child process thats running.
   * @param {string} stderr the error massage the process throw.
   * @param {Function} callback callback that run in the process is succsesful.
   */
  ReturnPromise (process, stderr, callback) {
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
