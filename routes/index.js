const router = require("express").Router();
const clothingItems = require("./clothingItems");
const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");
const { notFound } = require("../utils/errors");
const auth = require("../middlewares/auth");

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/items", clothingItems);

router.use(auth);

router.use("/users", userRouter);

router.use((req, res) => {
  res.status(notFound).send({ message: "Route not found" });
});

module.exports = router;
