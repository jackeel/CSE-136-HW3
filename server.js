var config = require('./server/config/config');
var db = require('./server/config/db');
var bookmarks = require('./server/api/bookmarks.js');
var users = require('./server/api/users.js');

db.init();

var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var mySession = session({
  secret: 'N0deJS1sAw3some',
  resave: true,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    httpOnly: true,
    maxAge: 3600000 * 24 * 7 //one week 
  }
});

app.set('x-powered-by', false); 
app.use(mySession);


/*  Not overwriting default views directory of 'views' */
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

//global middleware to refresh session 
/*
app.use(function(req, res, next) {
  if (req.session && req.session.user) {

    var queryString = 'SELECT username FROM users WHERE username = ' + req.session.user;

    db.query(queryString, function(err, user) {
      if (err) throw err;

      if (user.length == 1) {
        req.user = user[0]; 
        delete req.user.password; 
        req.session.user = user[0].username;  //refresh the session value
      }
      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
});
*/

/* Routes - consider putting in routes.js */
app.get('/login', users.loginForm);
app.post('/login', users.login);
//app.get('/logout', users.logout);
app.get('/signup', users.signupForm);
app.post('/signup', users.signup);
app.get('/passwordReset', users.passwordresetForm);

/*  This must go between the users routes and the books routes */
//app.use(users.auth);

app.get('/list', bookmarks.list);
//app.get('/books/add', books.add);
//app.get('/books/edit/:book_id(\\d+)', books.edit);
//app.get('/books/confirmdelete/:book_id(\\d+)', books.confirmdelete);
//app.get('/books/delete/:book_id(\\d+)', books.delete);
//app.post('/books/update/:book_id(\\d+)', books.update);
//app.post('/books/insert', books.insert);

//used to confirm user is logged in in combination to the middleware
function requireLogin (req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
};

app.listen(config.PORT, function () {
  console.log('Example app listening on port ' + config.PORT + '!');
});
