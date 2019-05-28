const Role = require('../models').Role;
const Shift = require('../models').Shift;
const roleRepository = require('./roleRepository');
const Q = require('q');

module.exports = {
  add: function(shift) {
    var deferred = Q.defer();
    Shift
    .create({
      title: shift.title,
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

  addRequiredRoles: function(shift, rolesRequired) {
    var deferred = Q.defer();
    rolesRequired.forEach(function(roleRequired) {
      roleRepository.getById(roleRequired.roleId)
      .then((role) => {
        shift
        .addRole(role, {through: {  numberRequired: roleRequired.number}});
        });
    });
    deferred.resolve(shift);
    return deferred.promise;
  }
};