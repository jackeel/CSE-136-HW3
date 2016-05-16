var db = require('../config/db');
var nodemailer = require('nodemailer');
var express = require('express');
var app = express();
var crypto = require('crypto');
var config = require('../config/config');


var user = "";
var pass = "";
// create reusable transporter object using the default SMTP transport
//var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');
module.exports.passwordresetForm = function(req, res){
  res.render('passwordReset');
};

module.exports.passwordReset = function(req, res){
  var username = db.escape(req.body.username);
  var queryString = 'SELECT username FROM users WHERE username = "' + username + '"';
  db.query(queryString, function(err, user) {
    if (user.length == 1) {
       user = user[0].username;
       pass = user[1].password;
    }
  });
  var newPassword = db.escape(req.body.newPassword);
  var retypePassword = db.escape(req.body.retypePassword);
  console.log(user);
  if (newPassword == retypePassword) {
    var queryUpdateString = 'UPDATE users SET password = ' + newPassword + 'WHERE username = ' + username;
    db.query(queryUpdateString, function(err, user) {
      if (err) throw err;
      //res.redirect('/login');
    });
  }
};

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "email@email.com", //I need to put the email id
        pass: "pass" // password of the email id
    }
});


// setup e-mail data with unicode symbols
app.get('/passwordReset', function(req, res) {
var mailOptions = {
    from: '"Fred Foo 👥" <dummytest@tester.com>', // sender address
    to: 'sohanthapa10@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world 🐴', // plaintext body
    html: '<b>Hello world 🐴</b>' // html body
};


// send mail with defined transport object
smtpTransport.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
    smtpTransport.close();

});
});
