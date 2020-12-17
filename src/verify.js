const commandExists = require('command-exists')
const { ReturnPromise } = require('./docker/util')
const { spawn } = require('child_process')

/**
 * Checks if docker is installed on the system.
 *
 * @returns {Promise<string>}
 */
function verifyDocker () {
  return commandExists('docker')
    .catch(() => 'Docker is\'t installed on this system! Please install docker and try again.')
}

/**
 * Checks if the docker demon is running.
 *
 * @returns {Promise<string>} return is the docker demon is running.
 */
function verifyDockerRunning () {
  const stats = spawn('docker', ['stats', '--no-stream'])
  return ReturnPromise(stats, () => { })
    .catch(() => {
      console.log('adasd')
      return ('The docker demon is\'t running! please start the demon and try again.')
    })
}

/**
 * Verify if the system have the right dependencies.
 *
 * @returns {Promise<boolean>} if the system can run cywp and exit if
 */
async function verify () {
  return safeVerify()
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}

/**
 * Verify if the system have the right dependencies.
 *
 * @returns {Promise<boolean,string>}
 */
async function safeVerify () {
  return Promise.all([verifyDocker(), verifyDockerRunning()])
    .catch(results => {
      for (let i = 0; i < results.length; i++) {
        if (results[i]) { return results[i] }
      }
    })
    .then((e) => {
      console.log(e)
      return true
    })
}

module.exports = {
  verify,
  verifyDockerRunning,
}
