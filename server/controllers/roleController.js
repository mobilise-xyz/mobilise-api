const Role = require('../models').Role;

module.exports = {
  create(req, res) {
    if (!req.user.admin) {
      res.status(401).send({message: "Only admin can add roles"})
    } else {
      return Role
      .create({
        name: req.body.name,
        involves: req.body.involves
      })
      .then((role) => res.status(201).send(role))
      .catch((error) => res.status(400).send(error));
    }
  },
  
  list(req, res) {
      return Role
      .findAll()
      .then((roles) => res.status(200).send(roles))
      .catch((error) => res.status(400).send(error));
  },
};