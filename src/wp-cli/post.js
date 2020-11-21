const { CreateWordpressCliContainer } = require('../docker/presets/containers')
const { CheckIfArrayOrNumber, FormatToWordpressDate } = require('./util')

/**
 * Adds, updates, deletes, and lists post custom fields.
 */
class PostMeta {
  /**
   * Constructor for the PostMeta object.
   *
   * @param {Post} post - the post object.
   */
  constructor (post) {
    /** @type {(commands: string[]) => Promise<RunInContainerOutput>} */
    this.wpPostMeta = (commands) => post.wpPost(['meta', ...commands])
  }

  /**
   * Adds a meta field.
   *
   * @param {number} post - The ID of the post.
   * @param {string} key -The name of the meta field to create.
   * @param {string} [value] - The value of the meta field. If omitted, the value is read from STDIN.
   * @returns {Promise<RunInContainerOutput>} The command output.
   */
  add (post, key, value) {
    const addArgs = ['add', post, key]

    if (value) { addArgs.push(value) }

    return this.wpPostMeta(addArgs)
  }

  /**
   * Deletes a meta field.
   *
   * @param {number} post - The ID of the post.
   * @param {string|'all'} key - The name of the meta field to delete. pass "all" to delete all meta for the post
   * @returns {Promise<RunInContainerOutput>} The command output.
   */
  delete (post, key) {
    const deleteArgs = ['delete', post]

    if ('all' === key) { key = '--all' }

    deleteArgs.push(key)

    return this.wpPostMeta(deleteArgs)
  }

  /**
   * Gets meta field value.
   *
   * @param {number} post - The ID of the post.
   * @param {string} key - The name of the meta field to get.
   * @returns {Promise<any>} The command output.
   */
  get (post, key) {
    const getArgs = ['get', '--format=json', post, key]

    return this.wpPostMeta(getArgs)
      .then(output => JSON.parse(output.stdout))
  }

  /**
   * Lists all metadata associated with a post.
   *
   * @param {number} post - The ID of the post.
   * @returns {Promise<{post_id: number, meta_key: string, meta_value: string}>} list of the post metadata
   */
  list (post) {
    const listArgs = ['list', '--format=json', post]

    return this.wpPostMeta(listArgs)
      .then(output => JSON.parse(output.stdout))
  }

  /**
   * Updates a meta field.
   *
   * @param {number} post - The ID of the post.
   * @param {string} key - The metadata key.
   * @param {string} [value] - The new metadata value.
   * @returns {Promise<RunInContainerOutput>} The command output.
   */
  update (post, key, value) {
    const updateArgs = ['update', post, key]

    if (value) { updateArgs.push(value) }

    return this.wpPostMeta(updateArgs)
  }
}

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
    this.meta = new PostMeta(this)
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
   * @param {object} option - option object to create a post.
   * @param {number} option.postAuthor - he ID of the user who added the post. Default is the current user ID.
   * @param {Date} option.postDate - The date of the post. Default is the current time.
   * @param {Date} option.postDateGmt - The date of the post in the GMT timezone. Default is the value of $post_date.
   * @param {string} option.postContent - The post content. Default empty.
   * @param {string} option.postContentFiltered - The filtered post content. Default empty.
   * @param {string} option.postTitle - The post title. Default empty.
   * @param {string} option.postExcerpt - The post excerpt. Default empty.
   * @param {string} option.postStatus - The post status. Default ‘draft’.
   * @param {string} option.postType - The post type. Default ‘post’.
   * @param {'open'|'closed'} option.commentStatus - Whether the post can accept comments. Accepts ‘open’ or ‘closed’. Default is the value of ‘default_comment_status’ option.
   * @param {'open'|'closed'} option.pingStatus - Whether the post can accept pings. Accepts ‘open’ or ‘closed’. Default is the value of ‘default_ping_status’ option.
   * @param {string} option.postPassword - The password to access the post. Default empty.
   * @param {string} option.postName - The post name. Default is the sanitized post title when creating a new post.
   * @param {number} option.fromPost - Post id of a post to be duplicated.
   * @param {string} option.toPing - Space or carriage return-separated list of URLs to ping. Default empty.
   * @param {string} option.pinged - Space or carriage return-separated list of URLs that have been pinged. Default empty.
   * @param {Date} option.postModified - The date when the post was last modified. Default is the current time.
   * @param {Date} option.postModifiedGmt - The date when the post was last modified in the GMT timezone. Default is the current time.
   * @param {number} option.postParent - Set this for the post it belongs to, if any. Default 0.
   * @param {number} option.menuOrder - The order the post should be displayed in. Default 0.
   * @param {string} option.postMimeType - The mime type of the post. Default empty.
   * @param {string} option.guid - Global Unique ID for referencing the post. Default empty.
   * @param {string[]} option.postCategory - Array of category names, slugs, or ID's. Defaults to value of the ‘default_category’ option.
   * @param {string[]} option.tagsInput - Array of tag names, slugs, or ID's. Default empty.
   * @param {string[]} option.taxInput - Array of taxonomy terms keyed by their taxonomy name. Default empty.
   * @param {object} option.metaInput - Array in JSON format of post meta values keyed by their post meta key. Default empty.
   * @returns {Promise<RunInContainerOutput>} Retruns newly created post id.
   */
  create (option) {
    const createArgs = ['create', '--porcelain']

    if (!option.postExcerpt && !option.postTitle && !option.postContent) {
      throw new TypeError('you must provide at least one of option.postExcerpt, option.postTitle or option.postContent')
    }

    if (option.commentStatus) { createArgs.push(`--comment_status=${option.commentStatus}`) }
    if (option.fromPost) { createArgs.push(`--from-post=${option.fromPost}`) }
    if (option.guid) { createArgs.push(`--guid=${option.guid}`) }
    if (option.menuOrder) { createArgs.push(`--menu_order=${option.menuOrder}`) }
    if (option.metaInput) { createArgs.push(`--meta_input='${JSON.stringify(option.metaInput)}'`) }
    if (option.pingStatus) { createArgs.push(`--ping_status=${option.pingStatus}`) }
    if (option.pinged) { createArgs.push(`--pinged=${option.pinged}`) }
    if (option.postAuthor) { createArgs.push(`--post_author=${option.postAuthor}`) }
    if (option.postCategory) { createArgs.push(`--post_category=${option.postCategory}`) }
    if (option.postContent) { createArgs.push(`--post_content=${option.postContent}`) }
    if (option.postContentFiltered) { createArgs.push(`--post_content_filtered=${option.postContentFiltered}`) }
    if (option.postDate) { createArgs.push(`--post_date=${FormatToWordpressDate(option.postDate, 'option.postDate')}`) }
    if (option.postDateGmt) { createArgs.push(`--post_date_gmt=${FormatToWordpressDate(option.postDateGmt, 'option.postDateGmt')}`) }
    if (option.postExcerpt) { createArgs.push(`--post_excerpt=${option.postExcerpt}`) }
    if (option.postMimeType) { createArgs.push(`--post_mime_type=${option.postMimeType}`) }
    if (option.postModified) { createArgs.push(`--post_modified=${FormatToWordpressDate(option.postModified, 'option.postModified')}`) }
    if (option.postModifiedGmt) { createArgs.push(`--post_modified_gmt=${FormatToWordpressDate(option.postModifiedGmt, 'option.postModifiedGmt')}`) }
    if (option.postName) { createArgs.push(`--post_name=${option.postName}`) }
    if (option.postParent) { createArgs.push(`--post_parent=${option.postParent}`) }
    if (option.postPassword) { createArgs.push(`--post_password=${option.postPassword}`) }
    if (option.postStatus) { createArgs.push(`--post_status=${option.postStatus}`) }
    if (option.postTitle) { createArgs.push(`--post_title=${option.postTitle}`) }
    if (option.postType) { createArgs.push(`--post_type=${option.postType}`) }
    if (option.tagsInput) { createArgs.push(`--tags_input=${option.tagsInput}`) }
    if (option.taxInput) { createArgs.push(`--tax_input=${option.taxInput}`) }
    if (option.toPing) { createArgs.push(`--to_ping=${option.toPing}`) }

    return this.wpPost(createArgs)
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
      'get',
      '--fields="ID,post_title,post_name,post_date,post_status,post_author,post_date_gmt,post_content,post_excerpt,comment_status,ping_status,post_password,to_ping,pinged,post_modified,post_modified_gmt,post_content_filtered,post_parent,guid,menu_order,post_type,post_mime_type,comment_count"',
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
      '--fields=ID,post_title,post_name,post_date,post_status,post_author,post_date_gmt,post_content,post_excerpt,comment_status,ping_status,post_password,to_ping,pinged,post_modified,post_modified_gmt,post_content_filtered,post_parent,guid,menu_order,post_type,post_mime_type,comment_count,filter,url',
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

  /**
   * Updates one or more existing posts.
   *
   * @param {object} option - option object to create a post.
   * @param {number|number[]} option.id - One or more IDs of posts to update.
   * @param {number} option.postAuthor - he ID of the user who added the post. Default is the current user ID.
   * @param {Date} option.postDate - The date of the post. Default is the current time.
   * @param {Date} option.postDateGmt - The date of the post in the GMT timezone. Default is the value of $post_date.
   * @param {string} option.postContent - The post content. Default empty.
   * @param {string} option.postContentFiltered - The filtered post content. Default empty.
   * @param {string} option.postTitle - The post title. Default empty.
   * @param {string} option.postExcerpt - The post excerpt. Default empty.
   * @param {string} option.postStatus - The post status. Default ‘draft’.
   * @param {string} option.postType - The post type. Default ‘post’.
   * @param {'open'|'closed'} option.commentStatus - Whether the post can accept comments. Accepts ‘open’ or ‘closed’. Default is the value of ‘default_comment_status’ option.
   * @param {'open'|'closed'} option.pingStatus - Whether the post can accept pings. Accepts ‘open’ or ‘closed’. Default is the value of ‘default_ping_status’ option.
   * @param {string} option.postPassword - The password to access the post. Default empty.
   * @param {string} option.postName - The post name. Default is the sanitized post title when creating a new post.
   * @param {string} option.toPing - Space or carriage return-separated list of URLs to ping. Default empty.
   * @param {string} option.pinged - Space or carriage return-separated list of URLs that have been pinged. Default empty.
   * @param {Date} option.postModified - The date when the post was last modified. Default is the current time.
   * @param {Date} option.postModifiedGmt - The date when the post was last modified in the GMT timezone. Default is the current time.
   * @param {number} option.postParent - Set this for the post it belongs to, if any. Default 0.
   * @param {number} option.menuOrder - The order the post should be displayed in. Default 0.
   * @param {string} option.postMimeType - The mime type of the post. Default empty.
   * @param {string} option.guid - Global Unique ID for referencing the post. Default empty.
   * @param {string[]} option.postCategory - Array of category names, slugs, or ID's. Defaults to value of the ‘default_category’ option.
   * @param {string[]} option.tagsInput - Array of tag names, slugs, or ID's. Default empty.
   * @param {string[]} option.taxInput - Array of taxonomy terms keyed by their taxonomy name. Default empty.
   * @param {object} option.metaInput - Array in JSON format of post meta values keyed by their post meta key. Default empty.
   * @returns {Promise<RunInContainerOutput>} Retruns newly created post id.
   */
  update (option) {
    const createArgs = ['create']

    option.id = CheckIfArrayOrNumber(option.id, 'option.id')

    createArgs.push.apply(createArgs)

    if (option.commentStatus) { createArgs.push(`--comment_status=${option.commentStatus}`) }
    if (option.guid) { createArgs.push(`--guid=${option.guid}`) }
    if (option.menuOrder) { createArgs.push(`--menu_order=${option.menuOrder}`) }
    if (option.metaInput) { createArgs.push(`--meta_input='${JSON.stringify(option.metaInput)}'`) }
    if (option.pingStatus) { createArgs.push(`--ping_status=${option.pingStatus}`) }
    if (option.pinged) { createArgs.push(`--pinged=${option.pinged}`) }
    if (option.postAuthor) { createArgs.push(`--post_author=${option.postAuthor}`) }
    if (option.postCategory) { createArgs.push(`--post_category=${option.postCategory}`) }
    if (option.postContent) { createArgs.push(`--post_content=${option.postContent}`) }
    if (option.postContentFiltered) { createArgs.push(`--post_content_filtered=${option.postContentFiltered}`) }
    if (option.postDate) { createArgs.push(`--post_date=${FormatToWordpressDate(option.postDate, 'option.postDate')}`) }
    if (option.postDateGmt) { createArgs.push(`--post_date_gmt=${FormatToWordpressDate(option.postDateGmt, 'option.postDateGmt')}`) }
    if (option.postExcerpt) { createArgs.push(`--post_excerpt=${option.postExcerpt}`) }
    if (option.postMimeType) { createArgs.push(`--post_mime_type=${option.postMimeType}`) }
    if (option.postModified) { createArgs.push(`--post_modified=${FormatToWordpressDate(option.postModified, 'option.postModified')}`) }
    if (option.postModifiedGmt) { createArgs.push(`--post_modified_gmt=${FormatToWordpressDate(option.postModifiedGmt, 'option.postModifiedGmt')}`) }
    if (option.postName) { createArgs.push(`--post_name=${option.postName}`) }
    if (option.postParent) { createArgs.push(`--post_parent=${option.postParent}`) }
    if (option.postPassword) { createArgs.push(`--post_password=${option.postPassword}`) }
    if (option.postStatus) { createArgs.push(`--post_status=${option.postStatus}`) }
    if (option.postTitle) { createArgs.push(`--post_title=${option.postTitle}`) }
    if (option.postType) { createArgs.push(`--post_type=${option.postType}`) }
    if (option.tagsInput) { createArgs.push(`--tags_input=${option.tagsInput}`) }
    if (option.taxInput) { createArgs.push(`--tax_input=${option.taxInput}`) }
    if (option.toPing) { createArgs.push(`--to_ping=${option.toPing}`) }

    return this.wpPost(createArgs)
  }
}

module.exports = Post
