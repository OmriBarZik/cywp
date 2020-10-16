/**
 * @typedef ContainerOptions
 * @type {object}
 * @property {object[]} exposePorts - list of objects that spesified what ports to expose.
 * @property {number} exposePorts.host - port expose at the host machine.
 * @property {number} exposePorts.docker - port expose at the container.
 * @property {object[]} environmentVariables - list of objects that spesified what environment variables pass to the docker contianer.
 * @property {string} environmentVariables.name - the name of the envierment variable that passes to the docker contianer.
 * @property {string} environmentVariables.value - the value of the envierment variable that passes to the docker contianer.
 * @property {object[]} volumes - list of bjects that spesified what volumes are expose.
 * @property {string} volumes.host - what path is expose at the host.
 * @property {string} volumes.docker - where the expose path is contained in the docker container.
 * @property {string} network - the network the contianer is in.
 * @property {string} image - the name if the docker image.
 * @property {string} name - name of the container.
 * @property {string} dockerId - the container id, set when the continer is created.
 * @property {string} status - the container status (created|started|removed|stoped)
 */

/**
 * @typedef VolumeOptions
 * @type {object}
 * @property {string} name - The volume id, set when the volume is created.
 * @property {string} status - Tells if the volume is alive (can be alive|dead)
 */
