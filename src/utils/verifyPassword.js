const bcrypt = require("bcryptjs");

const ComparePassword = async (password , hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {ComparePassword};