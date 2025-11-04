const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Review = require("../modals/reviewModal");

const createReview = catchAsync(async (req, res, next) => {
  const { listingId, rating, review } = req.body;
  const userId = req.user.id;

  if (!listingId || !rating || !review) {
    return next(new AppError("All fields are required", 400));
  }

  const newReview = await Review.create({
    listing: listingId,
    user: userId,
    rating,
    review,
  });

  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});

module.exports = {
  createReview,
};
