const Role = require('../models').Role;
const Shift = require('../models').Shift;
const roleRepository = require('./').RoleRepository;
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
    var promises = [];
    rolesRequired.forEach(function(roleRequired) {
      promises.push(roleRepository.getById(roleRequired.roleId)
      .then(role => {
        return shift
        .addRole(role, {through: {  numberRequired: roleRequired.number}});
      }));
    })
    return Q.all(promises)
           .then(roles => {return {shift: shift, roles: roles}})
  },

  getAll: function() {
    var deferred = Q.defer();
    Shift.findAll({include: ['roles']})
    .then(shifts => deferred.resolve(shifts))
    .catch(err => deferred.resolve(err));
    return deferred.promise;
  }
};