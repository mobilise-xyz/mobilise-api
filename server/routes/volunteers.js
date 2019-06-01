var express = require('express');
var router = express.Router();
var controller = require('../controllers').VolunteerController;

/* Get all volunteers */
router.get('/', controller.list);

/* Get all shifts for a volunteer */
router.get('/:id/shifts', controller.listShifts);

module.exports = router;
