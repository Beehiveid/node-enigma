var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Enigma-Express Based', message: 'Welcome, this is Enigma Back-end!' });
});

module.exports = router;
