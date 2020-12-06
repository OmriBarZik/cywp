const commandExists = require('command-exists')

const missingDependencies = []

/**
 * Checks whatever the given command exsists, if not. the name fo the
 * command will be added to the missingDependencies array
 *
 * @param {string} command - the command
 * @returns {Promise<string>} - retrun if the command exsists.
 */
function verifyCommand (command) {
  return commandExists(command).catch(() => missingDependencies.push(command))
}

/**
 * Verify if the system have the right dependencies.
 */
async function verify () {
  await Promise.all([verifyCommand('docker')])

  if (missingDependencies.length) {
    // eslint-disable-next-line no-console
    console.error(`The dependencies [ ${missingDependencies.join(' | ')} ] are missing\nplease install them and try again`)
    process.exit(1)
  }
}

module.exports = {
  verify,
}
