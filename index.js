const { CreateMysqlContainer, CreateWordpressContainer } = require('./src/docker/presets/containers')
const { Docker } = require('./src/docker/docker')

const docker = new Docker()

/**
 *
 */
async function start () {
  // const network = await docker.CreateNetwork('cywp-network')

  const mysql = await CreateMysqlContainer('tmp', 3306)
  const wordpress = await CreateWordpressContainer('tmp', 8080, 'cywp-tmp-mysql', 3306)

  await mysql.start()

  await wordpress.start()
}

/**
 *
 */
async function tmp () {
  docker.CreateContainer({
    volumes: [
      { docker: '/var/www/html', host: 'cywp-twentyseventeen-volume' },
    ],
    network: 'cywp-network',
    image: 'wordpress:cli',
    // rm: true,
  }, true).then(cli => {
    return cli.start()
  }).then(cli => {
    return cli.logs()
  }).then(logs => {
    console.log(logs)
  })
}
/*
[
  "container",
  "create",
  "--rm",
  "-v",
  "cywp-twentyseventeen-volume:/var/www/html",
  "wordpress:cli",
]
 */

// start()
tmp()
