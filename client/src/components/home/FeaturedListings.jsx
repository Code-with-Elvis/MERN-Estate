import useGetItems from "@/hooks/useGetItems";
import { useAuth } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ListingCard from "./ListingCard";
import CommonError from "../global/CommonError";

const FeaturedListings = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);

  const { data, error, isPending } = useGetItems(
    "/api/v1/listings?sort=createdAt&limit=4",
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
      }
    }
  }, [error, queryClient, navigate, logout]);

  if (isPending) {
    return (
      <section className="pb-12">
        <div className="container">
          <h2 className="font-extrabold uppercase text-sm mb-4">
            Featured Listings
          </h2>
          <div className="mt-10">Loading ...</div>
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="pb-12">
        <div className="container">
          <h2 className="font-extrabold uppercase text-sm mb-4">
            Featured Listings
          </h2>
          <div className=" pt-10">
            <CommonError message="Failed to load listings. Please try again later." />
          </div>
        </div>
      </section>
    );
  }

  const listings = data.data.listings;

  return (
    <section className="pb-12">
      <div className="container">
        <h2 className="font-extrabold uppercase text-sm mb-4">
          Featured Listings
        </h2>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {listings.map((listing) => (
            <ListingCard key={listing._id} {...listing} />
          ))}
        </div>
      </div>
    </section>
  );
};
export default FeaturedListings;
