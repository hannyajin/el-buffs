var React = require('react');
var utils = require('../utils');

var LoginForm = require('../components/LoginForm');

var RegisterPage = React.createClass({
  render: function () {
    var self = this;

    return (
      <div className='page'>
        <div className='container'>
          <div className='row centerBlock'>
            <div className='three columns' />
            <div className='six columns'>
              <h1>Success!</h1>
              <p>
                Your account has been registered.
                Please activate your account by verifying your email.
              </p>
              <hr />
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = RegisterPage;