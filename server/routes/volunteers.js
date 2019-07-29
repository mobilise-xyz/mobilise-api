let express = require("express");
let router = express.Router();
let controller = require("../controllers").VolunteerController;

/* Get all volunteers */
router.get("/", controller.list);

/* Get hall of fame of volunteers */
router.get("/hall-of-fame", controller.getHallOfFame);

/* Get all shifts for a volunteer */
router.get("/:id/shifts", controller.listShiftsForVolunteer);

router.get("/:id/shifts/calendar", controller.getCalendarForVolunteer);

/* Get all available shifts for a volunteer */
router.get("/:id/availableShifts", controller.listAvailableShiftsForVolunteer);

/* Get stats for a volunteer */
router.get("/:id/stats", controller.getStats);

/* Get activity for a volunteer */
router.get("/:id/activity", controller.getActivity);

/* Update availability for a volunteer */
router.put("/:id/availability", controller.updateAvailability);

/* Get availability for a volunteer */
router.get("/:id/availability", controller.getAvailability);

module.exports = router;
