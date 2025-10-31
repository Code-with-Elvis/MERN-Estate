const express = require("express");
const {
  getAllUsers,
  getMe,
  getUser,
} = require("../controllers/userController");
const {
  signUp,
  signIn,
  protect,
  logout,
} = require("../controllers/authController");

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/auth/me").get(protect, getMe, getUser);
router.route("/auth/logout").post(logout);

module.exports = router;
