const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { unauthorized } = require("../utils/errors");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(unauthorized).send({ message: "Authorization required" });
  }

  const token = authHeader.split(" ")[1];

  return jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(unauthorized).send({ message: "Invalid token" });
    }

    req.user = payload;
    return next();
  });
};

module.exports = auth;
