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
  .description('execute command on a specified container')
  .passThroughOptions(true)
  .argument('<container>', 'Container to run the command. (wordpress|mysql|wpcli)')
  .argument('<command>', 'command to run on the container.')
  .argument('[args...]', 'command arguments.')
  .action(exec)

program
  .command('rm')
  .argument('[container]', 'remove a specific container (wordpress|mysql)')
  .description('removes all stopped containers, networks and volumes of the project')
  .option('-a, --all', 'remove all containers, networks and volumes that starts with \'cywp-\' prefix')
  .option('-f, --force', 'removes all containers, networks and volumes, even running once')
  .option('--no-volumes', 'do not delete connected volumes')
  .action(rm)

program
  .command('start')
  .description('start cypress-for-wordpress environment')
  .argument('[container]', 'start cypress-for-wordpress environment')
  .option('-s --skip-pull', 'sets if to skip docker pull')
  .action(start)

program
  .command('stop')
  .description('stop all project\'s containers')
  .argument('[container]', 'stop a specific container (wordpress|mysql)')
  .option('-a, --all', 'stop all containers that starts with \'cywp-\' prefix')
  .action(stop)

program
  .command('status')
  .description('display current containers status.')
  .action(status)

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
      getMysql()
        .then(container => container.rm(options.force, true))
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
 * @param {{skipPull:string}} options - start command option object.
 */
async function start (container, options) {
  const config = getConfig()

  config.env.skip_pull = options.skipPull || process.env.cypress_skip_pull || process.env.CYPRESS_SKIP_PULL

  switch (container) {
    case 'wordpress':
      getWordpress()
        .then(wordpress => wordpress.start())
        .catch(() =>
          getMysql()
            .catch(() => commandFailed('mysql container must be running to start wordpress'))
            .then(mysql => CreateWordpress(mysql, config.env)))
      break
    case 'mysql':
      getMysql()
        .then(mysql => mysql.start())
        .catch(SetupDatabase)
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
 * stop running containers
 *
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
 * display containers status.
 */
function status () {
  Promise.all([
    getWordpress()
      .then(wordpress => wordpress.status())
      .then(status => 'exited' === status ? 'stopped' : status)
      .catch(() => 'offline'),
    getMysql()
      .then(mysql => mysql.status())
      .then(status => 'exited' === status ? 'stopped' : status)
      .catch(() => 'offline'),
  ])
    .then(status => console.log(`wordpress:\t${status[0]}\nmysql:\t\t${status[1]}`))
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
    const userHelper = program.project
      ? 'please check the \'--project\' path!'
      : 'create cypress.json or use --path to direct to a valid cypress project'

    commandFailed(`${errorMassage}\n${userHelper}`)
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

  return docker.AttachContainer({ name: config.env.cywpWordpressName })
    .then(container => container || Promise.reject(new Error('wordpress was not found!')))
}

/**
 * get project mysql container.
 *
 * @returns {Promise<import('../src/docker/container')>} mysql container.
 */
function getMysql () {
  return docker.AttachContainer({ name: 'cywp-main-mysql' })
    .then(container => container || Promise.reject(new Error('mysql was not found!')))
}

/**
 * print error message and exit with code 1.
 *
 * @param {string | Error} errorMessage error message to print
 */
function commandFailed (errorMessage) {
  if (errorMessage instanceof Error) {
    errorMessage = errorMessage.message
  }

  throw new Error(errorMessage)
}
