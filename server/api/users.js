var config = require('../config/config');
var db = require('../config/db');
var crypto = require('crypto');
var winston = require('winston');
var CONTENT_TYPE_KEY = 'Content-Type';
var JSON_CONTENT_TYPE = 'application/json';
var Constants = require('../config/Constants');

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

function handleError(status_code, err, action, req, res)
{
    logger.log('debug', "user-actions: "+ action,
              {timestamp: Date.now(), ip: req.ip, erro: err.code}
            );
    if (req.get(CONTENT_TYPE_KEY) == JSON_CONTENT_TYPE) {
        res.status(status_code).json({ status: Constants.status.error, data: action });
        return false;
    }
    return true;
}


/**
 * Render forms
 */
module.exports.loginForm = function(req, res){
    res.render('login', {
        successes: res.locals.success_messages,
        errors: res.locals.error_messages
    });
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
                options: [{min: 1, max: 25}],
                errorMessage: 'Username must be 1-25 characters'
            },
        },
        'password': {
            isLength: {
                options: [{min: 1, max: 64}],
                errorMessage: 'Password must be 1-64 characters'
            },
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
            if (err)
            {
                if(handleError(500, err, 'Error selecting username', req, res))
                {
                    errors = [{msg: 'An unexpected error occurred.'}];
                    res.render('login', {errors: errors});
                }
                return;
            }
            if(rows.length == 1) {
                var salt = rows[0].salt;
                var hash = crypto
                  .createHmac('SHA256', salt)
                  .update(password)
                  .digest('base64');

                var queryString = 'SELECT id FROM users WHERE username = ' + username + ' AND password = "' + hash + '"';

                db.query(queryString, function(err, rows) {
                    if (err)
                    {
                        if(handleError(500, err, 'Error selecting username', req, res))
                        {
                            errors = [{msg: 'An unexpected error occurred.'}];
                            res.render('login', {errors: errors});
                        }
                        return;
                    }

                    if (rows.length == 1) {
                        req.session.userId = rows[0].id;
                        res.redirect('/list?offset=1');
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
                options: [{min: 1, max: 25}],
                errorMessage: 'Username must be 1-25 characters'
            }
        },
        'password': {
            isLength: {
                options: [{min: 1, max: 64}],
                errorMessage: 'Password must be 1-64 characters'
            }
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
      if(req.get(CONTENT_TYPE_KEY) == JSON_CONTENT_TYPE) {
        console.log("400 calling");
            res.status(400).json({
            status: Constants.status.failed,
            failedMessages: Constants.failedMessages.FAIL
        });
        return;
      }
      else {
        res.render('signup', {errors: errors});
        return;
      }
    } else {
        // Fields are valid. Continue signup
        var username = db.escape(req.body.username);
        var email = db.escape(req.body.email);
        var password = db.escape(req.body.password);
        var confirm_password = db.escape(req.body.confirm_password);

        // Valid data so insert user
        var salt = crypto.randomBytes(32).toString('base64');
        var hash = crypto
              .createHmac('SHA256', salt)
              .update(password)
              .digest('base64');

        var queryString = 'INSERT INTO users (username, password, email, salt) VALUES ' +
                          '(' + username + ', "' +  hash + '", ' + email + ', "' + salt + '")';
        console.log(queryString);
        db.query(queryString, function(err, rows) {
            if (err) {
              if (req.get(CONTENT_TYPE_KEY) == JSON_CONTENT_TYPE) {
                res.status(200).json({
                status: Constants.status.SUCCESS,
                successMessages: Constants.successMessages.OK
              });
              return;
              }
              else {
                errors = [{msg: 'Email/username already taken'}];
                res.render('signup', {errors: errors});
                return;
              }
            }
            if (req.get(CONTENT_TYPE_KEY) == JSON_CONTENT_TYPE) {
                  res.status(200).json({
                  status: Constants.status.SUCCESS,
                  successMessages: Constants.successMessages.OK
                });
                return;

            }
            var successes = [{msg: 'You have signed up'}];
            req.flash("success_messages", successes);
            var queryString = 'SELECT id FROM users WHERE username = ' + username + ' AND password = "' + hash + '"';
            db.query(queryString, function(err, rows) {
                if (err)
                {
                    if(handleError(500, err, 'Error selecting username', req, res))
                    {
                        errors = [{msg: 'An unexpected error occurred.'}];
                        res.render('signup', {errors: errors});
                    }
                    return;
                }
            req.session.userId = rows[0].id;
            res.redirect('/list?offset=1');
            logger.log('debug', "user-actions: login",
                {timestamp: Date.now(), user:username, ip: req.ip}
            );
            });
        });
    }
};

/**
 * Clear out the session to logout the user
 */
module.exports.logout = function(req, res) {
    var successes = [{msg: 'You have logged out'}];
    req.flash('success_messages', successes);

    req.session.destroy();  // must flash message first before destroying session
    res.redirect('/login');
};
