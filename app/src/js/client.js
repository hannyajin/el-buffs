// Client API
var base_url = location.protocol + "//" + location.hostname + ":" + location.port + "/";

// client info
var token = null; // client token (logged in)


user = {
  username: null,
  email: null,
  lastlogin: null,
};

var client = {
  setToken: function (_token) {
    token = _token;
  },

  setUser: function(usr) {
    user = usr;
  },

  getUser: function() {
    return user;
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
      .done(function(data, status, xhr) {
        token = data.token;
        user = data.userData;
        
        // save token into localStorage
        localStorage.setItem("token", token);

        done(data, status, xhr);
      }).fail(fail);
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

// get token from localStorage
$(function(){
  console.log("-- IN TOKEN SETUP --");

  var i = localStorage.getItem("token");
  if (i) {
    token = i;
    var data = {token: token}
    client.send('token', JSON.stringify(data), function doneToken(data) {
      console.log("Token Success: " + data);
      user.username = data.username;
      user.email = data.email;
    }, function failToken() {
      console.log("Token Fail");
    });
  } else {
    console.log("-- No Token in Local Storage --");
  }
});

module.exports = client;
