const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../utils/errors/index");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required"));
  }

  const token = authHeader.split(" ")[1];

  return jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return next(new UnauthorizedError("Invalid token"));
    }

    req.user = payload;
    next();
  });
};

module.exports = auth;
