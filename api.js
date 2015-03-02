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

  // password salt
  var salt = 'cute_giraffes';

  function log(str) {
    console.log(str);
  }; // log

  function authenticate (email, password, done) {
    db.models.User.findOne({email: email}, function (err, doc) {
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
          return done(null, false, {id: 2, message: 'Incorrect Password.', error: 'Incorrect Password. ['+ doc.password +'] - ['+ sha1(password + salt) +']'});
        }
      } else {
        // not found
        return done(null, false, {id: 3, message: 'No such user found.'});
      }
    });
  }; // authenticate

  app.post('/token', function (req, res, next) {
    console.log('IN POST TOKEN');
    var json = req.body;

    var user =  tokenStore[json.token];
    if (user) {
      console.log('Token Found: ' + user);

      // send the user data back to the client
      // TODO check for expiration date etc
      var data = {
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
        comments: user.comments,
        clouds: user.clouds,
      };
      return res.status(200).json(user);
    } else {
      // no such token identified for a user
      console.log('No Token Found');
      return res.status(400);
    }
  });

  app.post('/login', function (req, res, next) {
    console.log('IN POST LOGIN');
    console.log(req.body);
    var json = req.body;

    authenticate(json.email, json.password, function (err, user, info) {
      if (err) { return next(err); }
      if (!user) {
        console.log('!user: ' + info.message || 'No user found.');
        return res.status(401).json({
          error: info.message || 'No such user found.', message: info.message || 'No such user found.', id: info.id
        });
      }

      // user logged in, create token authentication
      var token = jwt.sign({username: user.username}, tokenSecret);
      if (tokenStore[token]) {
        // this shouldn't happen
        console.log("ERROR: 51:api.js - TOKEN ALREADY SIGNED!!!");
        return res.status(401).json({error: 'Incident has been reported.'});
      } else {
        tokenStore[token] = user;
      }
      console.log("User ["+ (user.email || user.username) +"] has logged in successfully!");

      var userData = {
        email: user.email,
        username: user.username,
      }

      return res.status(200).json({token: token, userData: userData});
    });
  }); // login

  app.post('/register', function (req, res, next) {
    console.log('IN POST REGISTER');
    console.log(req.body);
    var json = req.body;

    var email = json.email;
    var username = json.username;
    var password = json.pass;;

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
        console.log("Registering new user with password: " + data.password);
        console.log("Given password was ["+ password +"] and salt ["+ salt +"]");
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

    var token = req.get('Authorization') || req.body.token;

    console.log('User Token: ' + token);

    if (tokenStore[token]) {
      delete tokenStore[token];

      return res.status(200).json({message: 'Successfully logged out!'}).redirect('/');
    }

    return res.status(400).json({error: 'Not logged in.', message: 'You are not logged in'});
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


  /* API V0
   * the api router under host/api/*
   * These api calls requries the user to be logged in (valid token) */
  var apirouter = express.Router();

  // defines root middleware that handles/grabs the Authorization header
  // from the request and adds into onto the request object for easy access
  // in subsequent paths by calling next()
  apirouter.use('/', function (req, res, next) {
    console.log('(((ROOT)) In api root middleware');
    var token = req.get('Authorization') || req.body.token;
    req.token = token;
    req.user = tokenStore[token];
    console.log('   TOKEN: ' + token);
    next();
  });

  apirouter.get('/users/:me', function (req, res) {
    if (req.user) {
      return res.status(200).json({username: req.user.username, email: req.user.email});
    }
    return res.status(400).json({error: 'Not logged in.'});
  });

  apirouter.post('/clouds', function (req, res) {
    console.log('IN API/CLOUDS POST');

    var json = req.body;

    console.log('json.title: ' + json.title);

    if (req.user) {
      var cloud = {
        creator: req.user._id,
        cloud: json.parentCloud, // null for no parent
        title: json.title,
        desc: json.desc,
        tags: json.tags,

        members: json.members,
        invites: json.invites,
      };

      console.log('creating cloud...');
      db.models.Cloud.create( cloud, function (err, doc) {
        if (err) {
          console.log('cloud creation error: ' + err);
          return res.status(500).json({
            error: "Internal server error, couldn't create cloud",
            message: "Internal server error 500, failed to create cloud."
          });
        }
        // else saved
        console.log('cloud created: ' + doc);
        return res.status(201).json({
          doc: cloud,
          message: "Cloud was Successfully created!"
        });
      });
    } else {
      // not allowed to create cloud when not logged in
      return res.status(405).json({
        error: 'Cloud creation required login',
        message: 'You need to be logged in to create a cloud'
      });
    }
  });

  app.use('/api/', apirouter);
} // api

module.exports = api;
