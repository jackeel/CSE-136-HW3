/*  TODO: Add Function Blocks

 */

var db = require('../config/db');
var fs = require('fs');

/**
 * Renders the page with the list.ejs template, using req.bookmarks and req.olders.
 */
module.exports.list = function(req, res) {
    res.render('index', {
        bookmarks: req.bookmarks,
        folders: req.folders,
        current_folder_id: req.current_folder_id,
        order_by: req.order_by,
        search: req.search,        
        errors: res.locals.error_messages
    });
}

/**
 * Query all bookmarks and put in req, use next().
 */
module.exports.listBookmarks = function(req, res, next) {
  var folder_id = req.params.folder_id;
  var order_by = req.query['SortBy'] ? req.query['SortBy'] : 'bookmarks.id';
  var search = req.query['Search'] ? req.query['Search'] : '';
  req.search = search;
  req.current_folder_id = folder_id;
  req.order_by = order_by;
  search = db.escape('%' + search + '%');

  if ((order_by != "bookmarks.id") && (order_by != "bookmarks.url") && 
      (order_by != "bookmarks.title") && (order_by != "bookmarks.star") &&
      (order_by != "bookmarks.create_date") && (order_by != "bookmarks.last_visit_date")) {
    order_by = "bookmarks.id";
  }
  if (!folder_id) {
    //search = db.escape(search);
    queryString = 'SELECT * FROM (SELECT * FROM folders WHERE user_id = ' +
                  req.session.userId +
                  ') AS user_folder JOIN bookmarks ON bookmarks.folder_id = user_folder.id '  +
                  'WHERE title like ' + search + ' or description like ' + search +
                  ' ORDER BY ' + (order_by == "bookmarks.star" ? order_by + " DESC" : order_by);
    db.query(queryString, function(err, bookmarks) {
        if (err) throw err;
        req.bookmarks = bookmarks;
        return next();
    });
  }
  else {
    folder_id = db.escape(folder_id);
    queryString = 'SELECT * FROM (SELECT * FROM folders WHERE user_id = ' +
                   req.session.userId +
                   ' and id = ' + folder_id +
                   ') AS user_folder JOIN bookmarks ON bookmarks.folder_id = user_folder.id ' +
                   'WHERE title like ' +search + ' or description like ' + search +
                   ' ORDER BY ' + (order_by == "bookmarks.star" ? order_by + " DESC" : order_by);
    db.query(queryString, function(err, bookmarks) {
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
  db.query('SELECT * from folders WHERE user_id = ' + req.session.userId + ' ORDER BY id', function(err, folders) {
    if (err) throw err;
    req.folders = folders;
    return next();
  });
};

module.exports.listStarred = function(req, res) {
  var order_by = req.query['SortBy'] ? req.query['SortBy'] : 'bookmarks.id';
  var search = req.query['Search'] ? req.query['Search'] : '';
  req.order_by = order_by;
  req.search = search;
  search = db.escape('%' + search + '%');

  if ((order_by != "bookmarks.id") && (order_by != "bookmarks.url") && 
      (order_by != "bookmarks.title") && (order_by != "bookmarks.star") &&
      (order_by != "bookmarks.create_date") && (order_by != "bookmarks.last_visit_date")) {
    order_by = "bookmarks.id";
  }
  queryString = 'SELECT * FROM (SELECT * FROM folders WHERE user_id = ' +
                  req.session.userId +
                  ') AS user_folder JOIN bookmarks ON bookmarks.folder_id = user_folder.id ' + 
                  'WHERE bookmarks.star = 1 ' +
                  'and (title like ' + search + ' or description like ' + search +
                  ') ORDER BY ' + order_by;
  db.query(queryString, function(err, bookmarks) {
    if(err) throw err;
    db.query('SELECT * from folders WHERE user_id = ' + req.session.userId + ' ORDER BY id', function(err, folders) {
      if(err) throw err;
        res.render('index', {bookmarks: bookmarks,
                             folders: folders,
                             current_folder_id: "starred",
                             order_by: req.order_by,
                             search: req.search });
    });
  });
};

/**
 * Selects information about the passed in bookmark and
 * renders the edit confirmation page with the edit.ejs template
 */
module.exports.edit = function(req, res) {
   var id = db.escape(req.params.bookmark_id);

  db.query('SELECT * from bookmarks WHERE id = ' + id, function(err, bookmark) {
    if (err) throw err;
    db.query('SELECT * from folders WHERE user_id = ' + req.session.userId +' ORDER BY id', function(err, folders) {
      if (err) throw err;
      res.render('bookmarks/edit', {bookmark: bookmark[0], folders: folders, errors: res.locals.error_messages});
    });
  });
};

/**
 * Deletes the passed in bookmark from the database.
 * Does a redirect to the current page
 */
module.exports.delete = function(req, res) {
  var id = db.escape(req.params.bookmark_id);

  db.query('DELETE from bookmarks where id = ' + id, function(err){
    if (err) throw err;
    res.redirect('back');
    //res.json({"bookmark_id": req.params.bookmark_id});
  });
};

/**
 * Adds a new bookmark to the database
 * Does a redirect to the list page
 */
module.exports.insert = function(req, res){
    req.sanitizeBody('title').trim();
    req.sanitizeBody('url').trim();
    var validate_insert = {
        'title': {
            isLength: {
                options: [{min: 1, max: 25}],
                errorMessage: 'Bookmark title must be 1-25 characters long'
            },
        },
        'url': {
            isLength: {
                options: [{min: 1, max: 2083}],
                errorMessage: 'Bookmark URL must be 1-2083 characters long'
            },
            isURL: {
                errorMessage: 'Invalid URL'
            },
            matches: {
                options: ['^https?://', 'i'],
                errorMessage: 'URL must start with http:// or https://'
            }
        },
        'folder_id': {
            isInt: {
                errorMessage: 'Folder id must be an integer'
            },
            isLength: {
                options: [{min: 1, max:11}],
                errorMessage: 'Invalid folder id'
            }
        }
    };

    //req.sanitizeBody('title').escape();
    //req.sanitizeBody('url').escape();
    req.checkBody(validate_insert);
    var errors = req.validationErrors();
    if (errors) {
        req.flash('error_messages', errors);
        res.redirect('/list');  // flash error to the add modal
    } else {
        var user_id = req.session.userId;
        var title = db.escape(req.body.title);
        var url = db.escape(req.body.url);
        var folder_id = db.escape(req.body.folder_id);

        var queryString = 'INSERT INTO bookmarks (title, url, folder_id) VALUES (' + title + ', ' + url + ', ' + folder_id + ')';
        db.query(queryString, function(err, result){
      	    if (err) {
                errors = [{msg: 'A bookmark with the same title already exists in the selected folder'}]
                req.flash('error_messages', errors);
                res.redirect('/list');
                return;
            }

            res.redirect('back');
            //res.json({"bookmark_id": result.insertId,
            //          "title": req.body.title,
            //          "url": req.body.url,
            //          "folder_id": req.body.folder_id});
            
        });
    }
};

/**
 * Updates a bookmark in the database
 * Does a redirect to the list page
 */
module.exports.update = function(req, res){
    var bookmark_id = req.params.bookmark_id;

    req.sanitizeBody('title').trim();
    req.sanitizeBody('url').trim();

    var validate_update = {
        'title': {
            isLength: {
                options: [{min: 1, max: 25}],
                errorMessage: 'Bookmark title must be 1-25 characters'
            },
        },
        'url': {
            isLength: {
                options: [{min: 1, max: 2083}],
                errorMessage: 'Bookmark URL must be 1-2083 characters'
            },
            isURL: {
                errorMessage: 'Invalid URL'
            },
            matches: {
                options: ['^https?://', 'i'],
                errorMessage: 'URL must start with http:// or https://'
            }
        },
        'folder_id': {
            isInt: {
                errorMessage: 'Folder id must be an integer'
            },
            isLength: {
                options: [{min: 1, max:11}],
                errorMessage: 'Invalid folder id'
            }
        }
    };

    req.checkBody(validate_update);
    //req.sanitizeBody('title').escape();
    //req.sanitizeBody('url').escape();
    var errors = req.validationErrors();

    if (errors) {
        req.flash('error_messages', errors);
        res.redirect('/bookmarks/edit/' + bookmark_id);  // flash error to edit page
    } else {
        var title = db.escape(req.body.title);
        var url = db.escape(req.body.url);
        var folder_id = db.escape(req.body.folder_id);
        var queryString = 'UPDATE bookmarks SET title = ' + title + ', url = ' + url + ', folder_id = ' + folder_id +
                          ' WHERE id = ' + db.escape(bookmark_id);

        db.query(queryString, function(err){
            if (err) {
                errors = [{msg: 'A bookmark with the same title already exists in the selected folder'}]
                req.flash('error_messages', errors);
                res.redirect('/bookmarks/edit/' + bookmark_id);
                return;
            }

            res.redirect('/list');
        });
    }
};

/**
 * Star a bookmark
 * Redirect to the current page
 */
module.exports.star = function(req, res) {
  var id = db.escape(req.params.bookmark_id);
  var queryString = 'UPDATE bookmarks SET star = 1 WHERE id = ' + id;
  db.query(queryString, function(err){
    if (err) throw err;
    res.redirect('back');
    //res.json({"bookmark_id": req.params.bookmark_id});
  });
};

/**
 * Unstar a bookmark
 * Redirect to the current page
 */
module.exports.unstar = function(req, res) {
  var id = db.escape(req.params.bookmark_id);
  var queryString = 'UPDATE bookmarks SET star = 0 WHERE id = ' + id;
  db.query(queryString, function(err){
    if (err) throw err;
    res.redirect('back');
    //res.json({"bookmark_id": req.params.bookmark_id});
  });
};
//
module.exports.download = function(req, res){
    //console.log(req.bookmarks);
    //var listFolder = [];
    var folderMap = {}
    req.bookmarks.forEach(function(bookmark) {
      var bookmark_id = bookmark["id"];
      var user_id = bookmark["user_id"];
      var folder_name = bookmark["name"];
      var title = bookmark["title"];
      var url = bookmark["url"];
      var desc = bookmark["description"];
      var star = bookmark["star"];
      var folder_id = bookmark["folder_id"];
      var session_id = req.session.userId;
      // Not existing folder, set up the folder information.
      // Key by folder_name.
      if (!folderMap[folder_name]) {
        folderItem = {};
        folderItem['name'] = folder_name;
        folderItem['folder_id'] =  folder_id;
        folderItem['user_id'] = user_id;
        list_bookmark = [];
        folderItem['bookmarks'] = list_bookmark;
        folderMap[folder_name] = folderItem;
      }

      // Folder item already exist in the map, just need to get it
      else {
        folderItem = folderMap[folder_name];
      }

      // Add the bookmark item
      bookmark_item = {};
      bookmark_item['title'] = title;
      bookmark_item['url'] = url;
      bookmark_item['description'] = desc;
      bookmark_item['star'] = star;
      folderItem['bookmarks'].push(bookmark_item);
    });
    //console.log(folderMap);
    array_json_bookmark = [];
    
    for (var key in folderMap) {
      array_json_bookmark.push(folderMap[key]);
    }
    //console.log(JSON.stringify(array_json_bookmark));
    fs.writeFile("server/tmp/bookmarks.json", JSON.stringify(array_json_bookmark), function(err) {
        if(err) {
            throw err;
        }
        var file = __dirname + '/../tmp/bookmarks.json';
        res.download(file); // Set disposition and send it.
    });
}
