import CommonError from "@/components/global/CommonError";
import ListingCard from "@/components/global/ListingCard";
import Filter from "@/components/Listings/Filter";
import useGetItems from "@/hooks/useGetItems";
import { useAuth } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Listings = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);

  const { data, error, isPending } = useGetItems(
    "/api/v1/listings/",
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
      <section className="pb-14">
        <div className="hidden sm:block h-12 bg-[#222]"></div>
        <div className="container pt-6 flex items-start">
          <aside className="w-70 sticky top-0 bg-gray-100 p-4">
            Filter Loader...
          </aside>
          <div className="flex-1 p-4">Loading ...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pb-14">
        <div className="hidden sm:block h-12 bg-[#222]"></div>
        <div className="container pt-10">
          <CommonError message="Failed to load listings. Please try again later." />
        </div>
      </section>
    );
  }

  if (!data.data.listings || data.data.listings.length === 0) {
    return (
      <section className="pb-14">
        <div className="hidden sm:block h-12 bg-[#222]"></div>

        <div className="container pt-6 flex items-start">
          <Filter />
          <div className="flex-1 p-4">
            <p className="mt-8 text-center">No listings found.</p>
          </div>
        </div>
      </section>
    );
  }

  const listings = data.data.listings;

  return (
    <section className="pb-14">
      <div className="hidden sm:block h-12 bg-[#222]"></div>
      <div className="container pt-6 md:flex items-start">
        <Filter />
        <div className="flex-1 md:p-4">
          {listings.length !== 0 && (
            <h4 className="font-semibold pb-4 uppercase text-sm border-b-neutral-200 border-b">
              Results: <span>{listings.length}</span>
            </h4>
          )}
          <div className="mt-5 max-[450px]:columns-1 columns-2 lg:columns-3 gap-4">
            {listings.map((listing) => (
              <ListingCard key={listing._id} {...listing} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Listings;
