var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dotenv = require('dotenv').config({path: '../.env'});
var moment = require('moment')

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
  where a.STATS = 0
  order by b.NCLI`;
  
    connection.query(sql, function (err, rows, fields) {
      if (err) throw err
      res.json(rows);
    });
  });

router.get('/create', function(req, res, next) {
  var sql = ``;
  
    connection.query(sql, function (err, rows, fields) {
      if (err) throw err
      res.json(rows);
    });
});

router.post('/', function(req, res, next) {
  var sql = ``;
  
    connection.query(sql, function (err, rows, fields) {
      if (err) throw err
      res.json(rows);
    });
});

router.get('/:userId', function(req, res, next) {
  var sql = `select a.ID_TAGIHAN,a.HARGA,b.NAMA as NAMA_PELANGGAN, c.NAMA as NAMA_LAYANAN from tagihan a
  left join pelanggan b
  on a.NCLI = b.NCLI
  left join layanan c
  on a.ID_LAYANAN = c.ID_LAYANAN
  where b.NO_TELEPON='`+ req.params.userId+`' or b.NO_INTERNET='`+ req.params.userId+`' and a.STATS = 0`;
  
    connection.query(sql, function (err, rows, fields) {
      if (err) throw err
      res.json(rows);
    });
});

router.get('/:id/edit', function(req, res, next) {
  var sql = ``;
  
    connection.query(sql, function (err, rows, fields) {
      if (err) throw err
      res.json(rows);
    });
});

router.put('/:id', function(req, res, next) {
  var sql = ``;
  
    connection.query(sql, function (err, rows, fields) {
      if (err) throw err
      res.json(rows);
    });
});

router.delete('/:id', function(req, res, next) {
  var sql = ``;
  
    connection.query(sql, function (err, rows, fields) {
      if (err) throw err
      res.json(rows);
    });
});

router.post('/paybills', function(req, res, next) {
  idx = "("+req.body.id.join()+")";
  stats = req.body.status;
  var now = moment().format("YYYY-M-DD HH:mm:ss");

  var sql = `update tagihan set STATS = ?
  ,TGL_BAYAR = ? where ID_TAGIHAN in ` + idx;

  //var sql = "update tagihan set STATS = " + stats + " TGL_BAYAR = '"+now+"' where ID_TAGIHAN in " + idx;
  console.log(sql);
    connection.query(sql,[stats,now], function (err, rows, fields) {
      if (err) throw err
      res.json(rows);
    });
  
});
module.exports = router;