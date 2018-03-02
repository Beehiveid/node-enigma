var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dotenv = require('dotenv').config({path: '../.env'});
var moment = require('moment');
var debug = require('debug')("node-enigma:bills");
var jwt = require('jsonwebtoken');

var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME
});

router.use(function(req, res, next){
  debug("verify token");
  let token = req.body.token || req.query.token || req.headers['token'];
  if(token){
    jwt.verify(token, process.env.SECRET, function(err, decoded){
      if(err){
        return res.json({ success: false, message: 'Failed to verify token.' });
      }else{
        req.decoded = decoded;
        next();
      }
    })
  }else{
    return res.status(403).send({
      success : false,
      message : "No token provided"
    });
  }
});

router.get('/', function(req, res, next) {
  debug("get Unpaid bills");
  debug(req.decoded);
  var group = {};
  var sql = `select a.ID_TAGIHAN,a.HARGA,a.STATS,b.NCLI,b.NAMA as NAMA_PELANGGAN,b.ALAMAT,c.NAMA as NAMA_TAGIHAN from tagihan a 
  join pelanggan b on a.NCLI = b.NCLI
  join layanan c on a.ID_LAYANAN = c.ID_LAYANAN
  where a.stats != 1`;
  
    connection.query(sql, function (err, rows, fields) {
      for(var i = 0; i < rows.length;i++){
        if(!group[rows[i].NCLI]){
          group[rows[i].NCLI] = {};
          group[rows[i].NCLI] = {
            "nama":rows[i].NAMA_PELANGGAN,
            "id":rows[i].NCLI,
            "idle": [],
            "queue": []
          }
        }
        if(rows[i].STATS){
          group[rows[i].NCLI].queue.push(rows[i]);
        }else{
          group[rows[i].NCLI].idle.push(rows[i]);
        }
      }
      if (err) throw err
      res.json(group);
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
  debug("get getUnpaidBill of "+req.params.userId);
  var group = {};
  var sql = `select a.ID_TAGIHAN,a.HARGA,b.NAMA as NAMA_PELANGGAN, c.NAMA as NAMA_LAYANAN, b.NCLI,a.STATS from tagihan a
  left join pelanggan b
  on a.NCLI = b.NCLI
  left join layanan c
  on a.ID_LAYANAN = c.ID_LAYANAN
  where b.NO_TELEPON='`+ req.params.userId+`' or b.NO_INTERNET='`+ req.params.userId+`' and a.STATS != 1`;
  
    connection.query(sql, function (err, rows, fields) {
      if(rows.length > 0){
        group.id = rows[0].NCLI;
        group.nama = rows[0].NAMA_PELANGGAN;
        group.totalIdle = 0;
        group.totalQueue = 0;
        group.idle = [];
        group.queue = [];
        for(var i = 0; i < rows.length; i++){
          if(rows[i].STATS){
            group.queue.push(rows[i]);
            group.totalQueue += rows[i].HARGA;
          }else{
            group.idle.push(rows[i]);
            group.totalIdle += rows[i].HARGA;
          }
        }
      }

      if (err) throw err
      res.json(group);
    });
});

router.get('/:userId/:stats', function(req, res, next) {
  var group = {};
  debug("get getBills by "+req.params.userId+" with stats="+req.params.stats);
  var sql = `select a.ID_TAGIHAN,a.HARGA,b.NCLI,b.NAMA as NAMA_PELANGGAN, c.NAMA as NAMA_LAYANAN from tagihan a
  left join pelanggan b
  on a.NCLI = b.NCLI
  left join layanan c
  on a.ID_LAYANAN = c.ID_LAYANAN
  where b.NO_TELEPON='`+ req.params.userId+`' or b.NO_INTERNET='`+ req.params.userId+`' and a.STATS = `+req.params.stats;
  
    connection.query(sql, function (err, rows, fields) {
      if(rows.length > 0){
        group.id = rows[0].NCLI;
        group.nama = rows[0].NAMA_PELANGGAN;
        group.total = 0;
        group.details = [];
        for (var i = 0; i < rows.length; i++) {
          group.details.push(rows[i]);
          group.total += rows[i].HARGA;
        }
      }
      
      if (err) throw err
      res.json(group);
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
  debug("post paybills");
  idx = "("+req.body.id.join()+")";
  stats = req.body.status;
  var now = moment().format("YYYY-M-DD HH:mm:ss");

  var sql = `update tagihan set STATS = ?
  ,TGL_BAYAR = ? where ID_TAGIHAN in ` + idx;

    connection.query(sql,[stats,now], function (err, rows, fields) {
      if (err) throw err
      res.json(rows);
    });
  
});
module.exports = router;