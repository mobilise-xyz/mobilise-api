var express = require('express');
var router = express.Router();
var controller = require('../controllers/userController');

router.post('/login',	function(req, res) {
  res.send('Login attempt');
});

router.post('/register',	function(req, res) {
  controller.registerUser(req, res);
});


module.exports = router;
