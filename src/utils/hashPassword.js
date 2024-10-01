const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 5);
};

module.exports = hashPassword;