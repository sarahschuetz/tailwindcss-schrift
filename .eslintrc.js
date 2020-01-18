const resolve = require('path').resolve;

module.exports = {

  root: true,

  env: {
    browser: true,
    node: true,
    es6: true,
  },

  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 9,
    sourceType: 'module',
  },

  extends: [
    'airbnb/base',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],

  plugins: [
  ],

  settings: {},

  rules: {
    'max-len': ['error', {
      'comments': 160,
      'ignoreTemplateLiterals': true,
      'ignoreStrings': true,
      'ignorePattern': 'd=\".*\"', // ignore long svg path descriptions
    }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
  },
}
