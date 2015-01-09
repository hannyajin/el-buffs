var React = require('react');

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

module.exports = Footer;