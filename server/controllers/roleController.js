const roleRepository = require('../repositories').RoleRepository;

module.exports = {
  create(req, res) {
    // Check if admin
    if (!req.user.admin) {
      res.status(401).send({message: "Only admin can add roles"})
    } else {
      // Check if already exists
      roleRepository.getByName(req.body.name)
      .then(role => {
        if (role) {
          res.status(400).send({message: "Role with that name already exists"})
        } else { 
          roleRepository.add(req.body)
          .then(role => res.status(201).send(role))
        }
      })
      .catch(error => res.status(500).send(error));
    }
  },
  
  list(req, res) {
      return roleRepository
      .getAll()
      .then(roles => res.status(200).send(roles))
      .catch(err => res.status(500).send(error));
  },
};