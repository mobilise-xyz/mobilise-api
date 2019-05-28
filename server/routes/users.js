var express = require('express');
var router = express.Router();
var controller = require('../controllers/userController');

router.get('/:id', function(req, res) {
  controller.getById(req, res);
})

router.post('/login',	function(req, res) {
  controller.loginUser(req, res);
});

router.post('/register',	function(req, res) {
  controller.registerUser(req, res);
});

module.exports = router;
