import EditHeader from "@/components/Listings/EditHeader";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import Tags from "@/components/global/Tags";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/store";
import CommonError from "@/components/global/CommonError";
import useGetItems from "@/hooks/useGetItems";
import useUpdateItem from "@/hooks/useUpdateItem";

const listingSchema = z.object({
  title: z
    .string()
    .trim()
    .min(10, "Title must be at least 10 characters")
    .max(100, "Title must be at most 100 characters"),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be at most 1000 characters"),
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Price must be a positive number")
  ),
  priceDiscount: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().min(0).optional()
  ),
  location: z.string().min(5, "Location must be at least 5 characters"),
  category: z.enum([
    "house",
    "apartment",
    "villa",
    "studio",
    "duplex",
    "farm",
    "land",
    "commercial",
  ]),
  listingType: z.enum(["sale", "rent"]),
});

const EditDetails = () => {
  const [count, setCount] = useState(0);
  const [tags, setTags] = useState([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);
  const { slug } = useParams();
  const user = useAuth((state) => state.user);

  const { data, isPending, error } = useGetItems(
    `/api/v1/listings/${slug}`,
    "listings"
  );
  const { updateItem, isPending: isLoading } = useUpdateItem(
    `/api/v1/listings/${slug}`,
    "listings",
    "Listing details updated successfully!"
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(listingSchema),
  });

  useEffect(() => {
    if (data) {
      const listing = data?.data?.listing;
      reset({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        priceDiscount: listing?.priceDiscount || "",
        location: listing.location,
        category: listing.category,
        listingType: listing.listingType,
      });
      setTags(listing.tags || []);
      setCount(listing.description.length || 0);
    }
  }, [data, reset]);

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
      <section className="pb-20">
        <div className="hidden sm:block h-12 bg-[#222]"></div>
        <div className="container pt-5">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pb-20">
        <div className="hidden sm:block h-12 bg-[#222]"></div>
        <div className="container pt-10">
          <CommonError message="Failed to load listing. Please try again later." />
        </div>
      </section>
    );
  }

  const onSubmit = async (data) => {
    if (!data.price) {
      toast.warning("Please provide a price.");
      return;
    }
    if (data.priceDiscount && data.priceDiscount >= data.price) {
      toast.warning("Discounted price must be less than the regular price.");
      return;
    }

    updateItem(
      { ...data, tags },
      {
        onSuccess: () => {
          navigate(`/profile/${user._id}`);
        },
      }
    );
  };

  return (
    <section className="pb-20">
      <div className="hidden sm:block h-12 bg-[#222]"></div>
      <div className="container pt-5">
        <EditHeader />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-2xl mx-auto mt-10"
        >
          {/* Title Field */}
          <div className="mb-2.5">
            <Input
              {...register("title")}
              placeholder="Title"
              className={` py-5 ${
                errors.title ? "border-red-400" : "border-neutral-300"
              }`}
            />
            {errors.title && (
              <p className="text-xs font-medium ml-1 mt-1 text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>
          {/* Description Field */}
          <div className="mb-2.5">
            <InputGroup
              className={` ${
                errors.description ? "border-red-400" : "border-neutral-300"
              }`}
            >
              <InputGroupTextarea
                {...register("description")}
                onChange={(e) => setCount(e.target.value.trim().length)}
                rows={4}
                className="resize-none py-5"
                placeholder="Enter property description"
              />
              <InputGroupAddon align="block-end">
                <InputGroupText className="font-semibold text-xs text-[#222]">
                  {1000 - count} characters left
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            {errors.description && (
              <p className="text-xs font-medium ml-1 mt-1 text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
          {/* Price Field */}
          <div className="mb-2.5">
            <Input
              {...register("price")}
              placeholder="Price (USD)"
              type="number"
              min="0"
              className={` py-5 ${
                errors.price ? "border-red-400" : "border-neutral-300"
              }`}
            />
            {errors.price && (
              <p className="text-xs font-medium ml-1 mt-1 text-red-500">
                {errors.price.message}
              </p>
            )}
          </div>
          {/* Discounted Price Field */}
          <div className="mb-2.5">
            <Input
              {...register("priceDiscount")}
              placeholder="Discounted Price (Optional)"
              type="number"
              min="0"
              className={` py-5 ${
                errors.priceDiscount ? "border-red-400" : "border-neutral-300"
              }`}
            />
            {errors.priceDiscount && (
              <p className="text-xs font-medium ml-1 mt-1 text-red-500">
                {errors.priceDiscount.message}
              </p>
            )}
          </div>
          {/* Location Field */}
          <div className="mb-2.5">
            <Input
              {...register("location")}
              placeholder="Location"
              className={` py-5 ${
                errors.location ? "border-red-400" : "border-neutral-300"
              }`}
            />
            {errors.location && (
              <p className="text-xs font-medium ml-1 mt-1 text-red-500">
                {errors.location.message}
              </p>
            )}
          </div>
          {/* Category Field */}
          <div className="mb-3">
            <h4 className="mb-2 text-sm ml-1 font-semibold ">Category:</h4>
            <Controller
              control={control}
              name="category"
              defaultValue="house"
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-2 lg:grid-cols-3 gap-2"
                >
                  {[
                    "house",
                    "apartment",
                    "villa",
                    "studio",
                    "duplex",
                    "farm",
                    "land",
                    "commercial",
                  ].map((cat) => (
                    <Label
                      key={cat}
                      className="flex cursor-pointer text-muted-foreground hover:text-muted-foreground items-center space-x-2 border rounded-md px-3 py-2"
                    >
                      <RadioGroupItem value={cat} id={cat} />
                      <span className="capitalize ">{cat}</span>
                    </Label>
                  ))}
                </RadioGroup>
              )}
            />

            {errors.category && (
              <p className="text-xs font-medium ml-1 mt-1 text-red-500">
                {errors.category.message}
              </p>
            )}
          </div>
          {/* Listing Type Field */}
          <div className="mb-4">
            <h4 className="mb-2 ml-1 text-sm font-semibold">Listing Type:</h4>
            <Controller
              control={control}
              name="listingType"
              defaultValue="sale"
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-2"
                >
                  <Label className="flex cursor-pointer text-muted-foreground hover:text-muted-foreground items-center space-x-2 border rounded-md px-3 py-2">
                    <RadioGroupItem value="sale" id="sale" />
                    <span className="capitalize ">For Sale</span>
                  </Label>
                  <Label className="flex cursor-pointer text-muted-foreground hover:text-muted-foreground items-center space-x-2 border rounded-md px-3 py-2">
                    <RadioGroupItem value="rent" id="rent" />
                    <span className="capitalize ">For Rent</span>
                  </Label>
                </RadioGroup>
              )}
            />
            {errors.listingType && (
              <p className="text-xs font-medium ml-1 mt-1 text-red-500">
                {errors.listingType.message}
              </p>
            )}
          </div>

          {/* Tags */}
          <Tags tags={tags} setTags={setTags} />

          {/* Submit Button */}
          <div className="flex mt-10 justify-center">
            <Button
              disabled={isLoading}
              type="submit"
              className="uppercase w-48"
            >
              {isLoading ? (
                <>
                  <Spinner /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
export default EditDetails;
