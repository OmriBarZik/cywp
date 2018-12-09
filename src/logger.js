const chalk = require( 'chalk' );

const consoleLog = console.log; // eslint-disable-line no-console

/**
 * prints to console in red.
 * 
 * @param {string} errorMessage the message that is printed.
 */
function error( errorMessage ) {
	consoleLog( chalk.red( errorMessage ) );
}

/**
 * prints to console in yellow.
 * 
 * @param {string} warnMessage the message that is printed.
 */
function warn( warnMessage ) {
	consoleLog( chalk.yellow( warnMessage ) );
}

/**
 * prints to console in white.
 * 
 * @param {string} logMessage the message that is printed.
 */
function log( logMessage ) {
	consoleLog( logMessage );
}

module.exports = {
	error,
	warn,
	log,
};
