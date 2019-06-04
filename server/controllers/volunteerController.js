const volunteerRepository = require("../repositories").VolunteerRepository;
const shiftRepository = require("../repositories").ShiftRepository;
const recommendedShiftRepository = require("../repositories").RecommendedShiftRepository;
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

  this.updateAvailability = function(req, res) {
    // Check bearer token id matches parameter id
    if (req.user.id != req.params.id) {
      res
        .status(400)
        .send({ message: "You can only update your own availability." });
      return;
    }

    volunteerRepository
      .getById(req.params.id)
      .then(volunteer => {
        if (!volunteer) {
          res.status(400).send({ message: "No volunteer with that id" });
        } else {
          volunteerRepository
            .updateAvailability(req.params.id, req.body.availability)
            .then(result =>
              res.status(201).send({
                message: "Availability Updated Successfuly"
              })
            )
            .catch(error => res.status(400).send(error));
        }
      })
      .catch(error => res.status(500).send(error));
  };

  this.getAvailability = function(req, res) {
    // Check bearer token id matches parameter id
    if (req.user.id != req.params.id) {
      res
        .status(400)
        .send({ message: "You can only update your own availability." });
      return;
    }

    volunteerRepository
      .getById(req.params.id)
      .then(volunteer => {
        if (!volunteer) {
          res.status(400).send({ message: "No volunteer with that id" });
        } else {
          volunteerRepository
            .getAvailability(req.params.id)
            .then(result => res.status(200).send(result))
            .catch(error => res.status(400).send(error));
        }
      })
      .catch(error => res.status(500).send(error));
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
        // Obtain Shift Ids
        var shiftIds = shifts.map(shift => shift.id);

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

  this.listRecommendedShifts = function(req, res) {
    recommendedShiftRepository
      .getAll()
      .then(shifts => {
        res.status(200).send(shifts);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  };
};

module.exports = new VolunteerController(volunteerRepository, shiftRepository);
