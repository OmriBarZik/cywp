require('./types')

/**
 * Adds, updates, deletes, and lists user custom fields.
 */
class UserMeta {
  /**
   * Constructor for the UserMeta object.
   *
   * @param {import('./user')} user - the user object.
   */
  constructor (user) {
    this.user = user
  }

  wpUserMeta (commands) {
    return this.user.wpUser(['meta', ...commands])
  }

  /**
   * Adds a meta field.
   *
   * @param {string|number} user - The user login, user email, or user ID of the user to add metadata for.
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
   * @param {string|number} user - The user login, user email, or user ID of the user to delete metadata from.
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
   * @param {string|number} user - The user login, user email, or user ID of the user to get metadata for.
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
   * @param {string|number} user - The user login, user email, or user ID of the user to get metadata for.
   * @returns {Promise<{user_id: number, meta_key: string, meta_value: string}>} list of the user metadata
   */
  list (user) {
    const listArgs = ['list', '--format=json', user]

    return this.wpUserMeta(listArgs)
      .then(output => JSON.parse(output.stdout))
  }

  /**
   * Updates a meta field.
   *
   * @param {string|number} user - The user login, user email, or user ID of the user to update metadata for.
   * @param {string} key - The metadata key.
   * @param {string} value - The new metadata value.
   * @returns {Promise<RunInContainerOutput>} The command output.
   */
  update (user, key, value) {
    const updateArgs = ['update', user, key, value]

    return this.wpUserMeta(updateArgs)
  }
}

module.exports = UserMeta
