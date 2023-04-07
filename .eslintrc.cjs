'use strict';

module.exports = {
  extends: 'ash-nazg/sauron-node-overrides',
  globals: {
    document: 'off',
    fetch: 'off'
  },
  settings: {
    jsdoc: {
      mode: 'typescript'
    },
    polyfills: [
      'Array.from',
      'Array.isArray',
      'console',
      'fetch',
      'JSON',
      'Map',
      'Number.isNaN',
      'Number.parseInt',
      'Object.entries',
      'Object.fromEntries',
      'Object.keys',
      'Promise',
      'URL'
    ]
  },
  parserOptions: {
    ecmaVersion: 2022
  }
};
