var config = require('./server/config/config');
var db = require('./server/config/db');
var books = require('./server/api/bookmarks.js');
//var users = require('./users');

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
//app.get('/login', users.loginForm);
//app.post('/login', users.login);
//app.get('/logout', users.logout);

/*  This must go between the users routes and the books routes */
//app.use(users.auth);

app.get('/books', books.list);
//app.get('/books/add', books.add);
//app.get('/books/edit/:book_id(\\d+)', books.edit);
//app.get('/books/confirmdelete/:book_id(\\d+)', books.confirmdelete);
//app.get('/books/delete/:book_id(\\d+)', books.delete);
//app.post('/books/update/:book_id(\\d+)', books.update);
//app.post('/books/insert', books.insert);



app.listen(config.PORT, function () {
  console.log('Example app listening on port ' + config.PORT + '!');
});
