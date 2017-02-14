var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');

var port = process.env.PORT || 8080;

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var search = require('./routes/search');
var photos = require('./routes/photos');
// var artist = require('./routes/artist');

var configDB = require('./config/database.js');

dotenv.load();

mongoose.Promise = global.Promise;

mongoose.connect(configDB.url);

var app = express();

// Using the .html extension instead of
// having to name the views as *.ejs
app.engine('.html', require('ejs').__express);

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html')

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'shhsecret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport);

app.use('/', routes);
app.use('/users', isLoggedIn, users);
// put middleware to check auth
app.use('/search', isLoggedIn, search);
// app.use('/artist', artist);
app.use('/photos', isLoggedIn, photos);


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

app.listen(port, () => console.log(
  `Your app is listening on port ${port}`));

module.exports = app;

function isLoggedIn(req, res, next) {
  console.log("middleware hit")
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}
