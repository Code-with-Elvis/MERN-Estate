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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import useCreateUser from "@/hooks/useCreateUser";

const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  name: z
    .string()
    .trim()
    .regex(
      /^[A-Za-z]{2,}\s[A-Za-z]{2,}$/,
      "Full name must contain exactly two names"
    ),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, "Weak password"),
});

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
  });

  const email = watch("email");
  const name = watch("name");
  const username = watch("username");

  const isEmailValid = z.email().safeParse(email).success;
  const isNameValid = z
    .string()
    .trim()
    .regex(
      /^[A-Za-z]{2,}\s[A-Za-z]{2,}$/,
      "Full name must contain exactly two names"
    )
    .safeParse(name).success;
  const isUsernameValid = z.string().min(3).max(30).safeParse(username).success;

  const { createUser, isPending } = useCreateUser("/api/v1/users/signup");

  const onSubmit = (data) => {
    createUser(data);
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
                <div className="mb-2.5">
                  <InputGroup
                    className={` py-5 ${
                      errors.username ? "border-red-400" : "border-neutral-300"
                    }`}
                  >
                    <InputGroupInput
                      type="text"
                      placeholder="Username"
                      {...register("username")}
                    />
                    <InputGroupAddon align="inline-end">
                      <div
                        className={`${
                          username && isUsernameValid
                            ? "bg-green-500"
                            : "bg-primary/70"
                        } text-primary-foreground flex size-5 items-center justify-center rounded-full`}
                      >
                        <Check className="size-3.5" />
                      </div>
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.username && (
                    <p className="text-xs font-medium ml-1 mt-1 text-red-500">
                      * {errors.username.message}
                    </p>
                  )}
                </div>

                <div className="mb-2.5">
                  <InputGroup
                    className={` py-5 ${
                      errors.name ? "border-red-400" : "border-neutral-300"
                    }`}
                  >
                    <InputGroupInput
                      type="text"
                      placeholder="Name"
                      {...register("name")}
                    />
                    <InputGroupAddon align="inline-end">
                      <div
                        className={`${
                          name && isNameValid ? "bg-green-500" : "bg-primary/70"
                        } text-primary-foreground flex size-5 items-center justify-center rounded-full`}
                      >
                        <Check className="size-3.5" />
                      </div>
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.name && (
                    <p className="text-xs font-medium ml-1 mt-1 text-red-500">
                      * {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="mb-2.5">
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
                    <InputGroupAddon align="inline-end">
                      <div
                        className={`${
                          email && isEmailValid
                            ? "bg-green-500"
                            : "bg-primary/70"
                        } text-primary-foreground flex size-5 items-center justify-center rounded-full`}
                      >
                        <Check className="size-3.5" />
                      </div>
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.email && (
                    <p className="text-xs font-medium ml-1 mt-1 text-red-500">
                      * {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="mb-2.5">
                  <InputGroup
                    className={` py-5 ${
                      errors.password ? "border-red-400" : "border-neutral-300"
                    }`}
                  >
                    <InputGroupInput
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...register("password")}
                    />
                    <InputGroupAddon align="inline-end">
                      <div
                        onClick={() => setShowPassword((val) => !val)}
                        className="bg-primary text-white rounded-full cursor-pointer flex size-6 items-center justify-center"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </div>
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.password && (
                    <p className="text-xs font-medium ml-1 mt-1 text-red-500">
                      * {errors.password.message}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-3 px-0">
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
                    "Sign Up"
                  )}
                </Button>
                <p className="text-center text-sm text-neutral-600 font-poppins dark:text-neutral-300">
                  Have an account?{" "}
                  <Link
                    to="/signin"
                    className=" font-medium text-black hover:text-accent"
                  >
                    Sign In
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
export default SignUp;
