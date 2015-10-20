var Hello = require("./include/index.jsx");

var Layout = React.createClass({
  render: function() {
    return <div>{this.props.children}</div>
  }
});

var Page = React.createClass({
  render: function() {
    return <Layout><Hello name={this.props.name}/></Layout>
  }
});

module.exports = Page;
