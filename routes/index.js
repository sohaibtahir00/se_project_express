const router = require("express").Router();
const clothingItems = require("./clothingItems");
const userRouter = require("./users");
const { notFound } = require("../utils/errors");

router.use("/items", clothingItems);

router.use("/users", userRouter);

router.use((req, res) => {
  res.status(notFound).send({ message: "Router not found" });
});

module.exports = router;
