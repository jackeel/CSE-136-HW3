var db = require('../config/db');
var CONTENT_TYPE_KEY = 'Content-Type';
var JSON_CONTENT_TYPE = 'application/json';
var Constants = require('../config/Constants');
var winston = require('winston');

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            name: 'folder-actions',
            level: 'debug',
            filename: './server/logs/db.log',
            prettyPrint: true,
            handleExceptions: false,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        })
    ],
    exitOnError: false
});

function handleError(err, action, req, res)
{
    logger.log('debug', "folder-actions: "+ action,
              {timestamp: Date.now(), userId:req.session.userId , ip: req.ip, erro: err.code}
            );
    if (req.get(CONTENT_TYPE_KEY) == JSON_CONTENT_TYPE) {
        res.status(500).json({ status: Constants.status.error, data: action });
    }
    else
    {
        //req.flash('error_messages', errors);
        res.redirect('/list#warningModal');  // flash error to the add modal
    }
}
 
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
            if (err)
            {
                handleError(err, 'add folder', req, res);
                return; 
            } 
            db.query('SELECT * from folders WHERE user_id = ' + user_id + ' ORDER BY id', function(err, folders) {
                if (err)
                {
                    handleError(err, 'show folders', req, res);
                    return;
                }
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
        if (err)
        {
            handleError(err, 'delete folder', req, res);
            return;
        }
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
