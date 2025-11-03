const express = require("express");
const { createListing } = require("../controllers/listingController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.route("/").post(protect, createListing);

module.exports = router;
