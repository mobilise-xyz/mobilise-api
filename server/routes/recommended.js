var express = require('express');
var router = express.Router();
var controller = require('../controllers').RecommendedController;

/* GET Recommended Shifts. */
router.get('/', controller.getRecommendedShifts);