var db = require('../config/db');
var nodemailer = require('nodemailer');

var user = "";
var pass = "";
// create reusable transporter object using the default SMTP transport
//var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');
module.exports.passwordresetForm = function(req, res){
  res.render('passwordReset');
};

module.exports.passwordReset = function(req, res){
  var email = db.escape(req.body.email);
  var queryString = 'SELECT username, password FROM users WHERE email = "' + email + '"';
  db.query(queryString, function(err, user) {
    if (user.length == 1) {
       user = user[0].username;
       pass = user[1].password;
    }
  });
};

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: user,
        pass: pass
    }
});

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '"Fred Foo 👥" <dummytest@tester.com>', // sender address
    to: 'test@testing.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world 🐴', // plaintext body
    html: '<b>Hello world 🐴</b>' // html body
};

/*var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'user@gmail.com',
        pass: 'pass'
    }
};*/

// send mail with defined transport object
smtpTransport.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});
