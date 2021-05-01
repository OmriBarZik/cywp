#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { program } = require('commander')

const { Docker } = require('../src/docker/docker')
const { CreateWordpressCliContainer } = require('../src/docker/presets/containers')
const { SetupDatabase } = require('../src/workflow/environment')
const { CreateWordpress } = require('../src/workflow/util')
const checkConfig = require('../src/config')
const runner = require('../src/runner')

const docker = new Docker()

program
  .option('-p, --project <project-path>', 'path to cypress project')
  .enablePositionalOptions(true)

program
  .command('exec')
  .passThroughOptions(true)
  .arguments('<container> <command> [args...]')
  .description('execute command on a specified container', {
    container: 'Container to run the command. (wordpress|mysql|wpcli)',
    command: 'command to run on the container',
    args: 'command arguments',
  })
  .action(exec)

program.command('rm [container]')
  .description('removes all stopped containers, networks and volumes of the project', {
    container: 'remove a specific container (wordpress|mysql|phpmyadmin)',
  })
  .option('-a, --all', 'remove all containers, networks and volumes that starts with \'cywp-\' prefix')
  .option('-f, --force', 'removes all containers, networks and volumes, even running once')
  .option('--no-volumes', 'do not delete connected volumes')
  .action(rm)

program.command('start [container]')
  .description('start cypress-for-wordpress environment', {
    container: 'if set create and start a specific container (wordpress|mysql)',
  })
  .action(start)

program.command('stop [container]')
  .description('stop all project\'s containers', {
    container: 'stop a specific container (wordpress|mysql)',
  })
  .option('-a, --all', 'stop all containers that starts with \'cywp-\' prefix')
  .action(stop)

program.parse()

/**
 * execute command to a docker container
 *
 * @param {string} container the container to run the command on.
 * @param {string} command command to pass to the container.
 * @param {string[]} args command arguments.
 */
async function exec (container, command, args) {
  const execContainer = (attachedContainer) => {
    return attachedContainer.exec([command].concat(args))
      .then(container => console.log(container.stdout))
      .catch(err => console.error(err))
  }

  switch (container) {
    case 'mysql':
      getMysql()
        .then(execContainer)
        .catch(commandFailed)
      break
    case 'wordpress':
      getWordpress()
        .then(execContainer)
        .catch(commandFailed)
      break
    case 'wpcli':
      getWordpress()
        .catch(() => commandFailed('wordpress not running! please start wordpress to use wpcli'))
        .then(wordpress => CreateWordpressCliContainer(wordpress, [command].concat(args)))
        .then(container => console.log(container.stdout))
        .catch(commandFailed)
      break
    default:
      commandFailed('invalid container argument! container must be \'wordpress\', \'mysql\' or \'wpcli\'!')
      break
  }
}

/**
 * @param {string} container container name.
 * @param {{all:string, force: boolean, volumes: boolean}} options - clean command option object.
 */
function rm (container, options) {
  switch (container) {
    case 'wordpress':
      getWordpress()
        .then(container => container.rm(options.force, true, options.volumes))
        .catch(commandFailed)
      break
    case 'mysql':
      getWordpress()
        .then(container => container.rm(options.force, true, options.volumes))
        .catch(commandFailed)
      break
    case undefined:
      rm('wordpress', options)
      rm('mysql', options)
      break
    default:
      commandFailed('invalid container argument! container must be \'wordpress\' or \'mysql\'!')
      break
  }
}

/**
 * Start a specific container or cywp runner
 *
 * @param {string} container the container type.
 */
async function start (container) {
  const config = getConfig()

  switch (container) {
    case 'wordpress':
      getMysql()
        .then(mysql => CreateWordpress(mysql, config))
        .catch(() => commandFailed('mysql container must be running to start wordpress'))
      break
    case 'mysql':
      SetupDatabase()
      break
    case undefined:
      runner(() => { }, config)
      break
    default:
      commandFailed('invalid container argument! container must be \'wordpress\' or \'mysql\'!')
      break
  }
}

/**
 * @param {string} container container name
 * @param {object} options cli options
 */
function stop (container, options) {
  switch (container) {
    case 'wordpress':
      getWordpress()
        .then(container => container.stop())
        .catch(commandFailed)
      break
    case 'mysql':
      getMysql()
        .then(container => container.stop())
        .catch(commandFailed)
      break
    case undefined:
      stop('wordpress', options)
      stop('mysql', options)
      break
    default:
      commandFailed('invalid container argument! container must be \'wordpress\' or \'mysql\'!')
      break
  }
}

/**
 * get cypress config from cypress.json file
 *
 * @returns {object} cypress config
 */
function getConfig () {
  const cypressPath = path.join(path.resolve(program.opts().project || process.cwd()), 'cypress.json')

  if (!fs.existsSync(cypressPath)) {
    const errorMassage = `cypress.json was not found in ${path.dirname(cypressPath)}!`
    const userHelper = program.project ? 'please check the \'--project\' path!'
      : 'create cypress.json or use --path to direct to a valid cypress project'

    console.error(`${errorMassage}\n${userHelper}`)

    process.exit(1)
  }

  return checkConfig({ configFile: cypressPath, env: {} }, true)
}

/**
 * get project wordpress container.
 *
 * @returns {Promise<import('../src/docker/container')>} wordpress container.
 */
function getWordpress () {
  const config = getConfig()
  const errorMessage = 'wordpress was not found!'

  return docker.AttachContainer({ name: config.env.cywpWordpressName })
    .then(container => container || Promise.reject(new Error(errorMessage)))
}

/**
 * get project mysql container.
 *
 * @returns {Promise<import('../src/docker/container')>} mysql container.
 */
function getMysql () {
  const errorMessage = 'mysql was not found!'

  return docker.AttachContainer({ name: 'cywp-main-mysql' })
    .then(container => container || Promise.reject(new Error(errorMessage)))
}

/**
 * @param {string | Error} errorMessage error message to print
 */
function commandFailed (errorMessage) {
  if (errorMessage instanceof Error) {
    errorMessage = errorMessage.message
  }

  console.error('Error: ' + errorMessage)

  process.exit(1)
}
