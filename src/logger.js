const chalk = require( 'chalk' );

const consoleLog = console.log; // eslint-disable-line no-console

function error( errorMessage ) {
	consoleLog( chalk.red( errorMessage ) );
}

function warn( warnMessage ) {
	consoleLog( chalk.yellow( warnMessage ) );
}

function log( logMessage ) {
	consoleLog( logMessage );
}

module.exports = {
	error,
	warn,
	log,
};
