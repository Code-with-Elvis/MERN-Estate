import { useAuth } from "@/store";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
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

  // === Check user roles ===
  if (!user || !user?.roles?.includes("admin")) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};
export default ProtectedRoute;
