const {EmailClient, emailClientTypes} = require("../utils/email");
const userRepository = require("../repositories").UserRepository;
const userContactPreferenceRepository = require("../repositories")
  .UserContactPreferenceRepository;
const {isSecure, validatePassword, hashedPassword} = require("../utils/password");
const moment = require("moment");
const crypto = require("crypto");
const invitationTokenRepository = require("../repositories").InvitationTokenRepository;

let UserController = function (userRepository) {

  this.getById = function (req, res) {
    // Check request validity
    // 1) Request made by admin
    // 2) Request made by volunteer for their own info
    if (!req.user.isAdmin && req.user.id !== req.params.id) {
      res.status(401).json({message: "Unauthorised request"});
      return;
    }

    userRepository
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
              contactPreferences: user.contactPreferences
            }
          });
        }
      })
      .catch(error => res.status(500).json({message: error}));
  };

  this.getContactPreferences = function (req, res) {
    userContactPreferenceRepository
      .getById(req.params.id)
      .then(result => {
        if (!result) {
          res.status(400).send({message: "No user with that id"});
        } else {
          res.status(200).json({message: "Success!", contactPreferences: result});
        }
      })
      .catch(error => res.status(500).json({message: error}));
  };

  this.updateContactPreferences = function (req, res) {
    // Check bearer token id matches parameter id
    if (req.user.id !== req.params.id) {
      res
        .status(401)
        .send({message: "You can only update your own contact preferences."});
      return;
    }

    userContactPreferenceRepository
      .update(req.params.id, req.body.contactPreferences)
      .then(result => {
        if (!result) {
          res.status(400).send({message: "No user with that id"});
        } else {
          res.status(200).send({message: "Success! Updated contact preferences", contactPreferences: result});
        }
      })
      .catch(error => res.status(500).json({message: error}));
  };

  this.changePassword = function (req, res) {
    if (!req.body.oldPassword) {
      res.status(400).json({message: "Please provide your old password"});
    }
    if (!validatePassword(req.body.oldPassword, req.user.password)) {
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
    userRepository.update(req.user, {password: hashedPassword(req.body.newPassword)})
      .then(() => res.status(200).json({message: "Success! Password has been changed."}))
      .catch(() => res.status(500).json({message: "An error occurred"}));
  };

  this.sendFeedback = function (req, res) {
    const emailClient = new EmailClient(emailClientTypes.NOREPLY);

    if (!req.body.feedback) {
      res.status(400);
      return;
    }

    // Lookup user email.
    userRepository
      .getById(req.params.id)
      .then(user => {
        if (!user) {
          res.status(400).json({message: "No user with that id"});
        } else {
          const feedbackMessage = (`
          New user feedback received from ${user.firstName} ${user.lastName} (${user.email}).
          Message sent at ${moment().format('MMMM Do YYYY, h:mm:ss a')}
          
          "${req.body.feedback}"
          
          Love from
          Mobilise.`.trim());
          return emailClient.send(process.env.CONTACT_MAIL_SENDER_USER, "User feedback", feedbackMessage)
        }
      })
      .then(
        res.status(200).json({
          message: "Success!",
        }))
      .catch(error => res.status(500).json({message: error}));
  };

  this.invite = function (req, res) {
    if (!req.user.isAdmin) {
      res.status(401).json({message: "Only admins can invite volunteers"});
      return;
    }
    if (!req.body.email) {
      res.status(400).json({message: "No email has been specified"});
    }
    userRepository.getByEmail(req.body.email)
      .then(user => {
        if (user) {
          res.status(400).json({message: "User already has an account"});
          return;
        }
        return invitationTokenRepository.getByEmail(req.body.email);
      })
      .then(invitation => {
        if (invitation && moment().isBefore(invitation.expires)) {
          res.status(400).json({message: "Volunteer with that email has already been invited!"});
          return;
        }
        const token = crypto.randomBytes(16).toString('hex');
        const expires = moment().add(1, 'days').format();
        return invitationTokenRepository.add(req.body.email, token, expires, req.body.isAdmin)
          .then(() => {
            const emailClient = new EmailClient(emailClientTypes.NOREPLY);
            return emailClient.send(req.body.email,
              "Invitation to City Harvest",
              `Hello from Mobilise,\n
          You have been invited to join City Harvest by ${req.user.firstName}.\n
          Please click the following link to sign-up to Mobilise, the home of volunteering at City Harvest.\n\n
          ${process.env.WEB_URL}/signup?token=${token}\n\n
          This link will expire in 24 hours.`)
          })
      })
      .then(() => res.status(200).json({message: "Success! Invitation has been sent."}))
      .catch(err => res.status(500).json({message: err}));
  }
};

module.exports = new UserController(userRepository);
