const Shift = require('../models').Shift;
const Q = require('q');
const sequelize = require('sequelize')
const ShiftRepositoryInterface = require('./interfaces/shiftRepositoryInterface');

var ShiftRepository = Object.create(ShiftRepositoryInterface);

ShiftRepository.add = function(shift, id) {
  var deferred = Q.defer();
  Shift
  .create({
    title: shift.title,
    creatorId: id,
    description: shift.description,
    date: shift.date,
    start: shift.start,
    stop: shift.stop,
    address: shift.address
  })
  .then(result => deferred.resolve(result))
  .catch(error => deferred.reject(error));
  return deferred.promise;
};

ShiftRepository.getAllWithRoles = function() {
  var deferred = Q.defer();
  Shift.findAll({include: ['roles'], order: [
    [sequelize.literal('date, start'), 'asc']
  ]})
  .then(shifts => deferred.resolve(shifts))
  .catch(err => deferred.resolve(err));
  return deferred.promise;
};

ShiftRepository.getAll = function(attributes) {
  var deferred = Q.defer();
  Shift.findAll({attributes: attributes, order: [
    [sequelize.literal('date, start'), 'asc']
  ]})
  .then(shifts => deferred.resolve(shifts))
  .catch(err => deferred.resolve(err));
  return deferred.promise;
};

ShiftRepository.removeById = function(id) {
  var deferred = Q.defer();
  Shift.destroy({where: {id: id}})
  .then(shift => deferred.resolve(shift))
  .catch(err => deferred.resolve(err));
  return deferred.promise;
}

module.exports = ShiftRepository;