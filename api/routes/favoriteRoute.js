const express = require("express");
const {
  toggleFavorite,
  getUserFavorites,
} = require("../controllers/favoriteController");
const { protect } = require("../controllers/authController");

const router = express.Router();

// === All routes require authentication
router.use(protect);

router.route("/").post(toggleFavorite).get(getUserFavorites);

module.exports = router;
