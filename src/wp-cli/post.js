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
   * Creates a new post.
   *
   * @param {object} option
   * @param {string} option.postAuthor - he ID of the user who added the post. Default is the current user ID.
   * @param {Date} option.post_date - The date of the post. Default is the current time.
   * @param {Date} option.post_date_gmt - The date of the post in the GMT timezone. Default is the value of $post_date.
   * @param {string} option.post_content - The post content. Default empty.
   * @param {string} option.post_content_filtered - The filtered post content. Default empty.
   * @param {string} option.post_title - The post title. Default empty.
   * @param {string} option.post_excerpt - The post excerpt. Default empty.
   * @param {string} option.post_status - The post status. Default ‘draft’.
   * @param {string} option.post_type - The post type. Default ‘post’.
   * @param {string} option.comment_status - Whether the post can accept comments. Accepts ‘open’ or ‘closed’. Default is the value of ‘default_comment_status’ option.
   * @param {string} option.ping_status - Whether the post can accept pings. Accepts ‘open’ or ‘closed’. Default is the value of ‘default_ping_status’ option.
   * @param {string} option.post_password - The password to access the post. Default empty.
   * @param {string} option.post_name - The post name. Default is the sanitized post title when creating a new post.
   * @param {number} option.from_post - Post id of a post to be duplicated.
   * @param {string} option.to_ping - Space or carriage return-separated list of URLs to ping. Default empty.
   * @param {string} option.pinged - Space or carriage return-separated list of URLs that have been pinged. Default empty.
   * @param {Date} option.post_modified - The date when the post was last modified. Default is the current time.
   * @param {Date} option.post_modified_gmt - The date when the post was last modified in the GMT timezone. Default is the current time.
   * @param {number} option.post_parent - Set this for the post it belongs to, if any. Default 0.
   * @param {number} option.menu_order - The order the post should be displayed in. Default 0.
   * @param {string} option.post_mime_type - The mime type of the post. Default empty.
   * @param {string} option.guid - Global Unique ID for referencing the post. Default empty.
   * @param {string[]} option.post_category - Array of category names, slugs, or ID's. Defaults to value of the ‘default_category’ option.
   * @param {string[]} option.tags_input - Array of tag names, slugs, or ID's. Default empty.
   * @param {string[]} option.tax_input - Array of taxonomy terms keyed by their taxonomy name. Default empty.
   * @param {object[]} option.meta_input - Array in JSON format of post meta values keyed by their post meta key. Default empty.
   * @returns {Promise<number>} The new post id.
   */
  create (option) {

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
   * Gets details about a post.
   *
   * @param {number} post The ID of the post to get.
   * @returns {PluginGetObject} Details about the post.
   */
  get (post) {
    const getArgs = [
      'list',
      '--fields=--fields=ID,post_title,post_name,post_date,post_status,post_author,post_date_gmt,post_content,post_excerpt,comment_status,ping_status,post_password,to_ping,pinged,post_modified,post_modified_gmt,post_content_filtered,post_parent,guid,menu_order,post_type,post_mime_type,comment_count', // eslint-disable-line spellcheck/spell-checker
      '--format=json',
      post,
    ]

    return this.wpPost(getArgs)
      .then(output => JSON.parse(output.stdout))
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
