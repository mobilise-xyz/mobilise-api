var express = require('express');
var router = express.Router();
var controller = require('../controllers').AuthController;

router.post('/login',	controller.loginUser);

router.post('/register', controller.registerUser);

module.exports = router;
