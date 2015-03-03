var React = require('react');

var Dropdown = require('./Dropdown');

var client = require('../client'); // not a react component

var AccountBox = React.createClass({
  componentDidMount: function () {
    var self = this;
    client.addUserListener(function() {
      console.log("FORCE UPDATING!!");
      self.forceUpdate();
    });
  },

  render: function () {
    var user = client.getUser();

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
          <div className='userinfo'>
            <div>
              {user.username ? (user.username) : ('Guest')}
            </div>
          </div>
          <Dropdown className='dropdown' />
        </div>
      );
    }
  }
});

module.exports = AccountBox;
