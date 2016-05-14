/*  This file is a stub for a full blown user management system.
 Values are hard coded for example purposes
 */

var config = require('../config/config');
var db = require('../config/db');

/**
 * Render forms
 */
module.exports.loginForm = function(req, res){
  res.render('login');
};

module.exports.signupForm = function(req, res){
  res.render('signup');
};

module.exports.passwordresetForm = function(req, res){
  res.render('passwordReset');
};

/**
 * Attempt to login the user.  Redirect to /books on successful login and /login on unsuccessful attempt.
 */
module.exports.login = function(req, res) {
  var username = db.escape(req.body.username);
  var password = db.escape(req.body.password);  // TODO: hash + salt

  var queryString = 'SELECT username FROM users WHERE username = ' + username + ' AND password = ' + password;

  db.query(queryString, function(err, rows) {
    if (err) throw err;

    if (rows.length == 1) {
      req.session.user = req.body.username;
      res.redirect('/list');
    } else {
      res.redirect('/login');
    }
  });
};

/**
 * Sign up user.
 */
module.exports.signup = function(req, res) {
  var username = db.escape(req.body.username);
  var password = db.escape(req.body.password);  // TODO: hash + salt

  var queryString = 'INSERT INTO users (username, password) VALUES (' + username + ', ' + password + ')';
  db.query(queryString, function(err) {
    if (err) throw err;
    
    res.redirect('/login');
  });
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