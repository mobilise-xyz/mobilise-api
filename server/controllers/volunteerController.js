const volunteerRepository = require("../repositories").VolunteerRepository;
const shiftRepository = require("../repositories").ShiftRepository;
const bookingRepository = require("../repositories").BookingRepository;
const metricRepository = require("../repositories").MetricRepository;
const moment = require("moment");
const Op = require("../models").Sequelize.Op;
const { volunteerIsAvailableForShift } = require("../utils/availability");
const {
  REQUIREMENTS_WITH_BOOKINGS,
  CREATOR,
  REPEATED_SHIFT
} = require("../sequelizeUtils/include");
const { SHIFT_BEFORE, SHIFT_AFTER } = require("../sequelizeUtils/where");
const EXPECTED_SHORTAGE_THRESHOLD = 2;

var VolunteerController = function(volunteerRepository, shiftRepository) {
  this.list = function(req, res) {
    // Restrict access to admin
    if (!req.user.isAdmin) {
      res
        .status(401)
        .send({ message: "Only admins can access volunteer catalogue" });
      return;
    }

    volunteerRepository
      .getAll()
      .then(volunteers => res.status(200).send(volunteers))
      .catch(err => res.status(500).send(err));
  };

  (this.getStats = function(req, res) {
    // Check bearer token id matches parameter id
    if (req.user.id !== req.params.id) {
      res.status(401).send({ message: "You can only view your own stats." });
      return;
    }
    var volunteer;

    volunteerRepository
      .getById(req.user.id)
      .then(vol => {
        if (!vol) {
          res.status(400).send({ message: "No volunteer with that id" });
        } else {
          const now = moment();
          const date = now.format("YYYY-MM-DD");
          const time = now.format("HH:mm");
          volunteer = vol;
          return bookingRepository.getByVolunteerId(
            vol.userId,
            SHIFT_BEFORE(date, time)
          );
        }
      })
      .then(bookings => {
        var contributions = {};
        var hours = 0;
        var shiftsCompleted = bookings.length;
        bookings.forEach(booking => {
          var shift = booking.shift;
          var startTime = moment(shift.start, "HH:mm");
          var stopTime = moment(shift.stop, "HH:mm");
          var duration = moment.duration(stopTime.diff(startTime));
          hours += duration.asHours();
        });
        var metricStat;
        var totalHoursFromLastWeek;
        contributions["shiftsCompleted"] = shiftsCompleted;
        contributions["hours"] = roundIfNotInteger(hours, 1);
        metricRepository
          .get()
          .then(metric => {
            if (metric) {
              metricStat = metric;
              return volunteerRepository.getTotalHoursFromLastWeek();
            } else {
              res.status(200).send({
                contributions: contributions
              });
            }
          })
          .then(hours => {
            totalHoursFromLastWeek = hours;
            contributions["metric"] = {
              name: metricStat.name,
              verb: metricStat.verb,
              value:
                totalHoursFromLastWeek !== 0
                  ? Math.round(
                      metricStat.value *
                        (volunteer.lastWeekHours / totalHoursFromLastWeek)
                    )
                  : 0
            };
            res.status(200).send({
              contributions: contributions
            });
          });
      })
      .catch(err => res.status(500).send(err));
  }),
    (this.getActivity = function(req, res) {
      // Check bearer token id matches parameter id
      if (req.user.id !== req.params.id) {
        res.status(401).send({ message: "You can only view your own stats." });
        return;
      }

      res.status(200).send({
        myActivity: []
      });
    });

  this.getHallOfFame = async function(req, res) {
    var response = {};
    var fields = ["lastWeekHours", "lastWeekIncrease"];
    var errs = [];
    for (var i = 0; i < fields.length; i++) {
      var ranking = [];
      await volunteerRepository
        .getTop([[fields[i], "DESC"]], 3)
        .then(volunteers => {
          for (var j = 0; j < volunteers.length; j++) {
            var volunteer = volunteers[j];
            ranking.push({
              rank: j + 1,
              uid: volunteer.userId,
              name: `${volunteer.user.firstName} ${volunteer.user.lastName}`,
              number: roundIfNotInteger(volunteer[fields[i]], 1)
            });
          }
        })
        .catch(err => errs.push(err));
      response[fields[i]] = ranking;
    }
    if (errs.length > 0) {
      res.status(500).send(errs);
    } else {
      res.status(200).send({ hallOfFame: response });
    }
  };

  this.updateAvailability = function(req, res) {
    // Check bearer token id matches parameter id
    if (req.user.id !== req.params.id) {
      res
        .status(401)
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
            .then(() =>
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
    if (req.user.id !== req.params.id) {
      res
        .status(401)
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
    var after = req.query.after;
    var whereTrue = {};
    if (after) {
      var afterMoment = moment(after);
      var date = afterMoment.format("YYYY-MM-DD");
      var time = afterMoment.format("HH:mm");
      whereTrue = SHIFT_AFTER(date, time);
    }
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
        var shiftIds = bookings.map(booking => booking.shiftId);
        if (req.query.booked) {
          whereTrue["id"] = { [Op.in]: shiftIds };
          return shiftRepository
            .getAll(null, whereTrue, [
              REQUIREMENTS_WITH_BOOKINGS(),
              CREATOR(),
              REPEATED_SHIFT()
            ])
            .then(shifts => {
              var result = [];
              shifts.forEach(s => {
                var shift = s.toJSON();
                var requirements = [];
                shift.requirements.forEach(requirement => {
                  requirement.bookings.forEach(booking => {
                    if (booking.volunteerId === volunteer.userId) {
                      requirements.push(requirement);
                    }
                  });
                });
                shift.requirements = requirements;
                result.push(shift);
              });
              return result;
            });
        }
        console.log(whereTrue);
        whereTrue["id"] = { [Op.notIn]: shiftIds };
        return shiftRepository
          .getAll(null, whereTrue, [
            REQUIREMENTS_WITH_BOOKINGS(),
            CREATOR(),
            REPEATED_SHIFT()
          ])
          .then(shifts => {
            var result = [];
            shifts.forEach(s => {
              var shift = s.toJSON();
              if (volunteerIsAvailableForShift(volunteer, shift)) {
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

function roundIfNotInteger(num, numDP) {
  return Number.isInteger(num) ? num : num.toFixed(numDP);
}

module.exports = new VolunteerController(volunteerRepository, shiftRepository);
