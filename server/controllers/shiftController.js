const shiftRepository = require('../repositories').ShiftRepository;
const roleRepository = require('../repositories').RoleRepository;

module.exports = {
  async create(req, res) {
    // Check if user is admin
    if (!req.user.admin) {
      res.status(401).send({message: "Only admin can add shifts"})
    } else {
      // Check the referenced roles
      var roles = [];
      var numbers = [];
      var errs = [];
      if (req.body.rolesRequired) {
        var rolesRequired = JSON.parse(req.body.rolesRequired);
        var i;
        for (i = 0; i < rolesRequired.length; i++) {
          var roleRequired = rolesRequired[i];
          numbers.push(roleRequired.number);
          await roleRepository.getByName(roleRequired.roleName)
          .then(role => {
            if (role) {
              roles.push(role)
            } else {
              errs.push("No role with name: " + roleRequired.roleName);
            }
          });
        }
      }
      if (errs.length > 0) {
        res.status(400).send({"Could not add shift" : errs});
      } else {
        // Add the shift
        shiftRepository
        .add(req.body, req.user.id)
        .then(async(shift) => {
          // Add the roles to shift
          var i;
          for (i = 0; i < roles.length; i++) {
            await shift.addRole(roles[i], {through: {numberRequired: numbers[i]}})
          }
          return shift;
        })
        .then(result => {
          res.status(201).send(result);
        })
        .catch(error => res.status(500).send(error))
        }
    }
  },
  
  list(req, res) {
      shiftRepository.getAll()
      .then(shifts => res.status(200).send(shifts))
      .catch(error => res.status(500).send(error));
  },
};