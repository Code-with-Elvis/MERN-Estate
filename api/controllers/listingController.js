const Listing = require("../modals/listingModal");
const Favorite = require("../modals/favoriteModal");
const Review = require("../modals/reviewModal");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// === Helper function to add isFavorite field to listings ===
const addFavoriteStatus = async (listings, userId) => {
  if (!userId) {
    return listings.map((listing) => ({
      ...listing.toObject(),
      isFavorite: false,
    }));
  }

  const listingIds = listings.map((listing) => listing._id);
  const favorites = await Favorite.find({
    user: userId,
    listing: { $in: listingIds },
  }).select("listing");

  const favoriteListingIds = new Set(
    favorites.map((fav) => fav.listing.toString())
  );

  return listings.map((listing) => {
    const listingIdStr = listing._id.toString();
    const isFav = favoriteListingIds.has(listingIdStr);

    return {
      ...listing.toObject(),
      isFavorite: isFav,
    };
  });
};

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

const updateListing = catchAsync(async (req, res, next) => {
  const listingSlug = req.params.slug;
  const userId = req.user.id;

  const listing = await Listing.findOne({ slug: listingSlug });
  if (!listing) {
    return next(new AppError("No listing found with that slug", 404));
  }

  if (listing.listedBy.toString() !== userId) {
    return next(
      new AppError("You are not authorized to update this listing", 403)
    );
  }

  // === Manual validation for priceDiscount ===

  if (req.body.priceDiscount) {
    const price = req.body.price || listing.price;
    if (req.body.priceDiscount >= price) {
      return next(
        new AppError(
          "Discounted price must be less than the original price",
          400
        )
      );
    }
  }

  // === Update the listing document directly to avoid validation issues with findByIdAndUpdate ===

  Object.assign(listing, req.body);

  const updatedListing = await listing.save();

  res.status(200).json({
    status: "success",
    data: {
      listing: updatedListing,
    },
  });
});

const getAllListings = catchAsync(async (req, res, next) => {
  // 1.a) == Filtering ==

  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields", "search", "q"];
  excludedFields.forEach((el) => delete queryObj[el]);

  // 1.b) == Advanced Filtering ==

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  // Parse the query object
  let parsedQuery = JSON.parse(queryStr);

  // Convert string values to numbers for numeric fields with comparison operators
  const processedQuery = {};

  Object.keys(parsedQuery).forEach((key) => {
    // Check if this is a numeric field with comparison operator (e.g., "price[$gte]")
    const numericFieldPattern =
      /^(price|priceDiscount|ratingsAverage|ratingsQuantity)\[\$\w+\]$/;

    if (numericFieldPattern.test(key)) {
      // Extract field name and operator (e.g., "price" and "$gte" from "price[$gte]")
      const matches = key.match(/^(\w+)\[\$(\w+)\]$/);
      if (matches) {
        const fieldName = matches[1];
        const operator = `$${matches[2]}`;

        // Initialize nested object if it doesn't exist
        if (!processedQuery[fieldName]) {
          processedQuery[fieldName] = {};
        }

        // Convert string to number if it's a valid number
        const value = parsedQuery[key];
        processedQuery[fieldName][operator] = !isNaN(value)
          ? Number(value)
          : value;
      }
    } else {
      // For non-numeric comparison fields, keep as is but convert simple numeric values
      const value = parsedQuery[key];
      processedQuery[key] =
        !isNaN(value) && typeof value === "string" ? Number(value) : value;
    }
  });

  // 1.c) == Text Search ==
  if (req.query.q) {
    const searchTerm = req.query.q;
    // Combine filters with text search
    processedQuery.$text = { $search: searchTerm };
  }

  let query = Listing.find(processedQuery);

  // Add text search score for relevance sorting if searching
  if (req.query.q) {
    query = query.select({ score: { $meta: "textScore" } });
  }

  // 2) == Sorting ==

  if (req.query.q) {
    // Sort by text search relevance score when searching
    query = query.sort({ score: { $meta: "textScore" } });
  } else if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // 3) == Field Limiting ==

  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }

  // 4) == Pagination ==

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  const listings = await query;

  // Add favorite status for authenticated users
  const userId = req.user?.id; // Optional chaining for when user might not be authenticated
  const listingsWithFavorites = await addFavoriteStatus(listings, userId);

  res.status(200).json({
    status: "success",
    results: listings.length,
    data: {
      listings: listingsWithFavorites,
    },
  });
});

const getRecentListings = catchAsync(async (req, res, next) => {
  // === Fetch only 4 ===
  const listings = await Listing.find().sort("-createdAt").limit(4);

  // Add favorite status for authenticated users
  const userId = req.user?.id;
  const listingsWithFavorites = await addFavoriteStatus(listings, userId);

  res.status(200).json({
    status: "success",
    results: listings.length,
    data: {
      listings: listingsWithFavorites,
    },
  });
});

const getMyListings = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const listings = await Listing.find({ listedBy: userId });

  // Add favorite status (user's own listings can also be favorited)
  const listingsWithFavorites = await addFavoriteStatus(listings, userId);

  res.status(200).json({
    status: "success",
    results: listings.length,
    data: {
      listings: listingsWithFavorites,
    },
  });
});

const getListing = catchAsync(async (req, res, next) => {
  const listingSlug = req.params.slug;
  const listing = await Listing.findOne({ slug: listingSlug })
    .populate("listedBy", "name email photo")
    .populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "name photo",
      },
    });
  if (!listing) {
    return next(new AppError("No listing found with that slug", 404));
  }

  // Add favorite status for authenticated users
  const userId = req.user?.id;
  const listingsWithFavorites = await addFavoriteStatus([listing], userId);

  res.status(200).json({
    status: "success",
    data: {
      listing: listingsWithFavorites[0],
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

  // === Delete all favorites for this listing ===
  await Favorite.deleteMany({ listing: listingId });

  // === Delete all reviews for this listing ===
  await Review.deleteMany({ listing: listingId });

  // === Delete the listing ===
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
  updateListing,
  getAllListings,
  getRecentListings,
};
