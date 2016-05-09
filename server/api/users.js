/*  This file is a stub for a full blown user management system.
 Values are hard coded for example purposes
 */

var config = require('../config/config');

/**
 *
 * Attempt to login the user.  Redirect to /books on successful login and /login on unsuccessful attempt.
 */
module.exports.login = function(req, res) {
  if (req.body.username === config.USERNAME && req.body.password === config.PASSWORD) {
    req.session.user = req.body.username;
    res.redirect('/books');
  }
  else{
    res.redirect('/login');
  }
};

/**
 * Render the login form
 */
module.exports.loginForm = function(req, res){
  res.render('users/login');
};

/**
 * Clear out the session to logout the user
 */
module.exports.logout = function(req, res) {
    req.session.destroy();
    res.redirect('/login');
};

/**
 * Verify a user is logged in.  This middleware will be called before every request to the books directory.
 */
module.exports.auth = function(req, res, next) {
  if (req.session && req.session.user === config.USERNAME) {
    return next();
  }
  else {
    res.redirect('/login');
  }
};