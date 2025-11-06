import { homeInterest } from "@/lib/data";
import { Link } from "react-router-dom";

const FindInterest = () => {
  return (
    <section>
      <div className="container py-12">
        <h2 className="font-extrabold lg:px-2 capitalize  mb-2 text-xl">
          Find listings by interest
        </h2>
        <p className="lg:px-2">Whatever you’re into, we’ve got it here.</p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          {homeInterest.map((item) => (
            <Link
              to={`/listings?category=${item.category.toLowerCase()}`}
              key={item.id}
              className="relative rounded-lg overflow-hidden"
            >
              <img
                src={item.imageUrl}
                alt={item.category}
                className="w-full h-auto md:h-50 lg:h-70 object-cover rounded-lg"
              />
              <span className="w-full inline-block bottom-0 absolute h-28 bg-linear-to-t  from-black/70 via-black/80  to-transparent"></span>
              <p className="text-white text-xl max-[460px]:text-base max-[500px]:text-lg absolute bottom-4 left-4 font-black">
                {item.category}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
export default FindInterest;
