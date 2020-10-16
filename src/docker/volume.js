const { spawn } = require('child_process')
const { ReturnPromise } = require('./util')

class Volume {
  /**
   * Set info for the volume.
   *
   * @param {VolumeOptions} options the docker volume options
   */
  constructor (options) {
    this.options = options
  }

  /**
   *
   * @param {boolean} force - Force the removal of the volume.
   * @returns {Promise<Volume>} Return the current volume.
   */
  rm (force) {
    const rmArgs = ['volume', 'rm']

    if (force) { rmArgs.push('--force') }

    rmArgs.push(this.options.name)

    const start = spawn('docker', rmArgs)

    return ReturnPromise(start, () => {
      this.options.status = 'dead'
      return this
    })
  }
}

module.exports = Volume
