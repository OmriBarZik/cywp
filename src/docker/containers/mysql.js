const Container = require('./container')

class MysqlContainer extends Container {
  constructor (name, port) {
    super({
      image: 'mysql:5.7',
      name: `cywp-${name}`,
      network: 'cywp',
      exposePorts: [
        { host: port, docker: 3306 }
      ],
      environmentVariables: [
        { name: 'MYSQL_ROOT_PASSWORD', value: 'cywp' }
      ]
    })
  }
}

module.exports = MysqlContainer
