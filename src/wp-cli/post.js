const { CreateWordpressCliContainer } = require('../docker/presets/containers')
const { CheckIfArrayOrNumber } = require('./util')

/**
 * Manages posts, content, and meta.
 */
class Post {
  /**
   * Constructor for the Post object.
   *
   * @param {import('../docker/container')} site - the wordpress site to work on.
   */
  constructor (site) {
    this.site = site
  }

  /**
   * Run wp post command on a wp cli continer that connect to the site provied in the constructor.
   *
   * @param {string[]} commands - commands passing to wp post.
   * @returns {Promise<RunInContainerOutput>} The output of the command.
   */
  wpPost (commands) {
    const args = ['wp', 'post'].concat(commands)

    return CreateWordpressCliContainer(this.site, args)
  }

  /**
   * Deletes an existing post.
   *
   * @param {number|number[]} post - One or more IDs of posts to delete.
   * @returns {Promise<RunInContainerOutput>} The output on the command.
   */
  delete (post) {
    post = CheckIfArrayOrNumber(post)

    const deleteArgs = ['delete', '--force']

    deleteArgs.push.apply(deleteArgs, post)

    return this.wpPost(deleteArgs)
  }

  /**
   * Verifies whether a post exists.
   *
   * @param {number} post - The ID of the post to check.
   * @returns {Promise<boolean>} Whether the post exists.
   */
  exists (post) {
    const existsArgs = ['exists', post]

    return this.wpPost(existsArgs)
      .then(() => true)
      .catch(() => Promise.resolve(false))
  }

  /**
   * Gets a list of posts.
   *
   * @param {PluginListFiltersObject} filters -Limit the output to specific object fields.
   * @returns {PluginListFiltersObject[]} list of posts that mach the filters.
   */
  list (filters) {
    const listArgs = [
      'list',
      '--fields=ID,post_title,post_name,post_date,post_status,post_author,post_date_gmt,post_content,post_excerpt,comment_status,ping_status,post_password,to_ping,pinged,post_modified,post_modified_gmt,post_content_filtered,post_parent,guid,menu_order,post_type,post_mime_type,comment_count,filter,url', // eslint-disable-line spellcheck/spell-checker
      '--format=json',
    ]

    if ('object' !== typeof filters) {
      throw new TypeError('filters must be an object')
    }

    for (const filtersField in filters) {
      listArgs.push(`--${filtersField}=${filters[filtersField]}`)
    }

    return this.wpPost(listArgs)
      .then(output => JSON.parse(output.stdout))
  }
}

module.exports = Post
