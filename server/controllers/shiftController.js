const shiftRepository = require('../repositories/shiftRepository');

module.exports = {
  create(req, res) {
    if (!req.user.admin) {
      res.status(401).send({message: "Only admin can add shifts"})
    } else {
      return shiftRepository
      .add(req.body)
      .then(shift => {
        if (req.body.rolesRequired) {
          var rolesRequired = JSON.parse(req.body.rolesRequired);
          return shiftRepository.addRequiredRoles(shift, rolesRequired);
        }
        return shift;
        })
      .catch(error => res.status(400).send(error))
      .then(result => {
        res.status(201).send(result);
      });
    }
  },
  
  list(req, res) {
      shiftRepository.getAll()
      .then((shifts) => res.status(200).send(shifts))
      .catch((error) => res.status(400).send(error));
  },
};