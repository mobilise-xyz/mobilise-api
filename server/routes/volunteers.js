var express = require('express');
var router = express.Router();
var controller = require('../controllers').VolunteerController;

/* Get all volunteers */
router.get('/', controller.list);

/* Get all shifts for a volunteer */
router.get('/:id/shifts', controller.listShiftsByVolunteerId);

/* Update availability for a volunteer */
router.put('/:id/availability', controller.updateAvailability);

/* Get availability for a volunteer */
router.get('/:id/availability', controller.getAvailability);

module.exports = router;
