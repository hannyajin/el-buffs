var React = require('react');

var Cloud = React.createClass({
  render: function () {
    var d = this.props.data;

    return (
      <div className='cloud'>
        <a href='/' title={d.title}>
          <img src={d.imgsrc} />
          <span>{d.title}</span>
        </a>
          <span>{d.desc}</span>
      </div>
    );
  }
});

module.exports = Cloud;
