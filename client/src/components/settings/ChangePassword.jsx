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
import useUpdateItem from "@/hooks/useUpdateItem";
import { Loader2 } from "lucide-react";

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, "Weak password"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, "Weak password"),
    confirmPassword: z.string().min(6, "This field is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"], // 👈 This tells Zod where to show the error
  });

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(passwordSchema), mode: "onSubmit" });

  const { updateItem, isPending } = useUpdateItem(
    "/api/v1/users/me/update-password",
    "users",
    "Password updated successfully"
  );

  const onSubmit = (data) => {
    // == Remove confirm password ==
    const { confirmPassword: _confirmPassword, ...rest } = data;
    updateItem(rest);
  };

  return (
    <form
      className="mt-10 mx-auto max-w-[450px]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Card>
        <CardHeader>
          <CardTitle className=" text-xl font-bold">
            Password Settings
          </CardTitle>
          <p className="text-sm font-medium text-muted-foreground">
            Update your account password securely.
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-2.5">
            <Label htmlFor="currentPassword" className="text-sm ml-1 mb-1">
              Current Password
            </Label>
            <Input
              type="password"
              id="currentPassword"
              placeholder="******"
              {...register("currentPassword")}
              className={`py-5 ${
                errors.currentPassword ? "border-red-400" : "border-neutral-300"
              }`}
            />
            {errors.currentPassword && (
              <p className="text-xs font-medium ml-1 mt-1 text-red-500">
                * {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="mb-2.5">
            <Label htmlFor="newPassword" className="text-sm ml-1 mb-1">
              New Password
            </Label>
            <Input
              type="password"
              id="newPassword"
              placeholder="*******"
              {...register("newPassword")}
              className={`py-5 ${
                errors.newPassword ? "border-red-400" : "border-neutral-300"
              }`}
            />
            {errors.newPassword && (
              <p className="text-xs font-medium ml-1 mt-1 text-red-500">
                * {errors.newPassword.message}
              </p>
            )}
          </div>
          <div className="mb-2.5">
            <Label htmlFor="confirmPassword" className="text-sm ml-1 mb-1">
              Confirm Password
            </Label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="*******"
              {...register("confirmPassword")}
              className={`py-5 ${
                errors.confirmPassword ? "border-red-400" : "border-neutral-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-xs font-medium ml-1 mt-1 text-red-500">
                * {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={isPending} type="submit" className="uppercase">
            {isPending ? (
              <>
                <Loader2 className="animate-spin" /> Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
export default ChangePassword;
