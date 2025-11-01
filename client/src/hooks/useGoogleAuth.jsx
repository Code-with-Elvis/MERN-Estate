import { useAuth } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const useGoogleAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const login = useAuth((state) => state.login);

  const { mutate: googleSignIn, isPending } = useMutation({
    mutationFn: async (userData) => {
      const response = await axios.post("/api/v1/users/auth/google", userData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Google sign-in successful!");
      navigate("/");
      login(data.data.user, data.token);
    },
    onError: (error) => {
      toast.error("Google sign-in failed. Please try again.");
      console.error(
        "Error:",
        error?.response?.data?.message || "An error occurred"
      );
    },
  });

  return { googleSignIn, isPending };
};
export default useGoogleAuth;
