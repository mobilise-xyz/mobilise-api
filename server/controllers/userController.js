const {EmailClient, emailClientTypes} = require("../utils/email");
const userRepository = require("../repositories").UserRepository;
const userContactPreferenceRepository = require("../repositories")
  .UserContactPreferenceRepository;
const moment = require("moment");

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

  this.sendFeedback = function (req, res) {
    let emailClient = new EmailClient(emailClientTypes.CONTACT);

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

\"${req.body.feedback}\"

Love from Mobilise.
          `.trim());

          return emailClient.send(process.env.CONTACT_MAIL_SENDER_USER, "User feedback", feedbackMessage)
        }
      })
      .then(
        res.status(200).json({
          message: "Success!",
        }))
      .catch(error => res.status(500).json({message: error}));


  }
};

module.exports = new UserController(userRepository);
