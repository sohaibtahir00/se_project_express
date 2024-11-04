const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res, next) => {
  const { name, avatar, email, password: userPassword } = req.body;

  if (!name || !avatar || !email || !userPassword) {
    return next(new BadRequestError("All fields are required"));
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return next(new ConflictError("Email already exists"));
      }
      return User.create({ name, avatar, email, password: userPassword });
    })
    .then((user) => {
      if (user) {
        const userData = user.toObject();
        const { password, ...responseData } = userData;
        return res.status(201).send(responseData);
      }
      return null;
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Validation error"));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password: loginPassword } = req.body;

  if (!email || !loginPassword) {
    return next(new BadRequestError("Email and password are required"));
  }

  return User.findUserByCredentials(email, loginPassword)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.message === "Invalid email or password") {
        return next(new UnauthorizedError("Invalid email or password"));
      }
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  return User.findById(userId)
    .orFail(() => new NotFoundError("User not found"))
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  if (!name && !avatar) {
    return next(new BadRequestError("At least one field must be provided"));
  }

  const updateFields = {};
  if (name) updateFields.name = name;
  if (avatar) updateFields.avatar = avatar;

  return User.findByIdAndUpdate(userId, updateFields, {
    new: true,
    runValidators: true,
  })
    .orFail(() => new NotFoundError("User not found"))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Validation error"));
      }
      next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
