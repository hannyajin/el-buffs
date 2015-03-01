var React = require('react');

var client = require('../client');

var Dropdown = React.createClass({
  render: function () {
    var list = null;

    if (client.isLoggedIn()) {
      list = [{
        text: 'Dashboard',
        handleClick: function() {
          console.log("Dash clicked");
        }
      },{
        text: 'Logout',
        handleClick: function() {
          console.log("Logout clicked");
        }
      }];
    } else {
      list = [{
        text: 'Login',
        handleClick: function() {
          console.log("Login clicked");
        }
      },{
        text: 'Register',
        handleClick: function() {
          console.log("Register clicked");
        }
      }]
    }

    list = list.map(function (index) {
      return (
        <li>
          <a onClick={index.handleClick}>
            {index.text}
          </a>
        </li>
      );
    });

    return (
      <div className='dropdown'>
        <a href='#'>
          <div className='dropdown-lines'>
            <span className='dropdown-line' />
            <span className='dropdown-line' />
            <span className='dropdown-line' />
          </div>
        </a>
        <ul className='dropdown-menu'>
          <span className='dropdown-block'>
            <span className='triangle-up' />
          </span>
          {list}
        </ul>
      </div>
    );
  }
});

module.exports = Dropdown;
