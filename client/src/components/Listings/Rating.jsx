import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const Rating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);

  // Emoji mapping based on rating value
  const getEmoji = (ratingValue) => {
    switch (ratingValue) {
      case 1:
        return "😞";
      case 2:
        return "😕";
      case 3:
        return "😐";
      case 4:
        return "😊";
      case 5:
        return "😍";
      default:
        return "🤔";
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gray-100 rounded-lg shadow-md">
      {/* Star Rating */}
      <div className="flex">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1; // Fixed: Should be index + 1 for 1-5 rating

          return (
            <label key={index} className="cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => setRating(ratingValue)}
                className="hidden"
              />
              <FaStar
                className={`text-3xl transition-colors duration-200 ${
                  ratingValue <= (hover || rating) // Fixed: Removed extra space and added hover state
                    ? "text-accent"
                    : "text-gray-300"
                }`}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
              />
            </label>
          );
        })}
      </div>

      {/* Rating Feedback */}
      <div className="flex flex-col items-center">
        <span className="text-4xl animate-bounce">
          {getEmoji(hover || rating)} {/* Show emoji for hover state too */}
        </span>
        <p className="mt-2 text-gray-600 font-medium">
          {hover > 0 && hover !== rating ? (
            <span className="text-gray-500">
              {`Hover: ${hover} star${hover !== 1 ? "s" : ""}`}
            </span>
          ) : rating > 0 ? (
            `You rated: ${rating} star${rating !== 1 ? "s" : ""}`
          ) : (
            "Please select a rating"
          )}
        </p>
      </div>
    </div>
  );
};

export default Rating;
