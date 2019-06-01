var express = require('express');
var router = express.Router();
var controller = require('../controllers').ShiftController;

/* Create a new shift. */
router.post('/', controller.create);

/* Get all shifts. */
router.get('/', controller.list);

/* Delete shift by ID */
router.delete('/:id', controller.deleteById);

/* Book a shift */
router.post('/:id/book', controller.book);

/* Get all shift titles */
router.get('/titles', controller.listTitles);

module.exports = router;
