const Volunteer = require('../models').Volunteer;
const Q = require('q');
const VolunteerRepositoryInterface = require('./interfaces/volunteerRepositoryInterface');

var VolunteerRepository = Object.create(VolunteerRepositoryInterface);

VolunteerRepository.add = function(volunteer) {
  var deferred = Q.defer();

  Volunteer
    .create({
        userId: volunteer.userId
    })
    .then(volunteer => deferred.resolve(volunteer))
    .catch(error => deferred.reject(error));

  return deferred.promise;
}

VolunteerRepository.getAll = function() {
  var deferred = Q.defer();

  Volunteer
    .findAll({include: ['user']})
    .then(volunteers => deferred.resolve(volunteers))
    .catch(err => deferred.reject(err));

  return deferred.promise;
}

VolunteerRepository.getById = function(id) {
  var deferred = Q.defer();

  Volunteer
    .findOne({where: {userId: id}})
    .then(volunteer => deferred.resolve(volunteer))
    .catch(err => deferred.reject(err));

  return deferred.promise;
}
 
module.exports = VolunteerRepository;