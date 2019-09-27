const {UserContactPreference} = require("../models");
const UserContactPreferenceRepositoryInterface = require("./interfaces/userContactPreferenceRepositoryInterface");

let UserContactPreferenceRepository = Object.create(
  UserContactPreferenceRepositoryInterface
);

UserContactPreferenceRepository.add = function(userId, contactPreferences) {
  return UserContactPreference.create({
    userId: userId,
    email: contactPreferences.email,
    text: contactPreferences.text
  });
};

UserContactPreferenceRepository.getById = function(userId) {
  return UserContactPreference.findOne({ where: { userId: userId } });
};

UserContactPreferenceRepository.update = function(userId, contactPreferences) {
  return UserContactPreference.update(
    {
      email: contactPreferences.email,
      text: contactPreferences.text
    },
    {
      where: { userId: userId }
    }
  );
};

module.exports = UserContactPreferenceRepository;
