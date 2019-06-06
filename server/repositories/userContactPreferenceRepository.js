const UserContactPreference = require('../models').UserContactPreference;
const Q = require('q');
const UserContactPreferenceRepositoryInterface = require('./interfaces/userContactPreferenceRepositoryInterface');

var UserContactPreferenceRepository = Object.create(UserContactPreferenceRepositoryInterface);

UserContactPreferenceRepository.add = function(userId, contactPreference) {
  var deferred = Q.defer();
  
  UserContactPreference
    .create({
        userId: userId,
        email: contactPreference.email,
        text: contactPreference.text
    })
    .then(contactPreference => deferred.resolve(contactPreference))
    .catch(error => deferred.reject(error));
  
  return deferred.promise;
};

UserContactPreferenceRepository.getById = function(userId) {
  var deferred = Q.defer();

  UserContactPreference
    .findOne({where: {userId: userId}})
    .then(contactPreference => deferred.resolve(contactPreference))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

UserContactPreferenceRepository.update = function(userId, contactPreference) {
  var deferred = Q.defer();
  
  UserContactPreference
    .update(
      {
        email: contactPreference.email,
        text: contactPreference.text
      },
      {
        where: {userId: userId}
      }
    )
    .then(contactPreference => deferred.resolve(contactPreference))
    .catch(error => deferred.reject(error));
  
  return deferred.promise;
};

module.exports = UserContactPreferenceRepository;