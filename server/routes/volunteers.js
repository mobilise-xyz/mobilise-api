let express = require("express");
let router = express.Router();
let controller = require("../controllers").VolunteerController;

/* Get all volunteers */
router.get("/",
  controller.list);

/* Get hall of fame of volunteers */
router.get("/hall-of-fame", controller.getHallOfFame);

/* Get all shifts for a volunteer */
router.get("/:id/shifts",
  controller.validate('listShiftsForVolunteer'),
  controller.listShiftsForVolunteer);

/* Get the calendar for a volunteer */
router.get("/:id/shifts/calendar",
  controller.validate('getCalendarForVolunteer'),
  controller.getCalendarForVolunteer);

/* Get all available shifts for a volunteer */
router.get("/:id/availableShifts",
  controller.validate('listAvailableShiftsForVolunteer'),
  controller.listAvailableShiftsForVolunteer);

/* Get stats for a volunteer */
router.get("/:id/stats",
  controller.validate('getStats'),
  controller.getStats);

/* Get activity for a volunteer */
router.get("/:id/activity",
  controller.validate('getActivity'),
  controller.getActivity);

/* Update availability for a volunteer */
router.put("/:id/availability",
  controller.validate('updateAvailability'),
  controller.updateAvailability);

/* Get availability for a volunteer */
router.get("/:id/availability",
  controller.validate('getAvailability'),
  controller.getAvailability);

/* Add emergency contact for a volunteer */
router.post("/:id/contacts",
  controller.validate('addContact'),
  controller.addContact);

/* Get emergency contacts for a volunteer */
router.get("/:id/contacts",
  controller.validate('getContacts'),
  controller.getContacts);

/* Remove emergency contact for a volunteer */
router.delete("/:id/contacts/:contactId", controller.removeContact);

module.exports = router;
