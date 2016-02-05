'use strict';

let Extract = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    library: './index.js',
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
        exclude: /node_modules/,
        loader: 'babel-loader',
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
