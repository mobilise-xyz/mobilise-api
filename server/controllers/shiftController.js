const shiftRepository = require('../repositories').ShiftRepository;
const roleRepository = require('../repositories').RoleRepository;
const moment = require('moment');

module.exports = {
  async create(req, res) {
    // Check if user is admin
    if (!req.user.admin) {
      res.status(401).send({message: "Only admin can add shifts"})
      return;
    }
    // Check the referenced roles
    var roles = [];
    var numbers = [];
    var errs = [];
    if (req.body.rolesRequired) {
      var rolesRequired = req.body.rolesRequired;
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
      res.status(400).send({"Could not add shift due to invalid roles" : errs});
      return;
    }
    // Check if repeated
    if (req.body.isRepeating) {
      const repeatedTypes = {"weekly": 7, "daily": 1};
      var increment = repeatedTypes[req.body.repeatedType];
      // Check if valid request
      if (!increment) {
        res.status(400).send({message: "Invalid repeated type, must be weekly or daily."});
        return;
      }
      var repeatedId;
      var lastShift;
      var successful = true;
      await shiftRepository.addRepeatedShift(req.body.repeatedType)
      .then(result => repeatedId = result.id)
      .catch(err => {
        successful = false;
        res.status(500).send(err);
      })
      // Create repeated shift
      var startDate = moment(req.body.date,"YYYY-MM-DD");
      var untilDate =  moment(req.body.untilDate,"YYYY-MM-DD");
      while (moment(startDate).isBefore(untilDate) && successful) {
        // Add the shift
        req.body.date = startDate;
        await shiftRepository
        .add(req.body, req.user.id, repeatedId)
        .then(async(shift) => {
          // Add the roles to shift
          var i;
          for (i = 0; i < roles.length; i++) {
            await shift.addRole(roles[i], {through: {numberRequired: numbers[i]}})
          }
          return shift;
        })
        .then(shift => lastShift = shift)
        .catch(err => {
          successful = false;
          res.status(500).send(err);
        });
        startDate = moment(startDate).add(increment, 'd').toDate()
      }
      if (successful) {
        res.status(200).send({message: "Created recurring shift", lastShift: lastShift})
      }
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
      .catch(err => res.status(500).send(err));
    }
  },
  
  list(req, res) {
    shiftRepository.getAllWithRoles()
    .then(shifts => res.status(200).send(shifts))
    .catch(err => res.status(500).send(err));
  },


  listTitles(req, res) {
    shiftRepository.getAll(["title"])
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
  },

  deleteById(req, res) {
    shiftRepository.removeById(req.params.id)
    .then(shift => res.status(200).send({message: "Successfully deleted"}))
    .catch(err => res.status(500).send(err));
  }

};
