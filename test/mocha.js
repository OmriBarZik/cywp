const consoleLog = console.log; // eslint-disable-line no-console
const processExit = process.exit;
process.LOG = [];

before( () => {
	process.exit = ( exitCode ) => {
		process.EXIT = exitCode;
		throw new Error( 'EXIT-TEST-' + exitCode );
	};
} );

beforeEach( () => {
	console.log = ( ...message ) => { // eslint-disable-line no-console
		consoleLog( ...message );
		process.LOG.push( ...message );
	};
} );

afterEach( () => {
	console.log = consoleLog; // eslint-disable-line no-console
} );

after( () => {
	process.exit = processExit;
} );
