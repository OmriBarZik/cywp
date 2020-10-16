const { spawnSync } = require('child_process')
const { Docker, processCreateContainerOptions, ProssesCreateNetworkOption } = require('../../src/docker/docker')
const CreateContainer = Docker.prototype.CreateContainer
const CreateVolume = Docker.prototype.CreateVolume
const CreateNetwork = Docker.prototype.CreateNetwork

describe('Docker', () => {
  describe('#processCreateContainerOptions()', () => {
    describe('##Errors', () => {
      it('should throw error when value not present', () => {
        expect(() => { processCreateContainerOptions() }).toThrow()
      })

      it('should throw error when image value is not present', () => {
        expect(() => { processCreateContainerOptions({}) }).toThrow()

        expect(() => { processCreateContainerOptions({ image: '' }) }).toThrow()
      })

      it('should throw error when volumes is not an array', () => {
        expect(() => { processCreateContainerOptions({ image: 'test', volumes: 'fail test' }) }).toThrow()
      })

      it('should throw error when environmentVariables is not an array', () => {
        expect(() => { processCreateContainerOptions({ image: 'test', environmentVariables: 'fail test' }) }).toThrow()
      })

      it('should throw error when exposePorts is not an array', () => {
        expect(() => { processCreateContainerOptions({ image: 'test', exposePorts: 'fail test' }) }).toThrow()
      })

      it('should throw error when volumes is not made of a spsific object array', () => {
        expect(() => { processCreateContainerOptions({ image: 'test', volumes: [{}] }) }).toThrow()

        expect(() => { processCreateContainerOptions({ image: 'test', volumes: [{ docker: 'docker' }] }) }).toThrow()

        expect(() => { processCreateContainerOptions({ image: 'test', volumes: [{ host: 'host' }] }) }).toThrow()

        expect(() => { processCreateContainerOptions({ image: 'test', volumes: [{ error: 'error' }] }) }).toThrow()
      })

      it('should throw error when environmentVariables is not made of a spsific object array', () => {
        expect(() => { processCreateContainerOptions({ image: 'test', environmentVariables: [{}] }) }).toThrow()

        expect(() => { processCreateContainerOptions({ image: 'test', environmentVariables: [{ name: 'docker' }] }) }).toThrow()

        expect(() => { processCreateContainerOptions({ image: 'test', environmentVariables: [{ value: 'host' }] }) }).toThrow()

        expect(() => { processCreateContainerOptions({ image: 'test', environmentVariables: [{ error: 'error' }] }) }).toThrow()
      })

      it('should throw error when exposePorts is not made of a spsific object array', () => {
        expect(() => { processCreateContainerOptions({ image: 'test', exposePorts: [{}] }) }).toThrow()

        expect(() => { processCreateContainerOptions({ image: 'test', exposePorts: [{ host: 'docker' }] }) }).toThrow()

        expect(() => { processCreateContainerOptions({ image: 'test', exposePorts: [{ docker: 'host' }] }) }).toThrow()

        expect(() => { processCreateContainerOptions({ image: 'test', exposePorts: [{ error: 'error' }] }) }).toThrow()
      })
    })

    describe('##Returns', () => {
      it('should contains docker image name', () => {
        const arr = processCreateContainerOptions({ image: 'image-test' })

        expect(arr).toContain('image-test')
      })

      it('should contains continer name argument', () => {
        const arr = processCreateContainerOptions({ image: 'image-test', name: 'name-test' })

        expect(arr).toContain('--name')
        expect(arr).toContain('name-test')
      })

      it('should contains continer network argument', () => {
        const arr = processCreateContainerOptions({ image: 'image-test', network: 'network-test' })

        expect(arr).toContain('network-test')
        expect(arr).toContain('--net')
      })

      it('should contains continer volume arguments', () => {
        const arr = processCreateContainerOptions({
          image: 'image-test',
          volumes: [
            { host: 'volume-1-host', docker: 'volume-1-docker' },
            { docker: 'volume-2-docker', host: 'volume-2-host' },
          ],
        })

        expect(arr).toContain('-v')
        expect(arr).toContain('volume-2-host:volume-2-docker')
        expect(arr).toContain('volume-1-host:volume-1-docker')
        expect(arr.indexOf('-v') < arr.lastIndexOf('-v')).toBe(true)
      })

      it('should contains continer environment variables arguments', () => {
        const arr = processCreateContainerOptions({
          image: 'image-test',
          environmentVariables: [
            { name: 'env-1-name', value: 'env-1-value' },
            { value: 'env-2-value', name: 'env-2-name' },
          ],
        })

        expect(arr).toContain('env-2-name=env-2-value')
        expect(arr).toContain('env-1-name=env-1-value')
        expect(arr).toContain('-e')
        expect(arr.indexOf('-e') < arr.lastIndexOf('-e')).toBe(true)
      })

      it('should contains continer expose ports arguments', () => {
        const arr = processCreateContainerOptions({
          image: 'image-test',
          exposePorts: [
            { host: 'port-1-host', docker: 'port-1-docker' },
            { docker: 'port-2-docker', host: 'port-2-host' },
          ],
        })

        expect(arr).toContain('port-1-host:port-1-docker')
        expect(arr).toContain('port-2-host:port-2-docker')
        expect(arr).toContain('-p')
        expect(arr.indexOf('-p') < arr.lastIndexOf('-p')).toBe(true)
      })
    })
  })

  describe('#ProssesCreateNetworkOption()', () => {
    describe('##Errors', () => {
      it('should throw error when value not present', () => {
        expect(() => { ProssesCreateNetworkOption() }).toThrow()
      })

      it('should throw error when name value is not present', () => {
        expect(() => { ProssesCreateNetworkOption({}) }).toThrow()

        expect(() => { ProssesCreateNetworkOption({ name: '' }) }).toThrow()
      })
    })

    describe('##Returns', () => {
      it('should contains docker image name', () => {
        const arr = ProssesCreateNetworkOption({ name: 'cywp-network-test' })

        expect(arr).toContain('cywp-network-test')
      })
    })
  })

  describe('#CreateContainer', () => {
    let dockerIds

    beforeAll(() => {
      dockerIds = []
    })

    it('should create docker continer', async () => {
      const container = await CreateContainer({ image: 'hello-world' })
      const continerCheck = spawnSync('docker', ['ps', '-a', '-q', '--filter', `id=${container.options.dockerId}`, '--filter', 'status=created'])

      dockerIds.push(container.options.dockerId)

      expect(continerCheck.stdout).not.toHaveLength(0)
      expect(container.options.status).toEqual('created')
    })

    it('should throw reject for creating continer with the same name', async () => {
      const container = await CreateContainer({ image: 'hello-world', name: 'test' })

      dockerIds.push(container.options.dockerId)

      return expect(CreateContainer({ image: 'hello-world', name: 'test' })).rejects.toBeTruthy()
    })

    it('should create runnig docker continer', async () => {
      const container = await CreateContainer({ image: 'hello-world' }, true)
      const continerCheck = spawnSync('docker', ['ps', '-a', '-q', '--filter', `id=${container.options.dockerId}`])

      dockerIds.push(container.options.dockerId)

      expect(continerCheck.stdout).not.toHaveLength(0)
      expect(container.options.status).toEqual('started')
    })

    afterAll(() => {
      spawnSync('docker', ['rm', '-f'].concat(dockerIds))
    })
  })

  describe('#CreateVolume()', () => {
    let volumeNames

    beforeAll(() => {
      volumeNames = []
    })

    it('should create a volume', async () => {
      const volume = await CreateVolume('cywp-docker-CreateVolume-test')
      volumeNames.push('cywp-docker-CreateVolume-test')

      const volumeCheck = spawnSync('docker', ['volume', 'ls', '-q', '-f', `name=${volume.options.name}`])

      expect(volumeCheck.stdout).not.toHaveLength(0)

      expect(volume.options.name).toBe('cywp-docker-CreateVolume-test')
      expect(volume.options.status).toBe('alive')
    })

    it('should throw error for creating a volume', async () => {
      return expect(CreateVolume('!')).rejects.toBeTruthy()
    })

    afterAll(() => {
      spawnSync('docker', ['volume', 'rm', '-f'].concat(volumeNames))
    })
  })

  describe('#CreateNetwork()', () => {
    let networkIds

    beforeAll(() => {
      networkIds = []
    })

    it('should create docker network with object', async () => {
      const network = await CreateNetwork({ name: 'cywp-create-network-with-object-test' })
      const networkCheck = spawnSync('docker', ['network', 'ls', '-q', '--filter', `id=${network.options.id}`])

      networkIds.push(network.options.id)

      expect(networkCheck.stdout).not.toHaveLength(0)
      expect(network.options.status).toEqual('alive')
    })

    it('should create docker network with string', async () => {
      const network = await CreateNetwork('cywp-create-network-with-string-test')
      const networkCheck = spawnSync('docker', ['network', 'ls', '-q', '--filter', `id=${network.options.id}`])

      networkIds.push(network.options.id)

      expect(networkCheck.stdout).not.toHaveLength(0)
      expect(network.options.status).toEqual('alive')
    })

    it('should throw reject for creating network with the same name', async () => {
      const network = await CreateNetwork({ name: 'cywp-name-error-create-network-test' })

      networkIds.push(network.options.id)

      return expect(CreateNetwork({ name: 'cywp-name-error-create-network-test' })).rejects.toBeTruthy()
    })

    afterAll(() => {
      spawnSync('docker', ['network', 'rm'].concat(networkIds))
    })
  })
})
