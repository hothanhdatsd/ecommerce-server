const jwt = require("jsonwebtoken");
const generateAccessToken = (uid, role) => {
  return jwt.sign({ _id: uid, role }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};
const generateRefreshToken = (uid) => {
  return jwt.sign({ _id: uid }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
