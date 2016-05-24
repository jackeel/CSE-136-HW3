var mysql      = require('mysql');
var config = require('./config');
var fs = require('fs');
var usersSQL = fs.readFileSync(__dirname+'/users.sql').toString();
var foldersSQL = fs.readFileSync(__dirname+'/folders.sql').toString();
var bookmarksSQL = fs.readFileSync(__dirname+'/bookmarks.sql').toString();

var MySQL = function() {
    var connection;
    
    return {
        init: function(){
            MySQL.connection = mysql.createConnection({
                host     : config.DATABASE_HOST,
                user     : config.DATABASE_USER,
                password : config.DATABASE_PASSWORD,
                database : config.DATABASE_NAME,
                multipleStatements: true
            });

            MySQL.connection.connect(function(err) {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    return;
                }
                MySQL.connection.query(usersSQL, function(err, result){
                    if(err){
                        console.log('error: ', err);
                    }
                });
                MySQL.connection.query(foldersSQL, function(err, result){
                    if(err){
                        console.log('error: ', err);
                    }
                });
                MySQL.connection.query(bookmarksSQL, function(err, result){
                    if(err){
                        console.log('error: ', err);
                    }
                });
            });
        },
        query: function(querystring, callback){
            MySQL.connection.query(querystring, callback);
        },
        escape: mysql.escape
    }
}();

module.exports = MySQL;
