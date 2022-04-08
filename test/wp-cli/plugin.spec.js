const {
  CreateWordpressCliContainer
} = require('../../src/docker/presets/containers')
const Plugin = require('../../src/wp-cli/plugin')

jest.mock('../../src/docker/presets/containers')

describe('Plugin', () => {
  /** @type {import('../../src/wp-cli/plugin')} */
  let plugin
  let originalWpPlugin

  beforeAll(async () => {
    plugin = new Plugin()
    originalWpPlugin = plugin.wpPlugin
  })

  beforeEach(() => {
    plugin.wpPlugin = jest.fn()
  })

  describe('#wpPlugin()', () => {
    beforeEach(() => {
      plugin.wpPlugin = originalWpPlugin
    })

    it('should have the arguments wp plugin', () => {
      plugin.wpPlugin([])

      expect(CreateWordpressCliContainer).toHaveBeenLastCalledWith(undefined, [
        'wp',
        'plugin'
      ])
    })
  })

  describe('#activate()', () => {
    it('should have the arguments to activate plugin', () => {
      plugin.activate('plugin')

      expect(plugin.wpPlugin).toHaveBeenLastCalledWith(['activate', 'plugin'])
    })

    it('should have the arguments to activate all plugins', () => {
      plugin.activate('all')

      expect(plugin.wpPlugin).toHaveBeenLastCalledWith(['activate', '--all'])
    })
  })

  describe('#deactivate()', () => {
    it('should have the arguments to deactivate plugin', () => {
      plugin.deactivate('plugin')

      expect(plugin.wpPlugin).toHaveBeenLastCalledWith(['deactivate', 'plugin'])
    })

    it('should have the arguments to deactivate all plugins', () => {
      plugin.deactivate('all')

      expect(plugin.wpPlugin).toHaveBeenLastCalledWith(['deactivate', '--all'])
    })

    it('should have the arguments to deactivate and uninstall plugin', () => {
      plugin.deactivate('plugin', true)

      expect(plugin.wpPlugin).toHaveBeenLastCalledWith([
        'deactivate',
        '--uninstall',
        'plugin'
      ])
    })
  })

  describe('#delete()', () => {
    it('should have the arguments to delete plugin', () => {
      plugin.delete('plugin')

      expect(plugin.wpPlugin).toHaveBeenLastCalledWith(['delete', 'plugin'])
    })

    it('should have the arguments to delete multiple plugins', () => {
      plugin.delete(['plugin1', 'plugin2'])

      expect(plugin.wpPlugin).toHaveBeenLastCalledWith([
        'delete',
        'plugin1',
        'plugin2'
      ])
    })

    it('should have the arguments to delete all plugins', () => {
      plugin.delete('all')

      expect(plugin.wpPlugin).toHaveBeenLastCalledWith(['delete', '--all'])
    })

    it('should throw an error massage with plugin in it', () => {
      expect(() => plugin.delete(1)).toThrow(
        new TypeError('plugin must be an array or a string')
      )
    })
  })

  describe('#get()', () => {
    it('should have the arguments to get plugin info', () => {
      plugin.wpPlugin = jest.fn((commands) =>
        Promise.resolve({ stdout: JSON.stringify(commands) })
      )

      plugin.get('plugin')

      expect(plugin.wpPlugin).toHaveBeenLastCalledWith([
        'get',
        '--format=json',
        'plugin'
      ])
    })
  })

  describe('#install()', () => {
    it('should have the arguments to install plugin', () => {
      plugin.install('plugin')

      expect(plugin.wpPlugin).toHaveBeenLastCalledWith([
        'install',
        '--force',
        'plugin'
      ])
    })

    it('should have the arguments to install multiple plugins', () => {
      plugin.install(['plugin1', 'plugin2'])

      expect(plugin.wpPlugin).toHaveBeenLastCalledWith([
        'install',
        '--force',
        'plugin1',
        'plugin2'
      ])
    })

    it('should have the arguments to install and activate plugin', () => {
      plugin.install('plugin', true)

      expect(plugin.wpPlugin).toHaveBeenLastCalledWith([
        'install',
        '--force',
        '--activate',
        'plugin'
      ])
    })

    it('should throw an error when trying to install an activate multiple plugins', () => {
      expect(() => plugin.install(['plugin1', 'plugin2'], true)).toThrow(
        new Error('To use activate there must be at only one plugin given.')
      )
    })

    it('should have the arguments to install different version plugin', () => {
      plugin.install('plugin', false, 2.2)

      expect(plugin.wpPlugin).toHaveBeenLastCalledWith([
        'install',
        '--force',
        '--version=2.2',
        'plugin'
      ])
    })

    it('should throw an error when trying to install an different version multiple plugins', () => {
      expect(() =>
        plugin.install(['plugin1', 'plugin2'], false, '2.2')
      ).toThrow(
        new Error('To use version there must be at only one plugin given.')
      )
    })
  })

  describe('#isActive()', () => {
    it('should have args to check plugin activation', () => {
      plugin.wpPlugin = jest.fn(() => Promise.resolve())

      plugin.isActive('plugin')

      expect(plugin.wpPlugin).toHaveBeenLastCalledWith(['is-active', 'plugin'])
    })

    it('should return true on resolve', () => {
      plugin.wpPlugin = jest.fn(() => Promise.resolve())

      return expect(plugin.isActive('plugin')).resolves.toBe(true)
    })

    it('should return false on reject', () => {
      plugin.wpPlugin = jest.fn(() => Promise.reject(new Error()))

      return expect(plugin.isActive('plugin')).resolves.toBe(false)
    })
  })

  describe('#isInstalled()', () => {
    it('should have args to check plugin installation', () => {
      plugin.wpPlugin = jest.fn(() => Promise.resolve())

      plugin.isInstalled('plugin')

      expect(plugin.wpPlugin).toHaveBeenLastCalledWith([
        'is-installed',
        'plugin'
      ])
    })

    it('should return true on resolve', () => {
      plugin.wpPlugin = jest.fn(() => Promise.resolve())

      return expect(plugin.isInstalled('plugin')).resolves.toBe(true)
    })

    it('should return false on reject', () => {
      plugin.wpPlugin = jest.fn(() => Promise.reject(new Error()))

      return expect(plugin.isInstalled('plugin')).resolves.toBe(false)
    })
  })

  describe('#list()', () => {
    it('should throw error when filters is not object', () => {
      expect(() => plugin.list('test')).toThrow(
        new TypeError('filters must be an object')
      )
    })

    it('should have arguments for listing plugins', () => {
      plugin.wpPlugin = jest.fn(() =>
        Promise.resolve({ stdout: JSON.stringify('data') })
      )

      plugin.list()

      expect(plugin.wpPlugin).toHaveBeenLastCalledWith([
        'list',
        '--fields=name,status,update,version,update_version,update_package,update_id,title,description,file',
        '--format=json'
      ])
    })

    it('should have arguments for listing plugins with filters', () => {
      plugin.wpPlugin = jest.fn(() =>
        Promise.resolve({ stdout: JSON.stringify('data') })
      )

      plugin.list({
        name: 'test',
        status: 'active'
      })

      expect(plugin.wpPlugin).toHaveBeenLastCalledWith([
        'list',
        '--fields=name,status,update,version,update_version,update_package,update_id,title,description,file',
        '--format=json',
        '--name=test',
        '--status=active'
      ])
    })
  })

  describe('#path()', () => {
    it('should have arguments to get plugin parent directory', () => {
      plugin.path()

      expect(plugin.wpPlugin).toHaveBeenLastCalledWith(['path'])
    })

    it('should have arguments to get plugin directory', () => {
      plugin.path('plugin')

      expect(plugin.wpPlugin).toHaveBeenLastCalledWith([
        'path',
        '--dir',
        'plugin'
      ])
    })
  })

  describe('#uninstall()', () => {
    it('should have arguments to uninstall plugin', () => {
      plugin.uninstall('plugin')

      expect(plugin.wpPlugin).toHaveBeenLastCalledWith([
        'delete',
        '--deactivate',
        'plugin'
      ])
    })

    it('should have arguments to uninstall multiple plugins', () => {
      plugin.uninstall(['plugin1', 'plugin2'])

      expect(plugin.wpPlugin).toHaveBeenLastCalledWith([
        'delete',
        '--deactivate',
        'plugin1',
        'plugin2'
      ])
    })

    it('should have arguments to uninstall all plugins', () => {
      plugin.uninstall('all')

      expect(plugin.wpPlugin).toHaveBeenLastCalledWith([
        'delete',
        '--deactivate',
        '--all'
      ])
    })
  })
})
