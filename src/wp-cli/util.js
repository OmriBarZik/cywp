
/**
 * Checks if the given value is an array or string.
 *
 * @param {string | Array} item - the items to be checked.
 * @param {string} purpose - use to determent what to throw is the items isn't valid.
 * @returns {Array} Array that contined a vlive item / items.
 */
function CheckIfArrayOrString (item, purpose) {
  if ('string' === typeof item) {
    item = [item]
  }

  if (!Array.isArray(item)) {
    throw new TypeError(`${purpose} must be an array or a string`)
  }

  return item
}

/**
 * Format the date to yyyy-mm-dd-hh-ii-ss style.
 *
 * @param {Date} date - the date to format.
 * @returns {string} formatted string.
 */
function FormatToWordpressDate (date) {
  const twoDigits = (number) => 10 > number ? '0' + number : number

  return [
    date.getFullYear(),
    twoDigits(date.getMonth() + 1),
    twoDigits(date.getDate()),
    twoDigits(date.getHours()),
    twoDigits(date.getMinutes()),
    twoDigits(date.getSeconds()),
  ].join('-')
}

module.exports = { CheckIfArrayOrString, FormatToWordpressDate }
