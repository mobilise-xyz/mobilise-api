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

module.exports = VolunteerRepository;