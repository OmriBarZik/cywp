const { CreateWordpressCliContainer } = require('../../src/docker/presets/containers')
const Theme = require('../../src/wp-cli/theme')

jest.mock('../../src/docker/presets/containers')

describe('Theme', () => {
  /** @type {Theme} */
  let theme
  let originalWpTheme

  beforeAll(async () => {
    theme = new Theme()
    originalWpTheme = theme.wpTheme
  })

  beforeEach(() => {
    theme.wpTheme = jest.fn()
  })

  describe('#wpTheme()', () => {
    beforeEach(() => {
      theme.wpTheme = originalWpTheme
    })

    it('should have the arguments wp theme', () => {
      theme.wpTheme([])

      expect(CreateWordpressCliContainer)
        .toHaveBeenLastCalledWith(undefined, ['wp', 'theme'])
    })
  })

  describe('#activate()', () => {
    it('should have the arguments to activate theme', () => {
      theme.activate('theme')

      expect(theme.wpTheme)
        .toHaveBeenLastCalledWith(['activate', 'theme'])
    })
  })

  describe('#delete()', () => {
    it('should have the arguments to delete theme', () => {
      theme.delete('theme')

      expect(theme.wpTheme)
        .toHaveBeenLastCalledWith(['delete', 'theme'])
    })

    it('should have the arguments to delete multiple themes', () => {
      theme.delete(['theme1', 'theme2'])

      expect(theme.wpTheme)
        .toHaveBeenLastCalledWith(['delete', 'theme1', 'theme2'])
    })

    it('should have the arguments to delete all themes', () => {
      theme.delete('all')

      expect(theme.wpTheme)
        .toHaveBeenLastCalledWith(['delete', '--all'])
    })

    it('should have the arguments to delete theme with force', () => {
      theme.delete('theme', true)

      expect(theme.wpTheme)
        .toHaveBeenLastCalledWith(['delete', '--force', 'theme'])
    })

    it('should throw an error massage with theme in it', () => {
      expect(() => theme.delete(1)).toThrow(new TypeError('theme must be an array or a string'))
    })
  })

  describe('#get()', () => {
    it('should have the arguments to get theme info', () => {
      theme.wpTheme = jest.fn((commands) => Promise.resolve({ stdout: JSON.stringify(commands) }))

      theme.get('theme')

      expect(theme.wpTheme)
        .toHaveBeenLastCalledWith(['get', '--format=json', 'theme'])
    })
  })

  describe('#install()', () => {
    it('should have the arguments to install theme', () => {
      theme.install('theme')

      expect(theme.wpTheme)
        .toHaveBeenLastCalledWith(['install', '--force', 'theme'])
    })

    it('should have the arguments to install multiple themes', () => {
      theme.install(['theme1', 'theme2'])

      expect(theme.wpTheme)
        .toHaveBeenLastCalledWith(['install', '--force', 'theme1', 'theme2'])
    })

    it('should have the arguments to install and activate theme', () => {
      theme.install('theme', true)

      expect(theme.wpTheme)
        .toHaveBeenLastCalledWith(['install', '--force', '--activate', 'theme'])
    })

    it('should throw an error when trying to install an activate multiple themes', () => {
      expect(() => theme.install(['theme1', 'theme2'], true))
        .toThrow(new Error('To use activate there must be at only one theme given.'))
    })

    it('should have the arguments to install different version theme', () => {
      theme.install('theme', false, 2.2)

      expect(theme.wpTheme)
        .toHaveBeenLastCalledWith(['install', '--force', '--version=2.2', 'theme'])
    })

    it('should throw an error when trying to install an different version multiple themes', () => {
      expect(() => theme.install(['theme1', 'theme2'], false, '2.2'))
        .toThrow(new Error('To use version there must be at only one theme given.'))
    })
  })

  describe('#isActive()', () => {
    it('should have args to check theme activation', () => {
      theme.wpTheme = jest.fn(() => Promise.resolve())

      theme.isActive('theme')

      expect(theme.wpTheme).toHaveBeenLastCalledWith(['is-active', 'theme'])
    })

    it('should return true on resolve', () => {
      theme.wpTheme = jest.fn(() => Promise.resolve())

      return expect(theme.isActive('theme')).resolves.toBe(true)
    })

    it('should return false on reject', () => {
      theme.wpTheme = jest.fn(() => Promise.reject(new Error()))

      return expect(theme.isActive('theme')).resolves.toBe(false)
    })
  })

  describe('#isInstalled()', () => {
    it('should have args to check theme installation', () => {
      theme.wpTheme = jest.fn(() => Promise.resolve())

      theme.isInstalled('theme')

      expect(theme.wpTheme).toHaveBeenLastCalledWith(['is-installed', 'theme'])
    })

    it('should return true on resolve', () => {
      theme.wpTheme = jest.fn(() => Promise.resolve())

      return expect(theme.isInstalled('theme')).resolves.toBe(true)
    })

    it('should return false on reject', () => {
      theme.wpTheme = jest.fn(() => Promise.reject(new Error()))

      return expect(theme.isInstalled('theme')).resolves.toBe(false)
    })
  })

  describe('#list()', () => {
    it('should throw error when filters is not object', () => {
      expect(() => theme.list('test')).toThrow(new TypeError('filters must be an object'))
    })

    it('should have arguments for listing themes', () => {
      theme.wpTheme = jest.fn(() => Promise.resolve({ stdout: JSON.stringify('data') }))

      theme.list()

      expect(theme.wpTheme)
        .toHaveBeenLastCalledWith([
          'list',
          '--fields=name,status,update,version,update_version,update_package,update_id,title,description',
          '--format=json',
        ])
    })

    it('should have arguments for listing themes with filters', () => {
      theme.wpTheme = jest.fn(() => Promise.resolve({ stdout: JSON.stringify('data') }))

      theme.list({
        name: 'test',
        status: 'active',
      })

      expect(theme.wpTheme)
        .toHaveBeenLastCalledWith([
          'list',
          '--fields=name,status,update,version,update_version,update_package,update_id,title,description',
          '--format=json',
          '--name=test',
          '--status=active',
        ])
    })
  })

  describe('#path()', () => {
    it('should have arguments to get theme parent directory', () => {
      theme.path()

      expect(theme.wpTheme)
        .toHaveBeenLastCalledWith(['path'])
    })

    it('should have arguments to get theme directory', () => {
      theme.path('theme')

      expect(theme.wpTheme)
        .toHaveBeenLastCalledWith(['path', '--dir', 'theme'])
    })
  })
})
