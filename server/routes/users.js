var express = require('express');
var router = express.Router();
var controller = require('../controllers/userController');

router.get('/:id', function(req, res) {
  controller.getById(req, res);
})

module.exports = router;
