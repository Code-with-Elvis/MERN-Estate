import { useAuth } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const useDeleteItem = (apiUrl, queryKey, message) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);

  const { mutate: deleteItem, isPending } = useMutation({
    mutationFn: async (data) => {
      return axios.delete(apiUrl, {
        data,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(message || "Item deleted successfully");
    },
    onError: (error) => {
      console.error("Error:", error?.message || "An error occurred");
      if (error?.response?.status === 401) {
        queryClient.removeQueries();
        navigate("/signin");
        logout();
        toast.error(
          "You are not authorized to perform this action. Please log in."
        );
      } else if (error?.response?.status === 403) {
        toast.error(
          error?.response?.data?.message ||
            "Access denied. You do not have permission for this action."
        );
        navigate("/");
      } else {
        const message =
          error?.response?.data?.message ||
          "Failed to login. Please try again.";
        toast.error(message);
      }
    },
  });

  return { deleteItem, isPending };
};
export default useDeleteItem;
