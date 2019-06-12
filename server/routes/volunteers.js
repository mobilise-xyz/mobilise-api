var express = require("express");
var router = express.Router();
var controller = require("../controllers").VolunteerController;

/* Get all volunteers */
router.get("/", controller.list);

/* Get hall of fame of volunteers */
router.get("/hall-of-fame", controller.getHallOfFame);

/* Get all shifts for a volunteer */
router.get("/:id/shifts", controller.listShiftsByVolunteerId);

/* Get stats for a volunteer */
router.get("/:id/stats", controller.getStats);

/* Get activity for a volunteer */
router.get("/:id/activity", controller.getActivity);

/* Update availability for a volunteer */
router.put("/:id/availability", controller.updateAvailability);

/* Get availability for a volunteer */
router.get("/:id/availability", controller.getAvailability);

module.exports = router;
