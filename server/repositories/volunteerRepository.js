const Volunteer = require('../models').Volunteer;
const Q = require('q');

module.exports = {
    add: function(volunteer) {
      var deferred = Q.defer();
      Volunteer
      .create({
          userId: volunteer.userId
      })
      .then(volunteer => deferred.resolve(volunteer))
      .catch(error => deferred.reject(error));
      return deferred.promise;
    }
  };