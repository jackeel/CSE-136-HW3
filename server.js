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
  cookie: { secure: false }
});

var app = express();
app.use(mySession);

/*  Not overwriting default views directory of 'views' */
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

/* Routes - consider putting in routes.js */
app.get('/login', users.loginForm);
app.post('/login', users.login);
//app.get('/logout', users.logout);
app.get('/signup', users.signupForm);
app.post('/signup', users.signup);
app.get('/passwordReset', users.passwordresetForm);

/*  This must go between the users routes and the books routes */
//app.use(users.auth);

app.get('/list/:folder_id(\\d+)?', bookmarks.listBookmarks, bookmarks.listFolders, bookmarks.list);
app.get('/bookmarks/edit/:bookmark_id(\\d+)', bookmarks.edit);
app.get('/bookmarks/delete/:bookmark_id(\\d+)', bookmarks.delete);
//app.get('/add', bookmarks.add);
//app.get('/books/confirmdelete/:book_id(\\d+)', books.confirmdelete);
//app.get('/books/delete/:book_id(\\d+)', books.delete);
app.post('/bookmarks/update/:bookmark_id(\\d+)', bookmarks.update);
app.post('/insert', bookmarks.insert);



app.listen(config.PORT, function () {
  console.log('Example app listening on port ' + config.PORT + '!');
});
