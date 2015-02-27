// Client API
var base_url = location.protocol + "//" + location.hostname + ":" + location.port + "/";

// client info
var token = null; // client token (logged in)

// user data
user = {
  token: null,

  username: null,
  email: null,
  lastlogin: null,

  clouds: [],
  comments: [],
};

var client = {
  setToken: function (tkn) {
    user.token = tkn;
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
        
        user.username = data.userData.username;
        user.email = data.userData.email;
        user.lastlogin = data.userData.lastlogin;

        user.clouds = data.userData.clouds;
        user.comments = data.userData.comments;
        
        user.token = data.token;
        // save token into localStorage
        localStorage.setItem("token", user.token);

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
$(function() {
  console.log("-- IN TOKEN SETUP --");

  var i = localStorage.getItem("token");
  if (i) {
    user.token = i;
    var data = {token: user.token}
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
