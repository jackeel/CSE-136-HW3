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
    var errors = req.validationErrors();

    if (errors) {
        req.flash('error_messages', errors);
        res.redirect('/list');  // flash error to the add modal
    } else {
        var name = db.escape(req.body.name);
        var user_id = db.escape(req.session.userId);

        var queryString = 'INSERT INTO folders (name, user_id) VALUES (' + name + ', ' + user_id + ')';
        db.query(queryString, function(err, result) {
            if (err) {
                errors = [{msg: 'A folder with the same name already exists'}];
                req.flash('error_messages', errors);
                res.redirect('/list');
                return;
            }
            
            res.redirect('/list');
            //res.json({"folder_id": result.insertId,
            //          "folder_name": req.body.name});
        });
    }
};

/**
 * Deletes the passed in folder from the database.
 * Does a redirect to the current page
 */
module.exports.delete = function(req, res) {
    var id = db.escape(req.params.folder_id);
    db.query('DELETE from folders where id = ' + id, function(err){
        if (err) throw err;
        res.redirect('back');
        //res.json({"folder_id": req.params.folder_id});
    });
};
