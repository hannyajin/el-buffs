var React = require('react');

var QueryPage = React.createClass({
  render: function () {
    return (
      <div className="page">Query Page, query: {this.props.querystring}</div>
    );
  }
});

module.exports = QueryPage;