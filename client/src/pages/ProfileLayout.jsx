import { Outlet } from "react-router-dom";
import ProfileAside from "@/components/profile/ProfileAside";

const ProfileLayout = () => {
  return (
    <section>
      <div className="hidden sm:block h-12 bg-[#222]"></div>
      <div className="container flex flex-col-reverse md:grid  md:grid-cols-[1fr_300px] gap-8">
        <Outlet />
        <ProfileAside />
      </div>
    </section>
  );
};
export default ProfileLayout;
