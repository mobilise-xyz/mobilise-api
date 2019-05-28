const Role = require('../models').Role;
const Q = require('q');

module.exports = {
  add: function(role) {
    var deferred = Q.defer();
    Role
    .create({
        name: role.name,
        involves: role.involves
    })
    .then(role => deferred.resolve(role))
    .catch(error => deferred.reject(error));
    return deferred.promise;
  },

  getById: function(id) {
    var deferred = Q.defer();
    Role
    .findOne({where: {id: id}})
    .then(role => deferred.resolve(role))
    .catch(error => deferred.reject(error));
    return deferred.promise;
  },

  getAll: function()  {
    var deferred = Q.defer();
    Role
    .findAll()
    .then(roles => deferred.resolve(roles))
    .catch(error => deferred.reject(error));
    return deferred.promise;
  },
};