const { CreateWordpressCliContainer } = require('../../src/docker/presets/containers')
const Post = require('../../src/wp-cli/post')

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

    it('should have the arguments to create post with post excerpt', () => {
      post.create({ postExcerpt: 'excerpt' })

      expect(post.wpPost)
        .toHaveBeenLastCalledWith(['create', '--porcelain', '--post_excerpt=excerpt'])
    })
  })
})
