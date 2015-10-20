"use strict";
var fs = require("fs"),
    path = require("path"),
    vm = require("vm"),
    tools = require("react-tools"),
    React = require("react");

var transform = module.exports = function(file) {
  file = path.resolve(file);
  var cwd = path.dirname(file);

  if (transform.options.cache && transform.cache[file]) {
    return transform.cache[file];
  }

  var js = fs.readFileSync(file, "utf8");
  js = tools.transform("/** @jsx React.DOM */\n" + js);

  var sandbox = {};
  sandbox.console = console;
  sandbox.global = global;
  sandbox.window = global.window;
  sandbox.document = global.document;
  sandbox.React = React;
  sandbox.module = {exports: {}};
  sandbox.exports = sandbox.module.exports;
  
  sandbox.require = function(file) {
    if (file[0] === ".") file = path.resolve(cwd, file);
    return path.extname(file) === transform.options.ext ? transform(file) : require(file);
  };

  vm.runInNewContext(js, sandbox, file);
  var fn = sandbox.module.exports;

  if (transform.options.cache) {
    transform.cache[file] = fn;
  }

  return fn;
};

transform.options = {
  cache: process.env.NODE_ENV === "production",
  ext: ".jsx"
};

transform.cache = {};
