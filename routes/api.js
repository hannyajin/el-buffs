function api (app) {
  var db = require('./db');

  /* Login */
  var store = {};

  var jwt = require('jsonwebtoken');
  var tokenSecret = 'pineapple';

  var bodyParser = require('body-parser');
  app.use(bodyParser.json());

  function log(str) {
    console.log(str);
  };


  function authenticate (username, password, done) {
    var u = store[username];
    if (u) {
      log('----------- In Authenticate and User Store ------------');
      if (u.password === password) {
        // login success
        return done(null, u);
      } else {
        // wrong password
        return done(null, false, {message: 'Incorrect Password.'});
      }
    } else {
      // no such user found
      return done(null, false, {message: 'No such username found.'});
    }
  };

  app.post('/login', function (req, res, next) {
    console.log('IN POST LOGIN');
    console.log(req.body);
    var json = req.body;

    authenticate(json.username, json.password, function (err, user, info) {
      if (err) { return next(err); }
      if (!user) {
        return res.status(401).json({error: 'No such user found.', message: info.message});
      }

      // user authenticated
      var token = jwt.sign({username: user}, tokenSecret);
      return res.json({token: token});
    });
  });

  app.post('/register', function (req, res, next) {
    console.log('IN POST REGISTER');
    console.log(req.body);
    var json = req.body;

    var username = json.username;
    var password = json.password;

    var u = store[username];
    if (u) {
      // username already exists, 409 conflict
      return res.status(409).json({message: 'That username is already in use.'});
    } else {
      // username is free
      store[username] = {
        username: username,
        email: '',
        password: password,
        emailVerified: false
      };
      // 201 created
      return res.status(201).json({
        message: 'Successfully created user ['+username+']. Please verify email.'
      });
    }
  });
}

module.exports = api;