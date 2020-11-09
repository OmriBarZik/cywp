const { CheckIfArrayOrString, FormatToWordpressDate } = require('../../src/wp-cli/util')

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

  describe('#FormatToWordpressDate()', () => {
    it('should return valid wordpress date with dates numbers smaller then 10', () => {
      const date = new Date(2020, 5, 6, 2, 8, 3)

      expect(FormatToWordpressDate(date)).toBe('2020-06-06-02-08-03')
    })

    it('should return valid wordpress date with dates numbers bigger then 10', () => {
      const date = new Date(2020, 11, 20, 20, 40, 50)

      expect(FormatToWordpressDate(date)).toBe('2020-12-20-20-40-50')
    })
  })
})
