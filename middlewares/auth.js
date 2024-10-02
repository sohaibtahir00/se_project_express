const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { unauthorized } = require("../utils/errors");

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.jwt;

  if (!token) {
    return res.status(unauthorized).send({ message: "Authorization required" });
  }

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(unauthorized).send({ message: "Invalid token" });
    }

    req.user = payload;
    return next();
  });
};

module.exports = auth;
