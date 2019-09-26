const {InvitationToken} = require("../models");
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
  return InvitationToken.findOne({ where: { email: email } });
};

InvitationTokenRepository.getByToken = function(token) {
  return InvitationToken.findOne({ where: { token: token } });
};

InvitationTokenRepository.removeByToken = function(token) {
  return InvitationToken.destroy({ where: { token: token } });
};


module.exports = InvitationTokenRepository;
