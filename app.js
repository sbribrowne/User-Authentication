var express = require('express');
var app = express();

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');

// link to routes
var routes = require('./routes/router');
app.use('/', routes);

// mongodb connection
mongoose.connect("mongodb://localhost:27017/trax");
var db = mongoose.connection;
// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

//sessions that track logins
app.use(session({
  secret: 'treehouse loves you',
  resave: true,
  saveUninitialized: false
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/template'));

 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});
 
// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json('error', {
    message: err.message,
    error: {}
  });
});

// listen on port 3000
app.listen(6060, function () {
  console.log('Listening on port 6060');
});