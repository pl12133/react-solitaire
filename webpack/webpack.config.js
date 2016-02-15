var path = require('path');
var webpack = require('webpack');

var host = process.env.HOST || 'localhost';
var port = process.env.PORT || '8080';

module.exports = {
  entry: [
    'webpack-dev-server/client?http://'+host+':'+port,
    './src/index'
  ],
  output: {
      filename: 'bundle.js',
      path: path.join(__dirname, '/dist/'),
      publicPath: '/dist/',
      sourceMapFilename: 'debugging/[file].map',
      library: 'react-solitaire',
      libraryTarget: 'umd'
  },
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
  },
  devtool: 'eval'
};
