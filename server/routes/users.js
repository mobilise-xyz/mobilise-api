var express = require('express');
var router = express.Router();
var controller = require('../controllers/userController');

router.post('/login',	function(req, res) {
  controller.authenticate(req, res);
});

router.post('/register',	function(req, res) {
  controller.registerUser(req, res);
});


module.exports = router;
