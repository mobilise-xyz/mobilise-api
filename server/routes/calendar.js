let express = require("express");
let router = express.Router();
let controller = require("../controllers").CalendarController;

/* Get calendar for a volunteer's shifts */
router.get("/:id/bookings.ics", controller.subscribe);

module.exports = router;
