import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

const ListingCard = ({ _id, title, price, images, slug, ratingsAverage }) => {
  return (
    <Link to={`/listings/${slug}`} className="block break-inside-avoid mb-4">
      <Card className="p-0 gap-0 bg-transparent border-0">
        <CardHeader className="p-0 overflow-hidden relative">
          <div className="bg-gray-100 min-h-20 rounded-xl overflow-hidden">
            <img src={images[0]} alt={title} className="w-full" />
          </div>
        </CardHeader>
        <CardContent className="px-2.5 py-2 pt-0">
          <h3 className="font-medium">{title}</h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              ${price.toLocaleString()}
            </p>
            <div className="flex gap-1 items-center">
              <div className="flex items-center gap-1">
                <span className="inline-block size-1 bg-muted-foreground"></span>{" "}
                <Star className="size-3.5" />
              </div>
              <span className="text-sm text-muted-foreground">
                {ratingsAverage ? ratingsAverage.toFixed(1) : "No ratings"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
export default ListingCard;
