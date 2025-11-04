const express = require("express");
const { createReview } = require("../controllers/reviewController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.route("/").post(protect, createReview);

module.exports = router;
