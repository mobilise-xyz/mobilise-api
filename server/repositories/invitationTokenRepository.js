const {InvitationToken} = require("../models");
const Q = require("q");
const InvitationTokenRepositoryInterface = require("./interfaces/invitationTokenRepositoryInterface");

let InvitationTokenRepository = Object.create(
  InvitationTokenRepositoryInterface
);

InvitationTokenRepository.add = function(email, token, expires, isAdmin) {
  return InvitationToken.create({
    email: email,
    token: token,
    isAdmin: isAdmin,
    expires: expires
  });
};

InvitationTokenRepository.getByEmail = function(email) {
  let deferred = Q.defer();

  InvitationToken.findOne({ where: { email: email } })
    .then(invite => deferred.resolve(invite))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

InvitationTokenRepository.getByToken = function(token) {
  let deferred = Q.defer();

  InvitationToken.findOne({ where: { token: token } })
    .then(invite => deferred.resolve(invite))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};

InvitationTokenRepository.removeByToken = function(token) {
  let deferred = Q.defer();

  InvitationToken.destroy({ where: { token: token } })
    .then(result => deferred.resolve(result))
    .catch(error => deferred.reject(error));

  return deferred.promise;
};


module.exports = InvitationTokenRepository;
