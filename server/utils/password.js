const bcrypt = require("bcryptjs");

function hashedPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

function validatePassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

function isSecure(password) {
  return new RegExp(
    '(?=^.{8,}$)((?=.*\\d)|(?=.*\\W+))' +
    '(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$'
  ).test(password);
}

module.exports = {
  hashedPassword,
  validatePassword,
  isSecure
};