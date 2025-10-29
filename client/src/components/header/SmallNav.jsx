import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AiOutlineMenu } from "react-icons/ai";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";

const SmallNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="sm:hidden w-9 bg-transparent">
          <AiOutlineMenu className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="ml-4">
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          onClick={closeMenu}
          className="cursor-pointer"
        >
          <Link to="/">Home</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          onClick={closeMenu}
          className="cursor-pointer"
        >
          <Link to="/about">About</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          onClick={closeMenu}
          className="cursor-pointer"
        >
          <Link to="/listings">Listings</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default SmallNav;
