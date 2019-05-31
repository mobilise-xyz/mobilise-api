var express = require('express');
var router = express.Router();
var controller = require('../controllers').RoleController;

/* POST shift. */
router.post('/', controller.create);

/* GET shifts. */
router.get('/', controller.list);

/* DELETE shifts */
router.delete('/', controller.remove);

module.exports = router;
