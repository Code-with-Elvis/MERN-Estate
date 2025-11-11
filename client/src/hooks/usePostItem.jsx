import { useAuth } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const usePostItem = (apiUrl, queryKey, message) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);

  const { mutate: postItem, isPending } = useMutation({
    mutationFn: async (data) => {
      return axios.post(apiUrl, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    },
    onSuccess: () => {
      const qkey = Array.isArray(queryKey) ? queryKey : [queryKey];
      queryClient.invalidateQueries({ queryKey: qkey });
      toast.success(message || "Item posted successfully");
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
      } else {
        const message =
          error?.response?.data?.message ||
          "Failed to login. Please try again.";
        toast.error(message);
      }
    },
  });

  return { postItem, isPending };
};
export default usePostItem;
