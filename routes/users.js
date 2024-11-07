const router = require("express").Router();
const { celebrate, Joi, Segments } = require("celebrate");
const { getCurrentUser, updateUser } = require("../controllers/users");

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(30).optional(),
  avatar: Joi.string().uri().optional(),
});

router.get("/me", getCurrentUser);

router.patch(
  "/me",
  celebrate({
    [Segments.BODY]: updateUserSchema,
  }),
  updateUser
);

module.exports = router;
