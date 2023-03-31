const jwt = require("jsonwebtoken");
const asyncHalder = require("express-async-handler");
const verifyAccessToken = asyncHalder(async (req, res, next) => {
  if (req?.headers?.authorization.startsWith("Bearer ")) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token access" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Require authentication" });
  }
});

const isAdmin = asyncHalder(async (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin") {
    throw new Error("Not is Authorization")
  }
  next();
})
module.exports = { verifyAccessToken, isAdmin };
