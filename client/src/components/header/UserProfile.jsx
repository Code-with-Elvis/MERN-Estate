import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BiChevronDown } from "react-icons/bi";
import { Link } from "react-router-dom";

const UserProfile = ({ user }) => {
  return (
    <Link to={`/profile/${user.id}`} className="flex items-center gap-2">
      <span>
        <BiChevronDown />
      </span>
      <Avatar className="size-9">
        <AvatarImage src={user.image} className="w-full h-full object-cover" />
        <AvatarFallback className="text-foreground font-semibold">
          {user.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
};
export default UserProfile;
