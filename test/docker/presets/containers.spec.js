const { CreateMysqlContainer, CreateWordpressContainer, CreateWordpressCliContainer } = require('../../../src/docker/presets/containers')
const { CleanTestCreateContainer, InitTestCreateContainer } = require('../../util')
const { spawnSync } = require('child_process')
const Container = require('../../../src/docker/container')
const { Docker } = require('../../../src/docker/docker')

describe('Presets', () => {
  let keepCywpNetwork

  beforeAll(async () => {
    InitTestCreateContainer('preset')

    try {
      await Docker.prototype.CreateNetwork('cywp-network')
      keepCywpNetwork = false
    } catch (error) {
      keepCywpNetwork = true
    }
  })

  describe('#CreateMysqlContainer()', () => {
    it('should create mysql container named cywp-test-mysql with port exposed', async () => {
      const container = await CreateMysqlContainer('test')

      expect(container.options.name).toBe('cywp-test-mysql')
    })
  })

  describe('#CreateWordpressContainer()', () => {
    it('should create wordpress container named cywp-test-mysql with port exposed', async () => {
      const demoMysqlContainer = new Container({ name: 'pop' })
      const container = await CreateWordpressContainer('presets-test', 4501, demoMysqlContainer)

      expect(container.options.name).toBe('cywp-presets-test-wordpress')
      expect(container.options.exposePorts[0].host).toBe(4501)
      expect(container.options.environmentVariables[0].value).toBe('pop:3306')
    })

    it('should throw for error when mysqlContainer is not Container', () => {
      expect(() => CreateWordpressContainer('test', 4501)).toThrow()

      expect(() => CreateWordpressContainer('test', 4501, {})).toThrow()
    })
  })

  describe('#CreateWordpressCliContainer()', () => {
    it('should create WordPress', async () => {
      const demoMysqlContainer = new Container({ name: 'pop', exposePorts: [{ host: 123, docker: 123 }] })
      const wordpress = await CreateWordpressContainer('presets-test-cli', 4501, demoMysqlContainer)
      const output = await CreateWordpressCliContainer(wordpress, ['wp', '--help'])

      expect(output.stdout).toBeTruthy()
      expect(output.stderr).toBeDefined()
    })

    it('should throw type error when commands is not array', async () => {
      expect(() => CreateWordpressCliContainer({}, 'error')).toThrow(TypeError)
    })
  })

  describe('#CheckParameters()', () => {
    it('should throw error for undefined name', () => {
      expect(() => CreateMysqlContainer()).toThrow(new TypeError('name must be a valid string!'))
    })

    it('should throw error for undefined port', () => {
      expect(() => CreateWordpressContainer('test')).toThrow(new TypeError('port to expose must be an integer!'))
    })
  })

  afterAll(() => {
    CleanTestCreateContainer('preset')

    if (!keepCywpNetwork) {
      spawnSync('docker', ['network', 'rm', 'cywp-network'])
    }
  })
})
