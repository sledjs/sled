'use strict';

let Extract = require('extract-text-webpack-plugin');
let path = require('path');

module.exports = {
  entry: {
    library: 'babel!./index.js',
  },

  output: {
    library: 'Sled',
    libraryTarget: 'window',
    filename: 'sled.js',
    path: 'lib',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'node_modules/@sled')],
        loader: 'babel',
      },
      {
        test: /\.styl$/i,
        loader: Extract.extract('style', 'css!stylus'),
      },
    ],
  },
};

module.exports.plugins = [
  new Extract('sled.css', {
    allChunks: true,
  }),
];
