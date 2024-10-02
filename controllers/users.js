const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const {
  badRequest,
  notFound,
  internalServer,
  unauthorized,
  alreadyExist,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res) =>
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.log(err);
      return res
        .status(internalServer)
        .send({ message: "An error has occurred on the server" });
    });

const createUser = (req, res) => {
  const { name, avatar, email, password: userPassword } = req.body;

  if (!name || !avatar || !email || !userPassword) {
    return res.status(badRequest).send({ message: "All fields are required" });
  }

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(alreadyExist)
          .send({ message: "Email already exists" });
      }
      return User.create({ name, avatar, email, password: userPassword });
    })
    .then((user) => {
      if (user) {
        const userData = user.toObject();
        const { password, ...responseData } = userData;
        return res.status(201).send(responseData);
      }
    })
    .catch((err) => {
      if (res.headersSent) {
        console.error("Headers already sent, can't send another response.");
        return;
      }

      if (err.name === "ValidationError") {
        return res.status(badRequest).send({ message: "Validation error" });
      }

      return res
        .status(internalServer)
        .send({ message: "Internal server error" });
    });
};

const login = (req, res) => {
  const { email, password: loginPassword } = req.body;

  if (!email || !loginPassword) {
    return res
      .status(badRequest)
      .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, loginPassword)
    .then((user) => {
      if (user) {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        return res.status(200).send({ token });
      }
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(unauthorized)
        .send({ message: "Invalid email or password" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(badRequest).send({ message: "Invalid user ID format" });
  }

  return User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "User not found" });
      }
      return res
        .status(internalServer)
        .send({ message: "An error has occurred on the server" });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  return User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "User not found" });
      }
      return res
        .status(internalServer)
        .send({ message: "An error has occurred on the server" });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  if (!name && !avatar) {
    return res
      .status(badRequest)
      .send({ message: "At least one field must be provided" });
  }

  const updateFields = {};
  if (name) updateFields.name = name;
  if (avatar) updateFields.avatar = avatar;

  return User.findByIdAndUpdate(userId, updateFields, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res.status(badRequest).send({ message: "Validation error" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "User not found" });
      }
      return res
        .status(internalServer)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  getUsers,
  createUser,
  login,
  getUser,
  getCurrentUser,
  updateUser,
};
