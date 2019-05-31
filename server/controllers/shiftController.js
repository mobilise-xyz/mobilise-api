const shiftRepository = require('../repositories').ShiftRepository;
const roleRepository = require('../repositories').RoleRepository;

var ShiftController = function(shiftRepository, roleRepository) {
  
  this.shiftRepository = shiftRepository;
  this.roleRepository = roleRepository;

  this.list = function(req, res) {

    shiftRepository
      .getAllWithRoles()
      .then(shifts => res.status(200).send(shifts))
      .catch(err => res.status(500).send(err));

  };

  this.listTitles = function(req, res) {

    shiftRepository
      .getAll(["title"])
      .then(shifts => {
        var titles = [];
        shifts.forEach(shift => {
          if (titles.indexOf(shift.title) == -1) {
            titles.push(shift.title)
          }
        });
        res.status(200).send(titles)
      })
      .catch(err => res.status(500).send(err));

  };

  this.deleteById = function(req, res) {

    shiftRepository
      .removeById(req.params.id)
      .then(shift => res.status(200).send({message: "Successfully deleted"}))
      .catch(err => res.status(500).send(err));

  };

  this.create = async function(req, res) {
    // Check if user is admin
    if (!req.user.admin) {
      res.status(401).send({message: "Only admin can add shifts"})
      return;
    }

    // Check the referenced roles
    var errs = [];
    var rolesRequired = req.body.rolesRequired;
    if (rolesRequired) {
      var i;
      for (i = 0; i < rolesRequired.length; i++) {
        await roleRepository.getByName(rolesRequired[i].roleName)
        .then(role => {
          if (role) {
            rolesRequired[i].role = role
          } else {
            errs.push("No role with name: " + rolesRequired[i].roleName);
          }
        });
      }
    }
    if (errs.length > 0) {
        res.status(400).send({"Could not add shift due to invalid roles" : errs});
        return;
    }
    // Check if repeated
    if (req.body.isRepeating) {
      var type = req.body.repeatedType
      // Check if valid request
      if (!['weekly', 'daily'].includes(type)) {
        res.status(400).send({message: "Invalid repeated type, must be weekly or daily."});
        return;
      }
      shiftRepository.addRepeated(req.body, req.user.id, rolesRequired, type)
      .then(result => {
        res.status(201).send(result);
      })
      .catch(err => res.status(500).send(err));
    } else {
      // Add the shift
      shiftRepository.add(req.body, req.user.id, rolesRequired)
      .then(result => {
        res.status(201).send(result);
      })
      .catch(err => res.status(500).send(err));
    }
  };
}

module.exports = new ShiftController(shiftRepository, roleRepository);
