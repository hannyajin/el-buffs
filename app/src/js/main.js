/** @jsx React.dom */

var React = require('react');
var page = require('page');

/* Utils */
var utils = require('./utils');

/* Components */

var Router = require('./components/Router');

var HomePage = require('./pages/HomePage');
var DashboardPage = require('./pages/DashboardPage');
var AboutPage = require('./pages/AboutPage');
var QueryPage = require('./pages/QueryPage');
var UsersPage = require('./pages/UsersPage');
var CodePage = require('./pages/CodePage');
var PageNotFound = require('./pages/PageNotFound');
var LoginPage = require('./pages/LoginPage');
var RegisterPage = require('./pages/RegisterPage');
var RegisteredPage = require('./pages/RegisteredPage');

/* Routes */

var routes = [
  ['/', HomePage],
  ['/dashboard', DashboardPage],
  ['/about', AboutPage],
  ['/users', UsersPage],
  ['/users/:id', UsersPage],
  ['/query', QueryPage],
  ['/code', CodePage],
  ['/login', LoginPage],
  ['/register', RegisterPage],
  ['/registered', RegisteredPage],
  ['*', PageNotFound],
];

/* Render */
React.render(<Router routes={routes} />, document.getElementById('main'));
