var React = require('react');
var page = require('page');

var Nav = require('./Nav');
var Footer = require('./Footer');
var AccountBox = require('./AccountBox');

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

module.exports = Router;