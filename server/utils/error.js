function errorMessage(err) {
  if (process.env.NODE_ENV === "production") {
    return "Something went wrong. Please try again."
  }
  return err;
}

module.exports = {
  errorMessage
};