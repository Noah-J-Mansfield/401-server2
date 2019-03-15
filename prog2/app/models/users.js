'use strict';

var db = require('../config/db');
var mysql = require('mysql');
function users(bookId, subject) {
    this.bookId = bookId;
    this.subject = subject;
}

users.search = function (username,password,callback) {
    db.pool.getConnection(function (err, connection) {
        if(err) return callback(err);

        let sql = "select * from users where username = ? and password = ?";
        
        sql = mysql.format(sql, [username,password]);
        console.log(sql);
        connection.query(sql, function (err, data) {
            console.log(data);
            connection.release();              
            if (err) return callback(err);
            if(data){
                callback(null, data !== []);
            } else {
                callback(null, null);
            }
        });
    });
}
users.hash = function(callback)
{
    db.pool.getConnection(function (err, connection) {
        if(err) return callback(err);

        let sql = "select * from user";
        sql = 
        sql = mysql.format(sql, [username,password]);
        console.log(sql);
        connection.query(sql, function (err, data) {
          
            connection.query(sql, function(error, cla)
            {
                connection.release();    
                return callback();

            });
                      
          
        });
    });
};

module.exports = users;