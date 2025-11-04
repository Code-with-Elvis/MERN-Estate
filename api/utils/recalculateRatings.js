const Review = require("../modals/reviewModal");

const recalculateAllRatings = async () => {
  try {
    // Get all unique listing IDs that have reviews
    const listingIds = await Review.distinct("listing");

    console.log(`Found ${listingIds.length} listings with reviews`);

    // Recalculate ratings for each listing
    for (const listingId of listingIds) {
      await Review.calcAverageRatings(listingId);
      console.log(`Updated ratings for listing: ${listingId}`);
    }

    console.log("All ratings recalculated successfully!");
  } catch (error) {
    console.error("Error recalculating ratings:", error);
  }
};

module.exports = recalculateAllRatings;
