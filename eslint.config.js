import ashNazg from 'eslint-config-ash-nazg';

export default [
  {
    ignores: [
      '.idea'
    ]
  },
  ...ashNazg(['sauron', 'node']).map((cfg) => {
    return {
      ignores: [
        'src/index-browser.js'
      ],
      ...cfg
    };
  }),
  ...ashNazg(['sauron', 'browser']).map((cfg) => {
    return {
      files: ['src/index-browser.js'],
      ...cfg
    };
  }),
  {
    rules: {
      'unicorn/prefer-global-this': 'off'
    }
  }
];
