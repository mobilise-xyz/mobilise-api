const Role = require("../models").Role;
const Q = require("q");

const RoleRepositoryInterface = require("./interfaces/roleRepositoryInterface");

var RoleRepository = Object.create(RoleRepositoryInterface);

RoleRepository.add = function(role) {
  const deferred = Q.defer();

  Role.create({
    name: role.name,
    involves: role.involves,
    colour: role.colour
  })
    .then(role => deferred.resolve(role))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

RoleRepository.getByName = function(name) {
  var deferred = Q.defer();

  Role.findOne({ where: { name: name } })
    .then(role => deferred.resolve(role))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

RoleRepository.getAll = function() {
  var deferred = Q.defer();

  Role.findAll()
    .then(roles => deferred.resolve(roles))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

RoleRepository.removeByName = function(name) {
  var deferred = Q.defer();

  Role.destroy({ where: { name: name } })
    .then(role => deferred.resolve(role))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

module.exports = RoleRepository;
