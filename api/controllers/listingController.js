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
  const excludedFields = ["page", "sort", "limit", "fields", "search"];
  excludedFields.forEach((el) => delete queryObj[el]);

  // 1.b) == Advanced Filtering ==

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let query = Listing.find(JSON.parse(queryStr));

  // 1.c) == Text Search ==

  if (req.query.search) {
    const searchTerm = req.query.search;

    // Use MongoDB text search for better performance
    query = query.find({
      $text: { $search: searchTerm },
    });

    // Add text search score for relevance sorting
    query = query.select({ score: { $meta: "textScore" } });
  }

  // 2) == Sorting ==

  if (req.query.search) {
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
  res.status(200).json({
    status: "success",
    results: listings.length,
    data: {
      listings,
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
  updateListing,
  getAllListings,
};
