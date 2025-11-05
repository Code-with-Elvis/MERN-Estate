import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Rating from "./Rating";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/input-group";
import { toast } from "sonner";
import usePostItem from "@/hooks/usePostItem";
import { Loader2 } from "lucide-react";

const AddReviewBtn = ({ listingId }) => {
  const [rating, setRating] = useState(0);
  const [count, setCount] = useState(0);
  const [review, setReview] = useState("");
  const [open, setOpen] = useState(false);

  const { postItem, isPending } = usePostItem(
    "/api/v1/reviews",
    ["reviews", "listings"],
    "Review posted successfully!"
  );

  const handleSubmit = () => {
    if (rating === 0) {
      toast.warning("Please select a rating.");
      return;
    }
    if (review.trim() === "") {
      toast.warning("Please enter a review.");
      return;
    }
    if (review.trim().length < 100) {
      toast.warning("Review must be at least 100 characters long.");
      return;
    }

    // === Submit the review ===
    postItem(
      { rating, review, listingId },
      {
        onSuccess: () => {
          setOpen(false);
          // == Reset form fields
          setRating(0);
          setReview("");
          setCount(0);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-2" disabled={isPending}>
          Add a Review
        </Button>
      </DialogTrigger>
      <DialogContent className=" sm:max-w-140">
        <DialogHeader>
          <DialogTitle className="uppercase font-semibold">
            Add a Review
          </DialogTitle>
          <DialogDescription>
            Share your thoughts about this property. Your feedback is valuable!
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Rating rating={rating} setRating={setRating} />
          <div className="mt-2.5">
            <InputGroup className="">
              <InputGroupTextarea
                onChange={(e) => {
                  setCount(e.target.value.trim().length);
                  setReview(e.target.value);
                }}
                rows={4}
                minlength={100}
                maxlength={600}
                value={review}
                className="resize-none py-5"
                placeholder="Enter property description"
              />
              <InputGroupAddon align="block-end">
                <InputGroupText className="font-medium text-xs text-[#222]">
                  {600 - count} characters left
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 /> Posting...
              </>
            ) : (
              "Post Review"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddReviewBtn;
