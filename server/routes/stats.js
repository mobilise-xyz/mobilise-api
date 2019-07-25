let express = require("express");
let router = express.Router();
let controller = require("../controllers").StatsController;

router.post("/compute-hall-of-fame", controller.computeHallOfFame);

module.exports = router;
