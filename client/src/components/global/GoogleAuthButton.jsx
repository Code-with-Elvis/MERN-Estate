import { FcGoogle } from "react-icons/fc";

const GoogleAuthButton = () => {
  return (
    <button
      type="button"
      aria-label="Continue with Google"
      className="w-full text-xs font-medium uppercase border border-[#dadce0] mt-3 py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-neutral-100 transition disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <FcGoogle size={24} />
      Continue with Google
    </button>
  );
};
export default GoogleAuthButton;
