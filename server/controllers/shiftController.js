const shiftRepository = require('../repositories').ShiftRepository;
const roleRepository = require('../repositories').RoleRepository;
const Q = require('q');

module.exports = {
  create(req, res) {
    if (!req.user.admin) {
      res.status(401).send({message: "Only admin can add shifts"})
    } else {
      shiftRepository
      .add(req.body, req.user.id)
      .then(async(shift) => {
        if (req.body.rolesRequired) {
          var rolesRequired = JSON.parse(req.body.rolesRequired);
          var i;
          for (i = 0; i < rolesRequired.length; i++) {
            var roleRequired = rolesRequired[i];
            await roleRepository.getByName(roleRequired.roleName)
            .then(role => {
              if (role) {
                return shift.addRole(role, {through: {numberRequired: roleRequired.number}});
              } else {
                return Q.reject("No role with id");
              }
            });
          }
        }
        return shift;
        })
      .then(result => {
        res.status(201).send(result);
      })
      .catch(error => res.status(400).send(error))
    }
  },
  
  list(req, res) {
      shiftRepository.getAll()
      .then(shifts => res.status(200).send(shifts))
      .catch(error => res.status(400).send(error));
  },
};