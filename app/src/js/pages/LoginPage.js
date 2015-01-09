var React = require('react');
var utils = require('../utils');

var LoginPage = React.createClass({
  forgotPassword: function (str) {
    if (str === 'show') {
      $('.overlay').fadeIn();
      $('#forget-modal').slideDown();
    } else {
      $('.overlay').fadeOut();
      $('#forget-modal').slideUp();
    }
  },
  render: function () {
    var self = this;

    return (
      <div className='page'>
        <div className='overlay' />
        <div className='container' id='loginContainer'>
          <div className='row centerBlock'>
            <div className='three columns' />
            <div className='six columns'>
              <form className='form-wrap' role='form' action='javascript:;'
             method='post' id='login-form' autoComplete='on'>
                <h1>Login</h1>
                <div className='form-group'>
                  <label for="loginEmailInput">Email</label>
                  <input className='u-full-width' type='email'
                   placeholder='user@example.com' id='loginEmailInput' />
                </div>

                <div className='form-group'>
                  <label for='loginPasswordInput'>Password</label>
                  <input className='u-full-width' type='password'
                  id='loginPasswordInput' placeholder='password' />
                </div>
                
                <div className='form-group'>
                  <button className='button button-primary u-full-width' onClick={function() {
                    utils.animateOnce('#loginContainer', 'animated shake');
                  }}>Login</button>
                </div>
              </form>

              <a className='forgotPasswordLink'
               onClick={function () {
                self.forgotPassword('show');
               }} href='javascript:;'>Forgot your password?</a>

              <hr />

              <div className='modal'>
                <div id='forget-modal' className='six columns'>
                  <div className='modal-content'>
                    <div className='modal-header'>
                      <button type='button' className='close' onClick={function () {
                        self.forgotPassword('hide');
                       }}>
                        <span>X</span>
                      </button>
                      <h4 className='modal-title'>Password Recovery</h4>
                    </div>
                    <div className='modal-body'>
                      <p>Type your email address</p>
                      <input type='email' name='recovery-email' id='recovery-email'
                       autoComplete='off'></input>
                    </div>
                    <div className='modal-footer'>
                      <button type='button' className='button' onClick={function () {
                        self.forgotPassword('hide');
                       }}>Cancel</button>
                      <button type='button' className='button button-primary' onClick={function () {
                        self.forgotPassword('hide');
                       }}>Recovery</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>


      </div>
    );
  }
});

module.exports = LoginPage;