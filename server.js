var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack/webpack.config');

var port= process.env.PORT || 8080
var host= process.env.HOST || 'localhost'

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  historyApiFallback: true
}).listen(port, host, function(err,result) {
  if (err) {
    console.error(err);
  }

  console.log('Listening at ' + host + ':' + port);
});
