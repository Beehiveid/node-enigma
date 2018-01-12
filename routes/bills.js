var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dotenv = require('dotenv').config({path: '../.env'});

var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME
});

router.get('/', function(req, res, next) {
    connection.query('SELECT * from heroes', function (err, rows, fields) {
      if (err) throw err
      res.json(rows);
    });
  });
module.exports = router;