const router = require("express").Router();
const clothingItems = require("./clothingItems");
const userRouter = require("./users");

router.use("/items", clothingItems);

router.use("/users", userRouter);

router.use((req, res) => {
  res.status(404).send({ message: "Router not found" });
});

module.exports = router;
