const Role = require("../models").Role;
const Admin = require("../models").Admin;
const User = require("../models").User;
const Shift = require("../models").Shift;
const Volunteer = require("../models").Volunteer;
const ShiftRequirement = require("../models").ShiftRequirement;
const UserContactPreference = require("../models").UserContactPreference;
const Booking = require("../models").Booking;
const RepeatedShift = require("../models").RepeatedShift;
const sequelize = require("sequelize");

function VOLUNTEER() {
  return {
    model: Volunteer,
    as: "volunteer",
    attributes: ["userId"],
    include: [
      {
        model: User,
        as: "user",
        attributes: ["firstName", "lastName"]
      }
    ]
  };
}

function VOLUNTEERS() {
  return {
    model: Volunteer,
    as: "volunteers",
    include: [
      {
        model: User,
        as: "user",
        include: ["contactPreferences"]
      }
    ]
  };
}

function SHIFTS_WITH_BOOKINGS(startDate, endDate, order) {
  return {
    model: Shift,
    as: "shifts",
    where: {
      date: {
        [Op.between]: [startDate, endDate]
      }
    },
    include: [
      {
        model: Booking,
        as: "bookings",
        required: false,
        where: {
          volunteerId: volunteerId
        }
      }
    ],
    order: order
  };
}

function REQUIREMENTS_WITH_BOOKINGS(withVolunteers = false) {
  return {
    model: ShiftRequirement,
    as: "requirements",
    attributes: ["numberRequired", "expectedShortage"],
    include: [
      {
        model: Booking,
        as: "bookings",
        required: false,
        where: sequelize.where(
          sequelize.col("requirements.roleName"),
          "=",
          sequelize.col("requirements->bookings.roleName")
        ),
        include: withVolunteers ? [VOLUNTEER()] : []
      },
      {
        model: Role,
        as: "role",
        attributes: ["name", "involves", "colour"]
      }
    ]
  };
}

function CREATOR() {
  return {
    model: Admin,
    as: "creator",
    include: [
      {
        model: User,
        as: "user",
        attributes: ["firstName", "lastName", "email"]
      }
    ]
  };
}

function REPEATED_SHIFT() {
  return {
    model: RepeatedShift,
    as: "repeated"
  };
}

function USER() {
  return {
    model: User,
    as: "user",
    include: ["contactPreferences"]
  };
}

function SHIFTS(required = false, whereShift = {}) {
  return {
    model: Shift,
    as: "shifts",
    required: required,
    where: whereShift
  };
}

function SHIFT(required = false, whereShift = {}) {
  return {
    model: Shift,
    as: "shift",
    required: required,
    where: whereShift
  };
}

function CONTACT_PREFERENCES() {
  return {
    model: UserContactPreference,
    as: "contactPreferences"
  };
}

module.exports = {
  VOLUNTEER,
  VOLUNTEERS,
  REQUIREMENTS_WITH_BOOKINGS,
  SHIFTS_WITH_BOOKINGS,
  CREATOR,
  REPEATED_SHIFT,
  USER,
  SHIFTS,
  SHIFT,
  CONTACT_PREFERENCES
};
