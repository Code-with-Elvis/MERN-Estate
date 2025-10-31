const express = require("express");
const { getAllUsers } = require("../controllers/userController");
const { signUp, signIn } = require("../controllers/authController");

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/signup").post(signUp);
router.route("/signin").post(signIn);

module.exports = router;
