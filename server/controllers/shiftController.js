const shiftRepository = require("../repositories").ShiftRepository;
const roleRepository = require("../repositories").RoleRepository;
const bookingRepository = require("../repositories").BookingRepository;

var ShiftController = function(shiftRepository, roleRepository) {
  this.shiftRepository = shiftRepository;
  this.roleRepository = roleRepository;

  this.list = function(req, res) {
    shiftRepository
      .getAllWithBookings()
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
            titles.push(shift.title);
          }
        });
        res.status(200).send(titles);
      })
      .catch(err => res.status(500).send(err));
  };

  this.deleteById = function(req, res) {
    shiftRepository
      .removeById(req.params.id)
      .then(shift =>
        res.status(200).send({ message: "Successfully deleted", shift: shift })
      )
      .catch(err => res.status(500).send(err));
  };

  this.book = function(req, res) {
    if (req.user.isAdmin) {
      res.status(400).send({ message: "Admin cannot book onto shift" });
      return;
    }
    bookingRepository
      .getById(req.params.id, req.user.id)
      .then(booking => {
        if (booking) {
          res
            .status(400)
            .send({
              message: "Booking already exists for this shift and volunteer"
            });
        } else {
          return roleRepository.getByName(req.body.roleName);
        }
      })
      .then(role => {
        if (!role) {
          res
            .status(400)
            .send({ message: "No role with name: " + req.body.roleName });
        } else {
          return shiftRepository.getById(req.params.id);
        }
      })
      .then(shift => {
        if (!shift) {
          res
            .status(400)
            .send({ message: "No shift with id: " + req.params.id });
        } else {
          return bookingRepository.add(
            req.params.id,
            req.user.id,
            req.body.roleName
          );
        }
      })
      .then(booking => {
        res
          .status(200)
          .send({ message: "Successfully created booking", booking: booking });
      })
      .catch(err => {
        res.status(500).send(err);
      });
  };

  this.create = async function(req, res) {
    // Check if user is admin
    if (!req.user.isAdmin) {
      res.status(401).send({ message: "Only admin can add shifts" });
      return;
    }
    // Check the referenced roles
    var { errs, rolesRequired } = await checkRoles(req, roleRepository);
    if (errs.length > 0) {
      res
        .status(400)
        .send({ "Could not add shift due to invalid roles": errs });
      return;
    }
    var type = req.body.repeatedType;
    // Check if valid request
    if (!["weekly", "daily", "none"].includes(type)) {
      res
        .status(400)
        .send({
          message: "Invalid repeatedType, must be weekly, daily or none."
        });
      return;
    }
    if (type == "none") {
      shiftRepository
        .add(req.body, req.user.id, rolesRequired)
        .then(result => {
          res.status(201).send(result);
        })
        .catch(err => res.status(500).send(err));
    } else {
      shiftRepository
        .addRepeated(req.body, req.user.id, rolesRequired, type)
        .then(result => {
          res.status(201).send(result);
        })
        .catch(err => res.status(500).send(err));
    }
  };
};

module.exports = new ShiftController(shiftRepository, roleRepository);

async function checkRoles(req, roleRepository) {
  var errs = [];
  var rolesRequired = req.body.rolesRequired;
  if (rolesRequired) {
    var i;
    for (i = 0; i < rolesRequired.length; i++) {
      await roleRepository.getByName(rolesRequired[i].roleName).then(role => {
        if (role) {
          rolesRequired[i].role = role;
        } else {
          errs.push("No role with name: " + rolesRequired[i].roleName);
        }
      });
    }
  }

  return { errs, rolesRequired };
}
