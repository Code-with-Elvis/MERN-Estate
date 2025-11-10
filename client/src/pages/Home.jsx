import FeaturedListings from "@/components/home/FeaturedListings";
import FindInterest from "@/components/home/FindInterest";
import Landing from "@/components/home/Landing";
import RecentListings from "@/components/home/RecentListings";

const Home = () => {
  return (
    <>
      <Landing />
      <FindInterest />
      <RecentListings />
      <FeaturedListings />
    </>
  );
};
export default Home;
