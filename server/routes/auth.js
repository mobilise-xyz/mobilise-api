var express = require('express');
var router = express.Router();
var controller = require('../controllers/authController');

router.post('/login',	function(req, res) {
  controller.loginUser(req, res);
});

router.post('/register',	function(req, res) {
  controller.registerUser(req, res);
});

module.exports = router;