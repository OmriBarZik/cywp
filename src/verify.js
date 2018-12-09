const logger = require( './logger' );
const commandExists = require( 'command-exists' ).sync;

const missingDependencies = [];

function verifyDocker() {
	if ( ! commandExists( 'docker' ) ) {
		missingDependencies.push( 'docker' );
	}
}

function verifyDockerCompose() {
	if ( ! commandExists( 'docker-compose' ) ) {
		missingDependencies.push( 'docker-compose' );
	}
}

function verifyGit() {
	if ( ! commandExists( 'git' ) ) {
		missingDependencies.push( 'git' );
	}
}

function verify() {
	verifyDocker();
	verifyDockerCompose();
	verifyGit();

	if ( missingDependencies ) {
		logger.error( `The dependencies [ ${missingDependencies.join( ' | ' )} ] are missing` );
		logger.error( 'please install them and try again' );
		process.exit( 1 );
	}
}

module.exports = {
	verify,
};
