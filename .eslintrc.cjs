'use strict';

module.exports = {
  extends: 'ash-nazg/sauron-node-overrides',
  globals: {
    document: 'off',
    fetch: 'off'
  },
  settings: {
    polyfills: [
      'console',
      'JSON',
      'Map',
      'Number.isNaN',
      'Number.parseInt',
      'Object.entries',
      'Object.fromEntries',
      'Promise'
    ]
  },
  parserOptions: {
    ecmaVersion: 2021
  }
};
