var express = require('express');
var router = express.Router();
var controller = require('../controllers').ShiftController;

/* POST shift. */
router.post('/', controller.create);

/* GET shifts. */
router.get('/', controller.list);

/* GET titles */
router.get('/titles', controller.listTitles);

module.exports = router;
