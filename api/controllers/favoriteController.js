const Favorite = require("../modals/favoriteModal");
const Listing = require("../modals/listingModal");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const toggleFavorite = catchAsync(async (req, res, next) => {
  const { listingId } = req.body;
  const userId = req.user.id; // Get from authenticated user instead of request body

  // Verify that the listing exists
  const listing = await Listing.findById(listingId);
  if (!listing) {
    return next(new AppError("No listing found with that ID", 404));
  }

  const existingFavorite = await Favorite.findOne({
    user: userId,
    listing: listingId,
  });

  if (existingFavorite) {
    await Favorite.deleteOne({ _id: existingFavorite._id });
    return res.status(200).json({
      status: "success",
      message: "Favorite removed",
      isFavorite: false,
    });
  }

  const favorite = await Favorite.create({ user: userId, listing: listingId });
  res.status(201).json({
    status: "success",
    message: "Favorite added",
    isFavorite: true,
    data: {
      favorite,
    },
  });
});

const getUserFavorites = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const favorites = await Favorite.find({ user: userId })
    .populate({
      path: "listing",
      select: "-__v",
    })
    .sort("-createdAt");

  // Extract the listings and add isFavorite: true to all
  const favoriteListings = favorites.map((fav) => ({
    ...fav.listing.toObject(),
    isFavorite: true,
  }));

  res.status(200).json({
    status: "success",
    results: favoriteListings.length,
    data: {
      listings: favoriteListings,
    },
  });
});

module.exports = {
  toggleFavorite,
  getUserFavorites,
};
