import { Link } from "react-router-dom";
import heroImg from "../../assets/hero-bg.png";
import { Button } from "../ui/button";
import { heroTags } from "@/lib/data";
import SearchForm from "./SearchForm";
import { Badge } from "../ui/badge";

const Landing = () => {
  return (
    <section className="relative">
      <div className="hidden sm:block h-44 bg-[#222] absolute inset-x-0 top-0 z-10"></div>
      <div className="px-0 lg:px-8 container z-20 relative">
        <div
          style={{ backgroundImage: `url(${heroImg})` }}
          className="min-h-80 bg-no-repeat bg-cover lg:rounded-b-xl overflow-hidden relative"
        >
          <div className="absolute inset-0 z-10 bg-black/60"></div>
          <div className="relative z-20 text-white">
            <div className="container pt-24 pb-10">
              <h1 className="text-center font-extrabold capitalize text-4xl">
                Your next home.
              </h1>
              {/* == Tags == */}
              <div className="mt-10 overflow-x-auto scrollbar-hide">
                <div className="flex justify-center pb-1 sm:justify-center gap-3 min-w-max px-2 sm:px-0">
                  {heroTags.map(({ id, label, icon: Icon }) => (
                    <Button
                      key={id}
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 whitespace-nowrap shrink-0"
                    >
                      <Link to="/listings" className="flex items-center gap-2">
                        <Icon size={16} />
                        {label}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
              {/* == Search Form == */}
              <SearchForm />
              {/* == Badge == */}
              <Badge className="mt-16 max-[400px]:text-xs bg-yellow-600 text-sm capitalize py-2 px-4 border border-white rounded-sm mx-auto block">
                List your property for free. No hidden fees.
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Landing;
