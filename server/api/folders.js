var db = require('../config/db');

/**
 * Adds a new folder to the database
 * Does a redirect to the list page
 */
module.exports.insert = function(req, res){
    var validate_insert = {
        'name': {
            optional: true,
            isLength: {
                options: [{min: 0, max: 25}],
                errorMessage: 'Title must be 0-25 characters'
            },
        },
    };

    req.checkBody(validate_insert);
    req.sanitizeBody('name').trim();
    //req.sanitizeBody('title').escape();
    //req.sanitizeBody('url').escape();
    var errors = req.validationErrors();

    if (errors) {
        req.flash('error_messages', errors);
        // TODO: send request to right error page for adding folder
    } else {
        var name = db.escape(req.body.name);
        var user_id = db.escape(req.session.userId);

        var queryString = 'INSERT INTO folders (name, user_id) VALUES (' + name + ', ' + user_id + ')';
        db.query(queryString, function(err){
            if (err) throw err;
            db.query('SELECT * from folders WHERE user_id = ' + user_id + ' ORDER BY id', function(err, folders) {
                if (err) throw err;
                res.send(folders);
            });
        });
    }
};

/**
 * Deletes the passed in bookmark from the database.
 * Does a redirect to the list page
 */
module.exports.delete = function(req, res) {
    var id = db.escape(req.params.bookmark_id);

    db.query('DELETE from bookmarks where id = ' + id, function(err){
        if (err) throw err;
        res.redirect('/list');
    });
};
