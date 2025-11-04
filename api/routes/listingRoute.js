const express = require("express");
const {
  createListing,
  getMyListings,
  deleteListing,
  getListing,
} = require("../controllers/listingController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.route("/").post(protect, createListing);
router.route("/me").get(protect, getMyListings);
router.route("/:id").delete(protect, deleteListing);
router.route("/:slug").get(getListing);

module.exports = router;
