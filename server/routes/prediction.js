var express = require('express');
var router = express.Router();
var controller = require('../controllers').PredictionController;

router.post('/compute-expected-shortages', controller.computeExpectedShortages);

module.exports = router;
