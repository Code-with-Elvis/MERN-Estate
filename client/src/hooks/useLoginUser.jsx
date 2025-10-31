import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const useLoginUser = (apiUrl) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: async (userData) => {
      const response = await axios.post(apiUrl, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Login successful!");
      navigate("/");
      console.log("Success:", data);
    },
    onError: (error) => {
      console.error("Error:", error?.message || "An error occurred");

      if (error?.response?.status === 401) {
        toast.error("Incorrect email or password. Please try again.");
      } else {
        const message =
          error?.response?.data?.message ||
          "Failed to login. Please try again.";
        toast.error(message);
      }
    },
  });

  return { loginUser, isPending };
};
export default useLoginUser;
