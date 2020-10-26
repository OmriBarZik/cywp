const { Docker } = require('../../src/docker/docker')
const { spawnSync } = require('child_process')
const CreateVolume = Docker.prototype.CreateVolume

describe('Volume', () => {
  describe('#rm()', () => {
    it('should remove volume', async () => {
      const volume = await CreateVolume('cywp-volume-rm-test')

      await volume.rm()
      expect(volume.options.status).toBe('dead')

      const volumeCheck = spawnSync('docker', ['volume', 'ls', '-q', '--filter', `name=${volume.options.name}`])
      expect(volumeCheck.stdout).toHaveLength(0)
    })

    it('should remove volume with force', async () => {
      const volume = await CreateVolume('cywp-volume-force-rm-test')

      await volume.rm(true)

      expect(volume.options.status).toBe('dead')

      const volumeCheck = spawnSync('docker', ['volume', 'ls', '-q', '--filter', `name=${volume.options.name}`])
      expect(volumeCheck.stdout).toHaveLength(0)
    })
  })
})
