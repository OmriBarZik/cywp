const { CreateWordpressCliContainer } = require('../../src/docker/presets/containers')
const User = require('../../src/wp-cli/user')

jest.mock('../../src/docker/presets/containers')

describe('User', () => {
  /** @type {User} */
  let user
  let originalWpUser

  beforeAll(() => {
    user = new User()
    originalWpUser = user.wpUser
  })

  beforeEach(async () => {
    user.wpUser = jest.fn()
  })

  describe('#wpUser()', () => {
    beforeEach(() => {
      user.wpUser = originalWpUser
    })

    it('should have the arguments wp plugin', () => {
      user.wpUser([])

      expect(CreateWordpressCliContainer)
        .toHaveBeenLastCalledWith(undefined, ['wp', 'user'])
    })
  })

  describe('#addCap()', () => {
    it('should have the arguments to add cap', () => {
      user.addCap(1, 'cap')

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['add-cap', 1, 'cap'])
    })
  })

  describe('#addRole()', () => {
    it('should have the arguments to add role', () => {
      user.addRole(1, 'role')

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['add-role', 1, 'role'])
    })
  })

  describe('#create()', () => {
    describe('##throws', () => {
      it('should throw error if user name not provided', () => {
        expect(() => user.create()).toThrow('options.userLogin must be provided!')

        expect(() => user.create({})).toThrow('options.userLogin must be provided!')
      })

      it('should throw error if password not provided', () => {
        expect(() => user.create({ userLogin: 'cywp' })).toThrow('options.userPass must be provided!')
      })

      it('should throw error if userRegistered is not a valid date', () => {
        expect(() => user.create({ userLogin: 'cywp', userPass: 'cywp', userRegistered: '2020.12.15' })).toThrow('options.userRegistered must be instance of Date!')
      })
    })

    describe('##returns', () => {
      it('should have the arguments to create basic user', () => {
        user.create({
          userLogin: 'cywp-user',
          userPass: 'cywp-password',
        })

        expect(user.wpUser)
          .toHaveBeenLastCalledWith([
            'create',
            '--porcelain',
            'cywp-user',
            'cywp-user@cywp.local',
            '--user_pass=cywp-password',
          ])
      })

      it('should have the arguments to create user with custom email', () => {
        user.create({
          userLogin: 'cywp-user',
          userPass: 'cywp-password',
          userEmail: 'pop@pop.com',
        })

        expect(user.wpUser)
          .toHaveBeenLastCalledWith([
            'create',
            '--porcelain',
            'cywp-user',
            'pop@pop.com',
            '--user_pass=cywp-password',
          ])
      })

      it('should have the arguments to create user with custom display name', () => {
        user.create({
          userLogin: 'cywp-user',
          userPass: 'cywp-password',
          displayName: 'cywp-display-name',
        })

        expect(user.wpUser)
          .toHaveBeenLastCalledWith([
            'create',
            '--porcelain',
            'cywp-user',
            'cywp-user@cywp.local',
            '--user_pass=cywp-password',
            '--display_name=cywp-display-name',
          ])
      })

      it('should have the arguments to create user with custom nicename', () => {
        user.create({
          userLogin: 'cywp-user',
          userPass: 'cywp-password',
          userNicename: 'cywp-nicename',
        })

        expect(user.wpUser)
          .toHaveBeenLastCalledWith([
            'create',
            '--porcelain',
            'cywp-user',
            'cywp-user@cywp.local',
            '--user_pass=cywp-password',
            '--user_nicename=cywp-nicename',
          ])
      })

      it('should have the arguments to create user with custom user url', () => {
        user.create({
          userLogin: 'cywp-user',
          userPass: 'cywp-password',
          userUrl: 'cywp-user-url',
        })

        expect(user.wpUser)
          .toHaveBeenLastCalledWith([
            'create',
            '--porcelain',
            'cywp-user',
            'cywp-user@cywp.local',
            '--user_pass=cywp-password',
            '--user_url=cywp-user-url',
          ])
      })

      it('should have the arguments to create user with custom nickname', () => {
        user.create({
          userLogin: 'cywp-user',
          userPass: 'cywp-password',
          nickname: 'cywp-nickname',
        })

        expect(user.wpUser)
          .toHaveBeenLastCalledWith([
            'create',
            '--porcelain',
            'cywp-user',
            'cywp-user@cywp.local',
            '--user_pass=cywp-password',
            '--nickname=cywp-nickname',
          ])
      })

      it('should have the arguments to create user with custom first name', () => {
        user.create({
          userLogin: 'cywp-user',
          userPass: 'cywp-password',
          firstName: 'cywp-first-name',
        })

        expect(user.wpUser)
          .toHaveBeenLastCalledWith([
            'create',
            '--porcelain',
            'cywp-user',
            'cywp-user@cywp.local',
            '--user_pass=cywp-password',
            '--first_name=cywp-first-name',
          ])
      })

      it('should have the arguments to create user with custom last name', () => {
        user.create({
          userLogin: 'cywp-user',
          userPass: 'cywp-password',
          lastName: 'cywp-last-name',
        })

        expect(user.wpUser)
          .toHaveBeenLastCalledWith([
            'create',
            '--porcelain',
            'cywp-user',
            'cywp-user@cywp.local',
            '--user_pass=cywp-password',
            '--last_name=cywp-last-name',
          ])
      })

      it('should have the arguments to create user with custom description', () => {
        user.create({
          userLogin: 'cywp-user',
          userPass: 'cywp-password',
          description: 'cywp-description',
        })

        expect(user.wpUser)
          .toHaveBeenLastCalledWith([
            'create',
            '--porcelain',
            'cywp-user',
            'cywp-user@cywp.local',
            '--user_pass=cywp-password',
            '--description=cywp-description',
          ])
      })

      it('should have the arguments to create user with custom role', () => {
        user.create({
          userLogin: 'cywp-user',
          userPass: 'cywp-password',
          role: 'cywp-role',
        })

        expect(user.wpUser)
          .toHaveBeenLastCalledWith([
            'create',
            '--porcelain',
            'cywp-user',
            'cywp-user@cywp.local',
            '--user_pass=cywp-password',
            '--role=cywp-role',
          ])
      })

      it('should have the arguments to create user with custom registered date', () => {
        user.create({
          userLogin: 'cywp-user',
          userPass: 'cywp-password',
          userRegistered: new Date(2020, 10, 10),
        })

        expect(user.wpUser)
          .toHaveBeenLastCalledWith([
            'create',
            '--porcelain',
            'cywp-user',
            'cywp-user@cywp.local',
            '--user_pass=cywp-password',
            '--user_registered=2020-11-10-00-00-00',
          ])
      })
    })
  })

  describe('#delete()', () => {
    it('should have the arguments to delete user', () => {
      user.delete(1)

      expect(user.wpUser).toHaveBeenLastCalledWith(['delete', '--yes', '1'])

      user.delete('user')

      expect(user.wpUser).toHaveBeenLastCalledWith(['delete', '--yes', 'user'])
    })

    it('should have the arguments to delete user and reassign posts', () => {
      user.delete(1, 12)

      expect(user.wpUser).toHaveBeenLastCalledWith(['delete', '--yes', '--reassign=12', '1'])
    })

    it('should have the arguments to delete multiple users', () => {
      user.delete([1, 12, 45])

      expect(user.wpUser).toHaveBeenLastCalledWith(['delete', '--yes', 1, 12, 45])
    })
  })

  describe('#get()', () => {
    it('should have the arguments to get user data', () => {
      user.wpUser = jest.fn((commands) => Promise.resolve({ stdout: JSON.stringify(commands) }))

      user.get('user')

      expect(user.wpUser)
        .toHaveBeenLastCalledWith([
          'get',
          '--format=json',
          '--fields=ID,user_login,display_name,user_email,user_registered,roles,user_pass,user_nicename,user_url,user_activation_key,user_status',
          'user',
        ])
    })
  })

  describe('#list()', () => {
    it('should have the arguments to list users', () => {
      user.wpUser = jest.fn((commands) => Promise.resolve({ stdout: JSON.stringify(commands) }))

      user.list()

      expect(user.wpUser)
        .toHaveBeenLastCalledWith([
          'list',
          '--format=json',
          '--fields=ID,user_login,display_name,user_email,user_registered,roles,user_pass,user_nicename,user_url,user_activation_key,user_status',
        ])
    })

    it('should have the arguments to list users with filters', () => {
      user.wpUser = jest.fn((commands) => Promise.resolve({ stdout: JSON.stringify(commands) }))

      user.list({ ID: 1 })

      expect(user.wpUser)
        .toHaveBeenLastCalledWith([
          'list',
          '--format=json',
          '--fields=ID,user_login,display_name,user_email,user_registered,roles,user_pass,user_nicename,user_url,user_activation_key,user_status',
          '--ID=1',
        ])
    })

    it('should throw error when filters is not object', () => {
      user.wpUser = jest.fn((commands) => Promise.resolve({ stdout: JSON.stringify(commands) }))

      expect(() => user.list('error')).toThrow(new TypeError('filters must be an object'))
    })
  })

  describe('#listCaps()', () => {
    it('should have the arguments to list user caps', () => {
      user.wpUser = jest.fn((commands) => Promise.resolve({ stdout: JSON.stringify(commands) }))

      user.listCaps('user')

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['list-caps', '--format=json', 'user'])
    })
  })

  describe('#removeCap()', () => {
    it('should have the arguments to remove caps', () => {
      user.removeCap('user', 'cap')

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['remove-cap', 'user', 'cap'])
    })
  })

  describe('#removeRole()', () => {
    it('should have the arguments to remove role', () => {
      user.removeRole('user', 'role')

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['remove-role', 'user', 'role'])
    })
  })

  describe('#setRole()', () => {
    it('should have the arguments to set role', () => {
      user.setRole('user', 'updated-role')

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['set-role', 'user', 'updated-role'])
    })
  })

  describe('#spam()', () => {
    it('should have the arguments to set user as spam', () => {
      user.spam('user')

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['spam', 'user'])
    })

    it('should have the arguments to set user as spam with user id as parameter', () => {
      user.spam(1)

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['spam', '1'])
    })

    it('should have the arguments to set multiple user as spam', () => {
      user.spam(['user', 1])

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['spam', 'user', 1])
    })
  })

  describe('#unspam()', () => {
    it('should have the arguments to unspam user', () => {
      user.unspam('user')

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['unspam', 'user'])
    })

    it('should have the arguments to unspam user with user id as parameter', () => {
      user.unspam(1)

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['unspam', '1'])
    })

    it('should have the arguments to unspam multiple users', () => {
      user.unspam(['user', 1])

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['unspam', 'user', 1])
    })
  })

  describe('#update()', () => {
    it('should throw error when user id in not given', () => {
      expect(() => user.update({})).toThrow(new TypeError('options.user must be provided'))

      expect(() => user.update()).toThrow(new TypeError('options.user must be provided'))
    })

    it('should throw error when user Registered date is not date object', () => {
      expect(() => user.update({ user: 'user', userRegistered: 'error' })).toThrow(new TypeError('options.userRegistered must be instance of Date!'))
    })

    it('should have the arguments to update user', () => {
      user.update({ user: 'user' })

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['update', '--skip-email', 'user'])
    })

    it('should have the arguments to update user with user id as parameter', () => {
      user.update({ user: 1 })

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['update', '--skip-email', '1'])
    })

    it('should have the arguments to update multiple users', () => {
      user.update({ user: ['user', 1] })

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['update', '--skip-email', 'user', 1])
    })

    it('should have the arguments to update user description', () => {
      user.update({ user: 'user', description: 'user-description' })

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['update', '--skip-email', 'user', '--description=user-description'])
    })

    it('should have the arguments to update user registered date', () => {
      user.update({ user: 'user', userRegistered: new Date(2020, 10, 10) })

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['update', '--skip-email', 'user', '--user_registered=2020-11-10-00-00-00'])
    })

    it('should have the arguments to update user display name', () => {
      user.update({ user: 'user', displayName: 'user-display-name' })

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['update', '--skip-email', 'user', '--display_name=user-display-name'])
    })

    it('should have the arguments to update user first name', () => {
      user.update({ user: 'user', firstName: 'user-first-name' })

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['update', '--skip-email', 'user', '--first_name=user-first-name'])
    })

    it('should have the arguments to update user last name', () => {
      user.update({ user: 'user', lastName: 'user-last-name' })

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['update', '--skip-email', 'user', '--last_name=user-last-name'])
    })

    it('should have the arguments to update user nickname', () => {
      user.update({ user: 'user', nickname: 'user-nickname' })

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['update', '--skip-email', 'user', '--nickname=user-nickname'])
    })

    it('should have the arguments to update user role', () => {
      user.update({ user: 'user', role: 'user-role' })

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['update', '--skip-email', 'user', '--role=user-role'])
    })

    it('should have the arguments to update user email', () => {
      user.update({ user: 'user', userEmail: 'user-email' })

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['update', '--skip-email', 'user', '--user_email=user-email'])
    })

    it('should have the arguments to update user nicename', () => {
      user.update({ user: 'user', userNicename: 'user-nicename' })

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['update', '--skip-email', 'user', '--user_nicename=user-nicename'])
    })

    it('should have the arguments to update user password', () => {
      user.update({ user: 'user', userPass: 'user-password' })

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['update', '--skip-email', 'user', '--user_pass=user-password'])
    })

    it('should have the arguments to update user url', () => {
      user.update({ user: 'user', userUrl: 'user-url' })

      expect(user.wpUser)
        .toHaveBeenLastCalledWith(['update', '--skip-email', 'user', '--user_url=user-url'])
    })
  })
})
