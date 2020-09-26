require('../types')
const { spawn } = require('child_process')

class Container {
  /**
  * Create and run a new docker contianer.
  * @param {ContainerOptions} options the docker container options
  */
  constructor (options) {
    const spawnArgs = this.processOptions(options)

    this.exposePorts = options.exposePorts
    this.environmentVariables = options.environmentVariables
    this.volumes = options.volumes
    this.network = options.network
    this.image = options.image
    this.name = options.name

    this.process = spawn('docker', spawnArgs)

    this.process.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })

    this.process.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`)
    })

    this.process.on('close', (code) => {
      console.log(`child process exited with code ${code}`)
    })
  }

  /**
   * Parse the container options
   * @param {ContainerOptions} options
   * @returns {string[]}
   */
  processOptions (options) {
    const args = ['run']

    if (!options || !options.image) {
      throw new Error('options.image must be provided!\nexample:\nnew Container({image = \'wordpress:latest\'})')
    }

    if (options.name) {
      args.push('--name', options.name)
    }

    if (options.network) {
      args.push('--net', options.network)
    }

    if (options.volumes) {
      const errorExample = 'example:\nnew Container({\n\tvolumes: [\n\t\t{ host: \'./example.js\', docker: \'/usr/bin/example.js\' }\n\t]\n})'

      if (!Array.isArray(options.volumes)) {
        throw new Error(`options.volumes must be an array\n${errorExample}`)
      }

      options.volumes.forEach(item => {
        if (!item.docker || !item.host) {
          throw new Error(`options.volumes must contain array of object with docker and host as properties\n${errorExample}`)
        }

        args.push('-v', `${item.host}:${item.docker}`)
      })
    }

    if (options.environmentVariables) {
      const errorExample = 'example:\nnew Container({\n\tenvironmentVariables: [\n\t\t{ name: \'DOCKER_ENV\', value: \'foo\' }\n\t]\n})'

      if (!Array.isArray(options.environmentVariables)) {
        throw new Error(`options.environmentVariables must be an array\n${errorExample}`)
      }

      options.environmentVariables.forEach(item => {
        if (!item.name || !item.value) {
          throw new Error(`options.environmentVariables must contain array of object with name and value as properties\n${errorExample}`)
        }

        args.push('-e', `${item.name}=${item.value}`)
      })
    }

    if (options.exposePorts) {
      const errorExample = 'example:\nnew Container({\n\texposePorts: [\n\t\t{ host: \'8080\', docker: \'80\' }\n\t]\n})'

      if (!Array.isArray(options.exposePorts)) {
        throw new Error(`options.exposePorts must be an array\n${errorExample}`)
      }

      options.exposePorts.forEach(item => {
        if (!item.host || !item.docker) {
          throw new Error(`options.volumes must contain array of object with docker and host as properties\n${errorExample}`)
        }

        args.push('-p', `${item.host}:${item.docker}`)
      })
    }

    args.push(options.image)

    return args
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
