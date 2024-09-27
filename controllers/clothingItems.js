const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  console.log(res);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.status(201).send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      res
        .status(500)
        .send({ message: "Error came from createItem", error: e.message });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((e) => {
      console.error(e);
      res
        .status(500)
        .send({ message: "Error came from getItems", error: e.message });
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
        .status(500)
        .send({ message: "Error came from updateItems", error: e.message });
    });
};

const deleteItem = (req, res) => {
  const { id: itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail(new Error("ItemNotFound"))
    .then((item) => {
      res
        .status(200)
        .send({ message: "Item deleted successfully", data: item });
    })
    .catch((err) => {
      if (err.message === "ItemNotFound") {
        return res.status(404).send({ message: "Item not found" });
      }
      res
        .status(500)
        .send({ message: "Error deleting item", error: err.message });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(itemId, { $inc: { likes: 1 } }, { new: true })
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      res
        .status(500)
        .send({ message: "Error updating likes", error: e.message });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(itemId, { $inc: { likes: -1 } }, { new: true })
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      res
        .status(500)
        .send({ message: "Error updating likes", error: e.message });
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
