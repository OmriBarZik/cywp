require('./types')
const { CreateWordpressCliContainer } = require('../docker/presets/containers')
const { FormatToWordpressDate, CheckIfArrayOrString } = require('./util')

class UserMeta {
  /**
   * Constructor for the UserMeta object.
   *
   * @param {(commands: string) => Promise<RunInContainerOutput>} wpUser - the wpUser user command.
   */
  constructor (wpUser) {
    /** @type {(commands: string) => Promise<RunInContainerOutput>} */
    this.wpUserMeta = (commands) => wpUser(commands.concat('meta'))
  }

  /**
   * Adds a meta field.
   *
   * @param {string} user - The user login, user email, or user ID of the user to add metadata for.
   * @param {string} key - The metadata key.
   * @param {string} value - The new metadata value.
   * @returns {Promise<RunInContainerOutput>} The command output.
   */
  add (user, key, value) {
    const addArgs = ['add', user, key, value]

    return this.wpUserMeta(addArgs)
  }

  /**
   * Deletes a meta field.
   *
   * @param {string} user - The user login, user email, or user ID of the user to delete metadata from.
   * @param {string} key - he metadata key.
   * @returns {Promise<RunInContainerOutput>} The command output.
   */
  delete (user, key) {
    const deleteArgs = ['delete', user, key]

    return this.wpUserMeta(deleteArgs)
  }

  /**
   * Gets meta field value.
   *
   * @param {string} user - The user login, user email, or user ID of the user to get metadata for.
   * @param {string} key - The metadata key.
   * @returns {Promise<any>} The command output.
   */
  get (user, key) {
    const getArgs = ['get', '--format=json', user, key]

    return this.wpUserMeta(getArgs)
      .then(output => JSON.parse(output.stdout))
  }

  /**
   * Lists all metadata associated with a user.
   *
   * @param {string} user - The user login, user email, or user ID of the user to get metadata for.
   * @returns {Promise<{user_id: number, meta_key: string, meta_value: string}>} list of the user metadata
   */
  list (user) {
    const listArgs = ['list', '--format=json', user]

    return this.wpUserMeta(listArgs)
      .then(output => JSON.parse(output))
  }

  /**
   * @param {string|number} user - The user login, user email, or user ID of the user to update metadata for.
   * @param {string} key - The metadata key.
   * @param {string} value - The new metadata value.
   */
  update (user, key, value) {
    const updateArgs = ['update', user, key, value]

    this.wpUserMeta(updateArgs)
  }
}

class User {
  /**
   * Constructor for the User object.
   *
   * @param {import('../docker/container')} site - the wordpress site to work on.
   */
  constructor (site) {
    this.site = site
    this.Meta = new UserMeta(this.wpUser)
  }

  /**
   * Run wp user command on a wp cli continer that connect to the site provied in the constructor.
   *
   * @param {string[]} commands - commands passing to wp user.
   * @returns {Promise<RunInContainerOutput>} The output of the command.
   */
  wpUser (commands) {
    const args = ['wp', 'user'].concat(commands)

    return CreateWordpressCliContainer(this.site, args)
  }

  /**
   * Adds a capability to a user.
   *
   * @param {number|string} user - User ID, user email, or user login.
   * @param {string} cap - The capability to add.
   * @returns {Promise<RunInContainerOutput>} The output of the command.
   */
  addCap (user, cap) {
    const addCapArgs = ['add-cap', user, cap]

    return this.wpUser(addCapArgs)
  }

  /**
   * Adds a role for a user.
   *
   * @param {number|string} user - User ID, user email, or user login.
   * @param {string} cap - Add the specified role to the user.
   * @returns {Promise<RunInContainerOutput>} The output of the command.
   */
  addRole (user, cap) {
    const addRoleArgs = ['add-role', user, cap]

    return this.wpUser(addRoleArgs)
  }

  /**
   * Creates a new user.
   *
   * @param {object} options - Option to create new user.
   * @param {string} options.userLogin - The login of the user to create.
   * @param {string} options.userPass - The user password.
   * @param {'administrator'|'editor'|'author'|'contributor'|'subscriber'} options.role - The role of the user to create. Default: default role. Possible values include ‘administrator’, ‘editor’, ‘author’, ‘contributor’, ‘subscriber’.
   * @param {Date} [options.userRegistered] - The date the user registered. Default: current date.
   * @param {string} [options.displayName] - The display name.
   * @param {string} [options.userNicename] - A string that contains a URL-friendly name for the user. The default is the user’s username.
   * @param {string} [options.userUrl] - A string containing the user’s URL for the user’s web site.
   * @param {string} [options.nickname] - The user’s nickname, defaults to the user’s username.
   * @param {string} [options.firstName] - The user’s first name.
   * @param {string} [options.lastName] - The user’s last name.
   * @param {string} [options.description] - A string containing content about the user.
   * @param {string} [options.userEmail] - The email address of the user to create. default: `${options.userLogin}@cywp.local`
   * @returns {Promise<RunInContainerOutput>} Retruns newy created User id.
   */
  create (options) {
    const createArgs = ['add-role', '--porcelain']

    if (!options.userLogin) {
      throw new TypeError('option.userLogin must be provided!')
    }

    createArgs.push(options.userLogin)

    if (!options.userEmail) {
      options.userEmail = `${options.userLogin}@cywp.local`
    }

    createArgs.push(options.userEmail)

    if (!options.userPass) {
      throw new TypeError('option.userPass must be provided!')
    }

    createArgs.push(`--user_pass=${options.userPass}`)

    if (options.role) {
      createArgs.push(`--role=${options.role}`)
    }

    if (options.userRegistered) {
      if (!(options.userRegistered instanceof Date)) {
        throw new TypeError('options.userRegistered must be instance of Date!')
      }

      createArgs.push(`--user_registered=${FormatToWordpressDate(options.userRegistered)}`)
    }

    if (options.displayName) {
      createArgs.push(`--display_name=${options.displayName}`)
    }

    if (options.userNicename) {
      createArgs.push(`--user_nicename=${options.userNicename}`)
    }

    if (options.userUrl) {
      createArgs.push(`--user_url=${options.userUrl}`)
    }

    if (options.nickname) {
      createArgs.push(`--nickname=${options.nickname}`)
    }

    if (options.firstName) {
      createArgs.push(`--first_name=${options.firstName}`)
    }

    if (options.lastName) {
      createArgs.push(`--last_name=${options.lastName}`)
    }

    if (options.description) {
      createArgs.push(`--description=${options.description}`)
    }

    return this.wpUser(createArgs)
  }

  /**
   * Deletes one or more users from the current site.
   *
   * @param {string} user - The user login, user email, or user ID of the user(s) to delete.
   * @param {number} [reassign] -  User ID to reassign the posts to.
   * @returns {Promise<RunInContainerOutput>} The output of the command.
   */
  delete (user, reassign) {
    user = CheckIfArrayOrString(user)

    const deleteArgs = ['delete', '--yes']

    if (reassign) {
      deleteArgs.push(`--reassign=${reassign}`)
    }

    deleteArgs.push.apply(deleteArgs, user)

    return this.wpUser(deleteArgs)
  }

  /**
   * Get user data.
   *
   * @param {string} user - The user to get.
   * @returns {Promise<UserGetObject>} Current user data.
   */
  get (user) {
    const getArgs = [
      'get',
      '--format=json',
      '--fields=ID,user_login,display_name,user_email,user_registered,roles,user_pass,user_nicename,user_url,user_activation_key,user_status',
      user,
    ]

    return this.wpUser(getArgs)
      .then(output => JSON.parse(output.stdout))
  }

  /**
   * Return list of users in the wordpress site and there data.
   *
   * @param {UserGetObject} [filters] - Filter results based on the value of a field.
   * @returns {Promise<UserGetObject[]>} - List of users in the wordpress site.
   */
  list (filters) {
    const listArgs = [
      'list',
      '--format=json',
      '--fields=ID,user_login,display_name,user_email,user_registered,roles,user_pass,user_nicename,user_url,user_activation_key,user_status',
    ]

    if ('object' !== typeof filters) {
      throw new TypeError('filters must be an object')
    }

    for (const filtersField in filters) {
      listArgs.push(`--${filtersField}=${filters[filtersField]}`)
    }

    return this.wpUser(listArgs)
      .then(output => JSON.parse(output.stdout))
  }

  /**
   * Return the user's capabilities
   *
   * @param {string} user - User to check
   * @returns {Promise<{name: string}[]>} List of the user capabilities.
   */
  listCaps (user) {
    const listCapsArgs = ['list-caps', '--format=json', user]

    return this.wpUser(listCapsArgs)
      .then(output => JSON.parse(output.stdout))
  }
}

module.exports = User
