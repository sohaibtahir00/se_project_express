const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  badRequest,
  notFound,
  internalServer,
  noPermission,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  return ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(badRequest).send({ message: "Validation error" });
      }
      return res
        .status(internalServer)
        .send({ message: "An error has occurred on the server" });
    });
};

const getItems = (req, res) =>
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(badRequest).send({ message: "Invalid ID format" });
      }
      if (err.message === "ItemNotFound") {
        return res.status(notFound).send({ message: "Item not found" });
      }
      return res
        .status(internalServer)
        .send({ message: "An error has occurred on the server" });
    });

const deleteItem = (req, res) => {
  const { id: itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(badRequest).send({ message: "Invalid item ID format" });
  }

  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(notFound).send({ message: "Item not found" });
      }
      if (item.owner.toString() !== req.user._id.toString()) {
        return res
          .status(noPermission)
          .send({ message: "You do not have permission to delete this item" });
      }
      return ClothingItem.findByIdAndDelete(itemId)
        .then(() =>
          res
            .status(200)
            .send({ message: "Item deleted successfully", data: item })
        )
        .catch((err) => {
          console.error(err);
          return res
            .status(internalServer)
            .send({ message: "An error has occurred on the server" });
        });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(internalServer)
        .send({ message: "An error has occurred on the server" });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(badRequest).send({ message: "Invalid item ID format" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Item not found" });
      }
      return res
        .status(internalServer)
        .send({ message: "An error has occurred on the server" });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(badRequest).send({ message: "Invalid item ID format" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Item not found" });
      }
      return res
        .status(internalServer)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
