/* eslint-disable require-atomic-updates */
const {Shift, ShiftRequirement, RepeatedShift} = require("../models");
const getNextDate = require("../utils/date").getNextDate;
const Q = require("q");
const sequelize = require("sequelize");
const moment = require("moment");
const ShiftRepositoryInterface = require("./interfaces/shiftRepositoryInterface");

let ShiftRepository = Object.create(ShiftRepositoryInterface);

ShiftRepository.add = async function(shift, creatorId, rolesRequired) {
  let deferred = Q.defer();
  let createdShift;
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
      let shiftRequirements = [];
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
    let deferred = Q.defer();
    let repeatedId;
    let successful = true;
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
    let shifts = [];
    let startDate = moment(shift.date, "YYYY-MM-DD");
    let untilDate = moment(shift.untilDate, "YYYY-MM-DD");
    shift["creatorId"] = creatorId;
    shift["repeatedId"] = repeatedId;
    while (startDate.isBefore(untilDate) || startDate.isSame(untilDate)) {
      let newShift = JSON.parse(JSON.stringify(shift));
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
  let deferred = Q.defer();
  ShiftRequirement.destroy({
    where: { shiftId: shift.id }
  })
    .then(() => {
      let shiftRequirements = [];
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
  let deferred = Q.defer();
  Shift.update(body, { where: { id: shift.id } })
    .then(result => deferred.resolve(result))
    .catch(error => deferred.reject(error));
  return deferred.promise;
};

ShiftRepository.addAll = function(shifts, rolesRequired) {
  let deferred = Q.defer();
  let allShifts;
  Shift.bulkCreate(shifts)
    .then(shifts => {
      allShifts = shifts;
      let shiftRequirements = [];
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
  let deferred = Q.defer();
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
  let deferred = Q.defer();

  Shift.findOne({
    where: { id: id },
    include: include
  })
    .then(shift => deferred.resolve(shift))
    .catch(err => deferred.reject(err));

  return deferred.promise;
};

ShiftRepository.getRepeatedById = function(id, include) {
  let deferred = Q.defer();
  RepeatedShift.findOne({
    where: {id: id},
    include: include
  })
    .then(result => deferred.resolve(result.shifts))
    .catch(err => deferred.reject(err));
  return deferred.promise;
};

ShiftRepository.removeById = function(id) {
  let deferred = Q.defer();

  Shift.destroy({ where: { id: id } })
    .then(shift => deferred.resolve(shift))
    .catch(err => deferred.reject(err));

  return deferred.promise;
};

module.exports = ShiftRepository;
