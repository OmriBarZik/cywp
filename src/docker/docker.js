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
   * @param {ContainerOptions} options - Docker container options
   * @param {boolean} run - Should the container run at the instance of creation.
   * @param {boolean} detach - Should the Promise resolve when the container exits.
   * @returns {Promise<Container>} Return promise for continer object
   */
  CreateContainer (options, run = false, detach = true) {
    const args = processCreateContainerOptions(options, run, detach)

    const process = spawn('docker', args)

    return ReturnPromise(process, (stdout) => {
      options.id = cleanID(stdout)[0]
      options.status = run ? 'started' : 'created'

      if (options.rm) { options.status = 'removed' }

      return new Container(options)
    })
  }

  /**
   * Run commands in a docker container return it's output.
   *
   * @param {ContainerOptions} options - Docker container options.
   * @returns {Promise<RunInContainerOutput>} Container outputs.
   */
  RunInContainer (options) {
    if (!options.commands) {
      throw new TypeError('options.commands must be provided to use RunInContainer.')
    }

    if (!options.rm) {
      throw new TypeError('options.rm must be true to use RunInContainer. (we don\'t want to leave garbage aroud)')
    }

    const args = processCreateContainerOptions(options, true, false)

    const process = spawn('docker', args)

    return ReturnPromise(process, (stdout, stderr) => {
      return { stdout: stdout, stderr: stderr }
    })
  }

  /**
   * Create docker volume.
   *
   * @param {string} name - Name of the volume.
   * @returns {Promise<Volume>} return promise for volume object.
   */
  CreateVolume (name) {
    const process = spawn('docker', ['volume', 'create', name])

    return ReturnPromise(process, (stdout) => {
      const options = {}
      options.name = cleanID(stdout)[0]
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
    if ('string' === typeof options) {
      options = { name: options }
    }

    const args = ProcessCreateNetworkOption(options)

    const process = spawn('docker', args)

    return ReturnPromise(process, (stdout) => {
      options.id = cleanID(stdout)[0]
      options.status = 'alive'

      return new Network(options)
    })
  }

  /**
   * @param {ContainerOptions} options - the option of the container you want to attach to.
   *
   * @returns {Promise<Container>} - return the maching continer.
   */
  AttachContainer (options) {
    const attachContainerArgs = processAttachContainerOptions(options, false, false)

    // return attachContainerArgs

    const process = spawn('docker', attachContainerArgs)

    return ReturnPromise(process, (stdout, stderr) => {
      const ids = cleanID(stdout)

      if (!ids.length) {
        return Promise.reject(new Error('docker container not found'))
      }

      if (1 === ids.length && !(options.volumes || options.health || options.exposePorts || options.environmentVariables)) {
        return new Container(ids[0])
      }

      ids.map(id => new Container(Object.assign({ id: id }, options)).inspect())

      // return Promise.all(ids)
      //   .then(values => {

      //   })

      const filterIds = ids.filter((value) => {
        if (options.volumes) {

        }
        return true
      })

      if (!filterIds) {

      }

      if (!(options.volumes || options.health || options.exposePorts || options.environmentVariables)) {
        if (1 === ids.length) {
          return new Container(ids[0])
        }

        return Promise.reject(new Error(''))

        // return {
        //   stdout: cleanID(stdout),
        //   stderr: stderr,
        //   args: attachContainerArgs,
        //   options: options,
        // }
      }

      const containersInfo = []

      cleanID(stdout).forEach(id => {
        containersInfo.push(new Container({ id: id }).inspect())
      })

      return Promise.all(containersInfo)
        .then(infos => {
          infos.forEach(element => {

          })
        })
    })
  }
}

/**
 * Create from the option object string array of arguments for the spwan function.
 *
 * @param {ContainerOptions} options - Docker container options
 * @param {boolean} run - Should the container run at the instance of creation.
 * @param {boolean} detach - Should the container run with logs attached.
 * @returns {string[]} Array of arguments
 */
function processCreateContainerOptions (options, run, detach) {
  const args = run ? ['container', 'run', '--detach'] : ['container', 'create']

  if (run && !detach) {
    args.pop()
  }

  if (!options || !options.image) {
    throw new Error('options.image must be provided!\nexample:\nnew Container({image = \'wordpress:latest\'})')
  }

  if (options.name) {
    args.push('--name', options.name)
  }

  if (options.network) {
    args.push('--net', options.network)
  }

  if (options.health) {
    if (!options.health.command) {
      throw new TypeError('options.health.command must not be defined to use options.health')
    }

    args.push('--health-cmd', options.health.command)

    if (options.health.interval) {
      args.push('--health-interval', options.health.interval)
    }

    if (options.health.retries) {
      if (!Number.isInteger(options.health.retries)) {
        throw new TypeError('options.health.retries must be an integer.')
      }

      args.push('--health-retries', options.health.retries)
    }

    if (options.health.startPeriod) {
      args.push('--health-start-period', options.health.startPeriod)
    }

    if (options.health.timeout) {
      args.push('--health-timeout', options.health.timeout)
    }
  }

  if (options.rm) {
    args.push('--rm')
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

  if (options.commands) {
    if (!Array.isArray(options.commands)) {
      throw new TypeError('options.commands must be array of string.')
    }

    args.push.apply(args, options.commands)
  }

  return args
}

/**
 * @param {ContainerOptions} options - the option of the container you want to attach to.
 *
 * @returns {string[]} Array of arguments
 */
function processAttachContainerOptions (options) {
  processCreateContainerOptions(options, false, false)

  const args = ['container', 'ps', '-a', '--no-trunc', '-q']

  if (options.image) {
    args.push('--filter', `ancestor=${options.image}`)
  }

  if (options.id) {
    args.push('--filter', `id=${options.id}`)
  }

  if (options.name) {
    args.push('--filter', `name=^${options.name}$`)
  }

  if (options.network) {
    args.push('--filter', `network=^${options.network}$`)
  }

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

/**
 * clean and extract the id's from the output of the docker command.
 *
 * @param {string} stdout - the raw output of a docker command.
 *
 * @returns {string[]} the clean output.
 */
function cleanID (stdout) {
  return stdout.split('\n').filter((id) => !!id)
}

module.exports = { Docker, processCreateContainerOptions, ProcessCreateNetworkOption }
