const volunteerRepository = require("../repositories").VolunteerRepository;
const shiftRepository = require("../repositories").ShiftRepository;
const bookingRepository = require("../repositories").BookingRepository;
const Op = require("../models").Sequelize.Op;
const Predictor = require("../recommenderSystem").Predictor;
const moment = require("moment");
const volunteerIsAvailableForShift = require("../utils/availability")
  .volunteerIsAvailableForShift;

const EXPECTED_SHORTAGE_THRESHOLD = 6;

var VolunteerController = function (volunteerRepository, shiftRepository) {
  this.list = function (req, res) {
    // Restrict access to admin
    if (!req.user.isAdmin) {
      res
        .status(401)
        .send({message: "Only admins can access volunteer catalogue"});
      return;
    }

    volunteerRepository
      .getAll()
      .then(volunteers => res.status(200).send(volunteers))
      .catch(err => res.status(500).send(err));
  };

  (this.getStats = function (req, res) {
    // Check bearer token id matches parameter id
    if (req.user.id !== req.params.id) {
      res.status(401).send({message: "You can only view your own stats."});
      return;
    }

    volunteerRepository.getById(req.user.id)
      .then(volunteer => {
        if (!volunteer) {
          res.status(400).send({message: "No volunteer with that id"});
        } else {
          const now = moment();
          const date = now.format("YYYY-MM-DD");
          const time = now.format("HH:mm");
          return bookingRepository.getByVolunteerId(volunteer.userId, {
            [Op.or]: [{
              date: {
                [Op.lt]: date
              }
            }, {
              [Op.and]: [{
                date: {
                  [Op.eq]: date,
                },
                stop: {
                  [Op.lte]: time
                }
              }]
            }]
          });
        }
      })
      .then(bookings => {
        var hours = 0;
        var shiftsCompleted = bookings.length;
        bookings.forEach(booking => {
          var shift = booking.shift;
          var startTime = moment(shift.start, "HH:mm");
          var stopTime = moment(shift.stop, "HH:mm");
          var duration = moment.duration(stopTime.diff(startTime));
          hours += duration.asHours();
        });
        res.status(200).send({
          contributions: {
            shiftsCompleted: shiftsCompleted,
            hours: hours,
            challengesCompleted: 2
          }
        });
      })
      .catch(err => res.status(500).send(err));
  });


    (this.getActivity = function (req, res) {
      // Check bearer token id matches parameter id
      if (req.user.id !== req.params.id) {
        res.status(401).send({message: "You can only view your own stats."});
        return;
      }

      res.status(200).send({
        myActivity: []
      });
    });

    (this.getHallOfFame = async function (req, res) {
      var response = {};
      var fields = ['lastWeekHours', 'lastWeekIncrease'];
      var errs = [];
      for (var i = 0; i < fields.length; i++) {
        var ranking = [];
        await volunteerRepository.getTop([[fields[i],'DESC']], 3)
          .then(volunteers => {
            for (var j = 0; j < volunteers.length; j++) {
              var volunteer = volunteers[j];
              ranking.push({
                rank: j+1,
                uid: volunteer.userId,
                name: `${volunteer.user.firstName} ${volunteer.user.lastName}`,
                number: volunteer[fields[i]]
              });
            }
          })
          .catch(err => errs.push(err));
        response[fields[i]] = ranking;
      }
      if (errs.length > 0) {
        res.status(500).send(errs);
      } else {
        res.status(200).send({hallOfFame: response});
      }
    });

    (this.updateAvailability = function (req, res) {
      // Check bearer token id matches parameter id
      if (req.user.id !== req.params.id) {
        res
          .status(401)
          .send({message: "You can only update your own availability."});
        return;
      }

      volunteerRepository
        .getById(req.params.id)
        .then(volunteer => {
          if (!volunteer) {
            res.status(400).send({message: "No volunteer with that id"});
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
    });

  this.getAvailability = function (req, res) {
    // Check bearer token id matches parameter id
    if (req.user.id !== req.params.id) {
      res
        .status(401)
        .send({message: "You can only update your own availability."});
      return;
    }

    volunteerRepository
      .getById(req.params.id)
      .then(volunteer => {
        if (!volunteer) {
          res.status(400).send({message: "No volunteer with that id"});
        } else {
          volunteerRepository
            .getAvailability(req.params.id)
            .then(result => res.status(200).send(result))
            .catch(error => res.status(400).send(error));
        }
      })
      .catch(error => res.status(500).send(error));
  };

  this.listShiftsByVolunteerId = function (req, res) {
    var volunteer;
    volunteerRepository
      .getById(req.params.id)
      .then(vol => {
        if (!vol) {
          res.status(400).send({message: "No volunteer with that id"});
        } else {
          volunteer = vol;
          return bookingRepository.getByVolunteerId(vol.userId);
        }
      })
      .then(bookings => {
        var shiftIds = bookings.map(booking => booking.shiftId);

        if (req.query.booked) {
          return shiftRepository
            .getAllWithRequirements({
              id: {[Op.in]: shiftIds}
            })
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

        return Predictor.computeExpectedShortages().then(_ => {
          return shiftRepository
            .getAllWithRequirements({
              id: {[Op.notIn]: shiftIds}
            })
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
        });
      })
      .then(shifts => res.status(200).send(shifts))
      .catch(err => res.status(500).send(err));
  };

  (this.calculateHallOfFame = function (req, res) {
    var date = moment().format("YYYY-MM-DD");
    var time = moment().format("HH:mm");
    var lastWeek = moment().subtract(7, "d").format("YYYY-MM-DD");

    volunteerRepository.getAllWithShifts({
      [Op.or]: [{
        date: {
          [Op.gt]: lastWeek
        }
      }, {
        [Op.and]: [{
          date: {
            [Op.eq]: lastWeek,
          },
          start: {
            [Op.gte]: time
          }
        }]
      }],
      [Op.and]: {
        // Started after last week
        // Stopped before now
        [Op.or]: [{
          date: {
            [Op.lt]: date
          }
        }, {
          [Op.and]: [{
            date: {
              [Op.eq]: date,
            },
            stop: {
              [Op.lte]: time
            }
          }]
        }]
      }
    })
      .then(async volunteers => {
        for (var i = 0; i < volunteers.length; i++) {
          var volunteer = volunteers[i];
          var lastWeekHours = 0;
          var lastWeekShifts = volunteer.shifts.length;
          var lastWeekIncrease = 0;
          volunteer.shifts.forEach(shift => {
            var startTime = moment(shift.start, "HH:mm");
            var stopTime = moment(shift.stop, "HH:mm");
            var duration = moment.duration(stopTime.diff(startTime));
            lastWeekHours += duration.asHours();
          });
          if (volunteer.lastWeekHours > 0) {
            lastWeekIncrease = (lastWeekHours / volunteer.lastWeekHours).toFixed(1);
          }
          await volunteerRepository.update(volunteer, {
            lastWeekHours: lastWeekHours,
            lastWeekShifts: lastWeekShifts,
            lastWeekIncrease: lastWeekIncrease
          });
        }
        res.status(200).send({message: "Success"});
      });
  });
};

module.exports = new VolunteerController(volunteerRepository, shiftRepository);
