var express = require('express');
var router = express.Router();
var controller = require('../controllers').VolunteerController;

/* Get all volunteers */
router.get('/', controller.list);

module.exports = router;
