var config = require('../config/config');
var db = require('../config/db');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var CONTENT_TYPE_KEY = 'Content-Type';
var JSON_CONTENT_TYPE = 'application/json';
var Constants = require('../config/Constants');
//var users = require('users.js');
var session = require('express-session');
var winston = require('winston'); 

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            name: 'password-reset',
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

function handleError(err, action, req, res)
{
    logger.log('debug', "password-reset: "+ action,
              {timestamp: Date.now(), userId:req.session.userId , ip: req.ip, erro: err.code}
            );
    if (req.get(CONTENT_TYPE_KEY) == JSON_CONTENT_TYPE) {
        res.status(500).json({ status: Constants.status.error, data: action });
    }
}


module.exports.passwordresetForm = function(req, res){
  if (req.get(CONTENT_TYPE_KEY) == JSON_CONTENT_TYPE) {
        res.status(200).json({
        status: Constants.status.SUCCESS,
        //msg: Constants.successMessages.OK
        successMessages: successMessages.OK
      })
  }
  else {
    res.render('passwordReset');
  }
};

var smtpTransport = nodemailer.createTransport('smtps://BookmarxBot%40gmail.com:b00kmarx@smtp.gmail.com');
var mailOptions = {
    from: '',
    to: '',
    subject: '',
    text: '',
    html: ''
};

/**
 *  Send reset link to email if the email exists.
 *  Then redirect with success/error message.
 */
module.exports.passwordReset = function(req, res) {
   if (!req.session.userId) {
    var validate_passwordReset = {
        'username': {
            isLength: {
                options: [{min: 0, max: 25}],
                errorMessage: 'Username must be 1-25 characters'
            },
        },
        'password': {
            isLength: {
                options: [{min: 0, max: 64}],
                errorMessage: 'Password must be 1-64 characters'
            },
        },
        'confirm_password': {
            equals: {
                options: [req.body.password],
                errorMessage: 'Passwords must match'
            },
        }
    };
  }
  else {
    var validate_passwordReset = {
        'password': {
            isLength: {
                options: [{min: 0, max: 64}],
                errorMessage: 'Password must be 1-64 characters'
            },
        },
        'confirm_password': {
            equals: {
                options: [req.body.password],
                errorMessage: 'Passwords must match'
            },
        }
    };
  }
    req.checkBody(validate_passwordReset);
    var errors = req.validationErrors();
    if (errors) {
      if(req.get(CONTENT_TYPE_KEY) == JSON_CONTENT_TYPE) {
            res.status(400).json({
            status: Constants.status.failed,
            failedMessages: Constants.failedMessages.FAIL
        })
      }
        else {
          res.render('passwordReset', {errors: errors});
          return;
        }
    } else {
        // Uncomment once email is added
        // var email = db.escape(req.body.email);
        // var queryString = 'SELECT * FROM users WHERE email = ' + email;
        if (!req.session.userId)
           var username = db.escape(req.body.username);
        else
            var usersession = req.session.userId;

        var password = db.escape(req.body.password);
        var confirm_password = db.escape(req.body.confirm_password);
        var queryString;
        if (!req.session.userId)
            queryString = 'SELECT * FROM users WHERE username = ' + username;
        else
            queryString = 'SELECT * FROM users WHERE id = ' + usersession;

        db.query(queryString, function(err, rows) {
            if(err)
            {
              handleError(err, 'select username', req, res);
              return; 
            }

            if(rows.length == 1) {
                var salt = crypto.randomBytes(32).toString('base64');
                var hash = crypto
                      .createHmac('SHA256', salt)
                      .update(password)
                      .digest('base64');
                var updateQueryString;
                if (!req.session.userId)
                   updateQueryString = 'UPDATE users SET password = "' + hash + '", salt = "' + salt + '" WHERE username = ' + username;
                else
                   updateQueryString = 'UPDATE users SET password = "' + hash + '", salt = "' + salt + '" WHERE id = ' + usersession;

                console.log(updateQueryString);
                db.query(updateQueryString, function(err) {
                    if (err)
                    {
                      handleError(err, 'update user password', req, res);
                      return; 
                    }
                    if (req.get(CONTENT_TYPE_KEY) == JSON_CONTENT_TYPE) {
                      console.log("inside the success");
                          res.status(200).json({
                          status: Constants.status.SUCCESS,
                          successMessages: Constants.successMessages.OK
                        })

                    setMailOptions(mailOptions, username, rows[0].email);
                    //setMailOptions(mailOptions, rows[0].username, rows[0].email, generatedLink);

                    smtpTransport.sendMail(mailOptions, function(error, info) {
                        if(error) {
                            // throw error;
                            console.log(error);
                            return;
                        }
                      });
                    }
                      else {
                        var successes = [{msg: 'Confirmation email sent'}];
                        res.render('passwordReset', {successes: successes});
                      }

                });
                /**************************/
              }

            else {
                errors = [{msg: 'Provided user does not exist'}];
                res.render('passwordReset', {errors: errors});
            }
        });
    }
};


/**
 * Set params for mailOptions.
 */
//function setMailOptions(mailOptions, username, email, link) {
function setMailOptions(mailOptions, username, email) {
    mailOptions.from = 'BookmarxBot@gmail.com';
    // Hardcode your own email here to test.
    mailOptions.to = email; // Use email once it's added to schema
    mailOptions.subject = 'Bookmarx - Password Reset Successful';
    mailOptions.text = 'Hello ' + username +
                       ', \n\nYour Password has been reset successfully. ' +
                       //'If you didn\'t mean to reset your password, ignore this email and your password will stay the same.' +
                       '\n\nThe Bookmarx Team';
    mailOptions.html = '<p>Hello ' + username+ ',</p><br><p>Your Password has been reset successfully. ' +
                       //'<p>If you didn\'t mean to reset your password, ignore this email and your password will stay the same.</p>' +
                       '<br><br><p>The Bookmarx Team</p>';
}
