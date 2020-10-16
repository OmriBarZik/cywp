/**
 * Return the chiild process as promise.
 *
 * @param {import('child_process').ChildProcessWithoutNullStreams} process - the child process thats running.
 * @param {Function} callback - callback that deterred what to return when the process is succsesful.
 * @returns {Promise} return what said to return form the callback
 */
function ReturnPromise (process, callback) {
  if ('function' !== typeof callback) {
    throw new TypeError('callback must be a function')
  }

  let stderr = ''

  process.stderr.on('data', (data) => {
    stderr += data
  })

  return new Promise((resolve, reject) => {
    process.on('close', (code) => {
      if (code) {
        reject(stderr)
        return
      }

      resolve(callback())
    })
  })
}

module.exports = { ReturnPromise }
