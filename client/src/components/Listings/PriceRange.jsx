import { Field, FieldDescription, FieldTitle } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { formatPrice } from "@/lib/format";
import { useMemo } from "react";

function FieldSlider({ setValue, value }) {
  // === Convert price to logarithmic scale for better UX
  const priceToScale = (price) => {
    const minPrice = 10;
    const maxPrice = 500000000;
    return (Math.log(price / minPrice) / Math.log(maxPrice / minPrice)) * 100;
  };

  // === Convert scale back to price
  const scaleToPrice = (scale) => {
    const minPrice = 10;
    const maxPrice = 500000000;
    return Math.round(minPrice * Math.pow(maxPrice / minPrice, scale / 100));
  };

  // === Convert current price values to scale values for the slider
  const scaleValues = useMemo(() => {
    return value.map(priceToScale);
  }, [value]);

  // === Handle slider value changes
  const handleSliderChange = (scaleValues) => {
    const priceValues = scaleValues.map(scaleToPrice);
    setValue(priceValues);
  };

  return (
    <div className="w-full max-w-md">
      <Field>
        <FieldTitle className="uppercase text-xs font-semibold">
          Price Range
        </FieldTitle>
        <FieldDescription>
          Budget range: ($
          <span className="font-medium tabular-nums">
            {formatPrice(value[0])}
          </span>{" "}
          -{" "}
          <span className="font-medium tabular-nums">
            {formatPrice(value[1])}
          </span>
          ).
        </FieldDescription>
        <Slider
          value={scaleValues}
          onValueChange={handleSliderChange}
          max={100}
          min={0}
          step={0.1}
          className="mt-2 w-full"
          aria-label="Price Range"
        />
      </Field>
    </div>
  );
}

export default FieldSlider;
