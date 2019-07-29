let express = require("express");
let router = express.Router();
let controller = require("../controllers").CalendarController;

/* Get calendar for a volunteer's shifts */
router.get("/:key/bookings.ics", controller.subscribeToBookings);

module.exports = router;
