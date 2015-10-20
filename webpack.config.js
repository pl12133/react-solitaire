var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    './src/index'
  ],
  output: {
      filename: 'bundle.js',
      path: path.join(__dirname, '/dist/'),
      publicPath: '/dist/'
  },
  resolve: {
    extensions: ['', '.jsx', '.js', '.json'],
    modulesDirectories: ['node_modules', 'src']
  },
  module: {
    loaders: [{
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }, {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"] 
      }
    ]
  },
  devtool: 'eval-source-map'
};
