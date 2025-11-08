import CommonError from "@/components/global/CommonError";
import { Button } from "@/components/ui/button";
import useGetItems from "@/hooks/useGetItems";
import { useAuth } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { IoShareSocialOutline } from "react-icons/io5";
import { GoHeart } from "react-icons/go";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { timeAgo } from "@/lib/format";
import { Star } from "lucide-react";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import AddReviewBtn from "@/components/Listings/AddReviewBtn";

const List = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);
  const { slug } = useParams();
  const [showmore, setShowmore] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState({});
  const user = useAuth((state) => state.user);

  const toggleReviewExpansion = (reviewId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const { data, isPending, error } = useGetItems(
    `/api/v1/listings/${slug}`,
    "listings"
  );

  useEffect(() => {
    if (error) {
      if (error.response?.status === 401) {
        queryClient.removeQueries();
        navigate("/login");
        logout();
        toast.warning("You are not authorized to perform this action.");
      } else if (error.response?.status === 403) {
        navigate("/");
      } else if (error.response?.status === 404) {
        navigate("/");
        toast.warning("Listing not found.");
      }
    }
  }, [error, queryClient, navigate, logout]);

  if (isPending) {
    return (
      <section className="pb-14">
        <div className="hidden sm:block h-12 bg-[#222]"></div>
        <div className="container pt-10">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pb-14">
        <div className="hidden sm:block h-12 bg-[#222]"></div>
        <div className="container pt-10">
          <CommonError message="Failed to load listing. Please try again later." />
        </div>
      </section>
    );
  }

  const listing = data.data.listing;

  if (!listing) {
    return <Navigate to="/" replace={true} />;
  }

  const {
    title,
    _id,
    description,
    price,
    priceDiscount,
    reviews,
    ratingsQuantity,
    images,
    location,
    category,
    listingType,
    listedBy,
    tags,
    ratingsAverage,
    createdAt,
  } = listing;

  const otherImages = images.slice(1);
  const hasAddedReview = reviews.some(
    (review) => review.user._id === user?._id
  );
  const createdByMe = listedBy._id === user?._id;

  return (
    <section className="pb-14">
      <div className="hidden sm:block h-12 bg-[#222]"></div>
      <div className="container pt-10">
        <header className="flex items-center justify-between">
          <Badge className="py-1 px-4 rounded-md uppercase bg-foreground text-background">
            {category}
          </Badge>

          <div className="flex items-center gap-4">
            <Button variant="outline">
              <IoShareSocialOutline className="size-5" />
              Share
            </Button>
            <Button variant="outline">
              <GoHeart className="size-5" />
              Save
            </Button>
            {createdByMe && (
              <Button>
                <Link to={`/listings/${slug}/edit-details`}>Edit</Link>
              </Button>
            )}
          </div>
        </header>

        {/* Listing Images */}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <article className="">
            <img
              src={images[0]}
              alt={title}
              className="object-cover w-full h-full rounded-xl md:rounded-none md:rounded-l-xl"
            />
          </article>
          <article className="aspect-w-1 aspect-h-1">
            {otherImages.length === 2 ? (
              <div className="grid grid-cols-2 gap-2 h-full">
                {otherImages.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`${title} - Image ${index + 2}`}
                    className={`object-cover w-full h-full ${
                      index === 1
                        ? "rounded-r-xl"
                        : "rounded-l-xl md:rounded-none"
                    }`}
                  />
                ))}
              </div>
            ) : otherImages.length === 1 ? (
              <img
                src={images[1]}
                alt={title}
                className="object-cover w-60 mx-auto md:w-full rounded-xl md:rounded-none h-full md:rounded-r-xl"
              />
            ) : (
              <img
                src={images[0]}
                alt={title}
                className="object-cover hidden md:block w-full h-full rounded-r-xl saturate-0"
              />
            )}
          </article>
        </div>

        {/* Listing Details */}

        <div className=" md:mt-8  grid grid-cols-1 md:grid-cols-[3fr_1.5fr] gap-5 md:gap-8">
          <article className="">
            <h1 className="mt-4 md:mt-0 text-lg sm:text-xl capitalize font-bold">
              {title}
            </h1>
            <div className="mt-2 flex items-center gap-2">
              {tags &&
                tags.slice(0, 4).map((tag, index) => (
                  <Badge
                    key={index}
                    variant={"outline"}
                    className="py-1 px-3 capitalize rounded-md"
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
            <p className="mt-4 leading-relaxed">
              {showmore || description.length <= 300
                ? description
                : `${description.substring(0, 300)}...`}
              {description.length > 300 && (
                <Button
                  variant="link"
                  onClick={() => setShowmore((prev) => !prev)}
                  className="text-foreground font-bold underline hover:text-accent"
                >
                  {showmore ? "Read less" : "Read more"}
                </Button>
              )}
            </p>

            <div className="mt-6 flex items-center gap-3 pb-5 border-b">
              <Avatar className="size-12">
                <AvatarImage
                  src={listedBy.photo}
                  alt={listedBy.name}
                  className="w-full h-full object-cover"
                />
                <AvatarFallback className="font-bold text-lg">
                  {listedBy.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">
                  Listed by {listedBy.name.split(" ")[0]}
                </p>
                <p className="text-xs font-medium text-muted-foreground">
                  Created {timeAgo(createdAt)}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <span className="flex text-accent ">
                <Star className="size-8" />
                <Star />
                <Star className="size-4" />
              </span>
              <Badge className="rounded-md bg-[#333] ">
                {ratingsAverage ? ratingsAverage.toFixed(1) : "No ratings yet"}
              </Badge>
              {ratingsAverage && (
                <span className="text-sm font-medium text-muted-foreground">
                  ({ratingsQuantity} review
                  {ratingsQuantity > 1 ? "s" : ""})
                </span>
              )}
            </div>
          </article>
          <aside>
            <Card className="mt-2 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)]">
              <CardHeader>
                <p className="text-2xl font-extrabold">
                  ${priceDiscount.toLocaleString()} - ${price.toLocaleString()}
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  <span className="text-foreground font-semibold">
                    Located In:{" "}
                  </span>
                  {location}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      <span className="text-foreground font-semibold">
                        Type:{" "}
                      </span>
                      For {listingType}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  disabled={createdByMe}
                  className="w-full uppercase disabled:cursor-not-allowed"
                >
                  Contact Owner
                </Button>
              </CardFooter>
            </Card>
          </aside>
        </div>
        {/* Reviews Section */}

        <div className="mt-6">
          {!hasAddedReview && user && <AddReviewBtn listingId={_id} />}
          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-center mt-6">
              No reviews yet. Be the first one to add a review!
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {reviews.map((review) => (
                <Card key={review._id} className="gap-1 py-3 bg-background">
                  <CardHeader className="px-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-11">
                        <AvatarImage
                          src={review.user?.photo}
                          alt={review.user?.name || "Anonymous"}
                          className="w-full h-full object-cover"
                        />
                        <AvatarFallback className="font-bold text-lg">
                          {review.user?.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm mb-0.5">
                          {review.user?.name || "Anonymous"}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, index) =>
                              index < review.rating ? (
                                <FaStar key={index} className="text-accent" />
                              ) : (
                                <FaRegStar
                                  key={index}
                                  className="text-accent"
                                />
                              )
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="size-1 inline-block bg-accent-foreground"></span>
                            <span className="hidden sm:block text-xs font-medium text-muted-foreground">
                              {timeAgo(review.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-3.5">
                    <p className="text-sm font-medium">
                      {expandedReviews[review._id] ||
                      review.review.length <= 100
                        ? review.review
                        : `${review.review.slice(0, 100)}...`}
                      {review.review.length > 100 && (
                        <Button
                          variant="link"
                          onClick={() => toggleReviewExpansion(review._id)}
                          className="text-primary font-bold underline hover:opacity-80"
                        >
                          {expandedReviews[review._id]
                            ? "View Less"
                            : "View More"}
                        </Button>
                      )}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
export default List;
