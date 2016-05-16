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
module.exports.passwordReset = function(req, res){
    // Uncomment once email is added
    // var email = db.escape(req.body.email);
    // var queryString = 'SELECT * FROM users WHERE email = ' + email;
    var username = db.escape(req.body.username);
    var queryString = 'SELECT * FROM users WHERE username = ' + username;
    db.query(queryString, function(err, users) {
        if(err) throw err;
        if (users.length == 1) {
            var generatedLink = 'DUMMY LINK';
            setMailOptions(mailOptions, users[0].username, users[0].email, generatedLink);

            smtpTransport.sendMail(mailOptions, function(error, info) {
                if(error) {
                    console.log(error);
                } else {
                    res.render('passwordReset'); // TODO: email sent message
                }
            });
        } else {
            res.render('passwordReset', {errors: [{msg: "No account exists for that email."}]});
        }
    });
};


/**
 * Set params for mailOptions.
 */
function setMailOptions(mailOptions, username, email, link) {
    mailOptions.from = 'BookmarxBot@gmail.com';
    // Hardcode your own email here to test.
    mailOptions.to = 'jal179@ucsd.edu'; // Use email once it's added to schema
    mailOptions.subject = 'Bookmarx - Password Reset Link';
    mailOptions.text = 'Hello ' + username +
                       ', \n\nYou told us you forgot your password. ' +
                       'Use the following link to set a new password.\n\n' + link + ' \n\n' +
                       'If you didn\'t mean to reset your password, ignore this email and your email will stay the same.' +
                       '\n\nThe Bookmarx Team';
    mailOptions.html = '<p>Hello ' + username+ ',</p><br><p>You told us you forgot your password. ' +
                       'Use the following link to set a new password.</p><br><br>' +
                       '<a href="' + link + '">' + link + '</a><br><br>' +
                       '<p>If you didn\'t mean to reset your password, ignore this email and your email will stay the same.</p>' +
                       '<br><br><p>The Bookmarx Team</p>';
}