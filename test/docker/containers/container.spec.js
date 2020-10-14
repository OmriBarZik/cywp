const { spawnSync, spawn } = require('child_process')
const { InitTestCreateContainer, CleanTestCreateContainer } = require('../../util')

describe('Container', () => {
  /** @type {TestCreateContainer} */
  let CreateContainer

  beforeAll(() => {
    CreateContainer = InitTestCreateContainer('container')
  })

  describe('#start()', () => {
    it('should start docker container', async () => {
      const container = await CreateContainer({ image: 'hello-world' })

      const continerCheck = spawnSync('docker', ['ps', '-a', '--filter', `id=${container.options.dockerId}`, '--filter', 'status=exited'])
      expect(continerCheck.stdout).not.toHaveLength(0)

      return expect(container.start()).resolves.toMatchObject({ options: { status: 'started' } })
    })
  })

  describe('#rm()', () => {
    it('should remove the container', async () => {
      const container = await CreateContainer({ image: 'hello-world' })

      return container.rm().then((container) => {
        const continerCheck = spawnSync('docker', ['ps', '-a', '-q', '--filter', `id=${container.options.dockerId}`])
        expect(continerCheck.stdout).toHaveLength(0)
      })
    })

    it('should remove the container with force', async () => {
      const container = await CreateContainer({ image: 'hello-world' })

      return container.rm(true).then((container) => {
        const continerCheck = spawnSync('docker', ['ps', '-a', '-q', '--filter', `id=${container.options.dockerId}`])
        expect(continerCheck.stdout).toHaveLength(0)
      })
    })

    it('should remove the container and its volumes', async () => {
      const container = await CreateContainer({ image: 'hello-world' })

      return container.rm(false, true).then((container) => {
        const continerCheck = spawnSync('docker', ['ps', '-a', '-q', '--filter', `id=${container.options.dockerId}`])
        expect(continerCheck.stdout).toHaveLength(0)
      })
    })
  })

  describe('#stop()', () => {
    it('should stop the container', async () => {
      const container = await CreateContainer({ image: 'hello-world' }, true)

      return expect(container.stop()).resolves.toMatchObject({ options: { status: 'stoped' } })
    })
  })

  describe('#logs()', () => {
    it('should return docker logs', async () => {
      const container = await CreateContainer({ image: 'hello-world' }, true)

      return expect(container.logs()).resolves.toEqual(expect.stringContaining('Docker'))
    })

    it('should return number of lines form logs', async () => {
      const container = await CreateContainer({ image: 'hello-world' }, true)

      return expect(container.logs({ tail: 2 })).resolves.toBe(' https://docs.docker.com/get-started/\n\n')
    })

    it('should return logs with time stemp', async () => {
      const container = await CreateContainer({ image: 'hello-world' }, true)

      const time = new Date().toISOString().substr(0, 14)
      return expect(container.logs({ timestamps: true })).resolves.toEqual(expect.stringContaining(time))
    })

    it('should return logs since', async () => {
      const time = new Date().toISOString()

      const container = await CreateContainer({ image: 'hello-world' }, true)

      return expect(container.logs({ since: time })).resolves.toBeTruthy()
    })

    it('should not return logs', async () => {
      const container = await CreateContainer({ image: 'hello-world' }, true)

      const time = new Date()
      time.setDate(new Date().getDate() + 1)

      return expect(container.logs({ since: time.toISOString() })).resolves.toBeFalsy()
    })
  })

  describe('#inspect()', () => {
    it('should return container info', async () => {
      const container = await CreateContainer({ image: 'hello-world' })

      return expect(container.inspect()).resolves
        .toMatchObject({ Id: container.options.dockerId, State: { Status: 'created' } })
    })

    it('should return spesific container info', async () => {
      const container = await CreateContainer({ image: 'hello-world' })

      return expect(container.inspect('{{.Id}}')).resolves.toBe(container.options.dockerId)
    })
  })

  describe('#status()', () => {
    it('should return container status', async () => {
      const container = await CreateContainer({ image: 'hello-world' })

      return expect(container.status()).resolves.toBe('created')
    })
  })

  describe('#ReturnPromise()', () => {
    it('should throw error for invalid arguments', async () => {
      const container = await CreateContainer({ image: 'hello-world' })

      return expect(() => { container.ReturnPromise('process', 'invalid callback') })
        .toThrow(new TypeError('callback must be a function'))
    })

    it('should reject for invalid process', async () => {
      const container = await CreateContainer({ image: 'hello-world' })

      const process = spawn('docker', ['error'])

      return expect(container.ReturnPromise(process, () => {})).rejects.toBeTruthy()
    })
  })

  afterAll(() => {
    CleanTestCreateContainer('container')
  })
})