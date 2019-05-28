const Shift = require('../models').Shift;
const Role = require('../models').Role;

module.exports = {
  create(req, res) {
    if (!req.user.admin) {
      res.status(401).send({message: "Only admin can add shifts"})
    } else {
      return Shift
      .create({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        start: req.body.start,
        stop: req.body.stop,
        postcode: req.body.postcode
      })
      .then(shift => {
        if (req.body.rolesRequired) {
          var rolesRequired = JSON.parse(req.body.rolesRequired);
          var i;
          for (i = 0; i < rolesRequired.length; i++) {
            var roleRequired = rolesRequired[i];
            Role
            .findOne({where: {id: roleRequired.roleId}})
            .then((role) => {
              shift
              .addRole(role, {through: {  numberRequired: roleRequired.number}});
              });
            }
          }
          return shift;
        })
      .then(result => {
        res.status(201).send(result);
      })
      .catch(error => res.status(400).send(error));
    }
  },
  
  list(req, res) {
      return Shift
      .findAll({
        include: ['roles']
      })
      .then((shifts) => res.status(200).send(shifts))
      .catch((error) => res.status(400).send(error));
  },
};