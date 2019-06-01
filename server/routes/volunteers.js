var express = require('express');
var router = express.Router();
var controller = require('../controllers').VolunteerController;

/* Get all volunteers */
router.get('/', controller.list);

/* Get shifts for volunteers */
router.get('/:id/shifts', controller.listShifts);

module.exports = router;
