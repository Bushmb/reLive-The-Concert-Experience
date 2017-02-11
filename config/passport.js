var LocalStrategy = require('passport-local').Strategy;
var SpotifyStrategy = require('../lib/passport-spotify/index').Strategy;
var User = require('../models/user');
var configAuth = require('./auth');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({ 'local.email':  email }, function(err, user) {
        if (err)
            return done(err);
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          var newUser = new User();
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    User.findOne({ 'local.email':  email }, function(err, user) {
      if (err)
          return done(err);
      if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.'));
      if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
      return done(null, user);
    });
  }));

  // Use the SpotifyStrategy within Passport.
  //   Strategies in Passport require a `verify` function, which accept
  //   credentials (in this case, an accessToken, refreshToken, and spotify
  //   profile), and invoke a callback with a user object.
 
  passport.use(new SpotifyStrategy({
    clientID: configAuth.spotifyAuth.clientID,
    clientSecret: configAuth.spotifyAuth.clientSecret,
    callbackURL: configAuth.spotifyAuth.callbackURL,
    },
    function(accessToken, refreshToken, profile, done) {
      console.log("REAL ACCESS TOKEN!!!!!" + accessToken);
      process.nextTick(function() {
        console.log(profile.photos[0]);
        User.findOne({ 'spotify.id': profile.id }, function(err, user) {
          if (err)
            return done(err);
          if (user) {
            user.spotify.token = accessToken;
            user.save(function(err) {
            if (err)
              throw err;
            return done(null, user);
            })

           } else {
            console.log("WORKING???");
            console.log("PROFILE", profile);
            var newUser = new User();
            newUser.spotify.id = profile.id;
            newUser.spotify.token = accessToken;
            newUser.spotify.name = profile.username;
            newUser.spotify.email = profile.emails[0].value;
            newUser.spotify.photo = profile.photos[0];
            // newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
            // newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();
            newUser.save(function(err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });
      });
  }));



};



