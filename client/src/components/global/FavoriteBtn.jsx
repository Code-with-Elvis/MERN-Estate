import { GoHeart } from "react-icons/go";
import { Button } from "../ui/button";

const FavoriteBtn = ({ listingId }) => {
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="absolute  w-8 bg-transparent hover:bg-gray-100/50  top-2 right-2"
    >
      <GoHeart className="size-5 drop-shadow-[0_0_1px_#fff] " />
    </Button>
  );
};
export default FavoriteBtn;
