'use strict';

var db = require('../config/db');
var mysql = require('mysql');

/// class to search users data base and compare passwords

function users(bookId, subject) {
    this.bookId = bookId;
    this.subject = subject;
}

/// searches for a matching username and password in the users data base
/// username: string 
/// password: string

users.search = function (username,password,callback) {
    db.pool.getConnection(function (err, connection) {
        if(err) return callback(err);

        let sql = "select * from users where username = ? and password = ?";
        
        sql = mysql.format(sql, [username,password]);
      
        connection.query(sql, function (err, data) {
           
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

module.exports = users;