import { Outlet } from "react-router-dom";
import ProfileAside from "@/components/profile/ProfileAside";

const ProfileLayout = () => {
  return (
    <section>
      <div className="hidden sm:block h-12 bg-[#222]"></div>
      <div className="container">
        <Outlet />
        <ProfileAside />
      </div>
    </section>
  );
};
export default ProfileLayout;
