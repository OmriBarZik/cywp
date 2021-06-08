/**
 * Return the child process as promise.
 *
 * @param {import('child_process').ChildProcessWithoutNullStreams} process - the child process that's running.
 * @param {(stdout: string, stderr: string) => any} callback - callback that deterred what to return when the process is successful.
 * @returns {Promise} return what said to return form the callback
 */
function ReturnPromise (process, callback) {
  if ('function' !== typeof callback) {
    throw new TypeError('callback must be a function')
  }

  let stderr = ''
  let stdout = ''

  process.stderr.on('data', (data) => {
    stderr += data
  })

  process.stdout.on('data', (data) => {
    stdout += data
  })

  return new Promise((resolve, reject) => {
    process.on('close', (code) => {
      if (code) {
        reject(new Error(`stdout: ${stdout}\nstderr: ${stderr}`))
        return
      }

      resolve(callback(stdout, stderr))
    })
  })
}

/* istanbul ignore next */
/**
 * wait for number of milliseconds.
 *
 * @param {number} ms - number of milliseconds.
 * @returns {Promise<void>} - return promise.
 */
function sleep (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * Clean docker inspect output.
 *
 * @param {string} stdout - raw inspect output
 * @returns {string | object} Clean json object or clean string
 */
function CleanInspect (stdout) {
  stdout = stdout.replace(/\r?\n|\r/g, '')
  try {
    return JSON.parse(stdout)[0]
  } catch (e) {
    return stdout
  }
}

module.exports = { ReturnPromise, CleanInspect, sleep }
