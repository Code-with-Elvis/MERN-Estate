import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import GoogleAuthButton from "@/components/global/GoogleAuthButton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2, LockIcon, MailIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import useLoginUser from "@/hooks/useLoginUser";

const signInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, "Weak password"),
});

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const { isPending, loginUser } = useLoginUser("/api/v1/users/signin");

  const onSubmit = (data) => {
    loginUser(data);
  };

  return (
    <section className="pb-10">
      <div className="hidden sm:block h-12 bg-[#222]"></div>
      <div className="container">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto max-w-[450px] mt-10"
        >
          <Card>
            <CardHeader>
              <GoogleAuthButton />
              <div className="flex items-center gap-2 my-4">
                <span className="border border-neutral-300 inline-block flex-1 dark:border-neutral-600"></span>
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                  OR
                </span>
                <span className="border border-neutral-300 inline-block flex-1 dark:border-neutral-600"></span>
              </div>

              <CardContent className="px-0">
                <div className="mb-3">
                  <InputGroup
                    className={` py-5 ${
                      errors.email ? "border-red-400" : "border-neutral-300"
                    }`}
                  >
                    <InputGroupInput
                      type="email"
                      placeholder="Email"
                      {...register("email")}
                    />
                    <InputGroupAddon>
                      <MailIcon className="size-5 text-neutral-400" />
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.email && (
                    <p className="text-xs font-medium ml-1 mt-1 text-red-500">
                      * {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <InputGroup
                    className={` py-5 ${
                      errors.password ? "border-red-400" : "border-neutral-300"
                    }`}
                  >
                    <InputGroupInput
                      type="password"
                      placeholder="Password"
                      {...register("password")}
                    />
                    <InputGroupAddon>
                      <LockIcon className="size-5 text-neutral-400" />
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.password && (
                    <p className="text-xs font-medium ml-1 mt-1 text-red-500">
                      * {errors.password.message}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-6 px-0">
                <Button
                  type="submit"
                  size={"lg"}
                  aria-label="Sign In"
                  disabled={isPending}
                  className="w-full uppercase disabled:cursor-not-allowed  text-white py-2 hover:scale-[1.02] active:scale-[1]  transition duration-100 disabled:bg-neutral-300 disabled:text-neutral-500"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin" /> Loading...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <p className="text-center text-sm text-neutral-600 font-poppins dark:text-neutral-300">
                  Have no account?{" "}
                  <Link
                    to="/signup"
                    className=" font-medium text-black hover:text-accent"
                  >
                    Sign Up
                  </Link>
                </p>
              </CardFooter>
            </CardHeader>
          </Card>
        </form>
      </div>
    </section>
  );
};
export default SignIn;
