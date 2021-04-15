/* eslint-disable spellcheck/spell-checker */
module.exports = {
  extends: [
    'standard',
    'plugin:jsdoc/recommended',
    'plugin:jest/style',
    'plugin:jest/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'jest',
    'jsdoc',
    'spellcheck',
  ],
  env: {
    es6: true,
    node: true,
    'jest/globals': true,
  },
  rules: {
    yoda: [
      'error',
      'always',
    ],
    'function-call-argument-newline': [
      'error',
      'never',
    ],
    'function-paren-newline': [
      'error',
      'never',
    ],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
      },
    ],
    'jsdoc/no-undefined-types': 'off',
    'jsdoc/valid-types': 'off',
    'spellcheck/spell-checker': [
      'warn',
      {
        skipWords: [
          'cywp',
          'stdout',
          'stderr',
          'ps',
          'wordpress',
          'mysql',
          'twentyseventeen',
          'twentytwenty',
          'spwan',
          'usr',
          'cmd',
          'wp',
          'uri',
          'php',
          'nicename',
          'unspam',
          'gmt',
          'guid',
          'fs',
          'or',
        ],
      },
    ],
  },
}
