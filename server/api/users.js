var config = require('../config/config');
var db = require('../config/db');
var crypto = require('crypto');

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
    var password = db.escape(req.body.password);

    var validate_login = {
        'username': {
            isLength: {
                options: [{min: 0, max: 25}],
                errorMessage: 'Username must be 0-25 characters'
            },
            errorMessage: 'Invalid username'
        },
        'password': {
            isLength: {
                options: [{min: 0, max: 64}],
                errorMessage: 'Password must be 0-64 characters'
            },
            errorMessage: 'Invalid password'
        }
    };
    req.checkBody(validate_login);
    var errors = req.validationErrors();

    if (errors) {
        res.render('login', {errors: errors});
    } else {
        var hash = crypto
              .createHmac('SHA256',config.SECRET)
              .update(password)
              .digest('base64');

        var queryString = 'SELECT username FROM users WHERE username = ' + username + ' AND password = "' + hash + '"';

        db.query(queryString, function(err, rows) {

            if (err)
            {
              throw err;
            }

            if (rows.length == 1) {
                req.session.user = req.body.username;
                res.redirect('/list');
            } else {
                res.redirect('/login');
            }
        });
    }
};

/**
 * Sign up user.
 */
module.exports.signup = function(req, res) {

    var username = db.escape(req.body.username);
    var email = db.escape(req.body.email);
    var password = db.escape(req.body.password);
    var confirm_password = db.escape(req.body.confirm_password);


    var validate_signup = {
        'email': {
            isEmail: {
                errorMessage: 'Invalid email'
            }
        },
        'username': {
            isLength: {
                options: [{min: 0, max: 25}],
                errorMessage: 'Username must be 0-25 characters'
            },
            errorMessage: 'Invalid username'
        },
        'password': {
            isLength: {
                options: [{min: 0, max: 64}],
                errorMessage: 'Password must be 0-64 characters'
            },
            errorMessage: 'Invalid password'
        },
        'confirm_password': {
            matches: {
                options: [req.body.password],
                errorMessage: 'Passwords must match'
            },
        }
    };
    req.checkBody(validate_signup);
    var errors = req.validationErrors();

    if (errors) {
        res.render('signup', {errors: errors});
    } else {
        var hash = crypto
              .createHmac('SHA256',config.SECRET)
              .update(password)
              .digest('base64'); 

        var queryString = 'INSERT INTO users (username, password) VALUES (' + username + ', "' +  hash + '")';

        db.query(queryString, function(err, rows) {

            if (err) throw err;
          
            res.redirect('/login');
        });
    }
};

/**
 * Reset password
 */
module.exports.passwordReset = function(req, res) {
    var validate_passwordReset = {
        'email': {
            isEmail: {
                errorMessage: 'Please enter a valid email'
            }
        }
    };

    req.checkBody(validate_passwordReset);
    var errors = req.validationErrors();

    if (errors) {
        res.render('passwordReset', {errors: errors});
    } else {
        // TODO: send confirmation email, etc.
    }
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