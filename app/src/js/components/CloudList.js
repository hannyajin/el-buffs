var React = require('react');

var client = require('../client');
var Cloud = require('./Cloud');

var CreateCloud = React.createClass({
  handleClick: function() {
    alert('Creating a cloud...');
  },

  render: function() {
    return (
      <div>
        <button type='button' onClick={this.handleClick}>Create Cloud</button>
      </div>
    );
  }
});

var CloudList = React.createClass({
  getInitialState: function() {
    var list = user.clouds;
    if (list.length > 0) return null;
    // add some defaul temp clouds
    list.push({
      creator: 'Kalle',
      cloud: null, // no parent cloud
      title: 'Sample Title',
      desc: 'This is a sample cloud for testing.',
      tags: ['a_tag', 'b_tag'],
    });

    // TODO get ajax data from cloud??
    return null;
  },

  render: function () {
    var user = client.getUser();
    var list = user.clouds;

    // create an array of Clouds
    if (list) {
      list = list.map(function (index) {
        return (
            <li>
              <a>
                <Cloud data={index} />
              </a>
            </li>
        );
      });
    }

    return (
      <div className='cloudList'>
        <ul>
          <CreateCloud />
          {list}
        </ul>
      </div>
    );
  }
});

module.exports = CloudList;
