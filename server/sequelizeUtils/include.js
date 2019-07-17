const Role = require("../models").Role;
const Admin = require("../models").Admin;
const User = require("../models").User;
const Volunteer = require("../models").Volunteer;
const ShiftRequirement = require("../models").ShiftRequirement;
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

function REPEATED() {
  return {
    model: RepeatedShift,
    as: "repeated"
  };
}

module.exports = {
  VOLUNTEER,
  REQUIREMENTS_WITH_BOOKINGS,
  CREATOR,
  REPEATED
};
