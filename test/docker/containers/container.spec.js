const { spawnSync } = require('child_process')
const { CreateContainer, GetContinerIDs } = require('../../util')

describe('Container', () => {
  it('should start docker container', async () => {
    const container = await CreateContainer('container', { image: 'hello-world' })

    const continerCheck = spawnSync('docker', ['ps', '-a', '--filter', `id=${container.options.dockerId}`, '--filter', 'status=exited'])
    expect(continerCheck.stdout).not.toHaveLength(0)

    return expect(container.start()).resolves.toMatchObject({ options: { status: 'started' } })
  })

  it('should remove the container', async () => {
    const container = await CreateContainer('container', { image: 'hello-world' })

    return container.rm().then((container) => {
      const continerCheck = spawnSync('docker', ['ps', '-a', '-q', '--filter', `id=${container.options.dockerId}`])
      expect(continerCheck.stdout).toHaveLength(0)
    })
  })

  it('should remove the container with force', async () => {
    const container = await CreateContainer('container', { image: 'hello-world' })

    return container.rm(true).then((container) => {
      const continerCheck = spawnSync('docker', ['ps', '-a', '-q', '--filter', `id=${container.options.dockerId}`])
      expect(continerCheck.stdout).toHaveLength(0)
    })
  })

  it('should remove the container and its volumes', async () => {
    const container = await CreateContainer('container', { image: 'hello-world' })

    return container.rm(false, true).then((container) => {
      const continerCheck = spawnSync('docker', ['ps', '-a', '-q', '--filter', `id=${container.options.dockerId}`])
      expect(continerCheck.stdout).toHaveLength(0)
    })
  })

  afterAll(async () => {
    spawnSync('docker', ['rm', '-f'].concat(GetContinerIDs('container')))
  })
})
