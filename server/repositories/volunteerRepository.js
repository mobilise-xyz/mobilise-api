const {Volunteer} = require("../models");
const Q = require("q");
const VolunteerRepositoryInterface = require("./interfaces/volunteerRepositoryInterface");
const { USER, SHIFTS } = require("../sequelizeUtils/include");
let VolunteerRepository = Object.create(VolunteerRepositoryInterface);

VolunteerRepository.add = function(volunteer) {
  return Volunteer.create({
    userId: volunteer.userId
  });
};

VolunteerRepository.getTotalHoursFromLastWeek = function() {
  return Volunteer.sum("lastWeekHours");
};

VolunteerRepository.getTop = function(orderBy, limit) {
  return Volunteer.findAll({
    include: [USER()],
    order: orderBy,
    limit: limit
  });
};

VolunteerRepository.getAll = function(whereTrue, include) {
  return Volunteer.findAll({
    where: whereTrue,
    include: include
  });
};

VolunteerRepository.getAllWithShifts = function(whereShift) {
  return Volunteer.findAll({
    include: [SHIFTS(false, whereShift)]
  });
};

VolunteerRepository.getById = function(id) {
  return Volunteer.findOne({
    where: { userId: id },
    include: [USER()]
  });
};

VolunteerRepository.update = function(volunteer, body) {
  return Volunteer.update(body, { where: { userId: volunteer.userId } });
};

VolunteerRepository.updateAvailability = function(id, availability) {
  return Volunteer.update({ availability: availability }, { where: { userId: id } });
};

VolunteerRepository.getAvailability = function(id) {
  return Volunteer.findOne({ where: { userId: id } })
    .then(volunteer => {
      return volunteer.availability
    })
};

module.exports = VolunteerRepository;
