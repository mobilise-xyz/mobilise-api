const userRepository = require("../repositories").UserRepository;
const userContactPreferenceRepository = require("../repositories")
  .UserContactPreferenceRepository;

var UserController = function(userRepository) {
  this.userRepository = userRepository;

  this.getById = function(req, res) {
    // Check request validity
    // 1) Request made by admin
    // 2) Request made by volunteer for their own info
    if (!req.user.isAdmin && req.user.id != req.params.id) {
      res.status(401).send({ message: "Unauthorised request" });
      return;
    }

    userRepository
      .getById(req.params.id)
      .then(user => {
        if (!user) {
          res.status(400).send({ message: "No user with that id" });
        } else {
          res.status(200).send({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName
          });
        }
      })
      .catch(error => res.status(500).send(error));
  };

  this.getContactPreferences = function(req, res) {
    userContactPreferenceRepository
      .getById(req.params.id)
      .then(result => {
        if (!result) {
          res.status(400).send({ message: "No user with that id" });
        } else {
          res.status(200).send(result);
        }
      })
      .catch(error => res.status(500).send(error));
  };

  this.updateContactPreferences = function(req, res) {
    // Check bearer token id matches parameter id
    if (req.user.id != req.params.id) {
      res
        .status(401)
        .send({ message: "You can only update your own contact preferences." });
      return;
    }

    userContactPreferenceRepository
      .update(req.params.id, req.body.contactPreference)
      .then(result => {
        if (!result) {
          res.status(400).send({ message: "No user with that id" });
        } else {
          res.status(200).send(result);
        }
      })
      .catch(error => res.status(500).send(error));
  };
};

module.exports = new UserController(userRepository);
