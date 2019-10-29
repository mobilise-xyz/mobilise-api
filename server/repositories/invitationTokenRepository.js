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

InvitationTokenRepository.removeByEmail = function(email) {
  return InvitationToken.destroy({ where: { email: email } });
};


module.exports = InvitationTokenRepository;
