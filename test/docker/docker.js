const assert = require('chai').assert
const { spawnSync } = require('child_process')
const { Docker } = require('../../src/docker/docker')
const CreateContainer = Docker.prototype.CreateContainer
const { processCreateContainerOptions: processOptions } = require('../../src/docker/docker')

describe('Container', function () {
  describe('#processOptions()', function () {
    describe('##Errors', function () {
      it('should throw error when value not present', function () {
        assert.throws(() => { processOptions() }, Error)
      })

      it('should throw error when image value is not present', function () {
        assert.throws(() => { processOptions({}) }, Error)

        assert.throws(() => { processOptions({ image: '' }) }, Error)
      })

      it('should throw error when volumes is not an array', function () {
        assert.throws(() => { processOptions({ image: 'test', volumes: 'fail test' }) }, Error)
      })

      it('should throw error when environmentVariables is not an array', function () {
        assert.throws(() => { processOptions({ image: 'test', environmentVariables: 'fail test' }) }, Error)
      })

      it('should throw error when exposePorts is not an array', function () {
        assert.throws(() => { processOptions({ image: 'test', exposePorts: 'fail test' }) }, Error)
      })

      it('should throw error when volumes is not made of a spsific object array', function () {
        assert.throws(() => { processOptions({ image: 'test', volumes: [{}] }) }, Error)

        assert.throws(() => { processOptions({ image: 'test', volumes: [{ docker: 'docker' }] }) }, Error)

        assert.throws(() => { processOptions({ image: 'test', volumes: [{ host: 'host' }] }) }, Error)

        assert.throws(() => { processOptions({ image: 'test', volumes: [{ error: 'error' }] }) }, Error)
      })

      it('should throw error when environmentVariables is not made of a spsific object array', function () {
        assert.throws(() => { processOptions({ image: 'test', environmentVariables: [{}] }) }, Error)

        assert.throws(() => { processOptions({ image: 'test', environmentVariables: [{ name: 'docker' }] }) }, Error)

        assert.throws(() => { processOptions({ image: 'test', environmentVariables: [{ value: 'host' }] }) }, Error)

        assert.throws(() => { processOptions({ image: 'test', environmentVariables: [{ error: 'error' }] }) }, Error)
      })

      it('should throw error when exposePorts is not made of a spsific object array', function () {
        assert.throws(() => { processOptions({ image: 'test', exposePorts: [{}] }) }, Error)

        assert.throws(() => { processOptions({ image: 'test', exposePorts: [{ host: 'docker' }] }) }, Error)

        assert.throws(() => { processOptions({ image: 'test', exposePorts: [{ docker: 'host' }] }) }, Error)

        assert.throws(() => { processOptions({ image: 'test', exposePorts: [{ error: 'error' }] }) }, Error)
      })
    })

    describe('##Returns', function () {
      it('should contains docker image name', function () {
        const arr = processOptions({ image: 'image-test' })

        assert.notStrictEqual(arr.indexOf('image-test'), -1)
      })

      it('should contains continer name argument', function () {
        const arr = processOptions({ image: 'image-test', name: 'name-test' })

        assert.notStrictEqual(arr.indexOf('name-test'), -1)
        assert.notStrictEqual(arr.indexOf('--name'), -1)
      })

      it('should contains continer network argument', function () {
        const arr = processOptions({ image: 'image-test', network: 'network-test' })

        assert.notStrictEqual(arr.indexOf('network-test'), -1)
        assert.notStrictEqual(arr.indexOf('--net'), -1)
      })

      it('should contains continer volume arguments', function () {
        const arr = processOptions({
          image: 'image-test',
          volumes: [
            { host: 'volume-1-host', docker: 'volume-1-docker' },
            { docker: 'volume-2-docker', host: 'volume-2-host' }
          ]
        })

        assert.notStrictEqual(arr.indexOf('volume-1-host:volume-1-docker'), -1)
        assert.notStrictEqual(arr.indexOf('volume-2-host:volume-2-docker'), -1)
        assert.notStrictEqual(arr.indexOf('-v'), -1)
        assert.strictEqual(arr.indexOf('-v') < arr.lastIndexOf('-v'), true)
      })

      it('should contains continer environment variables arguments', function () {
        const arr = processOptions({
          image: 'image-test',
          environmentVariables: [
            { name: 'env-1-name', value: 'env-1-value' },
            { value: 'env-2-value', name: 'env-2-name' }
          ]
        })

        assert.notStrictEqual(arr.indexOf('env-1-name=env-1-value'), -1)
        assert.notStrictEqual(arr.indexOf('env-2-name=env-2-value'), -1)
        assert.notStrictEqual(arr.indexOf('-e'), -1)
        assert.strictEqual(arr.indexOf('-e') < arr.lastIndexOf('-e'), true)
      })

      it('should contains continer expose ports arguments', function () {
        const arr = processOptions({
          image: 'image-test',
          exposePorts: [
            { host: 'port-1-host', docker: 'port-1-docker' },
            { docker: 'port-2-docker', host: 'port-2-host' }
          ]
        })

        assert.notStrictEqual(arr.indexOf('port-1-host:port-1-docker'), -1)
        assert.notStrictEqual(arr.indexOf('port-2-host:port-2-docker'), -1)
        assert.notStrictEqual(arr.indexOf('-p'), -1)
        assert.strictEqual(arr.indexOf('-p') < arr.lastIndexOf('-p'), true)
      })
    })
  })

  describe('#CreateContainer', function () {
    let dockerIds

    before(function () {
      dockerIds = []
    })

    it('should create docker continer', async function () {
      const continer = await CreateContainer({ image: 'hello-world' })
      const continerCheck = spawnSync('docker', ['ps', '-a', '--filter', `id=${continer.options.dockerId}`, '--filter', 'status=created'])

      dockerIds.push(continer.options.dockerId)

      assert.notStrictEqual(continerCheck.stdout.length, 0)
      assert.deepEqual(continer.options.status, 'created')
    })

    it('should throw reject for creating continer with the same name', async function () {
      const continer = await CreateContainer({ image: 'hello-world', name: 'test' })

      dockerIds.push(continer.options.dockerId)

      return CreateContainer({ image: 'hello-world', name: 'test' }).then(
        () => Promise.reject(new Error('Expected method to reject.')),
        err => assert.isNotEmpty(err)
      )
    })

    it('should create runnig docker continer', async function () {
      const continer = await CreateContainer({ image: 'hello-world' }, true)
      const continerCheck = spawnSync('docker', ['ps', '-a', '--filter', `id=${continer.options.dockerId}`, '--filter', 'status=exited'])

      dockerIds.push(continer.options.dockerId)

      assert.notStrictEqual(continerCheck.stdout.length, 0)
      assert.deepEqual(continer.options.status, 'started')
    })

    after(function () {
      spawnSync('docker', ['rm', '-f'].concat(dockerIds))
    })
  })
})
