const { CreateWordpressCliContainer } = require('../../src/docker/presets/containers')
const Theme = require('../../src/wp-cli/theme')

jest.mock('../../src/docker/presets/containers')

describe('Theme', () => {
  /** @type {Theme} */
  let theme

  beforeAll(async () => {
    theme = new Theme()
  })

  describe('#wpTheme()', () => {
    it('should have the arguments wp theme', () => {
      theme.wpTheme([])

      expect(CreateWordpressCliContainer)
        .toHaveBeenLastCalledWith(undefined, ['wp', 'theme'])
    })
  })

  describe('#activate()', () => {
    it('should have the arguments to activate theme', () => {
      theme.activate('theme')

      expect(CreateWordpressCliContainer)
        .toHaveBeenLastCalledWith(undefined, ['wp', 'theme', 'activate', 'theme'])
    })
  })

  describe('#delete()', () => {
    it('should have the arguments to delete theme', () => {
      theme.delete('theme')

      expect(CreateWordpressCliContainer)
        .toHaveBeenLastCalledWith(undefined, ['wp', 'theme', 'delete', 'theme'])
    })

    it('should have the arguments to delete multiple themes', () => {
      theme.delete(['theme1', 'theme2'])

      expect(CreateWordpressCliContainer)
        .toHaveBeenLastCalledWith(undefined, ['wp', 'theme', 'delete', 'theme1', 'theme2'])
    })

    it('should have the arguments to delete all themes', () => {
      theme.delete('all')

      expect(CreateWordpressCliContainer)
        .toHaveBeenLastCalledWith(undefined, ['wp', 'theme', 'delete', '--all'])
    })

    it('should have the arguments to delete theme with force', () => {
      theme.delete('theme', true)

      expect(CreateWordpressCliContainer)
        .toHaveBeenLastCalledWith(undefined, ['wp', 'theme', 'delete', '--force', 'theme'])
    })

    it('should throw an error massage with theme in it', () => {
      expect(() => theme.delete(1)).toThrow(new TypeError('theme must be an array or a string'))
    })
  })

  describe('#get()', () => {
    let originalWpTheme
    beforeAll(() => {
      originalWpTheme = theme.wpTheme
    })

    it('should have the arguments to get theme info', () => {
      theme.wpTheme = jest.fn((commands) => Promise.resolve({ stdout: JSON.stringify(commands) }))

      theme.get('theme')

      expect(theme.wpTheme)
        .toHaveBeenLastCalledWith(['get', '--format=json', 'theme'])
    })

    afterAll(() => {
      theme.wpTheme = originalWpTheme
    })
  })

  describe('#install()', () => {
    it('should have the arguments to install theme', () => {
      theme.install('theme')

      expect(CreateWordpressCliContainer)
        .toHaveBeenLastCalledWith(undefined, ['wp', 'theme', 'install', '--force', 'theme'])
    })

    it('should have the arguments to install multiple themes', () => {
      theme.install(['theme1', 'theme2'])

      expect(CreateWordpressCliContainer)
        .toHaveBeenLastCalledWith(undefined, ['wp', 'theme', 'install', '--force', 'theme1', 'theme2'])
    })

    it('should have the arguments to install and activate theme', () => {
      theme.install('theme', true)

      expect(CreateWordpressCliContainer)
        .toHaveBeenLastCalledWith(undefined, ['wp', 'theme', 'install', '--force', '--activate', 'theme'])
    })

    it('should throw an error when trying to install an activate multiple themes', () => {
      expect(() => theme.install(['theme1', 'theme2'], true))
        .toThrow(new Error('To use activate there must be at only one theme given.'))
    })

    it('should have the arguments to install different version theme', () => {
      theme.install('theme', false, 2.2)

      expect(CreateWordpressCliContainer)
        .toHaveBeenLastCalledWith(undefined, ['wp', 'theme', 'install', '--force', '--version=2.2', 'theme'])
    })

    it('should throw an error when trying to install an different version multiple themes', () => {
      expect(() => theme.install(['theme1', 'theme2'], false, '2.2'))
        .toThrow(new Error('To use version there must be at only one theme given.'))
    })
  })
})
