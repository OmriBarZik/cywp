const { setupNetwork } = require('../../src/workflow/environment')
const { spawnSync } = require('child_process')

describe('environment', () => {
  describe('#setupNetwork()', () => {
    let keepCywpNetwork

    beforeAll(() => {
      const rmProcess = spawnSync('docker', ['network', 'rm', 'cywp-network'])

      keepCywpNetwork = true

      if (rmProcess.status) {
        keepCywpNetwork = false
      }
    })

    it('should setup network named cywp-network', async () => {
      const network = await setupNetwork()

      expect(network.options.name).toBe('cywp-network')
    })

    afterAll(async () => {
      if (!keepCywpNetwork) {
        spawnSync('docker', ['network', 'rm', 'cywp-network'])
      }
    })
  })
})
