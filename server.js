var config = require('./server/config/config');
var db = require('./server/config/db');
var bookmarks = require('./server/api/bookmarks.js');
var users = require('./server/api/users.js');

db.init();

var express = require('express');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var mySession = session({
  secret: config.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    httpOnly: true,
    maxAge: 3600000 * 24 * 7 //one week 
  }
});

var app = express();

app.set('x-powered-by', false); 
app.use(mySession);


/*  Not overwriting default views directory of 'views' */
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());
app.use(flash());
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

/* Give all views access to any flashed error messages */
app.use(function(req, res, next) {
    res.locals.error_messages = req.flash('error_messages');
    next();
});


//TODO: middleware to check if js is turned off and check user-agent. 
//if missing, log for suspicion. Store ip and differentiate from ajax requests

//global middleware to refresh session 

app.use(function(req, res, next) {

  if(req.session && req.session.userId) {

    var queryString = 'SELECT id FROM users WHERE id = "' + req.session.userId + '"';

    db.query(queryString, function(err, user) {
      if(err)
        {
          next(err);
        }
      if (user.length == 1) {
        req.userId = user[0].id; 
        req.session.userId = user[0].id;  //refresh the session value
      }
      next();
    });
  } 
  else {
    next();
  }
});


/* Routes - consider putting in routes.js */
app.get('/login', users.loginForm);
app.post('/login', users.login);
//app.get('/logout', users.logout);
app.get('/signup', users.signupForm);
app.post('/signup', users.signup);
app.get('/passwordReset', users.passwordresetForm);
app.post('/passwordReset', users.passwordReset);

/*  This must go between the users routes and the books routes */
//app.use(users.auth);

app.get('/list/:folder_id(\\d+)?', requireLogin ,bookmarks.listBookmarks, bookmarks.listFolders, bookmarks.list);
app.get('/bookmarks/edit/:bookmark_id(\\d+)', requireLogin,bookmarks.edit);
app.get('/bookmarks/delete/:bookmark_id(\\d+)', requireLogin,bookmarks.delete);
//app.get('/books/confirmdelete/:book_id(\\d+)', books.confirmdelete);
app.post('/bookmarks/update/:bookmark_id(\\d+)', requireLogin,bookmarks.update);
app.post('/insert', requireLogin ,bookmarks.insert);

app.get('/list/starred', requireLogin ,bookmarks.listStarred);
app.get('/bookmarks/:bookmark_id(\\d+)/star', requireLogin,bookmarks.star);
app.get('/bookmarks/:bookmark_id(\\d+)/unstar', requireLogin,bookmarks.unstar);

// http://www.mcanerin.com/EN/search-engine/robots-txt.asp use to generate and 
// set trap if a disallowed endpoint is hit and log them. 
app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.sendFile('/views/robots.txt', { root: __dirname});
});

//error middleware to process any errors that come around
function logErrors(err, req, res, next)
{
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

//used to confirm user is logged in in combination to the middleware
function requireLogin (req, res, next) {
  if (!req.userId) {
    res.redirect('/login');
  } else {
    next();
  }
};

app.listen(config.PORT, function () {
  console.log('Bookmarx app listening on port ' + config.PORT + '!');
});


app.use(function(req, res, next){
  res.status(404);
  // respond with html page
  if (req.accepts('html')) {
    res.sendFile('/views/404.html', { root: __dirname});
    return;
  }
  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
  // default to plain-text. send()
  res.type('txt').send('Not found');
});
