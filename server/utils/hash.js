const bcrypt = require("bcryptjs");

function hashed(key) {
  return bcrypt.hashSync(key, bcrypt.genSaltSync(8), null);
}

function validateHash(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

module.exports = {
  validateHash,
  hashed
};