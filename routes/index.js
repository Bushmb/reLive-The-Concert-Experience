var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('main.html', { title: 'reLive' });
});

router.get('/login', function(req, res, next) {
    res.render('login.html', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res) {
    res.render('signup.html', { message: req.flash('loginMessage') });
});

router.get('/logout', function(req, res) {
    req.logout();
    console.log("USER IS SIGNED OUT");
    res.redirect('/');
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/users',
    failureRedirect: '/signup',
    failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/users',
    failureRedirect: '/login',
    failureFlash: true,
}));


// GET /auth/spotify
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in spotify authentication will involve redirecting
//   the user to spotify.com. After authorization, spotify will redirect the user
//   back to this application at /auth/spotify/callback
router.get('/auth/spotify',
    passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private', 'playlist-modify-public'], showDialog: true}),
    function(req, res){
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
});


// GET /auth/spotify/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user will be redirected back to the
//   login page. Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/callback',
    passport.authenticate('spotify', { failureRedirect: '/login' }),
    function(req, res) {
    res.redirect('/users/');
  });

router.get('/users', isLoggedIn, function(req, res) {
    res.render('search.html', { user: req.user });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/');
}
