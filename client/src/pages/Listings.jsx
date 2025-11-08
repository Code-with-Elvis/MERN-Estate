import Filter from "@/components/Listings/Filter";

const Listings = () => {
  return (
    <section className="pb-14">
      <div className="hidden sm:block h-12 bg-[#222]"></div>
      <div className="container pt-6 flex items-start">
        <Filter />
        <div className="flex-1 p-4">Listings Page Content</div>
      </div>
    </section>
  );
};
export default Listings;
