var React = require('react');

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

module.exports = Logo;