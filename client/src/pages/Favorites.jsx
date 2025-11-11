import CommonError from "@/components/global/CommonError";
import ListingCard from "@/components/global/ListingCard";
import Header from "@/components/profile/Header";
import useGetItems from "@/hooks/useGetItems";
import { useAuth } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Favorites = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);

  const { data, error, isPending } = useGetItems(
    "/api/v1/favorites",
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
      <section className="md:py-8">
        <Header />

        <div className="mt-18 flex justify-center">
          <Loader className="animate-spin" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="md:py-8">
        <Header />

        <div className="mt-5">
          <CommonError message="Failed to load listings. Please try again later." />
        </div>
      </section>
    );
  }

  if (!data.data.listings || data.data.listings.length === 0) {
    return (
      <section className="md:py-8">
        <Header />

        <div className="mt-14">
          <p className=" text-center">You have no favorites yet.</p>
        </div>
      </section>
    );
  }

  const listings = data.data.listings;

  return (
    <section className="md:py-8">
      <Header />

      <div className="mt-5 max-[450px]:columns-1 columns-2 lg:columns-3 gap-4">
        {listings.map((listing) => (
          <ListingCard key={listing._id} {...listing} />
        ))}
      </div>
    </section>
  );
};
export default Favorites;
