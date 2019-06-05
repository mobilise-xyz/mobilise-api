const volunteerRepository = require("../repositories").VolunteerRepository;
const shiftRepository = require("../repositories").ShiftRepository;
const bookingRepository = require("../repositories").BookingRepository;
const Op = require("../models").Sequelize.Op;
const Predictor = require("../recommenderSystem").Predictor;
const volunteerIsAvailableForShift = require("../utils/availability")
  .volunteerIsAvailableForShift;

const EXPECTED_SHORTAGE_THRESHOLD = 6;

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
    var volunteer;
    volunteerRepository
      .getById(req.params.id)
      .then(vol => {
        if (!vol) {
          res.status(400).send({ message: "No volunteer with that id" });
        } else {
          volunteer = vol;
          return bookingRepository.getByVolunteerId(vol.userId);
        }
      })
      .then(bookings => {
        var shiftIds = [];
        bookings.forEach(booking => {
          shiftIds.push(booking.shiftId);
        });
        if (req.query.booked) {
          return shiftRepository.getAllWithRequirements({
            id: { [Op.in]: shiftIds }
          });
        }
        return shiftRepository
          .getAllWithRequirements({
            id: { [Op.notIn]: shiftIds }
          })
          .then(shifts => {
            var result = [];
            shifts.forEach(s => {
              var shift = s.toJSON();
              if (volunteerIsAvailableForShift(volunteer, shift) > 0.5) {
                for (var i = 0; i < shift.requirements.length; i++) {
                  var requirement = shift.requirements[i];
                  if (
                    requirement.expectedShortage > EXPECTED_SHORTAGE_THRESHOLD
                  ) {
                    requirement.recommended = true;
                  }
                  shift.requirements[i] = requirement;
                }
              }
              result.push(shift);
            });
            return result;
          });
      })
      .then(shifts => res.status(200).send(shifts))
      .catch(err => res.status(500).send(err));
  };
};

module.exports = new VolunteerController(volunteerRepository, shiftRepository);
