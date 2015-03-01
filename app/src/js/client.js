// Client API
var base_url = location.protocol + "//" + location.hostname + ":" + location.port + "/";
var base_api_url = base_url + 'api/';
// user data
user = {
  token: null,

  username: null,
  email: null,
  lastlogin: null,

  clouds: [],
  comments: [],
};

// Ajax Json Request
function ajax (xhr) {
  xhr.headers = xhr.headers || {};
  // add Authorization header to headers
  xhr.headers['Authorization'] = user.token;
  $.ajax(xhr);
};

var reqs = {
  json: function (xhr) {
    xhr.contentType = 'application/json; charset=utf-8';
    xhr.dataType = 'json';

    ajax(xhr);
  },
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

  isLoggedIn: function() {
    return (user.token != null);
  },

  createCloud: function(title, value) {
    ajax('createcloud', data,
        function done (data, status, xhr) {
        },
        function fail () {
        });
  },

  login: function (data, done, fail) {
    console.log('in CLIENT API: login!');
    console.log('data.username: ' + data.username);
    console.log('data.password: ' + data.password);

    function success(data, status, xhr) {
      user.username = data.userData.username;

      user.email = data.userData.email;
      user.lastlogin = data.userData.lastlogin;

      user.clouds = data.userData.clouds;
      user.comments = data.userData.comments;

      user.token = data.token;
      // save token into localStorage
      localStorage.setItem("token", user.token);

      console.log('Login Success, status: ' + status);
      done(data, status, xhr);
    };

    function error(xhr, status, err) {
      console.log('Login Failed, status: ' + status);
      fail(xhr, status, err);
    };

    ajax({
      type: 'POST',
      url: base_url + 'login',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',

      success: success,
      error: error
    });
  },

  register: function (data, done, fail) {
    console.log('in CLIENT API: Register!');
    console.log('data.username: ' + data.username);
    console.log('data.password: ' + data.password);

    function success (data, status, xhr) {
      console.log('Registration Success, status: ' + status);
      done(data, status, xhr);
    };

    function error (xhr, status, err) {
      console.log('Registration Failed, status: ' + status);
      fail(xhr, status, err);
    };

    ajax({
      type: 'POST',
      url: base_url + 'register',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',

      success: success,
      error: error
    });
  }
}


// at page load get saved token from localStorage
// and ask for client data from server
$(function() {
  console.log("-- IN TOKEN SETUP --");

  // get token from localStorage
  var tkn = localStorage.getItem("token");
  if (tkn) {
    user.token = tkn;
    var data = {token: user.token}

    function success(data, status, xhr) {
      console.log("Token Success: " + data.username);
      user.username = data.username;
      user.email = user.email;
    };

    function error(xhr, status, error) {
      console.log("Token Fail");
    };

    // ask client info from server based on token
    ajax({
      type: 'POST',
      url: base_url + 'token',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',

      success: success,
      error: error
    });

  } else { 
    // no saved local Token to use for auto login
    console.log("-- No Token in Local Storage --");
  }
});

module.exports = client;
