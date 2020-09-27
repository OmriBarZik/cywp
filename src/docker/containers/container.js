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

  start () {
    const start = spawn('docker', ['container', 'start', this.options.dockerId])

    start.stdout.on('data', (data) => {
      console.log(data.toString())
    })

    start.stderr.on('data', (data) => {
      console.log(data.toString())
    })

    start.on('close', (code) => {
      console.log(`prosses ended on status ${code}`)
    })
  }
}

module.exports = Container
