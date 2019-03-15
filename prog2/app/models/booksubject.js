'use strict';

var db = require('../config/db');
var mysql = require('mysql');

/// class to search booksubjects table


function Subject(bookId, subject) {
    this.bookId = bookId;
    this.subject = subject;
}


/// takes the id number of a book and returns the subjects entry with matching number
/// id: int 
Subject.search = function (id,callback) {
    db.pool.getConnection(function (err, connection) {
        if(err) return callback(err);

        let sql = "select * from booksubjects where bookid = ?";
        
        sql = mysql.format(sql, [id]);
      
        connection.query(sql, function (err, data) {
       
            connection.release();              
            if (err) return callback(err);
            if(data){
                callback(null, new Subject(data[0].BookID, data[0].Subject));
            } else {
                callback(null, null);
            }
        });
    });
}


module.exports = Subject;