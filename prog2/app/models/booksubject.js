'use strict';

var db = require('../config/db');
var mysql = require('mysql');
function Subject(bookId, subject) {
    this.bookId = bookId;
    this.subject = subject;
}

Subject.search = function (id,callback) {
    db.pool.getConnection(function (err, connection) {
        if(err) return callback(err);

        let sql = "select * from booksubjects where bookid = ?";
        
        sql = mysql.format(sql, [id]);
        console.log(sql);
        connection.query(sql, function (err, data) {
            //console.log(data);
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