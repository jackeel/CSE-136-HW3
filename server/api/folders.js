var db = require('../config/db');
var CONTENT_TYPE_KEY = 'Content-Type';
var JSON_CONTENT_TYPE = 'application/json';
var Constants = require('../config/Constants');

/**
 * Adds a new folder to the database
 * Does a redirect to the list page
 */
//
module.exports.insert = function(req, res){
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
        if(req.get(CONTENT_TYPE_KEY) == JSON_CONTENT_TYPE) {
            res.status(400).json({
                status: Constants.status.failed,
                msg: errors
            });
        }else {
            req.flash('error_messages', errors);
            res.redirect('/list#addFolder');  // flash error to the add modal
        }
        // TODO: send request to right error page for adding folder
    } else {
        var name = db.escape(req.body.name);
        var user_id = db.escape(req.session.userId);

        var queryString = 'INSERT INTO folders (name, user_id) VALUES (' + name + ', ' + user_id + ')';
        db.query(queryString, function(err, result){
            if (err) throw err;
            db.query('SELECT * from folders WHERE user_id = ' + user_id + ' ORDER BY id', function(err, folders) {
                if (err) throw err;
                if(req.get(CONTENT_TYPE_KEY) == JSON_CONTENT_TYPE) {
                    res.status(200).json({
                        status: Constants.status.SUCCESS,
                        msg: Constants.successMessages.OK,
                        data: {
                            "folder_name": req.body.name,
                            "folder_id": result.insertId
                        }
                    })
                }else {
                    res.redirect('/list');
                }
            });
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
        if(req.get(CONTENT_TYPE_KEY) == JSON_CONTENT_TYPE) {
            res.status(200).json({
                status: Constants.status.SUCCESS,
                msg: Constants.successMessages.OK,
                data: {
                    "folder_id": req.params.folder_id
                }
            })
        }else {
            res.redirect('/list');
        }
    });
};
