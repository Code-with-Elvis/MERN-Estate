import { useAuth } from "@/store";
import ProfilePhoto from "./ProfilePhoto";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const ProfileAside = () => {
  const user = useAuth((state) => state.user);
  return (
    <aside className="md:border-l py-8 md:px-5 profile-aside-height">
      <ProfilePhoto />
      <div className="mt-12">
        <h2 className="text-lg font-semibold mb-1">{user?.name}</h2>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>
      <Button variant="outline" asChild className="mt-5">
        <Link to="/settings">Edit Profile</Link>
      </Button>
    </aside>
  );
};
export default ProfileAside;
