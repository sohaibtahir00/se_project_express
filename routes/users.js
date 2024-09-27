// const router = require("express").Router();
// const { getUsers, createUser, getUser } = require("../controllers/users");

// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser);

// module.exports = router;

const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users");

// Define the user routes
router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);

module.exports = router;
