var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var url = require('url'); // to parse urls

var port = process.env.port || 8000;

var browserify = require('browserify-middleware');

app.use(express.static(__dirname + '/dist'));

app.get('/main.js', function (req, res) {
  return res.sendFile(__dirname + '/app/dist/js/main.js');
});
app.get('/main.css', function (req, res) {
  return res.sendFile(__dirname + '/app/dist/css/main.css');
});

app.get('/img/*', function (req, res) {
  return res.sendFile(__dirname + '/app/src/' + req.url);
});

app.get('/fonts/*', function (req, res) {
  var parts = url.parse(req.url);
  console.log("FONTS: " + req.url);
  console.log("FONTS: " + parts.pathname);
  return res.sendFile(__dirname + '/app/src/' + parts.pathname);
});

app.get('/*', function (req, res) {
  return res.sendFile(__dirname + '/app/index.html');
});

io.on('connection', function (socket) {
  console.log('a user has connected.');

  socket.on('disconnect', function () {
    console.log('a user has disconnected.');
  });
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});