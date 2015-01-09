var React = require('react');

var Dropdown = require('./Dropdown');

user = {
  name: 'Dave'
};
user = null;

var AccountBox = React.createClass({
  render: function () {

    if (!user) {
      // No user logged in
      return (
        <div className='accountBox'>
          <Dropdown />
        </div>
      );
    } else {
      // User logged in
      return (
        <div className='accountBox'>
          <Dropdown />
          <span>{user.name || 'No User Name Found'}</span>
        </div>
      );
    }
  }
});

module.exports = AccountBox;