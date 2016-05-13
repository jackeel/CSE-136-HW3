/*  TODO: Add Function Blocks

 */

var db = require('../config/db');

/**
 * Renders the page with the list.ejs template, using req.bookmarks and req.olders.
 */

module.exports.list = function(req, res) {
    res.render('index', {
        bookmarks: req.bookmarks,
        folders: req.folders
    });
}

/**
 * Query all bookmarks and put in req, use next().
 */
module.exports.listBookmarks = function(req, res, next) {
  db.query('SELECT * from bookmarks ORDER BY id', function(err, bookmarks) {
    if (err) throw err;
    req.bookmarks = bookmarks;
    return next();
  });
};

/**
 * Query all folders and put in req, use next().
 */
module.exports.listFolders = function(req, res, next) {
  db.query('SELECT * from folders ORDER BY id', function(err, folders) {
    if (err) throw err;
    req.folders = folders;
    return next();
  });
};


/**
 *
 * Selects information about passed in book and then
 * renders the delete confirmation page with the delete.ejs template
 */
module.exports.confirmdelete = function(req, res){
  var id = req.params.book_id;
  db.query('SELECT * from books WHERE id =  ' + id, function(err, book) {
    if (err) throw err;
    res.render('books/delete', {book: book[0]});
  });
};

/**
 *
 * Renders the add page with the add.ejs template
 */
module.exports.add = function(req, res) {
  res.render('add');
};

/**
 *
 * Selects information about the passed in bood and then
 * renders the edit confirmation page with the edit.ejs template
 */
module.exports.edit = function(req, res) {
  var id = req.params.book_id;
  db.query('SELECT * from books WHERE id =  ' + id, function(err, book) {
    if (err) throw err;

    res.render('books/edit', {book: book[0]});
  });
};

/**
 * Deletes the passed in book from the database.
 * Does a redirect to the list page
 */
module.exports.delete = function(req, res) {
  var id = req.params.book_id;
  db.query('DELETE from books where id = ' + id, function(err){
    if (err) throw err;
    res.redirect('/books');
  });
};

/**
 * Adds a new book to the database
 * Does a redirect to the list page
 */
module.exports.insert = function(req, res){
  var title = db.escape(req.body.title);
  var url = db.escape(req.body.url);
  var folder_id = db.escape(req.body.folder_id);

  var queryString = 'INSERT INTO bookmarks (title, url, folder_id) VALUES (' + title + ', ' + url + ', ' + folder_id + ')';
  db.query(queryString, function(err){
	if (err) throw err;
    res.redirect('/list');
  });
};

/**
 * Updates a book in the database
 * Does a redirect to the list page
 */
module.exports.update = function(req, res){
  var id = req.params.book_id;
  var title = db.escape(req.body.title);
  var author = db.escape(req.body.author);
  var price = db.escape(req.body.price);

  var queryString = 'UPDATE books SET title = ' + title + ', author = ' + author + ', price = ' + price + ' WHERE id = ' + id;
  db.query(queryString, function(err){
    if (err) throw err;
    res.redirect('/books');
  });
};
