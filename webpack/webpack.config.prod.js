var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './src/index'
  ],
  output: {
      filename: 'index.js',
      path: path.join(__dirname, '..', '/lib/'),
      publicPath: '/lib/',
      library: 'react-solitaire',
      libraryTarget: 'umd'
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ],
  resolve: {
    extensions: ['', '.jsx', '.js', '.json'],
    modulesDirectories: ['node_modules', 'src'],
  },
  module: {
    loaders: [{
        test: /\.scss$/,
        loaders: ["style", "css", "sass"] 
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }, {
        test: /\.(png|jpg|svg)$/,
        loader: 'url-loader?limit=1048576'
      }
    ]
  }
};
