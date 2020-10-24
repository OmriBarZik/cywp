const { CreateMysqlContainer, CreateWordpressContainer } = require('../../../src/docker/presets/containers')
const { CleanTestCreateContainer, InitTestCreateContainer } = require('../../util')
const { spawnSync } = require('child_process')
const Container = require('../../../src/docker/container')

describe('Presets', () => {
  beforeAll(() => {
    InitTestCreateContainer('preset')
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
      const container = await CreateWordpressContainer('test', 4501, demoMysqlContainer)

      expect(container.options.name).toBe('cywp-test-wordpress')
      expect(container.options.exposePorts[0].host).toBe(4501)
      expect(container.options.environmentVariables[0].value).toBe('pop:123')
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

    spawnSync('docker', ['volume', 'rm', '-f', 'cywp-twentyseventeen-volume'])
  })
})
