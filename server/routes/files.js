let express = require('express');
let router = express.Router();
let controller = require('../controllers').FileController;

/* List all the files. */
router.get('/', controller.get);

/* Download a file */
router.get('/:name', controller.downloadByName);

module.exports = router;
