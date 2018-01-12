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
  var sql = `select a.ID_TAGIHAN,a.HARGA, b.NAMA,c.NAMA as TIPE_LAYANAN from tagihan a
  left join pelanggan b
  on a.NCLI = b.NCLI 
  left join layanan c
  on a.ID_LAYANAN = c.ID_LAYANAN
  where a.\`STATUS\` = 0
  order by b.NCLI`;
  console.log("SQL:"+sql);
    connection.query(sql, function (err, rows, fields) {
      if (err) throw err
      res.json(rows);
    });
  });
module.exports = router;