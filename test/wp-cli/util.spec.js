const { CheckIfArrayOrString } = require('../../src/wp-cli/util')

describe('util', () => {
  describe('#CheckIfArrayOrString()', () => {
    it('should return an array', () => {
      expect(CheckIfArrayOrString(['item'])).toContain('item')
      expect(CheckIfArrayOrString('item')).toContain('item')
    })

    it('should throw an error when item is not array or string', () => {
      expect(() => CheckIfArrayOrString(1)).toThrow()
    })

    it('should throw an error with massage when item is not array or string', () => {
      expect(() => CheckIfArrayOrString(1, 'fail')).toThrow('fail must be an array or a string')
    })
  })
})
