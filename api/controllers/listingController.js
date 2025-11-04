const Listing = require("../modals/listingModal");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const createListing = catchAsync(async (req, res, next) => {
  // === Get user ID from authenticated user ===
  req.body.listedBy = req.user.id;

  // === Create new listing ===
  const newListing = await Listing.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      listing: newListing,
    },
  });
});

const getMyListings = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const listings = await Listing.find({ listedBy: userId });
  res.status(200).json({
    status: "success",
    results: listings.length,
    data: {
      listings,
    },
  });
});

module.exports = {
  createListing,
  getMyListings,
};
