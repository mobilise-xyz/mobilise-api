const Admin = require('../models').Admin;
const Q = require('q');
const AdminRepositoryInterface = require('./interfaces/adminRepositoryInterface');

var AdminRepository = Object.create(AdminRepositoryInterface);

AdminRepository.add = function(admin) {
  var deferred = Q.defer();
      
  Admin
    .create({
        userId: admin.userId
    })
    .then(admin => deferred.resolve(admin))
    .catch(error => deferred.reject(error));
  
  return deferred.promise;
}

module.exports = AdminRepository;