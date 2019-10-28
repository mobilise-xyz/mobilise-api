const {EmailClient, emailClientTypes} = require("../utils/email");
const userRepository = require("../repositories").UserRepository;
const userContactPreferenceRepository = require("../repositories")
  .UserContactPreferenceRepository;
const {errorMessage} = require("../utils/error");
const {isSecure} = require("../utils/password");
const {hashed, validateHash} = require("../utils/hash");
const moment = require("moment");
const crypto = require("crypto");
const {body, param, validationResult} = require('express-validator');
const invitationTokenRepository = require("../repositories").InvitationTokenRepository;

let UserController = function (userRepository) {

  this.getById = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({message: "Invalid request", errors: errors.array()});
      return;
    }

    // Check request validity
    // 1. Request made by admin
    // 2. Request made by volunteer for their own info
    if (!req.user.isAdmin && req.user.id !== req.params.id) {
      res.status(401).json({message: "Unauthorised request"});
      return;
    }

    await userRepository
      .getById(req.params.id)
      .then(user => {
        if (!user) {
          res.status(400).json({message: "No user with that id"});
        } else {
          res.status(200).json({
            message: "Success!",
            user: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              passwordRetries: user.passwordRetries,
              contactPreferences: user.contactPreferences
            }
          });
        }
      })
      .catch(error => res.status(500).json({message: errorMessage(error)}));
  };

  this.getContactPreferences = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({message: "Invalid request", errors: errors.array()});
      return;
    }

    await userContactPreferenceRepository
      .getById(req.params.id)
      .then(result => {
        if (!result) {
          res.status(400).send({message: "No user with that id"});
        } else {
          res.status(200).json({message: "Success!", contactPreferences: result});
        }
      })
      .catch(error => res.status(500).json({message: errorMessage(error)}));
  };

  this.updateContactPreferences = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({message: "Invalid request", errors: errors.array()});
      return;
    }
    // Check bearer token id matches parameter id
    if (req.user.id !== req.params.id) {
      res.status(401).send({message: "You can only update your own contact preferences."});
      return;
    }
    await userContactPreferenceRepository
      .update(req.params.id, req.body.contactPreferences)
      .then(result => {
        if (!result) {
          res.status(400).send({message: "No user with that id"});
        } else {
          res.status(200).send({message: "Success! Updated contact preferences", contactPreferences: result});
        }
      })
      .catch(error => res.status(500).json({message: errorMessage(error)}));
  };

  this.changePassword = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({message: "Invalid request", errors: errors.array()});
      return;
    }
    if (!validateHash(req.body.oldPassword, req.user.password)) {
      res.status(400).json({message: "Password given is incorrect"});
      return;
    }
    if (!isSecure(req.body.newPassword)) {
      res.status(400).json({
        message: "New password must be at least 8 characters, contain at least one uppercase " +
          "letter, one lowercase letter and one number/special character"
      });
      return;
    }
    await userRepository.update(req.user, {password: hashed(req.body.newPassword)})
      .then(() => res.status(200).json({message: "Success! Password has been changed."}))
      .catch(err => res.status(500).json({message: errorMessage(err)}));
  };

  this.sendFeedback = async function (req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({message: "Invalid request", errors: errors.array()});
      return;
    }
    // Check for user
    let user;
    try {
      user = await userRepository.getById(req.params.id);
    } catch (err) {
      res.status(500).json({message: errorMessage(err)});
      return;
    }
    if (!user) {
      res.status(400).json({message: "No user with that id"});
      return;
    }

    const emailClient = new EmailClient(emailClientTypes.NOREPLY);
    const feedbackMessage = (`
    New user feedback received from ${user.firstName} ${user.lastName} (${user.email}).
    Message sent at ${moment.tz('Europe/London').format('MMMM Do YYYY, h:mm:ss a')}
    
    "${req.body.feedback}"
    
    Love from
    Mobilise.`.trim());
    await emailClient.send(process.env.CONTACT_MAIL_SENDER_USER, "User feedback", feedbackMessage)
      .then(() => res.status(200).json({message: "Success!"}))
      .catch(err => res.status(500).json({message: errorMessage(err)}));
  };

  this.invite = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({message: "Invalid request", errors: errors.array()});
      return;
    }
    if (!req.user.isAdmin) {
      res.status(401).json({message: "Only admins can invite volunteers"});
      return;
    }
    // Check if user already has account
    let existingUser;
    try {
      existingUser = await userRepository.getByEmail(req.body.email);
    } catch (err) {
      res.status(500).json({message: errorMessage(err)});
      return;
    }
    if (existingUser) {
      res.status(400).json({message: "User already has an account"});
      return;
    }

    // Check if user already has a valid invitation token
    let existingInvitation;
    try {
      existingInvitation = await invitationTokenRepository.getByEmail(req.body.email);
    } catch (err) {
      res.status(500).json({message: errorMessage(err)});
      return;
    }
    if (existingInvitation && moment().isBefore(existingInvitation.expires)) {
      res.status(400).json({message: "Volunteer with that email has already been invited!"});
      return;
    }

    // Create token and send it
    const token = crypto.randomBytes(16).toString('hex');
    const expires = moment().add(1, 'days').format();
    await invitationTokenRepository.add(req.body.email, hashed(token), expires, req.body.isAdmin)
      .then(() => {
        const emailClient = new EmailClient(emailClientTypes.NOREPLY);
        return emailClient.send(req.body.email,
          "Invitation to City Harvest",
          `Hello from Mobilise,
You have been invited to join City Harvest by ${req.user.firstName}.
Please click the following link to sign-up to Mobilise, the home of volunteering at City Harvest.

${process.env.WEB_URL}/signup?token=${token}

This link will expire in 24 hours.`)
      })
      .then(() => res.status(200).json({message: "Success! Invitation has been sent."}))
      .catch(err => res.status(500).json({message: errorMessage(err)}));
  };

  this.validate = function (method) {
    switch (method) {
      case 'getContactPreferences':
      case 'getById': {
        return [
          param('id').isUUID()
        ]
      }
      case 'updateContactPreferences': {
        return [
          param('id').isUUID(),
          body('contactPreferences').exists().bail()
            .custom(value => {
              return(typeof value["text"] == 'boolean' && typeof value["email"] == 'boolean')
            })
        ]
      }
      case 'changePassword': {
        return [
          body('oldPassword').exists(),
          body('newPassword').exists()
        ]
      }
      case 'sendFeedback': {
        return [
          body('feedback').exists()
        ]
      }
      case 'invite': {
        return [
          body('email').isEmail(),
          body('isAdmin').isBoolean()
        ]
      }
    }
  }

};

module.exports = new UserController(userRepository);
