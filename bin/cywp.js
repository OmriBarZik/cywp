#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { program } = require('commander')

const checkConfig = require('../src/config')
const { Docker } = require('../src/docker/docker')
const runner = require('../src/runner')
const { CreateWordpressCliContainer } = require('../src/docker/presets/containers')

const docker = new Docker()

program
  .option('-p, --project <project-path>', 'path to cypress project')

program.command('exec')
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
    container: 'create and start a specific container (wordpress|mysql|phpmyadmin)',
  })
  .action(start)

program.command('stop [container]')
  .description('stop all project\'s containers', {
    container: 'stop a specific container (wordpress|mysql|phpmyadmin)',
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
 * @returns {any} docker container.
 */
async function exec (container, command, args) {
  const config = getConfig()

  const containerCallback = (attachedContainer) => {
    if (!attachedContainer) {
      return console.error('container not working, use \'cywp start\' to start the containers')
    }
    return attachedContainer.exec([command].concat(args))
  }

  if ('mysql' === container) {
    return docker.AttachContainer({ name: 'cywp-main-mysql' }).then(containerCallback)
  }

  if ('wordpress' === container) {
    return docker.AttachContainer({ name: config.env.cywpWordpressName }).then(containerCallback)
  }

  if ('wpcli' === container) {
    return docker.AttachContainer({ name: config.env.cywpWordpressName })
      .then(wordpress => {
        if (wordpress) {
          return CreateWordpressCliContainer(wordpress, [command].concat(args))
        }

        console.log('wordpress not running! please start wordpress to use wpcli')
      })
  }

  return console.error('invalid container argument! container must be \'wordpress\', \'mysql\' or \'wpcli\'!')
}

/**
 * @param {{all:string}} options - clean command option object.
 */
function rm (options) {
  console.log('clean project ' + options.all)
}

/**
 * ret
 */
function start () {
  const config = getConfig()
  runner(() => { }, config)
}

/**
 *
 */
function stop () {

}

/**
 * get cypress config from cypress.json file
 *
 * @returns {object} cypress config
 */
function getConfig () {
  const cypressPath = path.join(path.resolve(program.project || process.cwd()), 'cypress.json')

  if (!fs.existsSync(cypressPath)) {
    const errorMassage = `cypress.json was not found in ${path.dirname(cypressPath)}!`
    const userHelper = program.project ? 'please check the \'--project\' path!'
      : 'create cypress.json or use --path to direct to a valid cypress project'

    return console.error(`${errorMassage}\n${userHelper}`)
  }

  return checkConfig({ configFile: cypressPath, env: {} })
}
