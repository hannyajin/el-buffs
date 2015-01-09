var React = require('react');
var utils = require('../utils');

var RegisterPage = React.createClass({
  register: function () {
    utils.animateOnce('#registerContainer', 'animated shake');
  },
  render: function () {
    var self = this;

    return (
      <div className='page'>
        <div className='overlay' />
        <div className='container' id='registerContainer'>
          <div className='row centerBlock'>
            <div className='three columns' />
            <div className='six columns'>
              <form className='form-wrap' role='form' action='javascript:;'
             method='post' id='register-form' autoComplete='on'>
                <h1>Register</h1>
                <div className='form-group'>
                  <label for="registerEmailInput">Email</label>
                  <input className='u-full-width' type='email'
                   placeholder='user@example.com' id='registerEmailInput' />
                </div>

                <div className='form-group'>
                  <label for="usernameRegisterInput">Username</label>
                  <input className='u-full-width' type='text'
                   placeholder='username' id='usernameRegisterInput' />
                </div>

                <div className='form-group'>
                  <label for='loginPasswordInput'>Password</label>
                  <input className='u-full-width' type='password'
                  id='loginPasswordInput' placeholder='password' />
                </div>

                <div className='form-group'>
                  <label for='loginPassword2Input'>Password Again</label>
                  <input className='u-full-width' type='password'
                  id='loginPassword2Input' placeholder='repeat password' />
                </div>
                
                <div className='form-group'>
                  <button className='button button-primary u-full-width' onClick={function() {
                    self.register();
                  }}>Register</button>
                </div>
              </form>

              <a className='specialLink' href='/login'>Already registered? Login</a>

              <hr />

            </div>
          </div>
        </div>


      </div>
    );
  }
});

module.exports = RegisterPage;