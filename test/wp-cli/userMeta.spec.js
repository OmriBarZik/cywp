const UserMeta = require('../../src/wp-cli/userMeta')

jest.mock('../../src/docker/presets/containers')

describe('#UserMeta', () => {
  /** @type {UserMeta} */
  let userMeta

  beforeAll(() => {
    userMeta = new UserMeta()
  })

  beforeEach(async () => {
    userMeta.wpUserMeta = jest.fn()
  })

  describe('##add()', () => {
    it('should have arguments to add user metadata', () => {
      userMeta.add(1, 'add-metadata-key', 'add-metadata-value')

      expect(userMeta.wpUserMeta)
        .toHaveBeenLastCalledWith(['add', 1, 'add-metadata-key', 'add-metadata-value'])
    })
  })

  describe('##delete()', () => {
    it('should have arguments to delete user metadata', () => {
      userMeta.delete(1, 'delete-metadata-key')

      expect(userMeta.wpUserMeta)
        .toHaveBeenLastCalledWith(['delete', 1, 'delete-metadata-key'])
    })
  })

  describe('##get()', () => {
    it('should have arguments to get user metadata', () => {
      userMeta.wpUserMeta = jest.fn((commands) => Promise.resolve({ stdout: JSON.stringify(commands) }))

      userMeta.get(1, 'get-metadata-key')

      expect(userMeta.wpUserMeta)
        .toHaveBeenLastCalledWith(['get', '--format=json', 1, 'get-metadata-key'])
    })
  })

  describe('##list()', () => {
    it('should have arguments to list user metadata', () => {
      userMeta.wpUserMeta = jest.fn((commands) => Promise.resolve({ stdout: JSON.stringify(commands) }))

      userMeta.list(1)

      expect(userMeta.wpUserMeta)
        .toHaveBeenLastCalledWith(['list', '--format=json', 1])
    })
  })

  describe('##update()', () => {
    it('should have arguments to update user metadata', () => {
      userMeta.update(1, 'update-metadata-key', 'update-metadata-value')

      expect(userMeta.wpUserMeta)
        .toHaveBeenLastCalledWith(['update', 1, 'update-metadata-key', 'update-metadata-value'])
    })
  })
})
