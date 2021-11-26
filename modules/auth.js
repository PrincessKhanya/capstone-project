const jwt = require("jsonwebtoken");
const crypto = require("crypto");

module.exports.getJWT = function (userData) {
  let auth = jwt.sign(userData, process.env.AUTH_TOKEN);
  return auth;
};

module.exports.verifyJWT = function (tokenData) {
  let auth = jwt.verify(tokenData, process.env.AUTH_TOKEN);
  return auth;
};

module.exports.hashPassword = function (password) {
  let unsalted = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex")
    .toLowerCase();

  return crypto
    .createHash("sha256")
    .update(unsalted + process.env.PASSWORD_SALT)
    .digest("hex")
    .toUpperCase();
};
