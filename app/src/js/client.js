// Client API
var base_url = location.protocol + "//" + location.hostname + ":" + location.port + "/";
var base_api_url = base_url + 'api/';


var utils = require('./utils');

// user data
user = {
  loggedIn: false,
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

// api calls to host/api/*
// requires being logged in
var api = {
  clouds: function(parentCloud, title, desc, done, fail) {

    var data = {
      parentCloud: null, // TODO
      title: title,
      desc: desc,
    }

    function success (data, status, xhr) {
      utils.showXHR(xhr, 'success');
      done(data, status, xhr);
    }

    function error (xhr, status, err) {
      utils.showXHR(xhr, 'error');
      fail(xhr, status, err);
    }

    ajax({
      type: 'POST',
      url: base_api_url + 'clouds',
      data: JSON.stringify(data),
      contentType: 'application/json; utf-8',
      dataType: 'json',

      success: success,
      error: error
    });
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
    return (user.token != null && user.loggedIn);
  },

  logout: function() {
    if (user.token != null) {
      utils.showMessage("Loggin out...", 'info');

      function success (data, status, xhr) {
        user.token = null;
        user.loggedIn = false;
        setTimeout(function() {
          var msg = "You've successfully logged out";
          utils.showMessage(data.message || msg, 'success');
          utils.navigate('/');
        }, 300);
      }

      function error (xhr, status, err) {
        utils.showXHR(xhr);
      }

      ajax({
        type: 'GET',
        url: base_url + 'logout',
        // data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',

        success: success,
        error: error
      });
    } else {
      utils.showMessage("You're not logged in.", 'info');
    }
  },

  api: api,

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

      user.loggedIn = true;
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
      var msg = "You've successfully registered!";
      utils.showMessage(xhr.message || msg, 'success');
      done(data, status, xhr);
    };

    function error (xhr, status, err) {
      console.log('Registration Failed, status: ' + status);
      utils.showXHR(xhr);
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
      user.loggedIn = true;
    };

    function error(xhr, status, error) {
      console.log("Token Fail");
      user.token = null;
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
    user.token = null;
    // no saved local Token to use for auto login
    console.log("-- No Token in Local Storage --");
  }
});

module.exports = client;
