var express = require('express');
var router = express.Router();
var controller = require('../controllers').MetricController;

/* POST metric. */
router.post('/', controller.update);

/* GET metric. */
router.get('/', controller.get);

module.exports = router;
