/* eslint-disable prettier/prettier */
module.exports = {
  plugins: [
    require('autoprefixer'),
    ...(process.env.NODE_ENV === 'production'
      ? [require('cssnano')({
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: false,
        }],
      })]
      : []
    ),
  ],
};
