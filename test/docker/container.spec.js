require('../types')
const { spawnSync } = require('child_process')
const { InitTestCreateContainer, CleanTestCreateContainer } = require('../util')

describe('Container', () => {
  /** @type {TestCreateContainer} */
  let CreateContainer

  beforeAll(() => {
    CreateContainer = InitTestCreateContainer('container')
  })

  describe('#start()', () => {
    it('should start docker container', async () => {
      const container = await CreateContainer({ image: 'hello-world' })

      const containerCheck = spawnSync('docker', ['ps', '-a', '--filter', `id=${container.options.id}`, '--filter', 'status=exited'])
      expect(containerCheck.stdout).not.toHaveLength(0)

      return expect(container.start()).resolves.toMatchObject({ options: { status: 'started' } })
    })
  })

  describe('#rm()', () => {
    it('should remove the container', async () => {
      const container = await CreateContainer({ image: 'hello-world' })

      return container.rm().then((container) => {
        expect(container.options.status).toBe('removed')

        const containerCheck = spawnSync('docker', ['ps', '-a', '-q', '--filter', `id=${container.options.id}`])
        expect(containerCheck.stdout).toHaveLength(0)
      })
    })

    it('should remove the container with force', async () => {
      const container = await CreateContainer({ image: 'hello-world' })

      return container.rm(true).then((container) => {
        const containerCheck = spawnSync('docker', ['ps', '-a', '-q', '--filter', `id=${container.options.id}`])
        expect(containerCheck.stdout).toHaveLength(0)
      })
    })

    it('should remove the container and its volumes', async () => {
      const container = await CreateContainer({ image: 'hello-world' })

      return container.rm(false, true).then((container) => {
        const containerCheck = spawnSync('docker', ['ps', '-a', '-q', '--filter', `id=${container.options.id}`])
        expect(containerCheck.stdout).toHaveLength(0)
      })
    })
  })

  describe('#stop()', () => {
    it('should stop the container', async () => {
      const container = await CreateContainer({ image: 'hello-world' }, true)

      return expect(container.stop()).resolves.toMatchObject({ options: { status: 'stopped' } })
    })
  })

  describe('#logs()', () => {
    it('should return stderr docker logs', async () => {
      const container = await CreateContainer({ image: 'hello-world' }, true)

      return expect(container.logs({ since: 'fail' })).rejects.toBeTruthy()
    })

    it('should return docker logs', async () => {
      const container = await CreateContainer({ image: 'hello-world' }, true)

      return container.logs().then((logs) => {
        expect(logs.stdout).toEqual(expect.stringContaining('docker'))
        expect(logs.stderr).toBeFalsy()
        expect(logs.container).toBe(container)
      })
    })

    it('should return number of lines form logs', async () => {
      const container = await CreateContainer({ image: 'hello-world' }, true)

      return container.logs({ tail: 2 }).then(logs => {
        expect(logs.stdout).toEqual(' https://docs.docker.com/get-started/\n\n')
        expect(logs.stderr).toBeFalsy()
        expect(logs.container).toBe(container)
      })
    })

    it('should return logs with time stamp', async () => {
      const container = await CreateContainer({ image: 'hello-world' }, true)

      const creationTime = await container.inspect('{{.Created}}')
      const time = new Date(creationTime)
      time.setDate(time.getDate())

      return container.logs({ timeStamps: true }).then(logs => {
        expect(logs.stdout).toEqual(expect.stringContaining(time.toISOString().substr(0, 17)))
        expect(logs.stderr).toBeFalsy()
        expect(logs.container).toBe(container)
      })
    })

    it('should return logs since', async () => {
      const container = await CreateContainer({ image: 'hello-world' }, true)

      const creationTime = await container.inspect('{{.Created}}')
      const time = new Date(creationTime)
      time.setDate(time.getDate() - 1)

      return container.logs({ since: time.toISOString() }).then(logs => {
        expect(logs.stdout).toBeTruthy()
        expect(logs.stderr).toBeFalsy()
        expect(logs.container).toBe(container)
      })
    })

    it('should not return logs', async () => {
      const container = await CreateContainer({ image: 'hello-world' }, true)

      const creationTime = await container.inspect('{{.Created}}')
      const time = new Date(creationTime)
      time.setDate(time.getDate() + 1)

      return container.logs({ since: time.toISOString() }).then(logs => {
        expect(logs.stdout).toBeFalsy()
        expect(logs.stderr).toBeFalsy()
        expect(logs.container).toBe(container)
      })
    })
  })

  describe('#inspect()', () => {
    it('should return container info', async () => {
      const container = await CreateContainer({ image: 'hello-world' })

      return expect(container.inspect()).resolves
        .toMatchObject({ Id: container.options.id, State: { Status: 'created' } })
    })

    it('should return specific container info', async () => {
      const container = await CreateContainer({ image: 'hello-world' })

      return expect(container.inspect('{{.Id}}')).resolves.toBe(container.options.id)
    })
  })

  describe('#status()', () => {
    it('should return container status', async () => {
      const container = await CreateContainer({ image: 'hello-world' })

      return expect(container.status()).resolves.toBe('created')
    })
  })

  afterAll(() => {
    CleanTestCreateContainer('container')
  })
})
