import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Button } from "../ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const SearchForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // === Extract the search term from URL on page load ===

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("q") || "";
    setSearchTerm(query);
  }, [location.search]);

  // === Handle form submission ===

  const handleSubmit = (e) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      const params = new URLSearchParams(); // Create a fresh set of search parameters
      params.set("q", searchTerm); // Add only the search term to the URL
      navigate(`/listings?${params.toString()}`); // Apply new search params to URL
    }
  };

  return (
    <form className="max-w-4xl mx-auto mt-6" onSubmit={handleSubmit}>
      <InputGroup className="h-12 ">
        <InputGroupInput
          className="placeholder:text-neutral-300 placeholder:text-sm"
          placeholder="Find properties near you..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <InputGroupAddon>
          <Search className="size-6 text-neutral-200" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end" className="hidden sm:block">
          <Button className="h-10 uppercase">Search</Button>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
};
export default SearchForm;
