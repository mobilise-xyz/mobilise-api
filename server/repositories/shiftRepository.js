const Shift = require("../models").Shift;
const Role = require("../models").Role;
const Admin = require("../models").Admin;
const User = require("../models").User;
const RepeatedShift = require("../models").RepeatedShift;
const ShiftRequirement = require("../models").ShiftRequirement;
const Booking = require("../models").Booking;
const getNextDate = require("../utils/date").getNextDate;
const Q = require("q");
const sequelize = require("sequelize");
const moment = require("moment");
const ShiftRepositoryInterface = require("./interfaces/shiftRepositoryInterface");

var ShiftRepository = Object.create(ShiftRepositoryInterface);

(ShiftRepository.add = async function(
  shift,
  creatorId,
  rolesRequired,
  repeatedId
) {
  var deferred = Q.defer();
  var createdShift;
  if (!rolesRequired) {
    rolesRequired = [];
  }
  await Shift.create({
    title: shift.title,
    creatorId: creatorId,
    description: shift.description,
    date: shift.date,
    start: shift.start,
    stop: shift.stop,
    address: shift.address,
    repeatedId: repeatedId
  })
    .then(async shift => {
      createdShift = shift;
      var shiftRequirements = [];
      // Add the roles to shift
      rolesRequired.forEach(roleRequired => {
        shiftRequirements.push({
          roleName: roleRequired.roleName,
          shiftId: shift.id,
          numberRequired: roleRequired.number
        });
      });
      return ShiftRequirement.bulkCreate(shiftRequirements);
    })
    .then(_ => {
      deferred.resolve(createdShift);
    })
    .catch(err => deferred.reject(err));
  return deferred.promise;
}),
  (ShiftRepository.addRepeated = async function(
    shift,
    creatorId,
    rolesRequired,
    type
  ) {
    var deferred = Q.defer();
    var repeatedId;
    var successful = true;
    await RepeatedShift.create({
      type: type,
      untilDate: shift.untilDate
    })
      .then(result => (repeatedId = result.id))
      .catch(err => {
        successful = false;
        deferred.reject(err);
      });
    if (!successful) {
      return deferred.promise;
    }
    // Create repeated shift
    var shifts = [];
    var startDate = moment(shift.date, "YYYY-MM-DD");
    var untilDate = moment(shift.untilDate, "YYYY-MM-DD");
    shift["creatorId"] = creatorId;
    shift["repeatedId"] = repeatedId;
    while (startDate.isBefore(untilDate) || startDate.isSame(untilDate)) {
      var newShift = JSON.parse(JSON.stringify(shift));
      newShift["date"] = startDate.format("YYYY-MM-DD");
      shifts.push(newShift);
      startDate = getNextDate(startDate, type);
    }
    ShiftRepository.addAll(shifts, rolesRequired)
      .then(shifts =>
        deferred.resolve({
          message: "Created recurring shift",
          lastShift: shifts[shifts.length - 1]
        })
      )
      .catch(err => {
        deferred.reject(err);
      });

    return deferred.promise;
  });

ShiftRepository.addAll = function(shifts, rolesRequired) {
  var deferred = Q.defer();
  var allShifts;
  Shift.bulkCreate(shifts)
    .then(shifts => {
      allShifts = shifts;
      var shiftRequirements = [];
      shifts.forEach(shift => {
        rolesRequired.forEach(roleRequired => {
          shiftRequirements.push({
            shiftId: shift.id,
            roleName: roleRequired.roleName,
            numberRequired: roleRequired.number
          });
        });
      });
      return ShiftRequirement.bulkCreate(shiftRequirements);
    })
    .then(_ => deferred.resolve(allShifts))
    .catch(err => deferred.reject(err));

  return deferred.promise;
};

ShiftRepository.getAllWithRequirements = function(whereTrue) {
  var deferred = Q.defer();
  Shift.findAll({
    where: whereTrue,
    include: [
      {
        model: ShiftRequirement,
        as: "requirements",
        attributes: ["numberRequired"],
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
            attributes: ["volunteerId"]
          },
          {
            model: Role,
            as: "role",
            attributes: ["name", "involves", "colour"]
          }
        ]
      },
      {
        model: Admin,
        as: "creator",
        include: [
          {
            model: User,
            as: "user",
            attributes: ["firstName", "lastName", "email"]
          }
        ]
      },
      "repeated"
    ],
    order: [[sequelize.literal("date, start"), "asc"]]
  })
    .then(shifts => {
      deferred.resolve(shifts);
    })
    .catch(err => deferred.reject(err));

  return deferred.promise;
};

ShiftRepository.getAll = function(attributes) {
  var deferred = Q.defer();

  Shift.findAll({
    attributes: attributes,
    order: [[sequelize.literal("date, start"), "asc"]]
  })
    .then(shifts => deferred.resolve(shifts))
    .catch(err => deferred.reject(err));

  return deferred.promise;
};

ShiftRepository.getAllRecommended = function() {
  
};

ShiftRepository.getById = function(id) {
  var deferred = Q.defer();

  Shift.findOne({ where: { id: id }, include: ["repeated"] })
    .then(shift => deferred.resolve(shift))
    .catch(err => deferred.reject(err));

  return deferred.promise;
};

ShiftRepository.removeById = function(id) {
  var deferred = Q.defer();

  Shift.destroy({ where: { id: id } })
    .then(shift => deferred.resolve(shift))
    .catch(err => deferred.reject(err));

  return deferred.promise;
};

module.exports = ShiftRepository;
