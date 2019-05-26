const Shift = require('../models').Shift;

module.exports = {
  create(req, res) {
    if (!req.user.admin) {
      res.status(401).send({message: "Only admin can add shifts"})
    } else {
      return Shift
      .create({
        title: req.body.title,
        description: req.body.description
      })
      .then((shift) => res.status(201).send(shift))
      .catch((error) => res.status(400).send(error));
    }
  },
  
  list(req, res) {
      return Shift
      .findAll()
      .then((shifts) => res.status(200).send(shifts))
      .catch((error) => res.status(400).send(error));
  },
};