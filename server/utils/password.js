function isSecure(password) {
  return new RegExp(
    '(?=^.{8,}$)((?=.*\\d)|(?=.*\\W+))' +
    '(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$'
  ).test(password);
}

module.exports = {
  isSecure
};