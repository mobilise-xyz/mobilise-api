let ForgotPasswordTokenRepositoryInterface = {
  add: function(email, token, expiry) {},
  getByToken: function(token) {}
};

module.exports = ForgotPasswordTokenRepositoryInterface;