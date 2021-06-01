const UserMeta = require('../../src/wp-cli/userMeta')

jest.mock('../../src/docker/presets/containers')

describe('#UserMeta', () => {
  /** @type {User} */
  let userMeta

  beforeAll(() => {
    userMeta = new UserMeta()
  })

  beforeEach(async () => {
    userMeta.wpUser = jest.fn()
  })

  describe('##add()', () => {
    it('should have arguments to add user metadata', () => {
      userMeta.Meta.add(1, 'add-metadata-key', 'add-metadata-value')

      expect(userMeta.wpUser)
        .toHaveBeenLastCalledWith(['meta', 'add', 1, 'add-metadata-key', 'add-metadata-value'])
    })
  })

  describe('##delete()', () => {
    it('should have arguments to delete user metadata', () => {
      userMeta.Meta.delete(1, 'delete-metadata-key')

      expect(userMeta.wpUser)
        .toHaveBeenLastCalledWith(['meta', 'delete', 1, 'delete-metadata-key'])
    })
  })

  describe('##get()', () => {
    it('should have arguments to get user metadata', () => {
      userMeta.wpUser = jest.fn((commands) => Promise.resolve({ stdout: JSON.stringify(commands) }))

      userMeta.Meta.get(1, 'get-metadata-key')

      expect(userMeta.wpUser)
        .toHaveBeenLastCalledWith(['meta', 'get', '--format=json', 1, 'get-metadata-key'])
    })
  })

  describe('##list()', () => {
    it('should have arguments to list user metadata', () => {
      userMeta.wpUser = jest.fn((commands) => Promise.resolve({ stdout: JSON.stringify(commands) }))

      userMeta.Meta.list(1)

      expect(userMeta.wpUser)
        .toHaveBeenLastCalledWith(['meta', 'list', '--format=json', 1])
    })
  })

  describe('##update()', () => {
    it('should have arguments to update user metadata', () => {
      userMeta.Meta.update(1, 'update-metadata-key', 'update-metadata-value')

      expect(userMeta.wpUser)
        .toHaveBeenLastCalledWith(['meta', 'update', 1, 'update-metadata-key', 'update-metadata-value'])
    })
  })
})
