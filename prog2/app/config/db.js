
var mysql = require('mysql');

exports.pool = mysql.createPool({
    host: 'localhost',
    user: 'server',
    password: '12345',
    database: 'cps401_library',
    connectionLimit: 10

});
