var express = require('express');
var router = express.Router();
var controller = require('../controllers').ShiftController;

/* Create a new shift. */
router.post('/:id/roles', controller.create);

/* Get all shifts. */
router.get('/:id/shifts', controller.list);

module.exports = router;
