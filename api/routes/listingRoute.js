const express = require("express");
const {
  createListing,
  getMyListings,
  deleteListing,
  getListing,
  updateListing,
  getAllListings,
  getRecentListings,
} = require("../controllers/listingController");
const { protect, protectOptional } = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(protectOptional, getAllListings)
  .post(protect, createListing);
router.route("/recent").get(protectOptional, getRecentListings);
router.route("/me").get(protect, getMyListings);
router
  .route("/:slug")
  .get(protectOptional, getListing)
  .patch(protect, updateListing);
router.route("/:id").delete(protect, deleteListing);

module.exports = router;
