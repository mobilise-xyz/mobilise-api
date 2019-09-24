let express = require('express');
let router = express.Router();
let controller = require('../controllers').AuthController;

router.post('/login',
  controller.validate('loginUser'),
  controller.loginUser);

router.post('/forgot-password',
  controller.validate('forgotPassword'),
  controller.resetPassword);

router.post('/register',
  controller.validate('registerUser'),
  controller.registerUser);

router.post('/inviteAdmin',
  controller.validate('inviteAdmin'),
  controller.inviteAdmin);

module.exports = router;
