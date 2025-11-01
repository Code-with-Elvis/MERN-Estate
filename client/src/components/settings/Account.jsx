import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAuth } from "@/store";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import useUpdateItem from "@/hooks/useUpdateItem";

const accountSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  name: z
    .string()
    .trim()
    .regex(
      /^[A-Za-z]{2,}\s[A-Za-z]{2,}$/,
      "Full name must contain exactly two non-numeric names"
    ),
  email: z.email("Invalid email address"),
});

const Account = () => {
  const user = useAuth((state) => state.user);
  const login = useAuth((state) => state.login);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(accountSchema), mode: "onSubmit" });

  useEffect(() => {
    if (user) {
      reset({
        name: user?.name || "",
        username: user?.username || "",
        email: user?.email || "",
      });
    }
  }, [user, reset]);

  const { updateItem, isPending } = useUpdateItem(
    "/api/v1/users/me/update",
    "users",
    "Account updated successfully"
  );

  const onSubmit = (data) => {
    // === Remove email  ===
    const { email: _email, ...rest } = data;

    updateItem(rest, {
      onSuccess: () => {
        login({ ...user, ...rest });
      },
    });
  };

  return (
    <form
      className="mt-10 mx-auto max-w-[450px]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Card>
        <CardHeader>
          <CardTitle className=" text-xl font-bold">Account Settings</CardTitle>
          <p className="text-sm font-medium text-muted-foreground">
            Make changes to your personal information.
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-2.5">
            <Label htmlFor="name" className="text-sm ml-1 mb-1">
              Full Name
            </Label>
            <Input
              type="text"
              id="name"
              placeholder="e.g John Doe"
              {...register("name")}
              className={`py-5 ${
                errors.name ? "border-red-400" : "border-neutral-300"
              }`}
            />
            {errors.name && (
              <p className="text-xs font-medium ml-1 mt-1 text-red-500">
                * {errors.name.message}
              </p>
            )}
          </div>
          <div className="mb-2.5">
            <Label htmlFor="username" className="text-sm ml-1 mb-1">
              Username
            </Label>
            <Input
              type="text"
              id="username"
              placeholder="e.g johndoe"
              {...register("username")}
              className={`py-5 ${
                errors.username ? "border-red-400" : "border-neutral-300"
              }`}
            />
            {errors.username && (
              <p className="text-xs font-medium ml-1 mt-1 text-red-500">
                * {errors.username.message}
              </p>
            )}
          </div>
          <div className="mb-2.5">
            <Label htmlFor="email" className="text-sm ml-1 mb-1">
              Email
            </Label>
            <Input
              type="text"
              id="email"
              placeholder="e.g John Doe"
              disabled
              {...register("email")}
              className={`py-5 ${
                errors.email ? "border-red-400" : "border-neutral-300"
              }`}
            />
            {errors.email && (
              <p className="text-xs font-medium ml-1 mt-1 text-red-500">
                * {errors.email.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            disabled={isPending}
            type="submit"
            className="uppercase disabled:cursor-not-allowed "
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" /> Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
export default Account;
