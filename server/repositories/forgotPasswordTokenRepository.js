const {ForgotPasswordToken} = require("../models");
const ForgotPasswordTokenRepositoryInterface = require("./interfaces/forgotPasswordTokenRepositoryInterface");

let ForgotPasswordTokenRepository = Object.create(
  ForgotPasswordTokenRepositoryInterface
);

ForgotPasswordTokenRepository.add = function(email, token, expires) {
  return ForgotPasswordToken.create({
    email: email,
    token: token,
    expires: expires
  });
};

ForgotPasswordTokenRepository.getByEmail = function(email) {
  return ForgotPasswordToken.findOne({ where: { email: email } });
};

ForgotPasswordTokenRepository.getByToken = function(token) {
  return ForgotPasswordToken.findOne({ where: { token: token } });
};

ForgotPasswordTokenRepository.removeByToken = function(token) {
  return ForgotPasswordToken.destroy({ where: { token: token } });
};


module.exports = ForgotPasswordTokenRepository;
