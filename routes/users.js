var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dotenv = require('dotenv').config({path: '../.env'});
var debug = require('debug')("node-enigma:users");

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

router.post('/login', function(req, res, next){
  debug("post login");
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
      obj = {
        fullname : user.fullname,
        department : user.department,
        access : AccessLevel.properties[user.status].name,
        login : true
      }
    }
    console.log(obj);
    res.json(obj);
  });

  
  
  
});

module.exports = router;