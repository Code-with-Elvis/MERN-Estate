import SearchForm from "./SearchForm";
import PriceRange from "./PriceRange";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const filterSchema = z.object({
  category: z.enum(["house", "villa", "studio", "duplex", "farm", "land"]),
  listingType: z.enum(["sale", "rent"]),
  sortBy: z.enum(["priceAsc", "priceDesc", "newest", "oldest"]),
});

const defaultValues = {
  category: "house",
  listingType: "sale",
  sortBy: "newest",
};

const Filter = () => {
  const [value, setValue] = useState([50000, 5000000]); // Default to $50K - $5M
  const location = useLocation();
  const navigate = useNavigate();

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(filterSchema),
    defaultValues,
  });

  // === Convert MongoDB sort format back to user-friendly format ===
  const convertFromMongoSort = (mongoSort) => {
    const reverseMap = {
      price: "priceAsc",
      "-price": "priceDesc",
      "-createdAt": "newest",
      createdAt: "oldest",
    };
    return reverseMap[mongoSort] || "newest";
  };

  // === Populate form from URL on mount / when URL changes ===

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const q = params.get("q") || "";
    const category = params.get("category") || "house";
    const listingType = params.get("listingType") || "sale";
    const mongoSort = params.get("sort") || "-createdAt";
    const sortBy = convertFromMongoSort(mongoSort);

    // == price[gte] and price[lte] as numbers if present
    const priceGte = params.get("price[gte]");
    const priceLte = params.get("price[lte]");

    const min = priceGte ? Number(priceGte) : 50000; // Default to $50K
    const max = priceLte ? Number(priceLte) : 5000000; // Default to $5M

    setValue([min, max]);

    reset({ q, category, listingType, sortBy });
  }, [location.search, reset]);

  // === Convert user-friendly sort options to MongoDB format ===
  const convertToMongoSort = (sortOption) => {
    const sortMap = {
      priceAsc: "price",
      priceDesc: "-price",
      newest: "-createdAt",
      oldest: "createdAt",
    };
    return sortMap[sortOption] || "-createdAt";
  };

  const onSubmit = (data) => {
    const params = new URLSearchParams();

    // == Category & Listing Type

    if (data.category) params.set("category", data.category);
    if (data.listingType) params.set("listingType", data.listingType);

    // == Sort By - Convert to MongoDB format

    if (data.sortBy) params.set("sort", convertToMongoSort(data.sortBy));

    // == Price Range

    const [min, max] = value;
    if (min !== undefined && min !== 0)
      params.set("price[gte]", Math.floor(min));
    if (max !== undefined && max !== 0)
      params.set("price[lte]", Math.floor(max));

    // == Navigate to listings with constructed params

    navigate(`/listings?${params.toString()}`);
  };

  const handleReset = () => {
    reset(defaultValues);
    setValue([50000, 5000000]); // Reset to $50K - $5M
    navigate(`/listings`);
  };

  return (
    <aside className="md:w-70 mb-4 rounded-xl md:rounded-none md:mb-0 md:sticky shrink-0 top-0 bg-gray-100 p-4">
      <SearchForm />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Category Field */}
        <div className="mb-3">
          <h4 className="mb-2 text-xs ml-1 font-semibold uppercase ">
            Category:
          </h4>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="grid grid-cols-2  gap-2"
              >
                {["house", "villa", "studio", "duplex", "farm", "land"].map(
                  (cat) => (
                    <Label
                      key={cat}
                      className="flex cursor-pointer text-muted-foreground hover:text-muted-foreground items-center space-x-2 border rounded-md px-3 py-2"
                    >
                      <RadioGroupItem value={cat} id={cat} />
                      <span className="capitalize ">{cat}</span>
                    </Label>
                  )
                )}
              </RadioGroup>
            )}
          />
        </div>

        {/* Listing Type Field */}
        <div className="mb-2.5">
          <h4 className="mb-2 ml-1 text-xs uppercase font-semibold">
            Listing Type:
          </h4>
          <Controller
            control={control}
            name="listingType"
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="grid grid-cols-2  gap-2"
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
        </div>
        {/* Sort Select */}
        <div className="mb-4">
          <Label
            htmlFor="sortBy"
            className="mb-2 ml-1 text-xs uppercase font-semibold"
          >
            Sort By:
          </Label>
          <Controller
            control={control}
            name="sortBy"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value ?? defaultValues.sortBy}
                key={field.value}
                id="sortBy"
              >
                <SelectTrigger className="w-full border-border">
                  <SelectValue placeholder="Select sorting option">
                    {field.value
                      ? field.value === "priceAsc"
                        ? "Price (Low to High)"
                        : field.value === "priceDesc"
                        ? "Price (High to Low)"
                        : field.value === "newest"
                        ? "Newest"
                        : "Oldest"
                      : "Select sorting option"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sort By</SelectLabel>
                    {["newest", "oldest", "priceAsc", "priceDesc"].map(
                      (option) => (
                        <SelectItem
                          key={option}
                          value={option}
                          className="capitalize"
                        >
                          {option}
                        </SelectItem>
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {/* Price Range */}
        <PriceRange value={value} setValue={setValue} />
        {/* Reset & Submit Buttons*/}
        <div className="mt-6 flex items-center gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={handleReset}
            className="flex-1"
          >
            Reset
          </Button>
          <Button className="flex-1">Submit</Button>
        </div>
      </form>
    </aside>
  );
};
export default Filter;
