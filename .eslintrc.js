module.exports = {
	env: {
		es6: true,
		node: true,
		mocha: true,
	},
	extends: 'eslint:recommended',
	globals: {
		require: true,
		module: true,
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2018,
	},
};
