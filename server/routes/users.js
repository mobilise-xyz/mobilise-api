let express = require('express');
let router = express.Router();
let controller = require('../controllers').UserController;

/* Get user by id */
router.get('/:id',
  controller.validate('getById'),
  controller.getById);

/* Get contact preferences for a volunteer */
router.get("/:id/contact-preferences",
  controller.validate('getContactPreferences'),
  controller.getContactPreferences);

/* Update contact preferences for a volunteer */
router.put("/:id/contact-preferences",
  controller.validate('updateContactPreferences'),
  controller.updateContactPreferences);

/* Send feedback from a user */
router.post("/:id/feedback",
  controller.validate('sendFeedback'),
  controller.sendFeedback);

/* Change password for this user */
router.put("/password",
  controller.validate('changePassword'),
  controller.changePassword);

/* Invite user */
router.post("/invite",
  controller.validate('invite'),
  controller.invite);

module.exports = router;