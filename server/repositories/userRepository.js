const {User} = require("../models");
const UserRepositoryInterface = require("./interfaces/userRepositoryInterface");
const { CONTACT_PREFERENCES } = require("../sequelizeUtils/include");

let UserRepository = Object.create(UserRepositoryInterface);

UserRepository.add = function(user, hash, phone, isAdmin) {
  return User.create({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: hash,
    isAdmin: isAdmin,
    dob: user.dob,
    telephone: phone
  });
};

UserRepository.getByEmail = function(email) {
  return User.findOne({ where: { email: email }, include: [CONTACT_PREFERENCES()] });
};

UserRepository.getById = function(id) {
  return User.findOne({ where: { id: id }, include: [CONTACT_PREFERENCES()] });
};


UserRepository.getByCalendarKey = function(key) {
  return User.findOne({
    where: { calendarAccessKey: key }
  });
};

UserRepository.update = function(user, body) {
  return User.update(body, { where: { id: user.id } });
};

module.exports = UserRepository;
