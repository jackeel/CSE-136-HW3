var db = require('../config/db');

/**
 * Adds a new folder to the database
 * Does a redirect to the list page
 */
module.exports.insert = function(req, res) {
    req.sanitizeBody('name').trim();
    var validate_insert = {
        'name': {
            isLength: {
                options: [{min: 1, max: 25}],
                errorMessage: 'Folder name must be 1-25 characters'
            },
        },
    };

    req.checkBody(validate_insert);
    //req.sanitizeBody('title').escape();
    //req.sanitizeBody('url').escape();
    var errors = req.validationErrors();

    if (errors) {
        req.flash('error_messages', errors);
        res.redirect('/list#addFolder');  // flash error to the add modal
    } else {
        var name = db.escape(req.body.name);
        var user_id = db.escape(req.session.userId);

        var queryString = 'INSERT INTO folders (name, user_id) VALUES (' + name + ', ' + user_id + ')';
        console.log(queryString);
        db.query(queryString, function(err) {
            if (err) {
                errors = [{msg: 'A folder with the same name already exists'}];
                res.redirect('/list#addFolder');
                return;
            }
            
            res.redirect('/list');
        });
    }
};

/**
 * Deletes the passed in bookmark from the database.
 * Does a redirect to the list page
 */
module.exports.delete = function(req, res) {
    var id = db.escape(req.params.folder_id);
    console.log("Delete: "+id);
    db.query('DELETE from folders where id = ' + id, function(err){
        if (err) throw err;
        res.redirect('/list');
    });
};
