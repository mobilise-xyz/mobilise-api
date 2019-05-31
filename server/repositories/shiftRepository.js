const Shift = require('../models').Shift;
const RepeatedShift = require('../models').RepeatedShift;
const Q = require('q');
const sequelize = require('sequelize')

module.exports = {
  add: function(shift, id, repeatedId) {
    var deferred = Q.defer();
    Shift
    .create({
      title: shift.title,
      creatorId: id,
      description: shift.description,
      date: shift.date,
      start: shift.start,
      stop: shift.stop,
      address: shift.address,
      repeatedId: repeatedId
    })
    .then(result => deferred.resolve(result))
    .catch(error => deferred.reject(error));
    return deferred.promise;
  },

  addRepeatedShift: function(type) {
    var deferred = Q.defer();
    RepeatedShift
    .create({
      type: type
    })
    .then(result => deferred.resolve(result))
    .catch(error => deferred.reject(error));
    return deferred.promise;
  },

  getAllWithRoles: function() {
    var deferred = Q.defer();
    Shift.findAll({include: ['roles'], order: [
      [sequelize.literal('date, start'), 'asc']
    ]})
    .then(shifts => deferred.resolve(shifts))
    .catch(err => deferred.resolve(err));
    return deferred.promise;
  },

  getAll: function(attributes) {
    var deferred = Q.defer();
    Shift.findAll({attributes: attributes, order: [
      [sequelize.literal('date, start'), 'asc']
    ]})
    .then(shifts => deferred.resolve(shifts))
    .catch(err => deferred.resolve(err));
    return deferred.promise;
  },

  removeById: function(id) {
    var deferred = Q.defer();
    Shift.destroy({where: {id: id}})
    .then(shift => deferred.resolve(shift))
    .catch(err => deferred.resolve(err));
    return deferred.promise;
  }
};