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

const getListing = catchAsync(async (req, res, next) => {
  const listingSlug = req.params.slug;
  const listing = await Listing.findOne({ slug: listingSlug })
    .populate("listedBy", "name email")
    .populate("reviews");
  if (!listing) {
    return next(new AppError("No listing found with that slug", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      listing,
    },
  });
});

const deleteListing = catchAsync(async (req, res, next) => {
  const listingId = req.params.id;
  const userId = req.user.id;

  const listing = await Listing.findById(listingId);
  if (!listing) {
    return next(new AppError("No listing found with that ID", 404));
  }

  if (listing.listedBy.toString() !== userId) {
    return next(
      new AppError("You are not authorized to delete this listing", 403)
    );
  }

  await Listing.findByIdAndDelete(listingId);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  createListing,
  getListing,
  getMyListings,
  deleteListing,
};
