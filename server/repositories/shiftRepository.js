/* eslint-disable require-atomic-updates */
const {Shift, ShiftRequirement, RepeatedShift} = require("../models");
const getNextDate = require("../utils/date").getNextDate;
const Q = require("q");
const sequelize = require("sequelize");
const moment = require("moment");
const ShiftRepositoryInterface = require("./interfaces/shiftRepositoryInterface");

var ShiftRepository = Object.create(ShiftRepositoryInterface);

ShiftRepository.add = async function(shift, creatorId, rolesRequired) {
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
    address: shift.address
  })
    .then(async shift => {
      createdShift = shift;
      var shiftRequirements = [];
      // Add the roles to shift
      rolesRequired.forEach(roleRequired => {
        shiftRequirements.push({
          roleName: roleRequired.roleName,
          shiftId: shift.id,
          numberRequired: roleRequired.number,
          expectedShortage: roleRequired.number
        });
      });
      return ShiftRequirement.bulkCreate(shiftRequirements);
    })
    .then(() => {
      deferred.resolve(createdShift);
    })
    .catch(err => deferred.reject(err));
  return deferred.promise;
};

ShiftRepository.addRepeated = async function(
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
        deferred.resolve(shifts)
      )
      .catch(err => {
        deferred.reject(err);
      });

    return deferred.promise;
};

ShiftRepository.updateRoles = function(shift, rolesRequired) {
  var deferred = Q.defer();
  ShiftRequirement.destroy({
    where: { shiftId: shift.id }
  })
    .then(() => {
      var shiftRequirements = [];
      // Add the roles to shift
      rolesRequired.forEach(roleRequired => {
        shiftRequirements.push({
          roleName: roleRequired.roleName,
          shiftId: shift.id,
          numberRequired: roleRequired.number,
          expectedShortage: roleRequired.number
        });
      });
      return ShiftRequirement.bulkCreate(shiftRequirements);
    })
    .then(() => deferred.resolve(shift))
    .catch(err => deferred.reject(err));
  return deferred.promise;
};

ShiftRepository.update = function(shift, body) {
  var deferred = Q.defer();
  Shift.update(body, { where: { id: shift.id } })
    .then(result => deferred.resolve(result))
    .catch(error => deferred.reject(error));
  return deferred.promise;
};

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
            numberRequired: roleRequired.number,
            expectedShortage: roleRequired.number
          });
        });
      });
      return ShiftRequirement.bulkCreate(shiftRequirements);
    })
    .then(() => deferred.resolve(allShifts))
    .catch(err => deferred.reject(err));

  return deferred.promise;
};

ShiftRepository.getAll = function(attributes, whereTrue, include, limit=null, offset=0) {
  var deferred = Q.defer();
  Shift.findAll({
    attributes: attributes,
    where: whereTrue,
    include: include,
    limit: limit,
    offset: offset,
    order: [[sequelize.literal("date, start"), "asc"]]
  })
    .then(shifts => {
      deferred.resolve(shifts);
    })
    .catch(err => deferred.reject(err));

  return deferred.promise;
};

ShiftRepository.getById = function(id, include) {
  var deferred = Q.defer();

  Shift.findOne({
    where: { id: id },
    include: include
  })
    .then(shift => deferred.resolve(shift))
    .catch(err => deferred.reject(err));

  return deferred.promise;
};

ShiftRepository.getRepeatedById = function(id, include) {
  var deferred = Q.defer();
  RepeatedShift.findOne({
    where: {id: id},
    include: include
  })
    .then(result => deferred.resolve(result.shifts))
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
