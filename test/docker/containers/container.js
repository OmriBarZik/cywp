const assert = require('assert')
const { Container } = require('../../../src/docker/containers/container')

describe('Container', function () {
  describe('#processOptions()', function () {
    let processOptions

    before(function () {
      processOptions = Container.prototype.processOptions
    })

    it('should throw error when value not present', function () {
      assert.throws(() => { processOptions() }, Error, 'options.image must be provided!\nexample:\nnew Container({image = \'wordpress:latest\'})')
    })

    it('should throw error when image value is not present', function () {
      assert.throws(() => { processOptions({}) }, Error, 'options.image must be provided!\nexample:\nnew Container({image = \'wordpress:latest\'})')

      assert.throws(() => { processOptions({ iamge: '' }) }, Error, 'options.image must be provided!\nexample:\nnew Container({image = \'wordpress:latest\'})')
    })

    it('should throw error when volumes is not an array', function () {
      assert.throws(() => { processOptions({ image: 'test', volumes: 'fail test' }) },
        Error, 'options.volumes must be an array\nexample:\nnew Container({\n\tvolumes: [\n\t\t{ host: \'./example.js\', docker: \'/usr/bin/example.js\' }\n\t]\n})')
    })

    it('should throw error when volumes is not made of object array', function () {
      const errormassage = 'options.volumes must contain array of object with docker and host as properties\n\nexample:\nnew Container({\n\tvolumes: [\n\t\t{ host: \'./example.js\', docker: \'/usr/bin/example.js\' }\n\t]\n})'

      assert.throws(() => { processOptions({ image: 'test', volumes: [{}] }) }, Error, errormassage)

      assert.throws(() => { processOptions({ image: 'test', volumes: [{ docker: 'docker' }] }) }, Error, errormassage)

      assert.throws(() => { processOptions({ image: 'test', volumes: [{ host: 'host' }] }) }, Error, errormassage)
    })
  })
})
