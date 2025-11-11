import { GoHeart, GoHeartFill } from "react-icons/go";
import { Button } from "../ui/button";
import usePostItem from "@/hooks/usePostItem";
import { Spinner } from "../ui/spinner";

const FavoriteBtn = ({ listingId, isFavorite }) => {
  const message = isFavorite
    ? "Successfully removed from favorites"
    : "Successfully added to favorites";

  const { postItem, isPending } = usePostItem(
    "/api/v1/favorites",
    "listings",
    message
  );

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!listingId) {
      console.error("No listing ID provided to FavoriteBtn");
      return;
    }

    postItem({ listingId });
  };

  return (
    <Button variant="outline" onClick={handleFavorite} disabled={isPending}>
      {isPending ? (
        <Spinner className="size-5" />
      ) : isFavorite ? (
        <GoHeartFill className="size-5 text-primary" />
      ) : (
        <GoHeart className="size-5" />
      )}
      {isPending ? "Saving..." : isFavorite ? "Saved" : "Save"}
    </Button>
  );
};
export default FavoriteBtn;
