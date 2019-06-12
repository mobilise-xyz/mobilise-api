var express = require("express");
var router = express.Router();
var controller = require("../controllers").StatsController;

router.post("/compute-hall-of-fame", controller.computeHallOfFame);

module.exports = router;
