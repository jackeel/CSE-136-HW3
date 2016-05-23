var config = require('../config/config');
var db = require('../config/db');
var nodemailer = require('nodemailer');
var crypto = require('crypto');


module.exports.passwordresetForm = function(req, res){
    res.render('passwordReset');
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
    var validate_passwordReset = {
      /*
        'email': {
            isEmail: {
                errorMessage: 'Invalid email'
            }
        },
      */
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
    req.checkBody(validate_passwordReset);
    var errors = req.validationErrors();
    if (errors) {
        res.render('passwordReset', {errors: errors});
        return;
    } else {
        // Uncomment once email is added
        // var email = db.escape(req.body.email);
        // var queryString = 'SELECT * FROM users WHERE email = ' + email;
        var username = db.escape(req.body.username);
        var password = db.escape(req.body.password);
        var confirm_password = db.escape(req.body.confirm_password);

        var queryString = 'SELECT * FROM users WHERE username = ' + username;
        db.query(queryString, function(err, rows) {
            if(err) throw err;
            if(rows.length == 1) {
                var salt = crypto.randomBytes(32).toString('base64');
                var hash = crypto
                      .createHmac('SHA256', salt)
                      .update(password)
                      .digest('base64');

                var updateQueryString = 'UPDATE users SET password = "' + hash + '", salt = "' + salt + '" WHERE username = ' + username;
                console.log(updateQueryString);
                db.query(updateQueryString, function(err) {
                    if (err) throw err;
                
                    setMailOptions(mailOptions, username, rows[0].email);
                    //setMailOptions(mailOptions, rows[0].username, rows[0].email, generatedLink);

                    smtpTransport.sendMail(mailOptions, function(error, info) {
                        if(error) {
                            // throw error;
                            console.log(error);
                            return;
                        }

                        var successes = [{msg: 'Confirmation email sent'}];
                        res.render('passwordReset', {successes: successes});
                    });
                });
                /**************************/
            } else {
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