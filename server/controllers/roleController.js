const roleRepository = require("../repositories").RoleRepository;

var RoleController = function(roleRepository) {
// Create a new role
  this.create = function(req, res) {
    // Check if admin
    if (!req.user.isAdmin) {
      res.status(401).send({ message: "Only admins can add roles" });
      return;
    }
    // Check if valid hex string
    if (req.body.colour) {
      if (!/^#[0-9A-F]{6}$/i.test(req.body.colour)) {
        res
          .status(400)
          .send({ message: req.body.colour + " is not a valid hex colour" });
        return;
      }
    }
    // Check if already exists
    roleRepository
      .getByName(req.body.name)
      .then(role => {
        if (role) {
          res
            .status(400)
            .send({ message: "Role with that name already exists" });
        } else {
          return roleRepository.add(req.body);
        }
      })
      .then(role => res.status(201).send(role))
      .catch(error => res.status(500).send(error));
  };

  // Retrieve all existing roles
  this.list = function(req, res) {
    return roleRepository
      .getAll()
      .then(roles => res.status(200).send(roles))
      .catch(() => res.status(500).send(error));
  };

  // Removing a role
  this.remove = function(req, res) {
    // Check if admin
    if (!req.user.isAdmin) {
      res.status(401).send({ message: "Only admins can remove roles" });
    } else {
      roleRepository
        .removeByName(req.body.name)
        .then(() => {
          res.status(200).send({ message: "Successfully removed role" });
        })
        .catch(error => res.status(500).send(error));
    }
  };
};

module.exports = new RoleController(roleRepository);
