const roleRepository = require('../repositories').RoleRepository;

var RoleController = function(roleRepository) {
  
  this.roleRepository = roleRepository;

  // Create a new role 
  this.create = function(req, res) {
    // Check if admin
    if (!req.user.admin) {
      res.status(401).send({message: "Only admins can add roles"})
    } else {
      // Check if already exists
      roleRepository
        .getByName(req.body.name)
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
  };

  // Retrieve all existing roles
  this.list = function(req, res) {
    return roleRepository
        .getAll()
        .then(roles => res.status(200).send(roles))
        .catch(err => res.status(500).send(error));
  };

  // Removing a role
  this.remove = function(req, res) {
    // Check if admin
    if (!req.user.admin) {
      res.status(401).send({message: "Only admins can remove roles"})
    } else {
      roleRepository
        .removeByName(req.body.name)
        .then(role => {
          res.status(200).send({message: "Successfully removed role"})
        })
        .catch(error => res.status(500).send(error));
    }
  }
}

module.exports = new RoleController(roleRepository);