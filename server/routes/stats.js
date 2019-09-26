let express = require("express");
let router = express.Router();
let controller = require("../controllers").StatsController;

router.post("/compute-hall-of-fame",
  controller.validate('computeHallOfFame'),
  controller.computeHallOfFame);

module.exports = router;
