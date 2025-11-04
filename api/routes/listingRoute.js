const express = require("express");
const {
  createListing,
  getMyListings,
  deleteListing,
} = require("../controllers/listingController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.route("/").post(protect, createListing);
router.route("/me").get(protect, getMyListings);
router.route("/:id").delete(protect, deleteListing);

module.exports = router;
