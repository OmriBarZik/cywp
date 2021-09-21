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
  async CreateContainer (options, run = false, detach = true) {
    const args = processCreateContainerOptions(options, run, detach)

    const container = await this.AttachContainer(options)

    if (container) {
      return container
    }

    const process = spawn('docker', args)

    return ReturnPromise(process, (stdout) => {
      options.id = cleanID(stdout)[0]
      options.status = run ? 'started' : 'created'

      if (options.rm) { options.status = 'removed' }

      if (!options.volumes) { options.volumes = [] }

      return Promise.all(options.volumes.map(({ ...volume }) => this.AttachVolume(volume.host)))
        .then(volumes => volumes.filter(volume => volume))
        .then(volumes => new Container(options, volumes))
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
   * Pull docker image.
   *
   * @param {string} image - Image to pull from docker hub.
   * @returns {Promise<string>} - iamge name when pull successfully.
   */
  pullImage (image) {
    const imagePull = spawn('docker', ['pull', image])

    return ReturnPromise(imagePull, () => image)
  }

  /**
   * Create docker volume.
   *
   * @param {string} name - Name of the volume.
   * @returns {Promise<Volume>} return promise for volume object.
   */
  async CreateVolume (name) {
    const volume = await this.AttachVolume(name)

    if (volume) {
      return volume
    }

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
   * @param {string} name - Name of the network.
   * @returns {Promise<Network>} return promise for network object.
   */
  async CreateNetwork (name) {
    if (!name) {
      throw new Error('name must be provided!')
    }

    const network = await this.AttachNetwork(name)

    if (network) {
      return network
    }

    const args = ['network', 'create', name]

    const process = spawn('docker', args)

    return ReturnPromise(process, (stdout) => {
      const options = {
        name: name,
        id: cleanID(stdout)[0],
        status: 'alive',
      }

      return new Network(options)
    })
  }

  /**
   * Returns the container that math the spesfection
   * the option must includ NAME or ID else the method will return NULL
   *
   * @param {ContainerOptions} options - the option of the container you want to attach to.
   * @returns {Promise<Container>} - return the first maching container.
   */
  AttachContainer (options) {
    const attachContainerArgs = processAttachContainerOptions(options)

    const process = spawn('docker', attachContainerArgs)

    return ReturnPromise(process, (stdout) => {
      const ids = cleanID(stdout)

      if (!ids.length) {
        return null
      }

      if (!(options.id || options.name)) {
        return null
      }

      const attachOptions = Object.assign({
        id: ids[0],
        commands: [],
        environmentVariables: [],
        exposePorts: [],
        volumes: [],
        health: {},
      }, options)

      const attachContainer = new Container(attachOptions)

      return attachContainer.inspect().then(info => {
        attachContainer.options.status = info.State.Status
        attachContainer.options.network = info.HostConfig.NetworkMode
        attachContainer.options.image = info.Config.Image

        if (info.Path) {
          attachContainer.options.commands = [info.Path]
        }

        if (info.Args) {
          attachContainer.options.commands.push
            .apply(attachContainer.options.commands, info.Args)
        }

        if (info.HostConfig.PortBindings) {
          Object.keys(info.HostConfig.PortBindings).forEach(port => {
            attachContainer.options.exposePorts.push({
              docker: port.split('/')[0],
              host: info.HostConfig.PortBindings[port][0].HostPort,
            })
          })
        }

        if (info.Config.Env) {
          info.Config.Env.forEach(env => {
            const envInfo = env.split('=')
            attachContainer.options.environmentVariables.push({
              name: envInfo[0],
              value: envInfo[1],
            })
          })
        }

        if (info.Mounts) {
          info.Mounts.filter(mount => !attachContainer.options.volumes.find(volume => volume.docker === mount.Destination))
            .forEach(mount => {
              if ('volume' !== mount.Type) {
                return
              }
              attachContainer.options.volumes.push({
                docker: mount.Destination,
                host: mount.Name,
              })
            })
        }

        const healthCheck = info.Config.Healthcheck // eslint-disable-line spellcheck/spell-checker
        if (healthCheck) {
          attachContainer.options.health.command = healthCheck.Test ? healthCheck.Test[1] : undefined
          attachContainer.options.health.interval = healthCheck.Interval ? (healthCheck.Interval % 1000000) + 'ms' : undefined
          attachContainer.options.health.startPeriod = healthCheck.StartPeriod ? (healthCheck.StartPeriod % 1000000) + 'ms' : undefined
          attachContainer.options.health.timeout = healthCheck.Timeout ? (healthCheck.Timeout % 1000000) + 'ms' : undefined
          attachContainer.options.health.retries = healthCheck.Retries ? healthCheck.Retries : undefined
        }

        return Promise.all(attachContainer.options.volumes.map(({ ...volume }) => this.AttachVolume(volume.host)))
          .then(volumes => volumes.filter(volume => volume))
          .then(volumes => {
            attachContainer.volumes = volumes
            return attachContainer
          })
      })
    }).catch(() => null)
  }

  /**
   * @param {string} name - the name of the network you want to attach.
   * @returns {Promise<Network>} the first network that match the desctiption.
   */
  AttachNetwork (name) {
    if (!name) {
      throw new Error('name must be provided!')
    }

    const args = ['network', 'ls', '--no-trunc', '--quiet', '--filter', `name=^${name}$`]

    const process = spawn('docker', args)

    return ReturnPromise(process, (stdout) => {
      const ids = cleanID(stdout)

      if (!ids.length) {
        return null
      }

      return new Network({ id: ids[0], name: name, status: 'alive' })
    })
  }

  /**
   * @param {string} name - the name of the volume you want to attach.
   * @returns {Promise<Network>} the first network that match the desctiption.
   */
  AttachVolume (name) {
    if (!name) {
      throw new Error('name must be provided!')
    }

    const args = ['volume', 'ls', '-q', '--filter', `name=^${name}$`]

    const process = spawn('docker', args)

    return ReturnPromise(process, (stdout) => {
      const names = cleanID(stdout)

      if (!names.length) {
        return null
      }

      return new Volume({ name: names[0], status: 'alive' })
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
      if (!item.name || item.value === undefined) {
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

  if (options.grope && !options.user) {
    throw new Error('options.grope must be used with options.user')
  }

  if (options.user) {
    args.push('--user', options.grope ? options.user + ':' + options.grope : options.user)
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
 * @returns {string[]} Array of arguments
 */
function processAttachContainerOptions (options) {
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
    args.push('--filter', `network=${options.network}`)
  }

  return args
}

/**
 * clean and extract the id's from the output of the docker command.
 *
 * @param {string} stdout - the raw output of a docker command.
 * @returns {string[]} the clean output.
 */
function cleanID (stdout) {
  return stdout.split('\n').filter((id) => !!id)
}

module.exports = { Docker, processCreateContainerOptions, processAttachContainerOptions }
