require('../types')
const { spawn } = require('child_process')

class Container {
  /**
  * Create and run a new docker contianer.
  * @param {ContainerOptions} options the docker container options
  */
  constructor (options) {
    this.options = options
  }

  close () {

  }
}

// const pop = new Container({
//   exposePorts: [{ docker: 80, host: 8080 }],
//   environmentVariables: [
//     { name: 'WORDPRESS_DB_HOST', value: 'cywp-mysql:3306' },
//     { name: 'WORDPRESS_DB_PASSWORD', value: 'cywp' },
//     { name: 'WORDPRESS_DB_NAME', value: 'cywp-twentyseventeen-db' }
//   ],
//   volumes: [
//     { host: 'cywp-twentyseventeen-volume', docker: '/var/www/html' }
//   ],
//   image: 'wordpress',
//   network: 'cywp-network',
//   name: 'cywp-twentyseventeen'
// })

module.exports = Container
