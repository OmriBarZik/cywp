require('./types')
const { ReturnPromise } = require('./util')
const Container = require('./container')
const Volume = require('./volume')
const Network = require('./network')
const { spawn } = require('child_process')

class Docker {
  /**
   * Create a docker container
   *
   * @param {ContainerOptions} options - docker container options
   * @param {boolean} run - should the container run at the instance of creation.
   * @returns {Promise<Container>} return promise for continer object
   */
  CreateContainer (options, run = false) {
    let stdout = ''

    const args = processCreateContainerOptions(options, run)

    const process = spawn('docker', args)

    process.stdout.on('data', (data) => {
      stdout += data
    })

    return ReturnPromise(process, () => {
      options.id = stdout.replace('\n', '')
      options.status = run ? 'started' : 'created'

      return new Container(options)
    })
  }

  /**
   * Create docker volume.
   *
   * @param {string} name - Name of the volume.
   * @returns {Promise<Volume>} return promise for volume object.
   */
  CreateVolume (name) {
    let stdout = ''

    const process = spawn('docker', ['volume', 'create', name])

    process.stdout.on('data', (data) => {
      stdout += data
    })

    return ReturnPromise(process, () => {
      const options = {}
      options.name = stdout.replace('\n', '')
      options.status = 'alive'

      return new Volume(options)
    })
  }

  /**
   * Create docker network.
   *
   * @param {NetworkOption | string} options - gfch
   * @returns {Promise<Network>} return promise for network object.
   */
  CreateNetwork (options) {
    let stdout = ''

    if ('string' === typeof options) {
      options = { name: options }
    }

    const args = ProcessCreateNetworkOption(options)

    const process = spawn('docker', args)

    process.stdout.on('data', (data) => {
      stdout += data
    })

    return ReturnPromise(process, () => {
      options.id = stdout.replace('\n', '')
      options.status = 'alive'

      return new Network(options)
    })
  }
}

/**
 * Create from the option object string array of arguments for the spwan function.
 *
 * @param {ContainerOptions} options - docker container options
 * @param {boolean} run - should the container run at the instance of creation.
 * @returns {string[]} array of arguments
 */
function processCreateContainerOptions (options, run) {
  const args = run ? ['container', 'run', '--detach'] : ['container', 'create']

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

/**
 * Create from the option object string array of arguments for the spwan function.
 *
 * @param {NetworkOption} options - docker network options
 * @returns {string[]} array of arguments
 */
function ProcessCreateNetworkOption (options) {
  const args = ['network', 'create']

  if (!options || !options.name) {
    throw new Error('options.name must be provided!\nexample:\nnew Network({ name: \'cywp-network\' })')
  }

  args.push(options.name)

  return args
}

module.exports = { Docker, processCreateContainerOptions, ProcessCreateNetworkOption }
