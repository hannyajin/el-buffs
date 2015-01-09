/** @jsx React.dom */

var React = require('react');
var page = require('page');

/* Utils */
var utils = require('./utils');

/* Components */

var Router = require('./components/Router');

var HomePage = require('./pages/HomePage');
var QueryPage = require('./pages/QueryPage');
var UsersPage = require('./pages/UsersPage');
var CodePage = require('./pages/CodePage');
var PageNotFound = require('./pages/PageNotFound');
var LoginPage = require('./pages/LoginPage');

/* Routes */

var routes = [
  ['/', HomePage],
  ['/users', UsersPage],
  ['/users/:id', UsersPage],
  ['/query', QueryPage],
  ['/code', CodePage],
  ['/login', LoginPage],
  ['*', PageNotFound],
];

/* Render */
React.render(<Router routes={routes} />, document.getElementById('main'));