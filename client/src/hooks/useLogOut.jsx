import { useAuth } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const useLogOut = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);

  const { mutate: logOut, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        "/api/v1/users/auth/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Logout successful!");
      navigate("/");
      logout();
    },
    onError: (error) => {
      console.error("Error:", error?.message || "An error occurred");
      const message =
        error?.response?.data?.message || "Failed to logout. Please try again.";

      if (error?.response?.status === 401) {
        logout();
        queryClient.removeQueries();
        toast.error("Logged out successfully");
      } else {
        toast.error(message);
      }
    },
  });
  return { logOut, isPending };
};
export default useLogOut;
