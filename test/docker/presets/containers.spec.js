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
      const container = await CreateMysqlContainer('test', 4500)

      expect(container.options.name).toBe('cywp-test-mysql')
      expect(container.options.exposePorts[0].host).toBe(4500)
    })
  })

  describe('#CreateWordpressContainer()', () => {
    it('should create wordpress container named cywp-test-mysql with port exposed', async () => {
      const demoMysqlContainer = new Container({ name: 'pop', exposePorts: [{ host: 123, docker: 123 }] })
      const container = await CreateWordpressContainer('presets-test', 4501, demoMysqlContainer)

      expect(container.options.name).toBe('cywp-presets-test-wordpress')
      expect(container.options.exposePorts[0].host).toBe(4501)
      expect(container.options.environmentVariables[0].value).toBe('pop:123')
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
      const container = await CreateWordpressCliContainer(wordpress, ['wp', '--help'])

      expect(container.options.commands).toEqual(expect.arrayContaining(['wp', '--help']))
      expect(container.options.network).toBe(wordpress.options.network)
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
      expect(() => CreateMysqlContainer('test')).toThrow(new TypeError('port to expose must be an integer!'))
    })
  })

  afterAll(() => {
    CleanTestCreateContainer('preset')

    if (!keepCywpNetwork) {
      spawnSync('docker', ['network', 'rm', 'cywp-network'])
    }
  })
})
