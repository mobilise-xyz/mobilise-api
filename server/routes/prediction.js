let express = require('express');
let router = express.Router();
let controller = require('../controllers').PredictionController;

router.post('/compute-expected-shortages', controller.computeExpectedShortages);

module.exports = router;
