var config = require('../config/config');
var db = require('../config/db');
var crypto = require('crypto');
var winston = require('winston');

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            name: 'user-actions',
            level: 'debug',
            filename: './server/logs/db.log',
            prettyPrint: true,
            handleExceptions: false,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        })
    ],
    exitOnError: false
});

/**
 * Render forms
 */
module.exports.loginForm = function(req, res){
    res.render('login');
};

module.exports.signupForm = function(req, res){
    res.render('signup');
};

/**
 * Attempt to login the user.  Redirect to /list on successful login and /login on unsuccessful attempt.
 */
module.exports.login = function(req, res) {
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
        var username = db.escape(req.body.username);
        var password = db.escape(req.body.password);

        // Find user with provided username/password
        var queryString = 'SELECT salt FROM users WHERE username = ' + username;
        db.query(queryString, function(err, rows) {
            if (err) throw err;
            if(rows.length == 1) {
                var salt = rows[0].salt;
                var hash = crypto
                  .createHmac('SHA256', salt)
                  .update(password)
                  .digest('base64');

                var queryString = 'SELECT id FROM users WHERE username = ' + username + ' AND password = "' + hash + '"';

                db.query(queryString, function(err, rows) {
                    if (err) throw err;

                    if (rows.length == 1) {
                        req.session.userId = rows[0].id;
                        res.redirect('/list');
                        logger.log('debug', "user-actions: login",
                            {timestamp: Date.now(), user:username, ip: req.ip}
                        );
                    } else {
                        errors = [{msg: 'Incorrect username/password'}];
                        res.render('login', {errors: errors});
                    }
                });
            } else {
                errors = [{msg: 'Provided username doesn\'t exist'}];
                res.render('login', {errors: errors});
            }
        });
    }
};

/**
 * Sign up user.
 */
module.exports.signup = function(req, res) {
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
            equals: {
                options: [req.body.password],
                errorMessage: 'Passwords must match'
            },
        }
    };
    req.checkBody(validate_signup);
    var errors = req.validationErrors();

    if (errors) {
        res.render('signup', {errors: errors});
        return;
    } else {
        // Fields are valid. Continue signup
        var username = db.escape(req.body.username);
        var email = db.escape(req.body.email);
        var password = db.escape(req.body.password);
        var confirm_password = db.escape(req.body.confirm_password);

    /*
        // Check if username already exists
        var queryString = 'SELECT id FROM users WHERE username = ' + username;
        db.query(queryString, function(err, rows) {
                if(err) throw err;
                if(rows.length > 0) {
                    errors = [{msg: 'Username already taken'}];
                    res.render('signup', {errors: errors});
                    console.log("inside query ..." + errors.msg);
                    return;
                }
        });

        // Check if email already exists
        var queryString = 'SELECT id FROM users WHERE email = ' + email;
        db.query(queryString, function(err, rows) {
            if(err) throw err;
            if(rows.length > 0) {
                errors = [{msg: 'Email already taken'}];
                res.render('signup', {errors: errors});
                return;
            }
        }); 
    */

        // Valid data so insert user
        var salt = crypto.randomBytes(32).toString('base64');
        var hash = crypto
              .createHmac('SHA256', salt)
              .update(password)
              .digest('base64');

        var queryString = 'INSERT INTO users (username, password, email, salt) VALUES ' +
                          '(' + username + ', "' +  hash + '", ' + email + ', "' + salt + '")';

        db.query(queryString, function(err, rows) {
            if (err) throw err;
            var successes = [{msg: 'You have signed up'}];
            res.render('login', {successes: successes});
            logger.log('debug', "user-actions: new user",
              {timestamp: Date.now(), user:username, ip: req.ip}
            );
        });
    }
};

/**
 * Clear out the session to logout the user
 */
module.exports.logout = function(req, res) {
    var successes = [{msg: 'You have logged out.'}]
    req.session.destroy();
    res.render('login', {successes: successes});
};