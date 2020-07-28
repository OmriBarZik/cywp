const commandExists = require('command-exists')

const missingDependencies = []

function verifyCommand (command) {
  return commandExists(command).catch(() => missingDependencies.push(command))
}

async function verify () {
  await Promise.all([verifyCommand('git'), verifyCommand('docker'), verifyCommand('docker-compose')])

  if (missingDependencies.length) {
    // eslint-disable-next-line no-console
    console.error(`The dependencies [ ${missingDependencies.join(' | ')} ] are missing\nplease install them and try again`)
    process.exit(1)
  }
}

module.exports = {
  verify
}
