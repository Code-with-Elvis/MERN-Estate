import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const useCreateUser = (apiUrl) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: createUser, isPending } = useMutation({
    mutationFn: async (userData) => {
      const response = await axios.post(apiUrl, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Success:", data);
      toast.success("User created successfully:");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/signin");
    },
    onError: (error) => {
      console.error("Error:", error?.message || "An error occurred");

      if (error?.response?.status === 409) {
        toast.error("User already exists. Please try logging in.");
      } else {
        const message =
          error?.response?.data?.message ||
          "Failed to create user. Please try again.";
        toast.error(message);
      }
    },
  });

  return { createUser, isPending };
};
export default useCreateUser;
