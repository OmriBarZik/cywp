const logger = require( './logger' );
const commandExists = require( 'command-exists' );

const missingDependencies = [];

function verifyCommand( command ) {
	return commandExists( command ).catch( () => missingDependencies.push( command ) );
}

async function verify() {
	await Promise.all( [ verifyCommand( 'git' ), verifyCommand( 'docker' ), verifyCommand( 'docker-compose' ) ] );

	if ( missingDependencies.length ) {
		logger.error( `The dependencies [ ${missingDependencies.join( ' | ' )} ] are missing` );
		logger.error( 'please install them and try again' );
		process.exit( 1 );
	}
}

module.exports = {
	verify,
};
