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

    return new Promise((resolve, reject) => {
      process.on('close', (code) => {
        if (code) {
          reject(stderr)
          return
        }

        this.options.status = 'started'

        resolve(this)
      })
    })
  }
}

module.exports = Container
