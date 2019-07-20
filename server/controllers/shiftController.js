const shiftRepository = require("../repositories").ShiftRepository;
const roleRepository = require("../repositories").RoleRepository;
const bookingRepository = require("../repositories").BookingRepository;
const volunteerRepository = require("../repositories").VolunteerRepository;
const adminRepository = require("../repositories").AdminRepository;
const moment = require("moment");
const isWeekend = require("../utils/date").isWeekend;
const {
  volunteerIsAvailableForShift,
  volunteerBookedOnShift
} = require("../utils/availability");
const {
  REQUIREMENTS_WITH_BOOKINGS,
  CREATOR,
  REPEATED_SHIFT,
  VOLUNTEERS
} = require("../sequelizeUtils/include");
const {SHIFT_AFTER} = require("../sequelizeUtils/where");
const nodemailer = require("nodemailer");
const Nexmo = require("nexmo");

const APP_LINK = "https://city-harvest.mobilise.xyz";

const REPEATED_TYPES = {
  Never: ["Never"],
  Daily: [
    "Never",
    "Daily",
    "Weekly",
    "Weekends",
    "Weekdays",
    "Monthly",
    "Annually"
  ],
  Weekdays: ["Never", "Weekly", "Weekdays"],
  Weekends: ["Never", "Weekly", "Weekends"],
  Weekly: ["Never", "Weekly"],
  Monthly: ["Never", "Monthly", "Annually"],
  Annually: ["Never", "Annually"]
};

var ShiftController = function (
  shiftRepository,
  roleRepository,
  bookingRepository
) {
  this.list = function (req, res) {
    var withVolunteers = req.user.isAdmin;
    var after = req.query.after;
    var whereTrue = {};
    if (after) {
      var afterMoment = moment(after);
      var date = afterMoment.format("YYYY-MM-DD");
      var time = afterMoment.format("HH:mm");
      whereTrue = SHIFT_AFTER(date, time);
    }

    shiftRepository
      .getAll(null, whereTrue, [
        REQUIREMENTS_WITH_BOOKINGS(withVolunteers),
        CREATOR(),
        REPEATED_SHIFT()
      ])
      .then(shifts => res.status(200).json({message: "Success!", shifts}))
      .catch(err => res.status(500).json({message: err}));
  };

  this.listTitles = function (req, res) {
    shiftRepository
      .getAll(["title"])
      .then(shifts => {
        var titles = [];
        shifts.forEach(shift => {
          if (titles.indexOf(shift.title) === -1) {
            titles.push(shift.title);
          }
        });
        res.status(200).json({message: "Success!", titles});
      })
      .catch(err => res.status(500).json({message: err}));
  };

  this.deleteById = function (req, res) {
    shiftRepository
      .getById(req.params.id, [VOLUNTEERS()])
      .then(shift => {
        if (!shift) {
          res.status(400).send({message: "No such shift"});
          return;
        }
        var emailClient = createEmailClient();
        var textClient = createTextClient();
        shift.volunteers.forEach(volunteer => {
          var message = constructCancelShiftMessage(volunteer, shift);
          if (volunteer.user.contactPreferences.email) {
            sendEmail(emailClient, volunteer.user, "Shift cancelled", message);
          }
          if (volunteer.user.contactPreferences.text) {
            sendText(textClient, volunteer.user, message);
          }
        });
        return shiftRepository.removeById(req.params.id);
      })
      .then(shift =>
        res.status(200).json({message: "Successfully deleted", shift: shift})
      )
      .catch(err => res.status(500).json({message: err}));
  };

  this.cancel = function (req, res) {
    var creator;
    var shift;

    bookingRepository
      .getById(req.params.id, req.user.id)
      .then(booking => {
        if (!booking) {
          res.status(400).json({message: "No such booking exists"});
        } else {
          shift = booking.shift;
          return adminRepository.getById(shift.creatorId);
        }
      })
      .then(admin => {
        if (!admin) {
          res.status(400).json({message: "Shift has no creator"});
        } else {
          creator = admin;
          return volunteerRepository.getById(req.user.id);
        }
      })
      .then(volunteer => {
        if (!volunteer) {
          res
            .status(400)
            .json({message: "Only a volunteer can cancel a booking"});
        } else {
          const message = constructCancelBookingMessage(
            creator,
            volunteer,
            shift,
            req.body.reason
          );
          if (creator.user.contactPreferences.email) {
            var emailClient = createEmailClient();
            sendEmail(emailClient, creator.user, "Cancelled booking", message);
          }
          if (creator.user.contactPreferences.text) {
            var textClient = createTextClient();
            sendText(textClient, creator.user, message);
          }
          return bookingRepository.delete(req.params.id, req.user.id);
        }
      })
      .then(booking =>
        res
          .status(200)
          .json({message: "Successfully cancelled booking", booking: booking})
      )
      .catch(err => res.status(500).json({message: err}));
  };

  this.book = function (req, res) {
    if (req.user.isAdmin) {
      res.status(400).json({message: "Admin cannot book onto shift"});
      return;
    }

    bookingRepository
      .getById(req.params.id, req.user.id)
      .then(booking => {
        if (booking) {
          res.status(400).json({
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
            .json({message: "No role with name: " + req.body.roleName});
        } else {
          return shiftRepository.getById(req.params.id, [REQUIREMENTS_WITH_BOOKINGS()]);
        }
      })
      .then(shift => {
        if (!shift) {
          res
            .status(400)
            .json({message: "No shift with id: " + req.params.id});
          return;
        }
        if (shiftRequirementIsFull(shift, req.body.roleName)) {
          res
            .status(400)
            .json({message: "Shift for that role is full!" + req.params.id});
          return;
        }
        if (!req.body.repeatedType || req.body.repeatedType === "Never") {
          return bookingRepository.add(shift, req.user.id, req.body.roleName);
        }
        var startDate = moment(shift.date, "YYYY-MM-DD");

        if (!repeatedTypeIsValid(req.body.repeatedType, startDate)) {
          res.status(400).json({
            message: "Invalid repeated type: " + req.body.repeatedType
          });
          return;
        }
        if (
          !repeatedTypesCompatible(shift.repeated.type, req.body.repeatedType)
        ) {
          res
            .status(400)
            .json({message: "Repeated type incompatible with shift"});
          return;
        }
        // Book repeated shifts
        return bookingRepository.addRepeated(
          shift,
          req.user.id,
          req.body.roleName,
          req.body.repeatedType,
          req.body.untilDate
        );
      })
      .then(booking => {
        res
          .status(200)
          .json({message: "Successfully created booking", booking: booking});
      })
      .catch(err => {
        res.status(500).send(err);
      });
  };

  this.update = function (req, res) {
    // Check if user is admin
    if (!req.user.isAdmin) {
      res.status(401).json({message: "Only admin can edit a shift"});
      return;
    }
    // Check shift exists
    shiftRepository
      .getById(req.params.id)
      .then(async shift => {
        if (!shift) {
          res.status(400).json({message: "Shift does not exist"});
          return;
        }
        return shiftRepository.update(shift, req.body);
      })
      .then(() => {
        res.status(200).json({message: "Shift updated"});
      })
      .catch(err => res.status(500).json({message: err}));
  };

  this.updateRoles = function (req, res) {
    // Check if user is admin
    if (!req.user.isAdmin) {
      res.status(401).json({message: "Only admin can edit a shift"});
      return;
    }
    // Check shift exists
    shiftRepository
      .getById(req.params.id)
      .then(async shift => {
        if (!shift) {
          res.status(400).json({message: "Shift does not exist"});
          return;
        }
        // Check the referenced roles
        var {errs, rolesRequired} = await checkRoles(
          req.body.rolesRequired,
          roleRepository
        );
        if (errs.length > 0) {
          res
            .status(400)
            .send({"Could not modify shift due to invalid roles": errs});
          return;
        }
        return shiftRepository.updateRoles(shift, rolesRequired);
      })
      .then(shift => {
        res.status(200).json({message: "Success! Updated shift!", shift});
      })
      .catch(err => res.status(500).send({message: err}));
  };

  this.ping = function (req, res) {
    if (!req.user.isAdmin) {
      res
        .status(401)
        .json({message: "Only an admin may ping all volunteers for shift"});
      return;
    }

    shiftRepository
      .getById(req.params.id)
      .then(shift => {
        if (!shift) {
          res.status(400).json({message: "No shift with that id"});
        } else {
          const emailClient = createEmailClient();
          const textClient = createTextClient();
          return volunteerRepository.getAll().then(volunteers => {
            volunteers.forEach(volunteer => {
              if (
                !volunteerBookedOnShift(volunteer, shift) &&
                volunteerIsAvailableForShift(volunteer, shift)
              ) {
                var message = constructHelpMessage(volunteer, shift);
                if (volunteer.user.contactPreferences.email) {
                  sendEmail(
                    emailClient,
                    volunteer.user,
                    "Help needed for shift!",
                    message
                  );
                }
                if (volunteer.user.contactPreferences.text) {
                  sendText(textClient, volunteer.user, message);
                }
              }
            });
            return shift;
          });
        }
      })
      .then(() => {
        res
          .status(200)
          .json({message: "Sending alerts to available volunteers"});
      });
  };

  this.create = async function (req, res) {
    // Check if user is admin
    if (!req.user.isAdmin) {
      res.status(401).json({message: "Only admin can add shifts"});
      return;
    }
    // Check the referenced roles
    var {errs, rolesRequired} = await checkRoles(
      req.body.rolesRequired,
      roleRepository
    );
    if (errs.length > 0) {
      res
        .status(400)
        .json({"Could not add shift due to invalid roles": errs});
      return;
    }

    if (
      !moment(req.body.start, "HH:mm").isBefore(moment(req.body.stop, "HH:mm"))
    ) {
      res.status(400).json({
        message: "Start time is not before end time"
      });
      return;
    }

    var type = req.body.repeatedType;

    if (!type || type === "Never") {
      shiftRepository
        .add(req.body, req.user.id, rolesRequired)
        .then(result => {
          res.status(201).send(result);
        })
        .catch(err => res.status(500).json({message: err}));
    } else {
      var startDate = moment(req.body.date, "YYYY-MM-DD");
      var untilDate = moment(req.body.untilDate, "YYYY-MM-DD");

      if (untilDate.isBefore(startDate)) {
        res.status(400).json({
          message: "Until date is before start date"
        });
        return;
      }

      // Check if valid request
      if (!repeatedTypeIsValid(type, startDate)) {
        res.status(400).json({
          message:
            "Invalid repeatedType (check starting day if Weekends/Week Days): " +
            type
        });
        return;
      }
      shiftRepository
        .addRepeated(req.body, req.user.id, rolesRequired, type)
        .then(shifts => {
          res.status(201).json({message: "Success! Created repeated shift!", lastShift: shifts[shifts.length - 1]});
        })
        .catch(err => res.status(500).json({message: err}));
    }
  };
};

module.exports = new ShiftController(
  shiftRepository,
  roleRepository,
  bookingRepository
);

function repeatedTypeIsValid(type, startDate) {
  switch (type) {
    case "Weekdays":
      return !isWeekend(startDate);
    case "Weekends":
      return isWeekend(startDate);
    default:
      break;
  }
  return REPEATED_TYPES.prototype.hasOwnProperty.call(type);
}

function sendEmail(emailClient, user, title, message) {
  var mailOptions = {
    from: process.env.SMTP_FROM,
    to: user.email,
    subject: title,
    text: message
  };
  emailClient.sendMail(mailOptions);
}

function sendText(textClient, user, message) {
  textClient.message.sendSms("Mobilise", user.telephone, message);
}

function repeatedTypesCompatible(shiftType, bookingType) {
  if (shiftType === bookingType) {
    return true;
  }
  return REPEATED_TYPES[shiftType].includes(bookingType);
}

function createEmailClient() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_SENDER_USER,
      pass: process.env.MAIL_SENDER_PASS
    }
  });
}

function createTextClient() {
  return new Nexmo({
    apiKey: process.env.NEXMO_API_KEY,
    apiSecret: process.env.NEXMO_API_SECRET
  });
}

function constructCancelShiftMessage(volunteer, shift) {
  var message = `Hello ${volunteer.user.firstName},\n\n`;
  message += `Shift has been cancelled:\n\n`;
  message += `Title: ${shift.title}\n`;
  message += `Description: ${shift.description}\n`;
  message += `When: ${moment(shift.date).format("LL")} from ${formatTime(
    shift.start
  )} to ${formatTime(shift.stop)}\n\n`;
  message += `Go to site: ${APP_LINK}`;
  return message;
}

function constructCancelBookingMessage(admin, volunteer, shift, reason) {
  var message = `Hello ${admin.user.firstName},\n\n`;
  message += `${
    volunteer.user.firstName
    } has cancelled their booking for a shift.\n\n`;
  message += `Title: ${shift.title}\n`;
  message += `Description: ${shift.description}\n`;
  message += `When: ${moment(shift.date).format("LL")} from ${formatTime(
    shift.start
  )} to ${formatTime(shift.stop)}\n\n`;
  message += `Reason for cancelling: ${reason}\n\n`;
  message += `Go to site: ${APP_LINK}`;
  return message;
}

function formatTime(time) {
  return moment(time, "H:m:ss")
    .local()
    .format("HH:mm");
}

function constructHelpMessage(volunteer, shift) {
  var message = `Hello ${volunteer.user.firstName},\n\n`;
  message += `A shift needs your assistance! \n`;
  message += `The shift details are as follows:\n\n`;
  message += `Title: ${shift.title}\n`;
  message += `Description: ${shift.description}\n`;
  message += `Location: ${shift.address}\n`;
  message += `When: ${moment(shift.date).format("LL")} from ${formatTime(
    shift.start
  )} to ${formatTime(shift.stop)}\n\n`;
  message += `Go to site: ${APP_LINK}`;
  return message;
}

async function checkRoles(rolesRequired, roleRepository) {
  var errs = [];
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

  return {errs, rolesRequired};
}

function shiftRequirementIsFull(shift, roleName) {
  shift.requirements.forEach(requirement => {
    const {numberRequired, bookings, role} = requirement;
    if (role.name === roleName) {
      return bookings.length >= numberRequired;
    }
  });
  return false;
}
