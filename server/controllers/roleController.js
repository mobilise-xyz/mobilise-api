const roleRepository = require('../repositories/roleRepository');

module.exports = {
  create(req, res) {
    if (!req.user.admin) {
      res.status(401).send({message: "Only admin can add roles"})
    } else {
      return roleRepository.add({
        name: req.body.name,
        involves: req.body.involves
      })
      .then(role => res.status(201).send(role))
      .catch(error => res.status(400).send(error));
    }
  },
  
  list(req, res) {
      return roleRepository
      .getAll()
      .then((roles) => res.status(200).send(roles))
      .catch((error) => res.status(400).send(error));
  },
};