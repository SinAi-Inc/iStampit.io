const path = require('node:path');

module.exports = {
  plugins: [
    require('@tailwindcss/postcss'),
    require('./postcss-media-range-fallback.cjs'),
    require('autoprefixer'),
  ],
};
