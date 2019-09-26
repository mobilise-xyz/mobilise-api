const {ForgotPasswordToken} = require("../models");
const Q = require("q");
const ForgotPasswordTokenRepositoryInterface = require("./interfaces/ForgotPasswordTokenRepositoryInterface");

let ForgotPasswordTokenRepository = Object.create(
  ForgotPasswordTokenRepositoryInterface
);

ForgotPasswordTokenRepository.add = function(email, token, expires) {
  let deferred = Q.defer();

  ForgotPasswordToken.create({
    email: email,
    token: token,
    expires: expires
  })
    .then(result => deferred.resolve(result))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

ForgotPasswordTokenRepository.getByEmail = function(email) {
  let deferred = Q.defer();

  ForgotPasswordToken.findOne({ where: { email: email } })
    .then(invite => deferred.resolve(invite))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

ForgotPasswordTokenRepository.getByToken = function(token) {
  let deferred = Q.defer();

  ForgotPasswordToken.findOne({ where: { token: token } })
    .then(invite => deferred.resolve(invite))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

ForgotPasswordTokenRepository.removeByToken = function(token) {
  let deferred = Q.defer();

  ForgotPasswordToken.destroy({ where: { token: token } })
    .then(result => deferred.resolve(result))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};


module.exports = ForgotPasswordTokenRepository;
