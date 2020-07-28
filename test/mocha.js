/* eslint-disable mocha/no-hooks-for-single-case, mocha/no-top-level-hooks */

const consoleLog = console.log // eslint-disable-line no-console
const processExit = process.exit

before(function () {
  process.exit = (exitCode) => {
    process.EXIT = exitCode
    throw new Error('EXIT-TEST-' + exitCode)
  }
})

beforeEach(function () {
  process.LOG = []
  console.log = (...message) => { // eslint-disable-line no-console
    consoleLog(...message)
    process.LOG.push(...message)
  }
})

afterEach(function () {
  console.log = consoleLog // eslint-disable-line no-console
})

after(function () {
  process.exit = processExit
})
