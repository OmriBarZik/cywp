const { Docker } = require('../../src/docker/docker')
const CreateVolume = Docker.prototype.CreateVolume

describe('Volume', () => {
  describe('#rm()', () => {
    it('should remove volume', async () => {
      const volume = await CreateVolume('cywp-volume-rm-test')

      return expect(volume.rm()).resolves.toMatchObject({ options: { status: 'dead' } })
    })
  })
})
