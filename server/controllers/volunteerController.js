const volunteerRepository = require("../repositories").VolunteerRepository;
const userRepository = require("../repositories").UserRepository;
const shiftRepository = require("../repositories").ShiftRepository;
const bookingRepository = require("../repositories").BookingRepository;
const metricRepository = require("../repositories").MetricRepository;
const contactRepository = require("../repositories").ContactRepository;
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
const {validationResult, body, param, query} = require('express-validator');
const {SHIFT_BEFORE} = require("../sequelizeUtils/where");
const EXPECTED_SHORTAGE_THRESHOLD = 2;
const ITEMS_PER_PAGE = 5;

let VolunteerController = function (volunteerRepository, shiftRepository, userRepository) {
  this.list = function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({message: "Invalid request", errors: errors.array()});
    }

    // Restrict access to admin
    if (!req.user.isAdmin) {
      res
        .status(401)
        .json({message: "Only admins can access volunteer catalogue"});
      return;
    }

    let whereTrue = {};
    let order = [];

    if (req.query.sortBy != null) {
      const result = req.query.sortBy.match('(asc|desc)\\(([^\\)\\(]+)\\)');
      order.push([result[2], result[1].toUpperCase()])
    }

    volunteerRepository
      .getAll({}, [USER(whereTrue), 'contacts'], order)
      .then(volunteers => res.status(200).json({message: "Success", volunteers}))
      .catch(err => res.status(500).json({message: err}));
  };

  this.getStats = function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({message: "Invalid request", errors: errors.array()});
    }

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
          const now = moment.tz('Europe/London');
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
        contributions["increase"] = volunteer.lastWeekIncrease;
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({message: "Invalid request", errors: errors.array()});
    }

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({message: "Invalid request", errors: errors.array()});
    }

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

  this.getAvailability = function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({message: "Invalid request", errors: errors.array()});
    }

    // Check bearer token id matches parameter id
    if (req.user.id !== req.params.id) {
      res
        .status(401)
        .json({message: "You can only get your own availability."});
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({message: "Invalid request", errors: errors.array()});
    }

    if (req.user.isAdmin) {
      res.status(400).json({message: "User is an admin"});
      return;
    }

    if (req.params.id !== req.user.id) {
      res.status(400).json({message: "You can not get someone else's calendar!"});
      return;
    }

    userRepository
      .getById(req.params.id)
      .then(user => {
        if (!user) {
          res.status(400).json({message: "No volunteer with that id"});
          return;
        }
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
      })
      .catch(err => res.status(500).json({message: err}));
  };

  this.listShiftsForVolunteer = function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({message: "Invalid request", errors: errors.array()});
    }

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
              for (let i = 0; i < shift.requirements.length; i++) {
                let requirement = shift.requirements[i];
                const { bookings } = requirement;
                requirement.booked = bookings.some(b => b.volunteerId === volunteer.userId);
                shift.requirements[i] = requirement;
              }
              result.push(shift);
            });
            return result;
          });
      })
      .then(shifts => res.status(200).json({message: "Success!", shifts, count: shifts.length}))
      .catch(err => res.status(500).json({message: err}));
  };

  this.listAvailableShiftsForVolunteer = function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({message: "Invalid request", errors: errors.array()});
    }

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

  this.addContact = function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({message: "Invalid request", errors: errors.array()});
    }


    if (req.user.id !== req.params.id) {
      res.status(400).json({message: "You can only add your own contacts!"});
      return;
    }

    volunteerRepository.getById(req.params.id)
      .then(volunteer => {
        if (!volunteer) {
          res.status(400).json({message: "No volunteer with that id"});
          return;
        }
        return contactRepository.add(req.params.id, req.body);
      })
      .then(contact => {
        res.status(201).json({message: "Success! Contact added.", contact})
      })
      .catch(err => res.status(500).json({message: err}))
  };

  this.getContacts = function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({message: "Invalid request", errors: errors.array()});
    }

    if (req.user.id !== req.params.id) {
      res.status(400).json({message: "You can only get your own contacts!"});
      return;
    }

    volunteerRepository.getById(req.params.id)
      .then(volunteer => {
        if (!volunteer) {
          res.status(400).json({message: "No volunteer with that id"});
          return;
        }
        return contactRepository.getAllByVolunteerId(req.params.id);
      })
      .then(contacts => {
        res.status(201).json({message: "Success! Contacts retrieved.", contacts})
      })
      .catch(err => res.status(500).json({message: err}))
  };

  this.removeContact = function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({message: "Invalid request", errors: errors.array()});
    }

    if (req.user.id !== req.params.id) {
      res.status(400).json({message: "You can only remove your own contacts!"});
      return;
    }

    volunteerRepository.getById(req.params.id)
      .then(volunteer => {
        if (!volunteer) {
          res.status(400).json({message: "No volunteer with that id"});
          return;
        }
        return contactRepository.getById(req.params.contactId);
      })
      .then(contact => {
        if (!contact) {
          res.status(400).json({message: "No contact with that id"});
          return;
        }
        if (contact.volunteerId !== req.params.id) {
          res.status(400).json({message: "You can only remove your own contacts!"});
          return;
        }
        return contactRepository.removeById(req.params.contactId);
      })
      .then(() => res.status(200).json({message: "Success! Contact removed!"}))
      .catch(err => res.status(500).json({message: err}));
  };

  this.validate = function (method) {
    switch (method) {
      case 'list': {
        return [
          query('sortBy').optional().matches('(asc|desc)\\(([^\\)\\(]+)\\)')
        ]
      }
      case 'getContacts':
      case 'getCalendarForVolunteer':
      case 'getAvailability':
      case 'getActivity':
      case 'getStats': {
        return [
          param('id').isUUID()
        ]
      }
      case 'updateAvailability': {
        return [
          param('id').isUUID(),
          body('availability').isArray().bail().custom(result => {
            return result.length === 7 &&
              result.every(col => col.length === 3 && col.every(item => ['0', '1', '2'].indexOf(item) >= 0))
          })
        ]
      }
      case 'listAvailableShiftsForVolunteer':
      case 'listShiftsForVolunteer': {
        return [
          param('id').isUUID(),
          query('before').optional().custom(result => moment(result).isValid()),
          query('after').optional().custom(result => moment(result).isValid()),
          query('page').optional().isInt()
        ]
      }
      case 'addContact': {
        return [
          param('id').isUUID(),
          body('firstName').isString(),
          body('lastName').isString(),
          body('telephone').isNumeric(),
          body('email').optional().isEmail(),
          body('relation').isString()
        ]
      }
      case 'removeContact': {
        return [
          param('id').isUUID(),
          param('contactId').isUUID()
        ]
      }
    }
  };
};

function roundIfNotInteger(num, numDP) {
  return Number.isInteger(num) ? num : num.toFixed(numDP);
}

module.exports = new VolunteerController(volunteerRepository, shiftRepository, userRepository);
