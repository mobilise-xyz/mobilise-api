const volunteerRepository = require("../repositories").VolunteerRepository;
const userRepository = require("../repositories").UserRepository;
const shiftRepository = require("../repositories").ShiftRepository;
const bookingRepository = require("../repositories").BookingRepository;
const metricRepository = require("../repositories").MetricRepository;
const moment = require("moment");
const uuid = require("uuid/v4");
const Op = require("../models").Sequelize.Op;
const {volunteerIsAvailableForShift} = require("../utils/availability");
const {getDateRange} = require("../utils/date");
const {
  REQUIREMENTS_WITH_BOOKINGS,
  CREATOR,
  REPEATED_SHIFT,
  USER
} = require("../sequelizeUtils/include");
const {SHIFT_BEFORE} = require("../sequelizeUtils/where");
const EXPECTED_SHORTAGE_THRESHOLD = 2;
const ITEMS_PER_PAGE = 5;

let VolunteerController = function (volunteerRepository, shiftRepository, userRepository) {
  this.list = function (req, res) {
    // Restrict access to admin
    if (!req.user.isAdmin) {
      res
        .status(401)
        .json({message: "Only admins can access volunteer catalogue"});
      return;
    }

    let whereTrue = {};

    if (req.query.approved != null) {
      whereTrue["approved"] = req.query.approved
    }

    volunteerRepository
      .getAll({}, [USER(whereTrue)])
      .then(volunteers => res.status(200).json({message: "Success", volunteers}))
      .catch(err => res.status(500).json({message: err}));
  };

  this.getStats = function (req, res) {
    // Check bearer token id matches parameter id
    if (req.user.id !== req.params.id) {
      res.status(401).send({message: "You can only view your own stats."});
      return;
    }
    let volunteer;

    volunteerRepository
      .getById(req.user.id)
      .then(vol => {
        if (!vol) {
          res.status(400).send({message: "No volunteer with that id"});
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
        let contributions = {};
        let hours = 0;
        let shiftsCompleted = bookings.length;
        bookings.forEach(booking => {
          let shift = booking.shift;
          let startTime = moment(shift.start, "HH:mm");
          let stopTime = moment(shift.stop, "HH:mm");
          let duration = moment.duration(stopTime.diff(startTime));
          hours += duration.asHours();
        });
        let metricStat;
        let totalHoursFromLastWeek;
        contributions["shiftsCompleted"] = shiftsCompleted;
        contributions["hours"] = roundIfNotInteger(hours, 1);
        metricRepository
          .get()
          .then(metric => {
            if (metric) {
              metricStat = metric;
              return volunteerRepository.getTotalHoursFromLastWeek();
            } else {
              res.status(200).json({
                message: "Success!",
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
            res.status(200).json({
              message: "Success!",
              contributions: contributions
            });
          });
      })
      .catch(err => res.status(500).send(err));
  };

  this.getActivity = function (req, res) {
    // Check bearer token id matches parameter id
    if (req.user.id !== req.params.id) {
      res.status(401).json({message: "You can only view your own stats."});
      return;
    }

    res.status(200).json({
      message: "Success!",
      myActivity: []
    });
  };

  this.getHallOfFame = async function (req, res) {
    let response = {};
    let fields = ["lastWeekHours", "lastWeekIncrease"];
    let errs = [];
    for (let i = 0; i < fields.length; i++) {
      let ranking = [];
      await volunteerRepository
        .getTop([[fields[i], "DESC"]], 3)
        .then(volunteers => {
          for (let j = 0; j < volunteers.length; j++) {
            let volunteer = volunteers[j];
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
      res.status(500).json({message: errs});
    } else {
      res.status(200).send({message: "Success!", hallOfFame: response});
    }
  };

  this.updateAvailability = function (req, res) {
    // Check bearer token id matches parameter id
    if (req.user.id !== req.params.id) {
      res
        .status(401)
        .json({message: "You can only update your own availability."});
      return;
    }

    volunteerRepository
      .getById(req.params.id)
      .then(volunteer => {
        if (!volunteer) {
          res.status(400).json({message: "No volunteer with that id"});
        } else {
          volunteerRepository
            .updateAvailability(req.params.id, req.body.availability)
            .then(() =>
              res.status(201).json({
                message: "Availability Updated Successfully"
              })
            )
        }
      })
      .catch(error => res.status(500).json({message: error}));
  };

  this.approve = function (req, res) {
    if (!req.user.isAdmin) {
      res.status(401).json({message: "Only admins may approve volunteers"});
    }
    volunteerRepository.getById(req.params.id)
      .then(volunteer => {
        if (!volunteer) {
          res.status(400).json({message: "No volunteer with that id"});
        } else if (volunteer.user.approved) {
          res.status(400).json({message: "Volunteer already approved"});
        } else {
          userRepository.update({id: volunteer.userId}, {approved: true})
            .then(() => res.status(200).json({
              message: "Approved volunteer!",
              volunteer: volunteer
            }));
        }
      })
      .catch(err => res.status(500).json({message: err}));
  };

  this.getAvailability = function (req, res) {
    // Check bearer token id matches parameter id
    if (req.user.id !== req.params.id) {
      res
        .status(401)
        .json({message: "You can only update your own availability."});
      return;
    }

    volunteerRepository
      .getById(req.params.id)
      .then(volunteer => {
        if (!volunteer) {
          res.status(400).json({message: "No volunteer with that id"});
        } else {
          volunteerRepository
            .getAvailability(req.params.id)
            .then(result => res.status(200).json({message: "Success!", availability: result}))
        }
      })
      .catch(error => res.status(500).json({message: error}));
  };

  this.getCalendarForVolunteer = function (req, res) {
    userRepository
      .getById(req.params.id)
      .then(user => {
        if (!user) {
          res.status(400).json({message: "No volunteer with that id"});
        } else if (user.id !== req.user.id) {
          res.status(400).json({message: "You can not get someone else's calendar!"})
        } else if (user.isAdmin) {
          res.status(400).json({message: "User is an admin!"})
        } else {
          if (user.calendarAccessKey) {
            res.status(200).json({
              message: "Success!",
              link: `${process.env.WEB_CAL_URL}/calendar/${user.calendarAccessKey}/bookings.ics`
            })
          } else {
            const key = uuid();
            return userRepository.update(user, {calendarAccessKey: key})
              .then(() => {
                res.status(200).json({
                  message: "Success!",
                  link: `${process.env.WEB_CAL_URL}/calendar/${key}/bookings.ics`
                })
              })
          }
        }
      })
      .catch(err => res.status(500).json({message: err}));
  };

  this.listShiftsForVolunteer = function (req, res) {
    let volunteer;
    const whereTrue = getDateRange(req.query.before, req.query.after);
    const page = req.query.page;
    volunteerRepository
      .getById(req.params.id)
      .then(vol => {
        if (!vol) {
          res.status(400).json({message: "No volunteer with that id"});
        } else {
          volunteer = vol;
          return bookingRepository.getByVolunteerId(vol.userId);
        }
      })
      .then(bookings => {
        let shiftIds = bookings.map(booking => booking.shiftId);
        whereTrue["id"] = {[Op.in]: shiftIds};
        return shiftRepository
          .getAll(null, whereTrue, [
            REQUIREMENTS_WITH_BOOKINGS(),
            CREATOR(),
            REPEATED_SHIFT()
          ], page ? ITEMS_PER_PAGE : null, page ? ((page - 1) * ITEMS_PER_PAGE) : null)
          .then(shifts => {
            let result = [];
            shifts.forEach(s => {
              let shift = s.toJSON();
              let requirements = [];
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
      })
      .then(shifts => res.status(200).json({message: "Success!", shifts, count: shifts.length}))
      .catch(err => res.status(500).json({message: err}));
  };

  this.listAvailableShiftsForVolunteer = function (req, res) {
    let volunteer;
    const whereTrue = getDateRange(req.query.before, req.query.after);
    const page = req.query.page;
    volunteerRepository
      .getById(req.params.id)
      .then(vol => {
        if (!vol) {
          res.status(400).json({message: "No volunteer with that id"});
        } else {
          volunteer = vol;
          return bookingRepository.getByVolunteerId(vol.userId);
        }
      })
      .then(bookings => {
        let shiftIds = bookings.map(booking => booking.shiftId);
        whereTrue["id"] = {[Op.notIn]: shiftIds};
        return shiftRepository
          .getAll(null, whereTrue, [
            REQUIREMENTS_WITH_BOOKINGS(),
            CREATOR(),
            REPEATED_SHIFT()
          ], page ? ITEMS_PER_PAGE : null, page ? ((page - 1) * ITEMS_PER_PAGE) : null)
          .then(shifts => {
            let result = [];
            shifts.forEach(s => {
              let shift = s.toJSON();
              if (volunteerIsAvailableForShift(volunteer, shift)) {
                for (let i = 0; i < shift.requirements.length; i++) {
                  let requirement = shift.requirements[i];
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
      .then(shifts => res.status(200).json({message: "Success!", shifts, count: shifts.length}))
      .catch(err => res.status(500).json({message: err}));
  };
};

function roundIfNotInteger(num, numDP) {
  return Number.isInteger(num) ? num : num.toFixed(numDP);
}

module.exports = new VolunteerController(volunteerRepository, shiftRepository, userRepository);
