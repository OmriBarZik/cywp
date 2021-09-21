require('./types')
const { CreateWordpressCliContainer } = require('../docker/presets/containers')
const { FormatToWordpressDate, CheckIfArrayOrString } = require('./util')
const UserMeta = require('./userMeta')

/**
 * Manages users, along with their roles, capabilities, and meta.
 */
class User {
  /**
   * Constructor for the User object.
   *
   * @param {import('../docker/container')} site - the wordpress site to work on.
   */
  constructor (site) {
    this.site = site
    this.Meta = new UserMeta(this)
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
   * @param {string} role - Add the specified role to the user.
   * @returns {Promise<RunInContainerOutput>} The output of the command.
   */
  addRole (user, role) {
    const addRoleArgs = ['add-role', user, role]

    return this.wpUser(addRoleArgs)
  }

  /**
   * Creates a new user.
   *
   * @param {object} options - Options to create new user.
   * @param {string} options.userLogin - The login of the user to create.
   * @param {string} options.userPass - The user password.
   * @param {'administrator'|'editor'|'author'|'contributor'|'subscriber'} [options.role] - The role of the user to create. Default: default role. Possible values include ‘administrator’, ‘editor’, ‘author’, ‘contributor’, ‘subscriber’.
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
  create (options = {}) {
    const createArgs = ['create', '--porcelain']

    if (!options.userLogin) {
      throw new TypeError('options.userLogin must be provided!')
    }

    createArgs.push(options.userLogin)

    if (!options.userEmail) {
      options.userEmail = `${options.userLogin}@cywp.local`
    }

    createArgs.push(options.userEmail)

    if (!options.userPass) {
      throw new TypeError('options.userPass must be provided!')
    }

    createArgs.push(`--user_pass=${options.userPass}`)

    if (options.userRegistered) {
      if (!(options.userRegistered instanceof Date)) {
        throw new TypeError('options.userRegistered must be instance of Date!')
      }

      createArgs.push(`--user_registered=${FormatToWordpressDate(options.userRegistered)}`)
    }

    if (options.role) { createArgs.push(`--role=${options.role}`) }
    if (options.displayName) { createArgs.push(`--display_name=${options.displayName}`) }
    if (options.userNicename) { createArgs.push(`--user_nicename=${options.userNicename}`) }
    if (options.userUrl) { createArgs.push(`--user_url=${options.userUrl}`) }
    if (options.nickname) { createArgs.push(`--nickname=${options.nickname}`) }
    if (options.firstName) { createArgs.push(`--first_name=${options.firstName}`) }
    if (options.lastName) { createArgs.push(`--last_name=${options.lastName}`) }
    if (options.description) { createArgs.push(`--description=${options.description}`) }

    return this.wpUser(createArgs)
  }

  /**
   * Deletes one or more users from the current site.
   *
   * @param {string|number} user - The user login, user email, or user ID of the user(s) to delete.
   * @param {number} [reassign] -  User ID to reassign the posts to.
   * @returns {Promise<RunInContainerOutput>} The output of the command.
   */
  delete (user, reassign) {
    if ('number' === typeof user) {
      user = user.toString()
    }

    user = CheckIfArrayOrString(user, 'user')

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
   * @param {string|number} user - The user to get.
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
  list (filters = {}) {
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
   * @param {string|number} user - User to check
   * @returns {Promise<Array<{name: string}>>} List of the user capabilities.
   */
  listCaps (user) {
    const listCapsArgs = ['list-caps', '--format=json', user]

    return this.wpUser(listCapsArgs)
      .then(output => JSON.parse(output.stdout))
  }

  /**
   * Removes a user's capability.
   *
   * @param {string|number} user - User ID, user email, or user login.
   * @param {string} cap - The capability to be removed.
   * @returns {Promise<RunInContainerOutput>} The output of the command.
   */
  removeCap (user, cap) {
    const removeCapArgs = ['remove-cap', user, cap]

    return this.wpUser(removeCapArgs)
  }

  /**
   * Removes a user's role.
   *
   * @param {string|number} user - User ID, user email, or user login.
   * @param {string} cap - A specific role to remove.
   * @returns {Promise<RunInContainerOutput>} The output of the command.
   */
  removeRole (user, cap) {
    const removeRoleArgs = ['remove-role', user, cap]

    return this.wpUser(removeRoleArgs)
  }

  /**
   * Sets the user role.
   *
   * @param {string} user - User ID, user email, or user login.
   * @param {string} role - Make the user have the specified role. If not passed, the default role is used.
   * @returns {Promise<RunInContainerOutput>} The output of the command.
   */
  setRole (user, role) {
    const setRoleArgs = ['set-role', user, role]

    return this.wpUser(setRoleArgs)
  }

  /**
   * Marks one or more users as spam.
   *
   * @param {string|number|number[]|string[]} user - One or more id's of users to mark as spam.
   * @returns {Promise<RunInContainerOutput>} The command output
   */
  spam (user) {
    if ('number' === typeof user) {
      user = user.toString()
    }

    user = CheckIfArrayOrString(user, 'user')

    const spamArgs = ['spam']

    spamArgs.push.apply(spamArgs, user)

    return this.wpUser(spamArgs)
  }

  /**
   * Removes one or more users from spam.
   *
   * @param {string|number|number[]|string[]} user - One or more IDs of users to remove from spam.
   * @returns {Promise<RunInContainerOutput>} The command output
   */
  unspam (user) {
    if ('number' === typeof user) {
      user = user.toString()
    }

    user = CheckIfArrayOrString(user, 'user')

    const args = ['unspam']

    args.push.apply(args, user)

    return this.wpUser(args)
  }

  /**
   * Updates an existing user.
   *
   * @param {object} options - Options to update user.
   * @param {string|number|string[]|number[]} options.user - The user login, user email or user ID of the user(s) to update.
   * @param {string} [options.userPass] - A string that contains the plain text password for the user.
   * @param {string} [options.userNicename] - A string that contains a URL-friendly name for the user. The default is the user’s username.
   * @param {string} [options.userUrl] - A string containing the user’s URL for the user’s web site.
   * @param {string} [options.userEmail] - A string containing the user’s email address.
   * @param {string} [options.displayName] - A string that will be shown on the site. Defaults to user’s username.
   * @param {string} [options.nickname] - The user’s nickname, defaults to the user’s username.
   * @param {string} [options.firstName] - The user’s first name.
   * @param {string} [options.lastName] - The user’s last name.
   * @param {string} [options.description] -A string containing content about the user.
   * @param {Date} [options.userRegistered] - The date the user registered.
   * @param {'administrator'|'editor'|'author'|'contributor'|'subscriber'} [options.role] - A string used to set the user’s role.
   * @returns {Promise<RunInContainerOutput>} the output of the command.
   */
  update (options = {}) {
    const updateArgs = ['update', '--skip-email']

    if (!options.user) {
      throw new TypeError('options.user must be provided')
    }

    if ('number' === typeof options.user) {
      options.user = options.user.toString()
    }

    options.user = CheckIfArrayOrString(options.user, 'options.user')

    updateArgs.push.apply(updateArgs, options.user)

    if (options.userRegistered) {
      if (!(options.userRegistered instanceof Date)) {
        throw new TypeError('options.userRegistered must be instance of Date!')
      }

      updateArgs.push(`--user_registered=${FormatToWordpressDate(options.userRegistered)}`)
    }

    if (options.description) { updateArgs.push(`--description=${options.description}`) }
    if (options.displayName) { updateArgs.push(`--display_name=${options.displayName}`) }
    if (options.firstName) { updateArgs.push(`--first_name=${options.firstName}`) }
    if (options.lastName) { updateArgs.push(`--last_name=${options.lastName}`) }
    if (options.nickname) { updateArgs.push(`--nickname=${options.nickname}`) }
    if (options.role) { updateArgs.push(`--role=${options.role}`) }
    if (options.userEmail) { updateArgs.push(`--user_email=${options.userEmail}`) }
    if (options.userNicename) { updateArgs.push(`--user_nicename=${options.userNicename}`) }
    if (options.userPass) { updateArgs.push(`--user_pass=${options.userPass}`) }
    if (options.userUrl) { updateArgs.push(`--user_url=${options.userUrl}`) }

    return this.wpUser(updateArgs)
  }
}

module.exports = User
