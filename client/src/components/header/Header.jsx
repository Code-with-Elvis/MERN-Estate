import Logo from "@/assets/Logo";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import SmallNav from "./SmallNav";
import UserProfile from "./UserProfile";
import { useAuth } from "@/store";

const Header = () => {
  const user = useAuth((state) => state.user);

  return (
    <header className="bg-foreground h-18 text-white">
      <div className="container relative h-full flex items-center justify-between">
        {/* Header content right */}
        <SmallNav />
        <div className="hidden sm:flex items-center space-x-7 text-sm font-medium  uppercase">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/listings">Listings</Link>
        </div>

        {/* Header center logo */}
        <div className="relative sm:absolute sm:left-1/2  sm:top-4 sm:transform sm:-translate-x-1/2 z-40">
          <Link to="/" className="inline-block">
            <Logo className=" mt-1 sm:mt-0 h-12 sm:h-24 text-primary" />
          </Link>
        </div>

        {/* Header content left */}
        {!user && (
          <div className="flex items-center space-x-5  sm:space-x-7 text-sm font-semibold uppercase">
            <Button
              variant="outline"
              asChild
              className="bg-trandsparent text-white"
            >
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        )}

        {user && <UserProfile user={user} />}
      </div>
    </header>
  );
};
export default Header;
