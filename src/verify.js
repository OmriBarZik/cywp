const commandExists = require('command-exists')
const { ReturnPromise } = require('./docker/util')
const { spawn } = require('child_process')

/**
 * Checks if docker is installed on the system.
 *
 * @returns {Promise<boolean | Error>} If docker is installed on the system.
 */
function verifyDocker () {
  return commandExists('docker')
    .then(() => true)
    .catch(() => Promise.reject(new Error('Docker is\'t installed on this system! Please install docker and try again.')))
}

/**
 * Checks if docker is running.
 *
 * @returns {Promise<boolean | Error>} If docker is running.
 */
function verifyDockerRunning () {
  const stats = spawn('docker', ['stats', '--no-stream'])

  return ReturnPromise(stats, () => { })
    .then(() => true)
    .catch(() => Promise.reject(new Error('Docker is\'t running! please start docker and try again.')))
}

/**
 * Verify if the system have the right dependencies to run cywp.
 * If not the program will print the error and then exit with status code 1.
 *
 * @returns {Promise<boolean>} If the system can run cywp.
 */
function unsafeVerify () {
  return verifyDocker()
    .then(verifyDockerRunning)
}

/**
 * Verify if the system have the right dependencies to run cywp.
 *
 * @returns {Promise<boolean,Error>} If the system can run cywp.
 */
function verify () {
  return verifyDocker()
    .then(verifyDockerRunning)
    .then(() => { return { verify: true } })
    .catch(message => { return { message: message, verify: false } })
}

module.exports = {
  verify: unsafeVerify,
  safeVerify: verify,
}
