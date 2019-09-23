let express = require("express");
let router = express.Router();
let controller = require("../controllers").CalendarController;

/* Get calendar for a volunteer's shifts */
router.get("/:key/bookings.ics",
  controller.validate('subscribeToBookings'),
  controller.subscribeToBookings);

/* Get calendar for all shifts */
router.get("/:key/shifts.ics",
  controller.validate('subscribeToBookings'),
  controller.subscribeToShifts);

module.exports = router;
