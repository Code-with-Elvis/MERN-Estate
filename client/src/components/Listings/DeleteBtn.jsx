import { MdDeleteOutline } from "react-icons/md";
import { Button } from "../ui/button";
import useDeleteItem from "@/hooks/useDeleteItem";
import { Spinner } from "../ui/spinner";
import { cleanupOldImages } from "@/lib/utils";

const DeleteBtn = ({ listingId, images }) => {
  const { deleteItem, isPending } = useDeleteItem(
    `/api/v1/listings/${listingId}`,
    "listings",
    "Listing deleted successfully"
  );
  const handleDelete = (e) => {
    // === Prevent the Link navigation ===

    e.preventDefault();
    e.stopPropagation();

    // === Show confirmation dialog ===

    if (confirm("Are you sure you want to delete this listing?")) {
      // === Proceed to delete the listing ===

      deleteItem(
        { id: listingId },
        {
          onSuccess: () => {
            // === Cleanup old images from firebase ===

            images.forEach((image) => {
              if (
                image &&
                !image.includes("flaticon.com") &&
                image.includes("firebasestorage.googleapis.com")
              ) {
                cleanupOldImages([image]);
              }
            });
          },
        }
      );
    }
  };
  return (
    <Button
      variant={"destructive"}
      size={"sm"}
      onClick={handleDelete}
      disabled={isPending}
      className="absolute w-8  top-2 right-2"
    >
      {isPending ? (
        <Spinner className=" size-5 " />
      ) : (
        <MdDeleteOutline className="size-5 drop-shadow-[0_0_1px_#000]" />
      )}
    </Button>
  );
};
export default DeleteBtn;
