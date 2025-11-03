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
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import Tags from "@/components/global/Tags";
import ImageUploadField from "./ImageUploadField";

const listingSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(100, "Title must be at most 100 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(500, "Description must be at most 500 characters"),
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

const AddListing = () => {
  const [count, setCount] = useState(0);
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(listingSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <section className="pb-14">
      <div className="hidden sm:block h-12 bg-[#222]"></div>
      <div className="container pt-10">
        <h1 className="uppercase font-bold mb-8">Create a Listing</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-col-1 md:grid-cols-2 gap-5 gap-x-10"
        >
          <article>
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
                  onChange={(e) => setCount(e.target.value.length)}
                  rows={4}
                  className="resize-none py-5"
                  placeholder="Enter property description"
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="text-muted-foreground text-xs">
                    {500 - count} characters left
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
                placeholder="Price"
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
            {/* Discounte Price Field */}
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
            <div className="mb-2.5">
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
          </article>
          <article>
            {/* Tags */}
            <Tags tags={tags} setTags={setTags} />
            {/* Images Field */}

            <ImageUploadField images={images} setImages={setImages} />
            <Button type="submit" className="uppercase w-44">
              Submit
            </Button>
          </article>
        </form>
      </div>
    </section>
  );
};
export default AddListing;
