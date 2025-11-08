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
    <form className="mb-4" onSubmit={handleSubmit}>
      <InputGroup className="border-border">
        <InputGroupInput
          placeholder="Find properties near you..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <InputGroupAddon align="inline-end" className="pr-2">
          <Button className="uppercase h-full ">
            <Search className="" />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
};
export default SearchForm;
