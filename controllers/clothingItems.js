const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  return ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Validation error"));
      } else {
        next(err);
      }
    });
};

const getItems = (req, res, next) =>
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(next);

const deleteItem = (req, res, next) => {
  const { id: itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item ID format"));
  }

  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }
      if (item.owner.toString() !== req.user._id.toString()) {
        return next(
          new ForbiddenError("You do not have permission to delete this item")
        );
      }
      return ClothingItem.findByIdAndDelete(itemId)
        .then(() =>
          res
            .status(200)
            .send({ message: "Item deleted successfully", data: item })
        )
        .catch(next);
    })
    .catch(next);
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item ID format"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => res.status(200).send({ data: item }))
    .catch(next);
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item ID format"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => res.status(200).send({ data: item }))
    .catch(next);
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
