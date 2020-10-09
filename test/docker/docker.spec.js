const { spawnSync } = require('child_process')
const { Docker } = require('../../src/docker/docker')
const CreateContainer = Docker.prototype.CreateContainer
const { processCreateContainerOptions: processOptions } = require('../../src/docker/docker')

describe('Container', () => {
  describe('#processOptions()', () => {
    describe('##Errors', () => {
      it('should throw error when value not present', () => {
        expect(() => { processOptions() }).toThrow()
      })

      it('should throw error when image value is not present', () => {
        expect(() => { processOptions({}) }).toThrow()

        expect(() => { processOptions({ image: '' }) }).toThrow()
      })

      it('should throw error when volumes is not an array', () => {
        expect(() => { processOptions({ image: 'test', volumes: 'fail test' }) }).toThrow()
      })

      it(
        'should throw error when environmentVariables is not an array',
        () => {
          expect(
            () => { processOptions({ image: 'test', environmentVariables: 'fail test' }) }
          ).toThrow()
        }
      )

      it('should throw error when exposePorts is not an array', () => {
        expect(() => { processOptions({ image: 'test', exposePorts: 'fail test' }) }).toThrow()
      })

      it(
        'should throw error when volumes is not made of a spsific object array',
        () => {
          expect(() => { processOptions({ image: 'test', volumes: [{}] }) }).toThrow()

          expect(
            () => { processOptions({ image: 'test', volumes: [{ docker: 'docker' }] }) }
          ).toThrow()

          expect(() => { processOptions({ image: 'test', volumes: [{ host: 'host' }] }) }).toThrow()

          expect(() => { processOptions({ image: 'test', volumes: [{ error: 'error' }] }) }).toThrow()
        }
      )

      it(
        'should throw error when environmentVariables is not made of a spsific object array',
        () => {
          expect(() => { processOptions({ image: 'test', environmentVariables: [{}] }) }).toThrow()

          expect(
            () => { processOptions({ image: 'test', environmentVariables: [{ name: 'docker' }] }) }
          ).toThrow()

          expect(
            () => { processOptions({ image: 'test', environmentVariables: [{ value: 'host' }] }) }
          ).toThrow()

          expect(
            () => { processOptions({ image: 'test', environmentVariables: [{ error: 'error' }] }) }
          ).toThrow()
        }
      )

      it(
        'should throw error when exposePorts is not made of a spsific object array',
        () => {
          expect(() => { processOptions({ image: 'test', exposePorts: [{}] }) }).toThrow()

          expect(
            () => { processOptions({ image: 'test', exposePorts: [{ host: 'docker' }] }) }
          ).toThrow()

          expect(
            () => { processOptions({ image: 'test', exposePorts: [{ docker: 'host' }] }) }
          ).toThrow()

          expect(
            () => { processOptions({ image: 'test', exposePorts: [{ error: 'error' }] }) }
          ).toThrow()
        }
      )
    })

    describe('##Returns', () => {
      it('should contains docker image name', () => {
        const arr = processOptions({ image: 'image-test' })

        expect(arr.indexOf('image-test')).not.toBe(-1)
      })

      it('should contains continer name argument', () => {
        const arr = processOptions({ image: 'image-test', name: 'name-test' })

        expect(arr.indexOf('name-test')).not.toBe(-1)
        expect(arr.indexOf('--name')).not.toBe(-1)
      })

      it('should contains continer network argument', () => {
        const arr = processOptions({ image: 'image-test', network: 'network-test' })

        expect(arr.indexOf('network-test')).not.toBe(-1)
        expect(arr.indexOf('--net')).not.toBe(-1)
      })

      it('should contains continer volume arguments', () => {
        const arr = processOptions({
          image: 'image-test',
          volumes: [
            { host: 'volume-1-host', docker: 'volume-1-docker' },
            { docker: 'volume-2-docker', host: 'volume-2-host' }
          ]
        })

        expect(arr.indexOf('volume-1-host:volume-1-docker')).not.toBe(-1)
        expect(arr.indexOf('volume-2-host:volume-2-docker')).not.toBe(-1)
        expect(arr.indexOf('-v')).not.toBe(-1)
        expect(arr.indexOf('-v') < arr.lastIndexOf('-v')).toBe(true)
      })

      it('should contains continer environment variables arguments', () => {
        const arr = processOptions({
          image: 'image-test',
          environmentVariables: [
            { name: 'env-1-name', value: 'env-1-value' },
            { value: 'env-2-value', name: 'env-2-name' }
          ]
        })

        expect(arr.indexOf('env-1-name=env-1-value')).not.toBe(-1)
        expect(arr.indexOf('env-2-name=env-2-value')).not.toBe(-1)
        expect(arr.indexOf('-e')).not.toBe(-1)
        expect(arr.indexOf('-e') < arr.lastIndexOf('-e')).toBe(true)
      })

      it('should contains continer expose ports arguments', () => {
        const arr = processOptions({
          image: 'image-test',
          exposePorts: [
            { host: 'port-1-host', docker: 'port-1-docker' },
            { docker: 'port-2-docker', host: 'port-2-host' }
          ]
        })

        expect(arr.indexOf('port-1-host:port-1-docker')).not.toBe(-1)
        expect(arr.indexOf('port-2-host:port-2-docker')).not.toBe(-1)
        expect(arr.indexOf('-p')).not.toBe(-1)
        expect(arr.indexOf('-p') < arr.lastIndexOf('-p')).toBe(true)
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
      const continerCheck = spawnSync('docker', ['ps', '-a', '--filter', `id=${container.options.dockerId}`, '--filter', 'status=created'])

      dockerIds.push(container.options.dockerId)

      expect(continerCheck.stdout.length).not.toBe(0)
      expect(container.options.status).toEqual('created')
    })

    it('should throw reject for creating continer with the same name', async () => {
      const continer = await CreateContainer({ image: 'hello-world', name: 'test' })

      dockerIds.push(continer.options.dockerId)

      return expect(CreateContainer({ image: 'hello-world', name: 'test' })).rejects.not.toBeNull()
    })

    it('should create runnig docker continer', async () => {
      const continer = await CreateContainer({ image: 'hello-world' }, true)
      const continerCheck = spawnSync('docker', ['ps', '-a', '--filter', `id=${continer.options.dockerId}`, '--filter', 'status=exited'])

      dockerIds.push(continer.options.dockerId)

      expect(continerCheck.stdout.length).not.toBe(0)
      expect(continer.options.status).toEqual('started')
    })

    afterAll(() => {
      spawnSync('docker', ['rm', '-f'].concat(dockerIds))
    })
  })
})
