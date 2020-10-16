const { Docker } = require('../../src/docker/docker')
const { spawnSync } = require('child_process')
const CreateVolume = Docker.prototype.CreateVolume

describe('Volume', () => {
  describe('#rm()', () => {
    it('should remove volume', async () => {
      const volume = await CreateVolume('cywp-volume-rm-test')

      return volume.rm().then((volume) => {
        expect(volume.options.status).toBe('dead')

        const continerCheck = spawnSync('docker', ['volume', 'ls', '-q', '--filter', `name=${volume.options.name}`])
        expect(continerCheck.stdout).toHaveLength(0)
      })
    })
  })
})
