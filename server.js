var config = require('./server/config/config');
var db = require('./server/config/db');
var bookmarks = require('./server/api/bookmarks.js');
var users = require('./server/api/users.js');
var folders = require('./server/api/folders.js');
var reset = require('./server/api/passwordReset.js');
var express = require('express');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var winston = require('winston');
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
var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            name: '404-errors',
            level: 'info',
            filename: './server/logs/request-errors.log',
            prettyPrint: true,
            handleExceptions: false,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.File({
            name: 'stack-trace',
            level: 'error',
            filename: './server/logs/stack-errors.log',
            prettyPrint: true,
            handleExceptions: false,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: true
        })
    ],
    exitOnError: false
});

//initialize db
db.init();
app.set('x-powered-by', false);
app.use(mySession);

/*  Not overwriting default views directory of 'views' */
if( app.get('env') != 'development' ) {
  app.set('views', __dirname + '/www/views');
  app.use(express.static(__dirname+'/www/public'));
}
else
{
  app.use(express.static('public'));
}

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
app.get('/', users.loginForm);
app.post('/login', users.login);
//app.get('/logout', users.logout);
app.get('/signup', users.signupForm);
app.post('/signup', users.signup);
app.get('/passwordReset', reset.passwordresetForm);
app.post('/passwordReset', reset.passwordReset);

/*  This must go between the users routes and the books routes */
//app.use(users.auth);

/**
 * Redirect to login page if user isn't logged in.
 * Note: Place login route before this and any routes that require login after this.
 */
function requireLogin(req, res, next) {
    if (!req.userId){
        res.redirect('/login');
    } else {
        next();
    }
};

app.get('/list/:folder_id(\\d+)?',requireLogin ,bookmarks.listBookmarks, bookmarks.listFolders, bookmarks.list);
app.get('/bookmarks/edit/:bookmark_id(\\d+)', requireLogin, bookmarks.edit);
app.get('/bookmarks/delete/:bookmark_id(\\d+)', requireLogin,bookmarks.delete);
//app.get('/books/confirmdelete/:book_id(\\d+)', books.confirmdelete);
app.post('/bookmarks/update/:bookmark_id(\\d+)', requireLogin,bookmarks.update);
app.post('/insert',requireLogin ,bookmarks.insert);

app.get('/list/starred', requireLogin ,bookmarks.listStarred);
app.get('/bookmarks/:bookmark_id(\\d+)/star', requireLogin,bookmarks.star);
app.get('/bookmarks/:bookmark_id(\\d+)/unstar', requireLogin,bookmarks.unstar);

app.post('/folders', folders.insert);
app.get('/folders/delete/:folder_id(\\d+)',folders.delete);

// http://www.mcanerin.com/EN/search-engine/robots-txt.asp use to generate and
// set trap if a disallowed endpoint is hit and log them.
app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.sendFile(app.get('views')+'/robots.txt');
});

app.use('/delete',function(req, res, next){

  logger.log('info', "Malicious",
              {timestamp: Date.now(), url: req.url, method: req.method, ip: req.ip}
            );
  res.type('txt').send("Woah there. Very suspicious request. You've been flagged.");
});

//error middleware to process any errors that come around
function logErrors(err, req, res, next)
{
  logger.log('error', 'stack-trace',
              {timestamp: Date.now(), pid: process.pid, url: req.url, method: req.method, ip: req.ip, stack: err.stack}
            );
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

app.listen(config.PORT, function () {
  console.log('Bookmarx app listening on port ' + config.PORT + '!');
});

/*
url: '/login1',
  method: 'GET',

*/


/* Redirect all 404 to 404.html */
app.use(function(req, res, next){

  logger.log('info', "404-errors",
              {timestamp: Date.now(), pid: process.pid, url: req.url, method: req.method, ip: req.ip}
            );
  res.status(404);
  // respond with html page
  if (req.accepts('html')) {
    res.sendFile(app.get('views')+'/404.html');
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
