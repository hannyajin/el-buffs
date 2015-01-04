/** @jsx React.dom */

var React = require('react');
var page = require('page');

var navigate = function (url) {
  return function () {
    page(url);
  }
};

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
        console.log(ctx.state);

        self.setState({
          component: (
            <div id='site'>
              <header>
                <div className='container'>
                  <div className='row'>
                    <Nav pathname={ctx.state.pathname}/>
                  </div>
                </div>
              </header>
              <div id='view'>
                <div className='container'>
                  <Component params={ctx.params} querystring={ctx.querystring} />
                  <Component params={ctx.params} querystring={ctx.querystring} />
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
      });
    });

    page.start();
  },

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
      }]
    }
  },

  activate: function (index) {
    this.state.active = index;
    console.log("new index: " + index);
  },

  render: function () {
    var self = this;
    var components = this.state.navItems.map(function (item, index) {
      return <NavItem activate={self.activate} index={index}
        active={self.state.active === index} url={item.url} text={item.text} />
    });

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
    this.props.activate(this.props.index);
    navigate(this.props.url)();
    console.log(this.props);
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

/* Routes */

var routes = [
  ['/', Home],
  ['/users', Users],
  ['/users/:id', Users],
  ['/query', Query],
  ['/code', Code],
  ['*', PageNotFound],
];

/* Render */
React.render(<Router routes={routes} />, document.getElementById('main'));