function api (app) {
  var express = require('express');
  var db = require('./db');
  var sha1 = require('sha1');
  var mail = require('./mail');

  var base_url = 'HTTP://localhost:8000/';

  /* Login */
  var store = {};
  var tokenStore = {};
  var activationStore = {};

  var jwt = require('jsonwebtoken');
  var tokenSecret = 'pineapple';

  var salt = 'cute_giraffes';

  function log(str) {
    console.log(str);
  }; // log

  function authenticate (username, password, done) {
    db.models.User.findOne( function (err, doc) {
      if (err) {
        return done(err);
      }
      if (doc) {
        // found
        if (doc.password === sha1(password + salt)) {
          if (doc.emailVerified) {
            return done(null, doc);
          } else {
            return done(null, false, {id: 1, message: 'Email not verified.'});
          }
        } else {
          return done(null, false, {id: 2, message: 'Incorrect Password.'});
        }
      } else {
        // not found
        return done(null, false, {id: 3, message: 'No such user found.'});
      }
    });
  }; // authenticate

  app.post('/login', function (req, res, next) {
    console.log('IN POST LOGIN');
    console.log(req.body);
    var json = req.body;

    authenticate(json.username, json.password, function (err, user, info) {
      if (err) { return next(err); }
      if (!user) {
        return res.status(401).json({
          error: 'No such user found.', message: info.message, id: info.id
        });
      }


      // user authenticated
      var token = jwt.sign({username: user.username}, tokenSecret);
      if (tokenSecret[token]) {
        // this shouldn't happen
        console.log("ERROR: 51:api.js - TOKEN ALREADY SIGNED!!!");
        return res.status(401).json({error: 'Incident has been reported.'});
      } else {        
        tokenStore[token] = user;
      }
      return res.status(200).json({token: token});
    });
  }); // login

  app.post('/register', function (req, res, next) {
    console.log('IN POST REGISTER');
    console.log(req.body);
    var json = req.body;

    var email = json.email;
    var username = json.username;
    var password = json.password;

    db.models.User.findOne( {email: email}, function (err, doc) {
      if (err) {
        return res.status(500);
      }
      if (doc) {
        // already exists
        return res.status(409).json({message: 'That username is already in use.'});
      } else {
        // free, can register
        var data = {
          email: email,
          username: username,
          password: sha1(password + salt)
        };
        var user = new db.models.User(data);
        user.save( function (err, doc) {
          if (err) {
            return res.status(500);
          }

          console.log("doc: " + doc);

          var activationId = sha1(Date.now() + "d");
          // Send activation email
          var url = base_url+'activate/'+activationId;
          opts = {
            to: doc.email,
            subject: 'Buffclouds verification email',
            html: '<div>Hello, activate your email by clicking\
            the below link. If you did not register at Buffclouds\
            then please ignore this email.<br>\
            <a href="'+url+'">'+url+'</a></div>'
          };
          mail.sendMail(opts, function (err, info) {
            if (err) {
              console.log('Error sending verification email: ' + err);
            } else {
              console.log('verification email sent.');
            }
          });
          // setup activation function
          activationStore[activationId] = function (rq, rs) {
            doc.emailVerified = true;
            doc.save( function (err, doc) {
              if (err) {
                return rs.status(500).json({error: 'Couldnt verify email - please try again.'});
              }
              delete activationStore[activationId];
              return rs.status(200).json({message: 'email Successfully verified!'});
            });
          }

          return res.status(201).json({
            message: 'Successfully created user ['+username+']. Please verify email ['+email+'].',
            username: username,
            email: email
          });
        });
      }
    });
  }); // register

  app.get('/logout', function (req, res) {
    console.log('IN GET LOGOUT');
    console.log(req.body);
    var json = req.body;

    var token = req.get('Authorization').split(' ', 1)[1] || req.body.token;
    if (tokenSecret[token]) {
      delete tokenSecret[token];

      return res.status(200).json({message: 'Bye bye.'}).redirect('/');
    }

    return res.status(400).json({error: 'Not logged in.'});
  }); // logout

  app.get('/activate/:id', function (req, res) {
    console.log('IN GET ACTIVATE:ID');
    var id = req.params.id;

    if (activationStore[id]) {
      activationStore[id](req, res);
    } else {
      return res.status(404);
    }
  });


  /* API V0 */
  var router = express.Router();

  router.get('/', function (req, res, next) {
    var token = req.get('Authorization').split(' ', 1)[1] || req.body.token;
    req.token = token;
    req.user = tokenStore[token];
    next();
  })

  router.get('/users/:me', function (req, res) {
    if (req.user) {
      return res.status(200).json({username: req.user.username, email: req.user.email});
    }
    return res.status(400).json({error: 'Not logged in.'});
  });

  app.use('/api/', router);
} // api

module.exports = api;