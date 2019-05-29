const roleRepository = require('../repositories').RoleRepository;

module.exports = {
  create(req, res) {
    if (!req.user.admin) {
      res.status(401).send({message: "Only admin can add roles"})
    } else {
      return roleRepository.add(req.body)
      .then(role => res.status(201).send(role))
      .catch(error => res.status(500).send(error));
    }
  },
  
  list(req, res) {
      return roleRepository
      .getAll()
      .then((roles) => res.status(200).send(roles))
      .catch((error) => res.status(500).send(error));
  },
};