const Shift = require('../models').Shift;
const Q = require('q');
const sequelize = require('sequelize')

module.exports = {
  add: function(shift, id) {
    var deferred = Q.defer();
    Shift
    .create({
      title: shift.title,
      creatorId: id,
      description: shift.description,
      date: shift.date,
      start: shift.start,
      stop: shift.stop,
      location: shift.location
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