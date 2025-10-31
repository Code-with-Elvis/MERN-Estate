import { useAuth } from "@/store";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "sonner";

const useAuthCheck = () => {
  const setLoading = useAuth((state) => state.setLoading);
  const login = useAuth((state) => state.login);
  const logout = useAuth((state) => state.logout);
  const setServerError = useAuth((state) => state.setServerError);

  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/v1/users/auth/me", {
          withCredentials: true,
        });

        if (res.data?.status === "success") {
          const user = res.data.data.user;
          const token = res.data.token;
          login({ ...user, token });
        } else {
          logout();
        }
        setServerError(false);
      } catch (error) {
        const status = error.response?.status;
        console.error("Auth check error:", error);
        if (status === 401 || status === 403) {
          logout();
        } else if (status === 500) {
          // Handle server error
          console.error("Server error occurred");
          setServerError(true);
        } else if (!status) {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error("An error occurred while authenticating the user.");
        }
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, [setLoading, login, logout, setServerError]);
};
export default useAuthCheck;
