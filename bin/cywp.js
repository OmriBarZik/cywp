#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { program } = require('commander')

const checkConfig = require('../src/config')
const { Docker } = require('../src/docker/docker')

const docker = new Docker()

program.command('exec')
  .arguments('<container> <command> [args...]')
  .description('execute command on a specified container', {
    container: 'Container to run the command. (wordpress|mysql)',
    command: 'command to run on the container',
    args: 'command arguments',
  })
  .option('-p, --project <project-path>', 'path to cypress project')
  .action(exec)

program.command('clean')
  .description('removes all project\'s docker containers, networks and volumes')
  .option('-a, --all', 'remove all containers, networks and volumes that starts with \'cywp-\' prefix')
  .action(clean)

program.command('phpmyadmin')
  .description('run phpmyadmin docker container to access MySQL server.')
  .action(phpmyadmin)

program.command('setup')
  .action(setup)

program.parse()

/**
 * execute command to a docker container
 *
 * @param {string} container the container to run the command on.
 * @param {string} command command to pass to the container.
 * @param {string[]} args command arguments.
 * @param {object} options subCommand option object.
 * @returns {any} docker container.
 */
function exec (container, command, args, options) {
  const cypressPath = path.join(path.resolve(options.project || process.cwd()), 'cypress.json')
  const config = checkConfig({ configFile: cypressPath, env: {} })

  if (!fs.existsSync(cypressPath)) {
    return console.error('cypress.json not found!' +
      options.project ? 'check your path!'
      : 'create cypress.json or use --path to direct to valid cypress project')
  }

  const containerCallback = (attachedContainer) => {
    if (!attachedContainer) {
      return console.error('container not working, use "cywp setup" to start the containers')
    }
    return attachedContainer.exec([command].concat(args))
  }

  if ('mysql' === container) {
    return docker.AttachContainer({ name: 'cywp-main-mysql' }).then(containerCallback)
  }

  if ('wordpress' === container) {
    return docker.AttachContainer({ name: config.env.cywpWordpressName }).then(containerCallback)
  }

  return console.error('invalid container argument! must be wordpress of mysql')
}

/**
 * @param {{all:string}} options - clean command option object.
 */
function clean (options) {
  console.log('clean project ' + options.all)
}

/**
 *
 */
function setup () {

}

/**
 *
 */
function phpmyadmin () {
}
