const Admin = require('../models').Admin;
const User = require('../models').User;
const Q = require('q');
const AdminRepositoryInterface = require('./interfaces/adminRepositoryInterface');

var AdminRepository = Object.create(AdminRepositoryInterface);

AdminRepository.add = function (admin) {
  var deferred = Q.defer();

  Admin
    .create({
      userId: admin.userId
    })
    .then(admin => deferred.resolve(admin))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

AdminRepository.getById = function (id) {
  var deferred = Q.defer();
  Admin
    .findOne({
      where: {
        userId: id
      }, include: [{
        model: User,
        as: "user",
        include: ['contactPreferences']
      }]
    })
    .then(admin => deferred.resolve(admin))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

module.exports = AdminRepository;