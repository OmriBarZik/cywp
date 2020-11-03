const { spawn } = require('child_process')
const { ReturnPromise, CleanInspect } = require('./util')

class Network {
  /**
   * Set info for the network.
   *
   * @param {NetworkOption} options - the docker network options
   */
  constructor (options) {
    this.options = options
  }

  /**
   * Remove the network
   *
   * @returns {Promise<Network>} Return the current network.
   */
  rm () {
    const rm = spawn('docker', ['network', 'rm', this.options.id])

    return ReturnPromise(rm, () => {
      this.options.status = 'dead'
      return this
    })
  }

  /**
   * Inspect current network.
   *
   * @param {string} [format] - Format the output using the given Go template.
   * @returns {Promise<string>} Network info.
   */
  inspect (format) {
    const inspectArgs = ['network', 'inspect']

    if (format) { inspectArgs.push('--format', format) }

    inspectArgs.push(this.options.id)

    const inspect = spawn('docker', inspectArgs)

    return ReturnPromise(inspect, (stdout) => {
      return CleanInspect(stdout)
    })
  }
}

module.exports = Network
