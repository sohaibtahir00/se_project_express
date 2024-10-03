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

const createUser = (req, res) => {
  const { name, avatar, email, password: userPassword } = req.body;

  if (!name || !avatar || !email || !userPassword) {
    return res.status(badRequest).send({ message: "All fields are required" });
  }

  return User.findOne({ email })
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
        return res.status(201).send(responseData); // Ensure return here
      }
      return null; // Make sure this returns something even if user is null
    })
    .catch((err) => {
      if (res.headersSent) {
        return null; // return here to avoid sending multiple responses
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
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ token }); // Ensure return here
    })
    .catch((err) => {
      if (err.message === "Invalid email or password") {
        return res
          .status(unauthorized)
          .send({ message: "Invalid email or password" });
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
    .then((user) => res.status(200).send(user)) // Ensure return here
    .catch((err) => {
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
    .then((user) => res.status(200).send(user)) // Ensure return here
    .catch((err) => {
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
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
