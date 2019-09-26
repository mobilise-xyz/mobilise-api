/* eslint-disable require-atomic-updates */
const {Shift, ShiftRequirement, RepeatedShift} = require("../models");
const getNextDate = require("../utils/date").getNextDate;
const Q = require("q");
const sequelize = require("sequelize");
const moment = require("moment");
const ShiftRepositoryInterface = require("./interfaces/shiftRepositoryInterface");

let ShiftRepository = Object.create(ShiftRepositoryInterface);

ShiftRepository.add = function (shift, creatorId, rolesRequired) {
  let createdShift;
  if (!rolesRequired) {
    rolesRequired = [];
  }
  return Shift.create({
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
      return createdShift
    });
};

ShiftRepository.addRepeated = async function (
  shift,
  creatorId,
  rolesRequired,
  type
) {
  return RepeatedShift.create({
    type: type,
    untilDate: shift.untilDate
  })
    .then(result => {
      // Create repeated shift
      let shifts = [];
      let startDate = moment(shift.date, "YYYY-MM-DD");
      let untilDate = moment(shift.untilDate, "YYYY-MM-DD");
      shift["creatorId"] = creatorId;
      shift["repeatedId"] = result.id;
      while (startDate.isBefore(untilDate) || startDate.isSame(untilDate)) {
        let newShift = JSON.parse(JSON.stringify(shift));
        newShift["date"] = startDate.format("YYYY-MM-DD");
        shifts.push(newShift);
        startDate = getNextDate(startDate, type);
      }
      return ShiftRepository.addAll(shifts, rolesRequired);
    });
};

ShiftRepository.updateRoles = function (shift, rolesRequired) {
  return ShiftRequirement.destroy({
    where: {shiftId: shift.id}
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
    .then(() => {
      return shift;
    })
};

ShiftRepository.update = function (shift, body) {
  return Shift.update(body, {where: {id: shift.id}});
};

ShiftRepository.addAll = function (shifts, rolesRequired) {
  let allShifts;
  return Shift.bulkCreate(shifts)
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
    .then(() => {
      return allShifts;
    });
};

ShiftRepository.getAll = function (attributes, whereTrue, include, limit = null, offset = 0) {
  return Shift.findAll({
    attributes: attributes,
    where: whereTrue,
    include: include,
    limit: limit,
    offset: offset,
    order: [[sequelize.literal("date, start"), "asc"]]
  });
};

ShiftRepository.getById = function (id, include) {
  return Shift.findOne({
    where: {id: id},
    include: include
  });
};

ShiftRepository.getRepeatedById = function (id, include) {
  return RepeatedShift.findOne({
    where: {id: id},
    include: include
  });
};

ShiftRepository.removeById = function (id) {
  return Shift.destroy({where: {id: id}});
};

module.exports = ShiftRepository;
