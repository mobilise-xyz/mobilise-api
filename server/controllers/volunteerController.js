const volunteerRepository = require("../repositories").VolunteerRepository;
const shiftRepository = require("../repositories").ShiftRepository;
const Op = require("../models").Sequelize.Op;

var VolunteerController = function(volunteerRepository, shiftRepository) {
  this.volunteerRepository = volunteerRepository;
  this.shiftRepository = shiftRepository;

  this.list = function(req, res) {
    volunteerRepository
      .getAll()
      .then(volunteers => res.status(200).send(volunteers))
      .catch(err => res.status(500).send(err));
  };

  this.listShiftsByVolunteerId = function(req, res) {
    volunteerRepository
      .getById(req.params.id)
      .then(volunteer => {
        if (!volunteer) {
          res.status(400).send({ message: "No volunteer with that id" });
        } else {
          return volunteer.getShifts();
        }
      })
      .then(shifts => {
        var shiftIds = [];
        shifts.forEach(shift => {
          shiftIds.push(shift.id);
        });
        if (req.query.booked === "true") {
          return shiftRepository.getAllWithRequirements({
            id: { [Op.in]: shiftIds }
          });
        } else {
          return shiftRepository.getAllWithRequirements({
            id: { [Op.notIn]: shiftIds }
          });
        }
      })
      .then(shifts => res.status(200).send(shifts))
      .catch(err => res.status(500).send(err));
  };
};

module.exports = new VolunteerController(volunteerRepository, shiftRepository);
