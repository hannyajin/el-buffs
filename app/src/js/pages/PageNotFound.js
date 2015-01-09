var React = require('react');

var PageNotFound = React.createClass({
  render: function () {
    return (
      <div className="page">404: Page not found!</div>
    );
  }
});

module.exports = PageNotFound;