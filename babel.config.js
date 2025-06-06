// babel.config.js - Fixed Babel Configuration
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not dead', 'not ie 11'],
        },
        useBuiltIns: 'usage',
        corejs: 3,
        modules: false, // Preserve ES modules for webpack
      },
    ],
  ],
  plugins: [
    // Add any babel plugins here if needed
    // Example: '@babel/plugin-proposal-class-properties'
  ],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current',
            },
            useBuiltIns: 'usage',
            corejs: 3,
          },
        ],
      ],
    },
  },
};
