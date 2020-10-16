const { Docker } = require('../../src/docker/docker')
const { spawnSync } = require('child_process')
const CreateNetwork = Docker.prototype.CreateNetwork

describe('Network', () => {
  let networkIds

  beforeAll(() => {
    networkIds = []
  })

  describe('#rm()', () => {
    it('should remove network', async () => {
      const network = await CreateNetwork('cywp-rm-network-test')

      return network.rm().then((network) => {
        expect(network.options.status).toBe('dead')

        const networkCheck = spawnSync('docker', ['volume', 'ls', '-q', '--filter', `name=${network.options.id}`])
        expect(networkCheck.stdout).toHaveLength(0)
      })
    })
  })

  describe('#inspect()', () => {
    it('should get network info', async () => {
      const network = await CreateNetwork('cywp-inspect-object-network-test')

      networkIds.push(network.options.id)

      return expect(network.inspect()).resolves.toMatchObject({ Id: network.options.id })
    })

    it('should get network info with filter', async () => {
      const network = await CreateNetwork('cywp-inspect-filter-network-test')

      networkIds.push(network.options.id)

      return expect(network.inspect('{{.Id}}')).resolves.toBe(network.options.id)
    })
  })

  afterAll(() => {
    spawnSync('docker', ['network', 'rm'].concat(networkIds))
  })
})
