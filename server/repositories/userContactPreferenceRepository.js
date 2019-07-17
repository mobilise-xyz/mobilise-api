const UserContactPreference = require("../models").UserContactPreference;
const Q = require("q");
const UserContactPreferenceRepositoryInterface = require("./interfaces/userContactPreferenceRepositoryInterface");

var UserContactPreferenceRepository = Object.create(
  UserContactPreferenceRepositoryInterface
);

UserContactPreferenceRepository.add = function(userId, contactPreferences) {
  var deferred = Q.defer();

  UserContactPreference.create({
    userId: userId,
    email: contactPreferences.email,
    text: contactPreferences.text
  })
    .then(contactPreferences => deferred.resolve(contactPreferences))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

UserContactPreferenceRepository.getById = function(userId) {
  var deferred = Q.defer();

  UserContactPreference.findOne({ where: { userId: userId } })
    .then(contactPreferences => deferred.resolve(contactPreferences))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

UserContactPreferenceRepository.update = function(userId, contactPreferences) {
  var deferred = Q.defer();

  UserContactPreference.update(
    {
      email: contactPreferences.email,
      text: contactPreferences.text
    },
    {
      where: { userId: userId }
    }
  )
    .then(contactPreferences => deferred.resolve(contactPreferences))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

module.exports = UserContactPreferenceRepository;
