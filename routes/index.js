const router = require("express").Router();
const { celebrate, Joi, Segments } = require("celebrate");

const clothingItems = require("./clothingItems");
const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");
const { NotFoundError } = require("../utils/errors/index");
const auth = require("../middlewares/auth");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const signUpSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  avatar: Joi.string().uri(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post(
  "/signin",
  celebrate({
    [Segments.BODY]: loginSchema,
  }),
  login
);

router.post(
  "/signup",
  celebrate({
    [Segments.BODY]: signUpSchema,
  }),
  createUser
);

router.use("/items", clothingItems);

router.use(auth);
router.use("/users", userRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Route not found"));
});

module.exports = router;
