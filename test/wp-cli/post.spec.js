const { CreateWordpressCliContainer } = require('../../src/docker/presets/containers')
const Post = require('../../src/wp-cli/post')
const { FormatToWordpressDate } = require('../../src/wp-cli/util')

jest.mock('../../src/docker/presets/containers')

describe('Post', () => {
  /** @type {Post} */
  let post
  let originalWpPost

  beforeAll(() => {
    post = new Post()
    originalWpPost = post.wpPost
  })

  beforeEach(async () => {
    post.wpPost = jest.fn()
  })

  describe('#wpPost()', () => {
    beforeEach(() => {
      post.wpPost = originalWpPost
    })

    it('should have the arguments wp plugin', () => {
      post.wpPost([])

      expect(CreateWordpressCliContainer)
        .toHaveBeenLastCalledWith(undefined, ['wp', 'post'])
    })
  })

  describe('#create()', () => {
    it('should throw error when postExcerpt, postTitle and postContent are not given', () => {
      expect(() => post.create()).toThrow(new TypeError('you must provide at least one of option.postExcerpt, option.postTitle or option.postContent'))
      expect(() => post.create({})).toThrow(new TypeError('you must provide at least one of option.postExcerpt, option.postTitle or option.postContent'))
    })

    it('should have the arguments to create post with post comment status', () => {
      post.create({ postTitle: 'title', commentStatus: 'open' })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', '--comment_status=open'])
    })

    it('should have the arguments to create post with from post', () => {
      post.create({ postTitle: 'title', fromPost: 1 })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', '--from-post=1'])
    })

    it('should have the arguments to create post with guid', () => {
      post.create({ postTitle: 'title', guid: 'guid-example' })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', '--guid=guid-example'])
    })

    it('should have the arguments to create post with menu order', () => {
      post.create({ postTitle: 'title', menuOrder: 'menu-order-example' })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', '--menu_order=menu-order-example'])
    })

    it('should have the arguments to create post with meta input', () => {
      post.create({ postTitle: 'title', metaInput: { menuOrder: 'example' } })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', '--meta_input={"menuOrder":"example"}'])
    })

    it('should have the arguments to create post with ping status', () => {
      post.create({ postTitle: 'title', pingStatus: 'ping-status-example' })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', '--ping_status=ping-status-example'])
    })

    it('should have the arguments to create post with pinged', () => {
      post.create({ postTitle: 'title', pinged: 'pinged-example' })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', '--pinged=pinged-example'])
    })

    it('should have the arguments to create post with author', () => {
      post.create({ postTitle: 'title', postAuthor: 'post-author-example' })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', '--post_author=post-author-example'])
    })

    it('should have the arguments to create post with content', () => {
      post.create({ postTitle: 'title', postContent: 'post-content-example' })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', '--post_content=post-content-example'])
    })

    it('should have the arguments to create post with post content filtered', () => {
      post.create({ postTitle: 'title', postContentFiltered: 'post-content-filtered-example' })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', '--post_content_filtered=post-content-filtered-example'])
    })

    it('should have the arguments to create post with date', () => {
      const date = new Date(2020, 10, 11)
      const processedDate = FormatToWordpressDate(date)

      post.create({ postTitle: 'title', postDate: date })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', `--post_date=${processedDate}`])
    })

    it('should have the arguments to create post with date gmt', () => {
      const date = new Date(2020, 5, 6)
      const processedDate = FormatToWordpressDate(date)

      post.create({ postTitle: 'title', postDateGmt: date })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', `--post_date_gmt=${processedDate}`])
    })

    it('should have the arguments to create post with mime type', () => {
      post.create({ postTitle: 'title', postMimeType: 'post-mime-type-example' })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', '--post_mime_type=post-mime-type-example'])
    })

    it('should have the arguments to create post with modified date', () => {
      const date = new Date(2020, 5, 8)
      const processedDate = FormatToWordpressDate(date)

      post.create({ postTitle: 'title', postModified: date })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', `--post_modified=${processedDate}`])
    })

    it('should have the arguments to create post with modified gmt date', () => {
      const date = new Date(2020, 10, 6)
      const processedDate = FormatToWordpressDate(date)

      post.create({ postTitle: 'title', postModifiedGmt: date })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', `--post_modified_gmt=${processedDate}`])
    })

    it('should have the arguments to create post with name', () => {
      post.create({ postTitle: 'title', postName: 'name-example' })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', '--post_name=name-example'])
    })

    it('should have the arguments to create post with parent', () => {
      post.create({ postTitle: 'title', postParent: 'parent-example' })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', '--post_parent=parent-example'])
    })

    it('should have the arguments to create post with password', () => {
      post.create({ postTitle: 'title', postPassword: 'password-example' })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', '--post_password=password-example'])
    })

    it('should have the arguments to create post with status', () => {
      post.create({ postTitle: 'title', postStatus: 'status-example' })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', '--post_status=status-example'])
    })

    it('should have the arguments to create post with title', () => {
      post.create({ postTitle: 'title-example' })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title-example'])
    })

    it('should have the arguments to create post with type', () => {
      post.create({ postTitle: 'title', postType: 'type-example' })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', '--post_type=type-example'])
    })

    it('should have the arguments to create post with to ping', () => {
      post.create({ postTitle: 'title', toPing: 'to-ping-example' })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', '--to_ping=to-ping-example'])
    })

    it('should have the arguments to create post with category', () => {
      post.create({ postTitle: 'title', postCategory: 'category-example' })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', '--post_category=category-example'])
    })

    it('should have the arguments to create post with multiple categories', () => {
      post.create({ postTitle: 'title', postCategory: ['category-example-1', 'category-example-2'] })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', '--post_category=category-example-1,category-example-2'])
    })

    it('should have the arguments to create post with tax input', () => {
      post.create({ postTitle: 'title', taxInput: 'tax-input-example' })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', '--tax_input=tax-input-example'])
    })

    it('should have the arguments to create post with multiple tax inputs', () => {
      post.create({ postTitle: 'title', taxInput: ['tax-input-example-1', 'tax-input-example-2'] })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', '--tax_input=tax-input-example-1,tax-input-example-2'])
    })

    it('should have the arguments to create post with tags input', () => {
      post.create({ postTitle: 'title', tagsInput: 'tags-input-example' })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', '--tags_input=tags-input-example'])
    })

    it('should have the arguments to create post with multiple tags input', () => {
      post.create({ postTitle: 'title', tagsInput: ['tags-input-example-1', 'tags-input-example-2'] })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_title=title', '--tags_input=tags-input-example-1,tags-input-example-2'])
    })

    it('should have the arguments to create post with post excerpt', () => {
      post.create({ postExcerpt: 'excerpt' })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_excerpt=excerpt'])
    })
  })
})
