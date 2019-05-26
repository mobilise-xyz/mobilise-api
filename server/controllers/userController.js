const User = require('../models').User;
var bcrypt = require('bcrypt');

module.exports = {
  registerUser: function(req, res) {
      var user = req.body;
      bcrypt.hash(user.password, 8, function(err, hash) {
        return User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
            dob: req.body.dob
        })
        .then((user) => res.status(201).send(user))
        .catch((error) => res.status(400).send(error));
      });
  }
};
