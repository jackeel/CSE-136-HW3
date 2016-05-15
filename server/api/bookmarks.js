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
  var folder_id = req.params.folder_id;
  if (!folder_id) {
    db.query('SELECT * from bookmarks ORDER BY id', function(err, bookmarks) {
    if (err) throw err;
    req.bookmarks = bookmarks;
    return next();
    });
  }
  else {
    db.query('SELECT * from bookmarks' + ' WHERE folder_id = ' + folder_id + ' ORDER BY id', function(err, bookmarks) {
      if (err) throw err;
      req.bookmarks = bookmarks;
      return next();
    });
  }
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
 * Selects information about the passed in bood and then
 * renders the edit confirmation page with the edit.ejs template
 */
module.exports.edit = function(req, res) {
  var id = req.params.bookmark_id;
  db.query('SELECT * from bookmarks WHERE id =  ' + id, function(err, bookmark) {
    if (err) throw err;
    db.query('SELECT * from folders ORDER BY id', function(err, folders) {
      if (err) throw err;
      res.render('bookmarks/edit', {bookmark: bookmark[0], folders: folders});
    });
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
  var id = req.params.bookmark_id;
  var title = db.escape(req.body.title);
  var url = db.escape(req.body.url);
  var folder_id = db.escape(req.body.folder_id);

  var queryString = 'UPDATE bookmarks SET title = ' + title + ', url = ' + url + ', folder_id = ' + folder_id + ' WHERE id = ' + id;
  db.query(queryString, function(err){
    if (err) throw err;
    res.redirect('/list');
  });
};
