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
    var password = req.body.password;
    var retypePassword = req.body.retypePassword;
    if (password == retypePassword) {
    var username = db.escape(req.body.username);
    var queryString = 'SELECT * FROM users WHERE username = ' + username;
    db.query(queryString, function(err, users) {
        if(err) throw err;
        if (users.length == 1) {
            var generatedLink = 'DUMMY LINK';
            var password = crypto
                  .createHmac('SHA256',config.SECRET)
                  .update(req.body.password)
                  .digest('base64');

            var updateQueryString = 'UPDATE users SET password = ' + "'" + password + "'" +  ' WHERE username = ' + username;
            db.query(updateQueryString, function(err, users) {
               if (err) throw err;
            });

            setMailOptions(mailOptions, users[0].username, generatedLink);
            //setMailOptions(mailOptions, users[0].username, users[0].email, generatedLink);

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
  }
  else {
    res.render('passwordReset', {errors: [{msg: "Not same password"}]});
  }

};


/**
 * Set params for mailOptions.
 */
//function setMailOptions(mailOptions, username, email, link) {
function setMailOptions(mailOptions, username,link) {
    mailOptions.from = 'BookmarxBot@gmail.com';
    // Hardcode your own email here to test.
    mailOptions.to = 'sthapa@ucsd.edu'; // Use email once it's added to schema
    mailOptions.subject = 'Bookmarx - Password Reset Successful';
    mailOptions.text = 'Hello ' + username +
                       ', \n\nYour Password has been reset successfully. ' +
                       'If you didn\'t mean to reset your password, ignore this email and your password will stay the same.' +
                       '\n\nThe Bookmarx Team';
    mailOptions.html = '<p>Hello ' + username+ ',</p><br><p>Your Password has been reset successfully. ' +
                       '<p>If you didn\'t mean to reset your password, ignore this email and your password will stay the same.</p>' +
                       '<br><br><p>The Bookmarx Team</p>';
}
