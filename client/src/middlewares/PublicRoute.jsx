import { useAuth } from "@/store";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const user = useAuth((state) => state.user);
  const loading = useAuth((state) => state.loading);

  if (loading)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black">
        <div className="wave-container">
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </div>
      </div>
    );

  return user ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
