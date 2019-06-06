var express = require('express');
var router = express.Router();
var controller = require('../controllers').UserController;

/* Get user by id */
router.get('/:id', controller.getById);

/* Get contact preferences for a volunteer */
router.get("/:id/contact-preferences", controller.getContactPreferences);

/* Update contact preferences for a volunteer */
router.put("/:id/contact-preferences", controller.updateContactPreferences);

module.exports = router;