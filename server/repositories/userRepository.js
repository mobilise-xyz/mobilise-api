const {User} = require("../models");
const Q = require("q");
const UserRepositoryInterface = require("./interfaces/userRepositoryInterface");
const { CONTACT_PREFERENCES } = require("../sequelizeUtils/include");

let UserRepository = Object.create(UserRepositoryInterface);

UserRepository.add = function(user, hash, phone) {
  let deferred = Q.defer();

  User.create({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: hash,
    isAdmin: user.isAdmin,
    dob: user.dob,
    telephone: phone
  })
    .then(user => deferred.resolve(user))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

UserRepository.getByEmail = function(email) {
  let deferred = Q.defer();

  User.findOne({ where: { email: email }, include: [CONTACT_PREFERENCES()] })
    .then(user => deferred.resolve(user))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

UserRepository.getById = function(id) {
  let deferred = Q.defer();

  User.findOne({ where: { id: id }, include: [CONTACT_PREFERENCES()] })
    .then(user => deferred.resolve(user))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};


UserRepository.getByCalendarKey = function(key) {
  let deferred = Q.defer();

  User.findOne({
    where: { calendarAccessKey: key }
  })
    .then(user => deferred.resolve(user))
    .catch(err => deferred.reject(err));

  return deferred.promise;
};

UserRepository.update = function(user, body) {
  let deferred = Q.defer();

  User.update(body, { where: { id: user.id } })
    .then(user => deferred.resolve(user))
    .catch(err => deferred.reject(err));

  return deferred.promise;
};

module.exports = UserRepository;
