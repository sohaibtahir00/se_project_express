const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getUsers,
  getUser,
  getCurrentUser,
  updateUser,
} = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUser);

router.get("/:userId", getUser);
router.get("/", getUsers);

module.exports = router;
