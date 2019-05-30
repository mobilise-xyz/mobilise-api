var express = require('express');
var router = express.Router();
var controller = require('../controllers').ShiftController;

/* POST shift. */
router.post('/', controller.create);

/* GET shifts. */
router.get('/', controller.list);

/* DELETE shift by ID */
router.delete('/:id', controller.deleteById);

/* GET titles */
router.get('/titles', controller.listTitles);

module.exports = router;
