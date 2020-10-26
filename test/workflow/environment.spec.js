const { setupNetwork } = require('../../src/workflow/environment')

describe('environment', () => {
  describe('#setupNetwork()', () => {
    it('should setup network named cywp-network', async () => {
      const network = await setupNetwork()

      expect(network.options.name).toBe('cywp-network')
    })
  })
})
