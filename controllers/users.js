const User = require("../models/user");
const mongoose = require("mongoose");
const { badRequest, notFound, internalServer } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.log(err);
      return res.status(internalServer).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res.status(badRequest).send({ message: err.message });
      }
      return res.status(internalServer).send({ message: err.message });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(badRequest).send({ message: "Invalid user ID format" });
  }

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "User not found" });
      }
      return res.status(internalServer).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser };
