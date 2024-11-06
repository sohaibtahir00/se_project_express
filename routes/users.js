const router = require("express").Router();
const { celebrate, Joi, Segments } = require("celebrate");
const { getCurrentUser, updateUser, login } = require("../controllers/users");

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(30).optional(),
  avatar: Joi.string().uri().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.get("/me", getCurrentUser);

router.patch(
  "/me",
  celebrate({
    [Segments.BODY]: updateUserSchema,
  }),
  updateUser
);

router.post(
  "/signin",
  celebrate({
    [Segments.BODY]: loginSchema,
  }),
  login
);

module.exports = router;
