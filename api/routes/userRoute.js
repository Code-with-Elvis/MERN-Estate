const express = require("express");
const { getAllUsers } = require("../controllers/userController");
const { signUp } = require("../controllers/authController");

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/signup").post(signUp);

module.exports = router;
