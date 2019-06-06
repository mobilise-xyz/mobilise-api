const userRepository = require('../repositories').UserRepository;

var UserController = function(userRepository) {

  this.userRepository = userRepository;

  this.getById = function(req, res) {

    // Check request made by admin
    if (!req.user.isAdmin) {
      res.status(401).send({ message: "Only admins can access user catalogue" })
    }

    userRepository
      .getById(req.params.id)
      .then(user => {
          res.status(200).send({
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName
          });
      })
      .catch(err => res.status(500).send(err));

  }

  this.getContactPreferences = function(req, res) {

    // Check bearer token id matches parameter id
    if (req.user.id != req.params.id) {
      res
        .status(401)
        .send({ message: "You can only view your own contact preferences." });
      return;
    }

    res.status(200).send({
      email: true,
      text: true 
    })

  };

  this.updateContactPreferences = function(req, res) {

    // Check bearer token id matches parameter id
    if (req.user.id != req.params.id) {
      res
        .status(401)
        .send({ message: "You can only update your own contact preferences." });
      return;
    }

    res.status(200).send({
      message: "Updated contact preferences",
      email: req.body.email,
      text: req.body.text 
    })

  };
}

module.exports = new UserController(userRepository);
