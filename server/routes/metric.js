let express = require('express');
let router = express.Router();
let controller = require('../controllers').MetricController;

/* POST metric. */
router.post('/',
  controller.validate('update'),
  controller.update);

/* GET metric. */
router.get('/', controller.get);

module.exports = router;
