import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { Loader, Loader2 } from "lucide-react";
import { useAuth } from "@/store";
import useDeleteItem from "@/hooks/useDeleteItem";

function DangerZone() {
  const [password, setPassword] = useState("");
  const user = useAuth((state) => state.user);
  const login = useAuth((state) => state.login);
  const { deleteItem, isPending } = useDeleteItem(
    "/api/v1/users/me/deactivate",
    "users",
    "Account status updated successfully"
  );

  const deactivateMe = () => {
    deleteItem(
      { delete: true },
      {
        onSuccess: (data) => {
          login({ ...user, active: data.data.data.active });
        },
      }
    );
  };

  return (
    <div className="mt-10">
      <h2 className="mb-6 text-xl font-bold">Deactivation & Deletion</h2>
      <article>
        <h4 className="mb-2 font-bold">Deactivate account</h4>
        <p className="mb-4 text-[15px] text-muted-foreground">
          Temporarily hide your profile and posts
        </p>
        <Button
          variant="destructive"
          disabled={isPending}
          className={` ${
            user.active ? "bg-yellow-600" : "bg-green-600"
          } font-bold disabled:cursor-not-allowed`}
          onClick={deactivateMe}
        >
          {isPending && <Loader2 className="animate-spin" />}
          {user.active ? "Deactivate account" : "Activate account"}
        </Button>
      </article>
      <article className="mt-8">
        <h4 className="mb-2 font-bold">Delete your data and account</h4>
        <p className="mb-4 text-[15px] text-muted-foreground">
          Permanently delete your data and everything associated with your
          account
        </p>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className=" bg-red-400 font-bold">
              Delete account
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-bold">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="font-medium">
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="mt-0 mb-2">
              <Label htmlFor="password" className="text-sm font-bold ml-1">
                Enter Password*
              </Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 py-5"
                disabled={isPending}
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => setPassword("")}
                disabled={isPending}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button variant="destructive" disabled={isPending}>
                  {isPending && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Delete account
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </article>
    </div>
  );
}
export default DangerZone;
