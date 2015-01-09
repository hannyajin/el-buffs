var React = require('react');

var UsersPage = React.createClass({
  render: function () {
    return (
      <div className="page">Users page. Params: {this.props.params.id}</div>
    );
  }
});

module.exports = UsersPage;