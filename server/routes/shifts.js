var express = require("express");
var router = express.Router();
var controller = require("../controllers").ShiftController;

/* Create a new shift. */
router.post("/", controller.create);

/* Get all shifts. */
router.get("/", controller.list);

/* Delete shift by ID */
router.delete("/:id", controller.deleteById);

/* Ping all available volunteers */
router.post("/:id/ping", controller.ping);

/* Update the shift information */
router.put("/:id", controller.update);

/* Update the shift roles */
router.put("/:id/rolesRequired", controller.updateRoles);

/* Book a shift */
router.post("/:id/book", controller.book);

/* Delete booking by ID */
router.delete("/:id/booking", controller.cancel);

/* Get all shift titles */
router.get("/titles", controller.listTitles);

module.exports = router;
