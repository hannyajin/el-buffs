var React = require('react');

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

module.exports = Dropdown;