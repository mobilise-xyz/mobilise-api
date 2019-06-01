var express = require('express');
var router = express.Router();
var controller = require('../controllers').RoleController;

/* POST role. */
router.post('/', controller.create);

/* GET roles. */
router.get('/', controller.list);

/* DELETE role */
router.delete('/', controller.remove);

module.exports = router;
