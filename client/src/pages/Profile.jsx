import CommonError from "@/components/global/CommonError";
import DeleteBtn from "@/components/Listings/DeleteBtn";
import Header from "@/components/profile/Header";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import useGetItems from "@/hooks/useGetItems";
import { useAuth } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { Loader, Star } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);

  const { data, error, isPending } = useGetItems(
    "/api/v1/listings/me",
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

        <div className="mt-18 flex items-center">
          <Loader className="animate-spin" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <CommonError message="Failed to load listings. Please try again later." />
    );
  }

  if (!data.data || data.data.length === 0) {
    return (
      <section className="md:py-8">
        <Header />

        <div className="mt-5">
          <p className="mt-8">You have no listings yet.</p>
        </div>
      </section>
    );
  }

  console.log(data.data);
  const listings = data.data.listings;

  return (
    <section className="pb-20 md:py-8">
      <Header />

      <div className="mt-5 max-[450px]:columns-1 columns-2 lg:columns-3 gap-4">
        {listings.map((listing) => (
          <Link
            key={listing._id}
            to={`/listings/${listing.slug}`}
            className="block break-inside-avoid mb-4"
          >
            <Card className="p-0 gap-0 bg-transparent border-0">
              <CardHeader className="p-0 overflow-hidden relative">
                <div className="bg-background min-h-20 rounded-xl overflow-hidden">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full"
                  />
                  <DeleteBtn />
                </div>
              </CardHeader>
              <CardContent className="px-2.5 py-2 pt-0">
                <h3 className="font-medium">{listing.title}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    ${listing.price.toLocaleString()}
                  </p>
                  <div className="flex gap-1 items-center">
                    <div className="flex items-center gap-1">
                      <span className="inline-block size-1 bg-muted-foreground"></span>{" "}
                      <Star className="size-3.5" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {listing.ratingsAverage
                        ? listing.ratingsAverage.toFixed(1)
                        : "No ratings"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};
export default Profile;
