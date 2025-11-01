import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Button } from "../ui/button";

const SearchForm = () => {
  return (
    <form className="max-w-4xl mx-auto mt-6">
      <InputGroup className="h-12 ">
        <InputGroupInput
          className="placeholder:text-neutral-300 "
          placeholder="Find properties near you..."
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
