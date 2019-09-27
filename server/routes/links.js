let express = require('express');
let router = express.Router();
let controller = require('../controllers').LinkController;

/* List all the links. */
router.get('/', controller.get);

/* Upload a link */
router.post('/',
  controller.validate('add'),
  controller.add);

/* Delete a link */
router.delete('/:id',
  controller.validate('deleteById'),
  controller.deleteById);

module.exports = router;
