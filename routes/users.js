const router = require("express").Router();
const { getCurrentUser, updateUser, login } = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", updateUser);
router.post("/signin", login);

module.exports = router;
