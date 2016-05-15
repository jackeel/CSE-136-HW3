/*  TODO: Add Function Blocks

 */

var db = require('../config/db');

/**
 * Renders the page with the list.ejs template, using req.bookmarks and req.olders.
 */
module.exports.list = function(req, res) {
    res.render('index', {
        bookmarks: req.bookmarks,
        folders: req.folders,
        errors: res.locals.error_messages
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

module.exports.listStarred = function(req, res) {
  db.query('SELECT * from bookmarks WHERE star = 1 ORDER BY id', function(err, bookmarks) {
    if(err) throw err;
    db.query('SELECT * from folders ORDER BY id', function(err, folders) {
      if(err) throw err;
        res.render('index', {bookmarks: bookmarks, folders: folders});
    });
  });
};

/**
 * Selects information about the passed in bookmark and
 * renders the edit confirmation page with the edit.ejs template
 */
module.exports.edit = function(req, res) {
  var id = req.params.bookmark_id;
  db.query('SELECT * from bookmarks WHERE id =  ' + id, function(err, bookmark) {
    if (err) throw err;
    db.query('SELECT * from folders ORDER BY id', function(err, folders) {
      if (err) throw err;
      res.render('bookmarks/edit', {bookmark: bookmark[0], folders: folders, errors: res.locals.error_messages});
    });
  });
};

/**
 * Deletes the passed in book from the database.
 * Does a redirect to the list page
 */
module.exports.delete = function(req, res) {
  var id = req.params.bookmark_id;
  db.query('DELETE from bookmarks where id = ' + id, function(err){
    if (err) throw err;
    res.redirect('/list');
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

    var validate_insert = {
      'title': {
          optional: true
      },
      'url': {
          optional: {
              options: [{checkFalsy: true}]
          },
          isURL: {
              errorMessage: 'Invalid URL'
          }
      },
      'folder_id': {
          notEmpty: true,
          isLength: {
              options: [{min: 1, max:11}]
          },
          isInt: true,
          errorMessage: 'Invalid folder id'
      }
    };

    req.checkBody(validate_insert);
    var errors = req.validationErrors();

    if (errors) {
        req.flash('error_messages', errors);
        res.redirect('/list#addModal');  // flash error to the add modal
    } else {
        var queryString = 'INSERT INTO bookmarks (title, url, folder_id) VALUES (' + title + ', ' + url + ', ' + folder_id + ')';
        db.query(queryString, function(err){
      	if (err) throw err;
          res.redirect('/list');
        });
    }
};

/**
 * Updates a bookmark in the database
 * Does a redirect to the list page
 */
module.exports.update = function(req, res){
    var id = req.params.bookmark_id;
    var title = db.escape(req.body.title);
    var url = db.escape(req.body.url);
    var folder_id = db.escape(req.body.folder_id);

      var validate_update = {
        'title': {
            optional: true
        },
        'url': {
            optional: {
                options: [{checkFalsy: true}]
            },
            isURL: {
                errorMessage: 'Invalid URL'
            }
        },
        'folder_id': {
            notEmpty: true,
            isLength: {
                options: [{min: 1, max:11}]
            },
            isInt: true,
            errorMessage: 'Invalid folder id'
        }
      };

      req.checkBody(validate_update);
      var errors = req.validationErrors();

      if (errors) {
          req.flash('error_messages', errors);
          res.redirect('/bookmarks/edit/' + id);  // flash error to edit page
      } else {
          var queryString = 'UPDATE bookmarks SET title = ' + title + ', url = ' + url + ', folder_id = ' + folder_id +
                            ' WHERE id = ' + id;
          db.query(queryString, function(err){
              if (err) throw err;
              res.redirect('/list');
          });
    }
};

/**
 * Star a bookmark
 * Redirect to the list page
 */
module.exports.star = function(req, res) {
  var id = req.params.bookmark_id;
  var queryString = 'UPDATE bookmarks SET star = 1 WHERE id = ' + id;
  db.query(queryString, function(err){
    if (err) throw err;
    res.redirect('/list');
  });
};

/**
 * Unstar a bookmark
 * Redirect to the list page
 */
module.exports.unstar = function(req, res) {
  var id = req.params.bookmark_id;
  var queryString = 'UPDATE bookmarks SET star = 0 WHERE id = ' + id;
  db.query(queryString, function(err){
    if (err) throw err;
    res.redirect('/list');
  });
};
