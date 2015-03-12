var React = require('react');

var client = require('../client');
var Cloud = require('./Cloud');

// input forms for creating cloud
var CreateCloud = React.createClass({
  getInitialState: function () {
    return {swap: false}
  },
  swap: function () {
    this.setState({swap: !this.state.swap});
  },
  handleCreate: function() {
    var t = $('#createcloud_title').val();
    var d = $('#createcloud_desc').val();

    var self = this;

    client.api.clouds(null, t, d,
       function done (data, status, xhr) {
      console.log('In cloudlist, success');
      self.swap();
    }, function fail (xhr, status, err) {
      console.log('In cloudlist, fail');
    });

    $('#createcloud_title').val('');
    $('#createcloud_desc').val('');
  },

  render: function() {
    return (
      <div>
        <button style={{display: this.state.swap ? "none":"block"}} type='button' onClick={this.swap}>Create Cloud</button>

        <div style={{display: !this.state.swap ? "none":"block"}}>
          <input type='text' id='createcloud_title' />
          <input type='text' id='createcloud_desc' />

          <button type='button' onClick={this.swap}>Cancel</button>
          <button type='button' onClick={this.handleCreate}>Create Cloud</button>
        </div>
      </div>
    );
  }
});

var CloudList = React.createClass({
  getInitialState: function() {
    var list = user.clouds;
    return {list: user.clouds};
  },

  render: function () {
    var user = client.getUser();
    var list = user.clouds;
    console.log("list: " + list);

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
