
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

module.exports = { CheckIfArrayOrString }
