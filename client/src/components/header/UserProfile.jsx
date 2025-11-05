import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BiChevronDown } from "react-icons/bi";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusSquare, Settings2, User2Icon } from "lucide-react";
import LogoutBtn from "./LogoutBtn";

const UserProfile = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-3 cursor-pointer">
          <span className="text-xs uppercase font-medium inline-block w-18 text-end  truncate">
            {user.name.split(" ")[0]}
          </span>
          <div className="flex items-center gap-2">
            <span>
              <BiChevronDown />
            </span>
            <Avatar className="size-9">
              <AvatarImage
                src={user?.photo}
                className="w-full h-full object-cover"
              />
              <AvatarFallback className="text-foreground font-semibold select-none">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-8 sm:mr-10 w-40">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={`/profile/${user._id}`} className="flex items-center gap-2">
            <User2Icon /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center gap-2">
            <Settings2 /> Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/add-listing" className="flex items-center gap-2">
            <PlusSquare /> Create
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <div className="py-1">
            <LogoutBtn />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserProfile;
