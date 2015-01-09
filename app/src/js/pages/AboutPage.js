var React = require('react');

var utils = require('../utils');
var text = utils.generateIpsum(160);

var AboutPage = React.createClass({
  render: function () {
    return (
      <div className="page">
        <div className="container">

          <div className='row'>
            <div className='six columns'>
                <h1>About Page</h1>
                <div>
                  {text}
                </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
});

module.exports = AboutPage;