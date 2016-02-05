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
    ],
  },
};
