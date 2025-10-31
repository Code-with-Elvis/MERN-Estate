import { Loader2, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import useLogOut from "@/hooks/useLogOut";

const LogoutBtn = () => {
  const { isPending, logOut } = useLogOut();
  return (
    <Button variant={"outline"} className="w-full" onClick={logOut}>
      {isPending ? <Loader2 className="animate-spin" /> : <LogOut />}
      Log out
    </Button>
  );
};
export default LogoutBtn;
