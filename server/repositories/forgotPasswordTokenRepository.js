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

ForgotPasswordTokenRepository.removeByEmail = function(email) {
  return ForgotPasswordToken.destroy({ where: { email: email } });
};


module.exports = ForgotPasswordTokenRepository;
