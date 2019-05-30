const Admin = require('../models').Admin;
const Q = require('q');

module.exports = {
    add: function(admin) {
      var deferred = Q.defer();
      Admin
      .create({
          userId: admin.userId
      })
      .then(admin => deferred.resolve(admin))
      .catch(error => deferred.reject(error));
      return deferred.promise;
    }
  };