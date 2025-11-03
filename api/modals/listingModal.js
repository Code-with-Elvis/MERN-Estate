const mongoose = require("mongoose");
const slugify = require("slugify");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [10, "Title must be at least 10 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
      unique: [true, "Listing with this title already exists"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [20, "Description must be at least 20 characters long"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: "Discounted price must be less than the original price",
      },
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      minlength: [5, "Location must be at least 5 characters long"],
    },
    images: [{ type: String, required: [true, "Images are required"] }],
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "apartment",
        "house",
        "villa",
        "land",
        "commercial",
        "studio",
        "duplex",
        "farm",
      ],
    },
    listingType: {
      type: String,
      enum: ["sale", "rent"],
      required: [true, "Listing type is required"],
    },
    listedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Listing must be associated with a user"],
    },
    tags: [String],
    ratingsAverage: {
      type: Number,
      default: 0,
      min: 1,
      max: 5,
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// === Create Slug ===

listingSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
