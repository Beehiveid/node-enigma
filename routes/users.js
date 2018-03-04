var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dotenv = require('dotenv').config({path: '../.env'});
var debug = require('debug')("node-enigma:users");
var jwt = require('jsonwebtoken');
var moment = require('moment');

var AccessLevel = {
  BANNED: 0,
  USER: 1,
  SUPERUSER: 7,
  properties: {
    0: {name: "banned", value: 0},
    1: {name: "user", value: 1},
    7: {name: "superuser", value: 7}
  }
};

var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/auth', function(req, res, next){
  debug("post auth");
  let username = req.body.username;
  let password = req.body.password;
  let obj = {};

  var sql = `select fullname, department, status from users where username = ? and password = ?`;
  connection.query(sql,[username,password], function(err, rows, fields){
    if (err) throw err
    console.log(rows);
    let user = rows[0];
    if(rows.length == 0){
      obj = {
        login : false,
        message : "Login failed"
      }
    }else{
      let payload = {
        fullname : user.fullname,
        department : user.department,
        access : AccessLevel.properties[user.status].name,
      }

      var token = jwt.sign(payload, process.env.SECRET,{
        expiresIn: "1d"
      });

      obj = {
        fullname : user.fullname,
        department : user.department,
        access : AccessLevel.properties[user.status].name,
        token : token,
        login : true,
        expIn : 1 //1 days
      }
    }
    console.log(obj);
    res.json(obj);
  });
});

router.post('/verify', function(req, res, next){
  debug("get verify");
  let token = req.body.token || req.query.token || req.headers['token'];
  debug(token);
  
  if(token != "undefined"){
    jwt.verify(token, process.env.SECRET, function(err, decoded){
      if(err){
        return res.json({ login: false, message: 'Failed to verify token.' });
      }else{
        let obj = {
          fullname : decoded.fullname,
          department : decoded.department,
          access : decoded.access,
          login : true
        }

        return res.json(obj);
      }
    })
  }else{
    return res.send({
      login : false,
      message : "No token provided"
    });
  }
});
module.exports = router;