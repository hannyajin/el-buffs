/** @jsx React.dom */

var React = require('react');
var page = require('page');


/* User */
var user = null;

/* Utils */
var utils = (function() {
  var animEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

  function animateOnce(sel, cls) {
    $(sel).addClass(cls).one(animEnd, function () {
      $(this).removeClass(cls);
    })
  };

  function navigate (url) {
    return function () {
      page(url);
    }
  };

  return {
    animateOnce: animateOnce,
    navigate: navigate
  }
})();

/* Components */

var Router = React.createClass({
  getInitialState: function () {
    return {
      component: <div>Initial State</div>
    };
  },

  componentDidMount: function () {
    var self = this;

    this.props.routes.forEach(function (route) {
      var url = route[0];
      var Component = route[1];

      page(url, function (ctx) {
        console.log('STATE: ' + ctx.state);
        console.log('PATHNAME: ' + ctx.pathname);
        console.log('______________');

        self.setState({
          component: (
            <div id='site'>
              <header>
                <div className='container'>
                  <div className='row'>
                    <Nav pathname={ctx.pathname}/>
                    <AccountBox />
                  </div>
                </div>
              </header>
              <div id='view'>
                <div className='view-wrap'>
                  <Component params={ctx.params} querystring={ctx.querystring} />
                </div>
              </div>
              <footer>
                <div>
                  <Footer />
                </div>
              </footer>
            </div>
          )
        });
      }); // page()
    });

    page.start();
  }, // componentDidMount

  render: function () {
    return this.state.component;
  }

});

var Nav = React.createClass({
  getInitialState: function () {
    return {
      active: 0,
      navItems: [{
        url: '/',
        text: 'Home'
      },{
        url: '/about',
        text: 'About'
      },{
        url: '/login',
        text: 'Login'
      }]
    }
  },

  render: function () {
    var self = this;
    var components = this.state.navItems.map(function (item, index) {
      return <NavItem index={index}
        active={self.props.pathname === item.url} url={item.url} text={item.text} />
    });
        
        //active={self.state.active === index} url={item.url} text={item.text} />

    return (
      <div>
        <Logo />
        <nav className="navbar">
          <div className="">
            <ul className="navbar-list">
              {components}
            </ul>
          </div>
        </nav>
      </div>
    );
  }
});

var NavItem = React.createClass({
  handleClick: function () {
    utils.navigate(this.props.url)();
  },
  render: function () {
    return (
      <li>
        <a className={this.props.active ? 'active' : ''} onClick={this.handleClick}>{this.props.text}</a>
      </li>
    );
  }
});

var Home = React.createClass({
  render: function () {
    return (
      <div className="page">Home Page</div>
    );
  }
});

var Query = React.createClass({
  render: function () {
    return (
      <div className="page">Query Page, query: {this.props.querystring}</div>
    );
  }
});

var Users = React.createClass({
  render: function () {
    return (
      <div className="page">Users page. Params: {this.props.params.id}</div>
    );
  }
});

var Code = React.createClass({
  render: function () {
    return (
      <div className="page">Code page.
        <pre>
          <code>
            Code block Code block Code block Code block
          </code>
        </pre>
      </div>
    );
  }
});

var PageNotFound = React.createClass({
  render: function () {
    return (
      <div className="page">404: Page not found!</div>
    );
  }
});

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

var Footer = React.createClass({
  render: function () {
    return (
      <div className='footer'>

        <div className="row cwrapper">
          <a href="">
            <i className="fa fa-2x fa-facebook"></i>
          </a>
          <a href="">
            <i className="fa fa-2x fa-twitter"></i>
          </a>
          <a href="">
            <i className="fa fa-2x fa-pinterest"></i>
          </a>
        </div>

      </div>
    );
  }
});

var Logo = React.createClass({
  render: function () {
    return (
      <div className='logo'>
        <a href='/' title="Go to homepage">
          <span>Buffclouds</span>
        </a>
      </div>
    );
  }
});

user = {
  name: 'Dave'
}
user = null;

var Dropdown = React.createClass({
  render: function () {
    var list = ['Link','Link','Link'];

    list = list.map(function (index) {
      return <li><a>{index}</a></li>
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

/* Routes */

var routes = [
  ['/', Home],
  ['/users', Users],
  ['/users/:id', Users],
  ['/query', Query],
  ['/code', Code],
  ['/login', LoginPage],
  ['*', PageNotFound],
];

/* Render */
React.render(<Router routes={routes} />, document.getElementById('main'));