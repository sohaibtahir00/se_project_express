const router = require("express").Router();
const { celebrate, Joi, Segments } = require("celebrate");
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const itemSchema = Joi.object({
  name: Joi.string().required(),
  weather: Joi.string().valid("hot", "warm", "cold").required(),
  imageUrl: Joi.string().uri().required(),
});

const itemIdSchema = Joi.object({
  itemId: Joi.string().hex().length(24).required(),
});

const idSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

router.post(
  "/",
  auth,
  celebrate({
    [Segments.BODY]: itemSchema,
  }),
  createItem
);

router.get("/", getItems);

router.put(
  "/:itemId/likes",
  auth,
  celebrate({
    [Segments.PARAMS]: itemIdSchema,
  }),
  likeItem
);

router.delete(
  "/:itemId/likes",
  auth,
  celebrate({
    [Segments.PARAMS]: itemIdSchema,
  }),
  dislikeItem
);

router.delete(
  "/:id",
  auth,
  celebrate({
    [Segments.PARAMS]: idSchema,
  }),
  deleteItem
);

module.exports = router;
