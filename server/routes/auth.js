let express = require('express');
let router = express.Router();
let controller = require('../controllers').AuthController;

router.post('/login',	controller.loginUser);

//router.post('/register', controller.registerUser);

module.exports = router;
