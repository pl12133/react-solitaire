"use strict";
var transform = require("../index.js"),
    React = require("react");

describe("transform", function() {
  it("transforms jsx resolving requires", function() {
    transform.options.cache = false;

    var view = __dirname+"/views/layout.jsx";
    var fn = transform(view);

    fn.should.be.a.Function;
    Object.keys(transform.cache).should.have.length(0);
  });

  it("caches generated functions", function() {
    transform.options.cache = true;

    var view = __dirname+"/views/layout.jsx";
    var fn = transform(view);

    fn.should.be.a.Function;
    Object.keys(transform.cache).should.have.length(3);
    transform.cache[view].should.be.a.Function;
    transform.cache[view].should.equal(transform(view));
  });

  it("resolves nested jsx requires", function() {
    var view = __dirname+"/views/layout.jsx";
    var fn = transform(view);

    var str = React.renderComponentToStaticMarkup(fn({name: "layout"}));
    str.should.equal("<div><h1>Hello, layout</h1></div>");
  });

  it("throws errors", function(done) {
    var view = __dirname+"/views/error.jsx";

    try {
      var fn = transform(view);
    } catch(err) {
      done();
    }
  });
});
