var React = require('react');

var utils = require('../utils');
var client = require('../client');

var RegisterForm = React.createClass({
  register: function () {
    var self = this;

    var email = $('#registerContainer #registerEmailInput');
    var username = $('#registerContainer #usernameRegisterInput');
    var pass = $('#registerContainer #registerPasswordInput');
    var pass2 = $('#registerContainer #registerPassword2Input');

    if (email.val().indexOf('@') < 0 || email.val().length < 3
        || pass.val().length < 1 || pass.val() != pass2.val() || username.val().length < 1) {
      utils.animateOnce('#registerContainer', 'animated shake');
    } else {
      // xhr post register
      var data = {
        email: email.val(),
        username: username.val(),
        pass: pass.val(),
        pass2: pass2.val()
      };

      client.register(data, function (data, status, xhr) {
        console.log("Registered. Verify email sent.");
        utils.navigate('/registered');
        //self.showMessage('show');
      }, function (xhr, status, err) {
        utils.animateOnce('#registerContainer', 'animated shake');
      });
    }
  },

  showMessage: function (str) {
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
      <div>

        <div id='registerContainer'>
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
              <label for='registerPasswordInput'>Password</label>
              <input className='u-full-width' type='password'
              id='registerPasswordInput' placeholder='password' />
            </div>

            <div className='form-group'>
              <label for='registerPassword2Input'>Password Again</label>
              <input className='u-full-width' type='password'
              id='registerPassword2Input' placeholder='repeat password' />
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
    );
  }
});

module.exports = RegisterForm;