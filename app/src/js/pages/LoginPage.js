var React = require('react');
var utils = require('../utils');

var LoginForm = require('../components/LoginForm');

var LoginPage = React.createClass({
  render: function () {
    return (
      <div className='page'>
        <div className='container'>
          <div className='row centerBlock'>
            <div className='three columns' />
            <div className='six columns'>
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = LoginPage;