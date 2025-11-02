const express = require("express");
const {
  getAllUsers,
  getMe,
  getUser,
  updateMe,
  updatePassword,
  deactivateMe,
  deleteMe,
} = require("../controllers/userController");
const {
  signUp,
  signIn,
  protect,
  logout,
  googleSignUp,
  mustBeActive,
} = require("../controllers/authController");

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/auth/logout").post(logout);
router.post("/auth/google", googleSignUp);

router.route("/auth/me").get(protect, getMe, getUser);
router.route("/me/update").patch(protect, mustBeActive, updateMe);
router
  .route("/me/update-password")
  .patch(protect, mustBeActive, updatePassword);
router.route("/me/deactivate").delete(protect, deactivateMe);
router.route("/me/delete").delete(protect, mustBeActive, deleteMe);

module.exports = router;
