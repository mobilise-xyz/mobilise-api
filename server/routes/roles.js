let express = require('express');
let router = express.Router();
let controller = require('../controllers').RoleController;

/* POST role. */
router.post('/',
  controller.validation('create'),
  controller.create);

/* GET roles. */
router.get('/', controller.list);

/* DELETE role */
router.delete('/',
  controller.validation('remove'),
  controller.remove);

module.exports = router;
