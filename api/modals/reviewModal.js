const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review text is required"],
      minlength: [5, "Review must be at least 5 characters long"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Rating is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: [true, "Review must belong to a listing"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewSchema.index(
  {
    listing: 1,
    user: 1,
  },
  { unique: true }
);

// Static method to calculate average ratings
reviewSchema.statics.calcAverageRatings = async function (listingId) {
  const stats = await this.aggregate([
    { $match: { listing: listingId } },
    {
      $group: {
        _id: "$listing",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model("Listing").findByIdAndUpdate(listingId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await mongoose.model("Listing").findByIdAndUpdate(listingId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

// Middleware to update ratings after saving a review
reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.listing);
});

// Middleware for updates and deletes
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  if (this.r) {
    await this.r.constructor.calcAverageRatings(this.r.listing);
  }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
