const {Role, Admin, User, Shift, Volunteer, ShiftRequirement, UserContactPreference, Booking, RepeatedShift} = require("../models");
const sequelize = require("sequelize");
const Op = require("../models").Sequelize.Op;

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

function SHIFTS_WITH_REQUIREMENTS_WITH_BOOKINGS(startDate, endDate, order) {
  return {
    model: Shift,
    as: "shifts",
    where: {
      date: {
        [Op.between]: [startDate, endDate]
      }
    },
    include: [{
      model: ShiftRequirement,
      as: "requirements",
      attributes: ["numberRequired", "expectedShortage"],
      include: [
        {
          model: Booking,
          as: "bookings",
          required: false,
          where: sequelize.where(
            sequelize.col("shifts->requirements.roleName"),
            "=",
            sequelize.col("shifts->requirements->bookings.roleName")
          )
        },
        {
          model: Role,
          as: "role",
          attributes: ["name", "involves", "colour"]
        }
      ]
    }],
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
  VOLUNTEERS,
  REQUIREMENTS_WITH_BOOKINGS,
  SHIFTS_WITH_REQUIREMENTS_WITH_BOOKINGS,
  CREATOR,
  REPEATED_SHIFT,
  USER,
  SHIFTS,
  SHIFT,
  CONTACT_PREFERENCES
};
