const e = require("express");
const ClothingItem = require("../models/clothingItem");
const mongoose = require("mongoose");
const { badRequest, notFound, internalServer } = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(badRequest)
          .send({ message: "Validation error", error: err.message });
      }
      res
        .status(internalServer)
        .send({ message: "Error retrieving items", error: err.message });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(badRequest).send({ message: "Invalid ID format" });
      }
      if (err.message === "ItemNotFound") {
        return res.status(notFound).send({ message: "Item not found" });
      }
      res
        .status(internalServer)
        .send({ message: "Error retrieving items", error: err.message });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      res
        .status(internalServer)
        .send({ message: "Error came from updateItems", error: e.message });
    });
};

const deleteItem = (req, res) => {
  const { id: itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(badRequest).send({ message: "Invalid item ID format" });
  }

  ClothingItem.findByIdAndDelete(itemId)
    .orFail(new Error("ItemNotFound"))
    .then((item) => {
      res
        .status(200)
        .send({ message: "Item deleted successfully", data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "ItemNotFound") {
        return res.status(notFound).send({ message: "Item not found" });
      }
      res
        .status(internalServer)
        .send({ message: "Error deleting item", error: err.message });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(badRequest).send({ message: "Invalid item ID format" });
  }

  ClothingItem.findByIdAndUpdate(itemId, { $inc: { likes: 1 } }, { new: true })
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Item not found" });
      }
      res
        .status(internalServer)
        .send({ message: "Error updating likes", error: err.message });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(badRequest).send({ message: "Invalid item ID format" });
  }

  ClothingItem.findByIdAndUpdate(itemId, { $inc: { likes: -1 } }, { new: true })
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Item not found" });
      }
      res
        .status(internalServer)
        .send({ message: "Error updating likes", error: err.message });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
