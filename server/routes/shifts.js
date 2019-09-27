let express = require("express");
let router = express.Router();
let controller = require("../controllers").ShiftController;

/* Create a new shift. */
router.post("/",
  controller.validate('create'),
  controller.create);

/* Get all shifts. */
router.get("/",
  controller.validate('list'),
  controller.list);

/* Get calendar link for all shifts. */
router.get("/calendar", controller.getCalendarForShifts);

/* Delete shift by ID */
router.delete("/:id",
  controller.validate('deleteById'),
  controller.deleteById);

/* Ping volunteers */
router.post("/:id/ping",
  controller.validate('ping'),
  controller.ping);

/* Update the shift information */
router.put("/:id",
  controller.validate('update'),
  controller.update);

/* Update the shift roles */
router.put("/:id/rolesRequired",
  controller.validate('updateRoles'),
  controller.updateRoles);

/* Book a shift */
router.post("/:id/book",
  controller.validate('book'),
  controller.book);

/* Delete booking by ID */
router.delete("/:id/booking",
  controller.validate('cancel'),
  controller.cancel);

/* Get all shift titles */
router.get("/titles", controller.listTitles);

module.exports = router;
