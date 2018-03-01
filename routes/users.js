var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

router.post('/login', function(req, res, next){
  let obj = {};
  if((req.body.username == 'nanda') && (req.body.password == '123456')){
    obj = {
      username : 'nanda',
      password : '123456',
      type : 'superuser',
      login : true
    }
  }else{
    obj = {
      login : false,
      message : 'Login failed'
    }
  }
  console.log(req.body);
  res.json(obj);
})