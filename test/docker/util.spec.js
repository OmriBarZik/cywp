
const { spawn } = require('child_process')
const { ReturnPromise } = require('../../src/docker/util')

describe('Util', () => {
  describe('#ReturnPromise()', () => {
    it('should throw error for invalid arguments', async () => {
      return expect(() => { ReturnPromise('process', 'invalid callback') })
        .toThrow(new TypeError('callback must be a function'))
    })

    it('should reject for invalid process', async () => {
      const process = spawn('docker', ['error'])

      return expect(ReturnPromise(process, () => {})).rejects.toBeTruthy()
    })
  })
})
