/**
 * @typedef ContainerOptions
 * @type {object}
 * @property {object[]} exposePorts - list of objects that specified what ports to expose.
 * @property {number} exposePorts.host - port expose at the host machine.
 * @property {number} exposePorts.docker - port expose at the container.
 * @property {object[]} environmentVariables - list of objects that specified what environment variables pass to the docker container.
 * @property {string} environmentVariables.name - the name of the environment variable that passes to the docker container.
 * @property {string} environmentVariables.value - the value of the environment variable that passes to the docker container.
 * @property {object[]} volumes - list of objects that specified what volumes are expose.
 * @property {string} volumes.host - what path is expose at the host.
 * @property {string} volumes.docker - where the expose path is contained in the docker container.
 * @property {string} network - the network the container is in.
 * @property {string} image - the name if the docker image.
 * @property {string} name - name of the container.
 * @property {string} id - the container id, set when the container is created.
 * @property {boolean} rm - remove the container after it exits.
 * @property {'created'|'started'|'removed'|'stopped'} status - the container status (created|started|removed|stopped)
 * @property {string[]} commands - commands to pass to the container.
 * @property {object} health - Object to check container health.
 * @property {string} health.command - Command to run to check health.
 * @property {string} health.interval - Time between running the check (ms|s|m|h) (default 30s)
 * @property {number} health.retries - Consecutive failures needed to report unhealthy
 * @property {string} health.startPeriod - Start period for the container to initialize before starting health-retries countdown (ms|s|m|h) (default 30s)
 * @property {string} health.timeout - Maximum time to allow one check to run (ms|s|m|h) (default 30s)
 * @property {string} user - Sets the user name or UID.
 * @property {string} grope - Sets group name or GID, must be used with user.
 */

/**
 * @typedef RunInContainerOutput
 * @type {object}
 * @property {string} stdout - Container output from log stream.
 * @property {string} stderr - Container output from error stream.
 */

/**
 * @typedef VolumeOptions
 * @type {object}
 * @property {string} name - The volume id, set when the volume is created.
 * @property {'alive'|'dead'} status - Tells if the volume is alive (alive|dead)
 */

/**
 * @typedef NetworkOption
 * @type {object}
 * @property {string} name - the name of the docker network.
 * @property {string} id - the network id, set when the network is created.
 * @property {'alive'|'dead'} status - Tells if the network is alive (alive|dead)
 */
