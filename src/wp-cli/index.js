const { CreateWordpressCliContainer } = require('../docker/presets/containers')
require('./types')
const Plugin = require('./plugin')
const Theme = require('./theme')
const User = require('./user')

class WPCLI {
  /**
   * Constructor for the WPCLI object.
   *
   * @param {import('../docker/container')} site - the wordpress site to work on.
   */
  constructor (site) {
    this.site = site

    this.plugin = new Plugin(site)
    this.theme = new Theme(site)
    this.user = new User(site)

    Plugin.prototype.wpPlugin = (commands) => {
      return this.wp(['plugin'].concat(commands))
    }

    Theme.prototype.wpTheme = (commands) => {
      return this.wp(['theme'].concat(commands))
    }

    User.prototype.wpUser = (commands) => {
      return this.wp(['user'].concat(commands))
    }
  }

  wp (commands) {
    const args = ['wp'].concat(commands)

    return CreateWordpressCliContainer(this.site, args)
  }
}

module.exports = WPCLI
