require('./types')
const Container = require('./containers/container')
const { spawn } = require('child_process')

class Docker {
  /**
   * Create docker container
   * @param {ContainerOptions} options docker container options
   * @returns {Promise<Container>} return promise for continer object
   */
  CreateContainer (options) {
    let stderr = ''
    let stdout = ''

    const args = processCreateContainerOptions(options)

    spawn('docker', args)

    this.process.stdout.on('data', (data) => {
      stdout += data
    })

    this.process.stderr.on('data', (data) => {
      stderr += data
    })

    this.process.on('close', (code) => {
      return new Promise((resolve, reject) => {
        if (code) {
          reject(stderr)
        }

        options.dockerId = stdout

        resolve(new Container(options))
      })
    })
  }
}

function processCreateContainerOptions (options) {
  const args = ['container', 'create']

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

module.exports = { Docker, processCreateContainerOptions }
