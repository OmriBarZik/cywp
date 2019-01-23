const assert = require( 'assert' );
const logger = require( '../src/logger' );
const chalk = require( 'chalk' );

describe( 'logger', () => {
	describe( 'exit', () => {
		it( 'should print to console in red', () => {
			logger.error( 'error' );
			assert.equal( process.LOG[ 0 ], chalk.red._styles[ 0 ].open + 'error' + chalk.red._styles[ 0 ].close );
		} );
	} );

	describe( 'warn', () => {
		it( 'should print to console in yellow', () => {
			logger.warn( 'warn' );
			assert.equal( process.LOG[ 0 ], chalk.yellow._styles[ 0 ].open + 'warn' + chalk.yellow._styles[ 0 ].close );
		} );
	} );

	describe( 'log', () => {
		it( 'should print to console in white', () => {
			logger.log( 'log' );
			assert.equal( process.LOG[ 0 ], 'log' );
		} );
	} );
} );
