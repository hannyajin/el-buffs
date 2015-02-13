var base_url = location.protocol + "//" + location.hostname + ":" + location.port + "/";

var token = null;

var client = {
  setToken: function (_token) {
    token = _token;
  },

  send: function (url, data, done, fail) {
    $.ajax({
      type: 'POST',
      url: base_url + url,
      data: data,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json'
    })
      .done(done).fail(fail);
  },

  login: function (data, done, fail) {
    console.log('in CLIENT API: login!');
    console.log('data.username: ' + data.username);
    console.log('data.password: ' + data.password);

    $.ajax({
      type: 'POST',
      url: base_url + 'login',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json'
    })
      .done(done).fail(fail);
  },

  register: function (data, done, fail) {
    $.ajax({
      type: 'POST',
      url: base_url + 'register',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json'
    })
      .done(done).fail(fail);
  }
}


module.exports = client;