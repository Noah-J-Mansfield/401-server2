'use strict';

var db = require('../config/db');
var mysql = require('mysql');
function Item(id, callNo, author, title, pubInfo, descript, series, addAuthor, updateCount) {
    this.id = id;
    this.callNo = callNo;
    this.author = author;
    this.title = title;
    this.pubInfo = pubInfo;
    this.descript = descript;
    this.series = series;
    this.addAuthor = addAuthor;
    this.updateCount = updateCount;
}

Item.search = function (query,start,end,callback) {
    db.pool.getConnection(function (err, connection) {
        if(err) return callback(err);
        query = "%"+query+"%";
        let sql = "select * from items where title like ? order by title limit ?,?";
        sql = mysql.format(sql, [query, start,end]);
        console.log(sql);
        connection.query(sql, function (err, data) {
            //console.log(data);
            connection.release();              
            if (err) return callback(err);

            if (data) {
                var results = [];
                for (var i = 0; i < data.length; ++i) {
                    var item = data[i];
                    results.push(new Item(item.ID, item.CALLNO, item.AUTHOR, item.TITLE, item.PUB_INFO,
                        item.DESCRIPT, item.SERIES, item.ADD_AUTHOR, item.UPDATE_COUNT));
                }
                callback(null, results);
            } else {
                callback(null, null);
            }
        });
    });
};

Item.getid = function (query,callback) {
    db.pool.getConnection(function (err, connection) {
        if(err) return callback(err);

        let sql =  "select * from items where id = ?";
        
        sql = mysql.format(sql, [query]);
        console.log(sql);
        connection.query(sql, function (err, data) {
            //console.log(data);
            connection.release();              
            if (err) return callback(err);

            if (data) {
                
                
                    var item = data[0];
                
                callback(null, new Item(item.ID, item.CALLNO, item.AUTHOR, item.TITLE, item.PUB_INFO,
                    item.DESCRIPT, item.SERIES, item.ADD_AUTHOR, item.UPDATE_COUNT));
            } else {
                callback(null, null);
            }
        });
    });
};
Item.count = function (query,callback) {
    db.pool.getConnection(function (err, connection) {
        if(err) return callback(err);
        query = "%"+query+"%";
        let sql = "select count(*) from items where title like ?";

        sql = mysql.format(sql, [query]);

        console.log(sql);
        connection.query(sql, function (err, data) {
            //console.log(data);
            connection.release();              
            if (err) return callback(err);

            if (data) {
                console.log(data);
                //console.log(data);
                callback(null, data);
            } else {
                callback(null, null);
            }
        });
    });
};




Item.update = function (values,query,callback) {
    db.pool.getConnection(function (err, connection) {
        if(err) return callback(err);
        
        let sql = "";
        let flag= false;
        let k = Object.keys(values);
        for(let i = 0; i < k.length; i++)
        {
            var q = k[i]
            console.log(q);
            if(values[q])
            {
                if(flag) sql+=",";

                let temp = mysql.format("?",values[q]);
                if(q === "addAuthor") q = "add_Author";
                if(q === "pubInfo") q = "pub_Info";
                sql += q + " = " + temp;
                flag = true;
            }
        }
        

        sql = "update items set "+sql + " , update_count=? where id = ? and update_count = ?";
        sql= mysql.format(sql, [query.updateCount+1,query.id, query.updateCount]);


        console.log(sql);
        connection.query(sql, function (err, data) {

            connection.release();              
            if (err) return callback(err);

            if (data) {
            
              
                callback(null, data.affectedRows);
            } else {
                callback(null, null);
            }
        });
    });
};







module.exports = Item;