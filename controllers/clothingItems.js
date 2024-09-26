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
  const { itemId } = req.params;

  ClothingItems.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.status(204).send({});
    })
    .catch((e) => {
      res.status(500).send({ message: "Error came from deleteItems", e });
    });
};

module.exports = { createItem, getItems, updateItem, deleteItem };
