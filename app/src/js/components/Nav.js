var React = require('react');

var Logo = require('./Logo');
var utils = require('../utils');
var client = require('../client');

function getState() {
  var items = null;
  if (!client.isLoggedIn()) {
    items = [{
      url: '/',
      text: 'Home'
    },{
      url: '/about',
      text: 'About'
    },{
      url: '/login',
      text: 'Login'
    }];
  } else {
    items = [{
      url: '/',
      text: 'Home'
    },{
      url: '/about',
      text: 'About'
    },{
      url: '/dashboard',
      text: 'Dashboard'
    }]
  }

  return {
    active: 0,
    navItems: items
  }
}

var Nav = React.createClass({
  getInitialState: function () {
    return getState();
  },

  render: function () {
    var self = this;
    this.state = getState();
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
    utils.navigate(this.props.url);
  },
  render: function () {
    return (
      <li>
        <a className={this.props.active ? 'active' : ''} onClick={this.handleClick}>{this.props.text}</a>
      </li>
    );
  }
});

module.exports = Nav;
