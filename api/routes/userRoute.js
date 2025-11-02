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
  mustBeActive,
} = require("../controllers/authController");

const router = express.Router();
const app = express();

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

module.exports = router;
