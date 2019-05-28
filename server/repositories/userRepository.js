const User = require('../models').User;
const Q = require('q');

module.exports = {
  add: function(user, hash) {
    var deferred = Q.defer();
    User
    .create({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: hash,
        admin: user.admin,
        dob: user.dob
    })
    .then(user => deferred.resolve(user))
    .catch(error => deferred.reject(error));
    return deferred.promise;
  },

  getByEmail: function(email) {
    var deferred = Q.defer();
    User
    .findOne({where: {email: email}})
    .then(user => deferred.resolve(user))
    .catch(error => deferred.reject(error));
    return deferred.promise;
  },

  getById: function(id) {
    var deferred = Q.defer();
    User
    .findOne({where: {id: id}})
    .then(user => deferred.resolve(user))
    .catch(error => deferred.reject(error));
    return deferred.promise;
  }
};