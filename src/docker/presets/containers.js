const Container = require('../container') // eslint-disable-line no-unused-vars
const { Docker } = require('../docker')
const docker = new Docker()

/**
 * Create mysql continer.
 *
 * @param {string} name - The name of the container.
 * @param {boolean} run - should the container run at the instance of creation.
 * @returns {Promise<Container>} retrun promise for mysql continer object.
 */
function CreateMysqlContainer (name, run = false) {
  CheckParameters(name, 3306)

  return docker.CreateContainer({
    image: 'mysql:5.7',
    name: `cywp-${name}-mysql`,
    network: 'cywp-network',
    environmentVariables: [
      { name: 'MYSQL_ROOT_PASSWORD', value: 'cywp' },
    ],
    health: {
      command: 'mysqladmin ping -u root -p$MYSQL_ROOT_PASSWORD | grep \'mysqld is alive\'', // eslint-disable-line spellcheck/spell-checker
      startPeriod: '5s',
      retries: 30,
      interval: '1s',
    },
  }, run)
}

/**
 * Create wordpress continer.
 *
 * @param {string} name - The name of the container.
 * @param {number} port - The port expose to the host.
 * @param {Container} mysqlContainer - The mysql container object.
 * @param {string} version - wordrepss container version.
 * @param {[{host: string, docker: string}]} volumes - additional volumes to add local files to the container.
 * @param {boolean} [run] - Should the container run at the instance of creation.
 * @returns {Promise<Container>} Retrun promise for WordPress continer object.
 */
function CreateWordpressContainer (name, port, mysqlContainer, version, volumes = [], run = false) {
  CheckParameters(name, port)

  if (!(mysqlContainer instanceof Container)) {
    throw new TypeError('mysqlContainer must be instance of container')
  }

  return docker.CreateContainer({
    exposePorts: [{ docker: 80, host: port }],
    environmentVariables: [
      { name: 'WORDPRESS_DB_HOST', value: `${mysqlContainer.options.name}:3306` },
      { name: 'WORDPRESS_DB_PASSWORD', value: 'cywp' },
      { name: 'WORDPRESS_DB_USER', value: 'root' },
      { name: 'WORDPRESS_DB_NAME', value: `cywp-${name}-db` },
    ],
    volumes: [
      { host: `cywp-${name}-volume`, docker: '/var/www/html' },
      { host: `cywp-${name}-volume-themes`, docker: '/var/www/html/wp-content/themes' },
      { host: `cywp-${name}-volume-plugins`, docker: '/var/www/html/wp-content/plugins' },
    ].concat(volumes),
    image: 'wordpress' + (version ? `:${version}` : ''),
    network: 'cywp-network',
    name: `cywp-${name}-wordpress`,
    health: {
      command: 'test -r wp-includes/version.php',
      startPeriod: '1s',
      interval: '1s',
      retries: 30,
    },
  }, run)
}

/**
 * Create wordpress cli container.
 *
 * @param {Container} wordpress - WordPress docker container based from.
 * @param {string[]} commands - commands to pass to the container.
 * @returns {Promise<RunInContainerOutput>} retrun promise for WordPress continer object.
 */
function CreateWordpressCliContainer (wordpress, commands) {
  if (!Array.isArray(commands)) {
    throw new TypeError('commands must be an array')
  }

  return docker.RunInContainer({
    volumes: wordpress.options.volumes,
    environmentVariables: wordpress.options.environmentVariables,
    image: 'wordpress:cli',
    network: wordpress.options.network,
    name: `${wordpress.options.name}-cli`,
    commands: commands,
    user: '33',
    grope: '33',
    rm: true,
  }, true, false)
}

/**
 * Check user Parameters.
 *
 * @param {string} name - The name of the container - should be string.
 * @param {number} port - The port expose to the host - should be an integer.
 */
function CheckParameters (name, port) {
  if ('string' !== typeof name) {
    throw new TypeError('name must be a valid string!')
  }
  if (!Number.isInteger(+port)) {
    throw new TypeError('port to expose must be an integer!')
  }
}

module.exports = { CreateMysqlContainer, CreateWordpressContainer, CreateWordpressCliContainer }
