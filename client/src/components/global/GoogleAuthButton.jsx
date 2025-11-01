import { auth, googleProvider } from "@/firebase";
import useGoogleAuth from "@/hooks/useGoogleAuth";
import { signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

const GoogleAuthButton = () => {
  const { googleSignIn, isPending } = useGoogleAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
      const user = auth.currentUser;
      if (user) {
        googleSignIn({
          name: user.displayName,
          email: user.email,
          photo: user?.photoURL || "",
        });
      }
    } catch (error) {
      console.error("Google sign-in failed:", error);
      toast.error("Google sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <button
      type="button"
      aria-label="Continue with Google"
      className="w-full text-xs font-medium uppercase border border-[#dadce0] mt-3 py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-neutral-100 transition disabled:opacity-70 disabled:cursor-not-allowed"
      onClick={handleGoogleSignIn}
      disabled={isPending || isLoading}
    >
      <FcGoogle size={24} />
      Continue with Google
    </button>
  );
};
export default GoogleAuthButton;
