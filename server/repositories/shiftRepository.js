const Shift = require('../models').Shift;
const Q = require('q');

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
      postcode: shift.postcode
    })
    .then(result => deferred.resolve(result))
    .catch(error => deferred.reject(error));
    return deferred.promise;
  },

  getAllWithRoles: function() {
    var deferred = Q.defer();
    Shift.findAll({include: ['roles']})
    .then(shifts => deferred.resolve(shifts))
    .catch(err => deferred.resolve(err));
    return deferred.promise;
  },

  getAll: function(attributes) {
    var deferred = Q.defer();
    Shift.findAll({attributes: attributes})
    .then(shifts => deferred.resolve(shifts))
    .catch(err => deferred.resolve(err));
    return deferred.promise;
  }


};