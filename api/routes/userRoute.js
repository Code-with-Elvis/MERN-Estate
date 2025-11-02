const express = require("express");
const {
  getAllUsers,
  getMe,
  getUser,
  updateMe,
  updatePassword,
  deactivateMe,
} = require("../controllers/userController");
const {
  signUp,
  signIn,
  protect,
  logout,
  googleSignUp,
} = require("../controllers/authController");

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/auth/me").get(protect, getMe, getUser);
router.route("/me/update").patch(protect, updateMe);
router.route("/me/update-password").patch(protect, updatePassword);
router.route("/auth/logout").post(logout);
router.post("/auth/google", googleSignUp);
router.route("/me/deactivate").delete(protect, deactivateMe);

module.exports = router;
