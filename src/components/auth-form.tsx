"use client";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import AuthFormBtn from "./auth-form-btn";
import { login, signup } from "@/actions/actions";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { signUpSchema, TSignUpForm } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordInput } from "./ui/password-input";

type AuthFormProps = {
  type: "login" | "signup";
};
export default function AuthForm({ type }: AuthFormProps) {
  //here the first argument to useFormState is the action, the second is the initial state
  const [signUpError, dispatchSignUp] = useFormState(signup, undefined);
  const [loginError, dispatchLogIn] = useFormState(login, undefined);

  const {
    register,
    trigger,
    formState: { errors },
  } = useForm<TSignUpForm>({
    resolver: zodResolver(signUpSchema),
  });
  return (
    <form
      action={async (formData) => {
        if (type === "signup") {
          const result = await trigger();
          if (!result) return;
          await dispatchSignUp(formData);
        } else {
          await dispatchLogIn(formData);
        }
      }}
    >
      {type === "signup" && (
        <>
          <div className="space-y-1">
            <Label htmlFor="firstName" className="sm:text-lg">
              First Name
            </Label>
            <Input
              className="border-zinc-400 sm:text-lg"
              type="text"
              id="firstName"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-red-500/85 text-xs">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="lastName" className="sm:text-lg">
              Last Name
            </Label>
            <Input
              className="border-zinc-400 sm:text-lg"
              type="text"
              {...register("lastName")}
              id="lastName"
            />
            {errors.lastName && (
              <p className="text-red-500/85 text-xs">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </>
      )}
      <div className="space-y-1">
        <Label htmlFor="email" className="sm:text-lg">
          Email
        </Label>
        <Input
          className="border-zinc-400 sm:text-xs"
          type="email"
          {...register("email")}
          id="email"
          maxLength={100}
          {...(type === "login" ? { required: true } : undefined)}
        />
        {errors.email && (
          <p className="text-red-500/85 text-xs">{errors.email.message}</p>
        )}
      </div>
      <div className="mb-4 mt-2 space-y-1">
        <Label htmlFor="password" className="sm:text-lg">
          Password
        </Label>
        <PasswordInput
          className="border-zinc-400 sm:text-lg"
          {...register("password")}
          id="password"
          {...(type === "login" ? { required: true } : undefined)}
        />
        {errors.password && (
          <p className="text-red-500/85 text-xs">{errors.password.message}</p>
        )}
      </div>
      {type === "signup" && (
        <div className="mb-4 mt-2 space-y-1">
          <Label htmlFor="confirmPassword" className="sm:text-lg">
            Confirm Password
          </Label>
          <Input
            className="border-zinc-400 sm:text-lg"
            type="password"
            {...register("confirmPassword")}
            id="password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500/85 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      )}
      <AuthFormBtn>{type === "login" ? "Log In" : "Sign Up"} </AuthFormBtn>
      {signUpError && (
        <p className="text-red-500/85 text-xs">{signUpError.message}</p>
      )}
      {loginError && (
        <p className="text-red-500/85 text-xs">{loginError.message}</p>
      )}
    </form>
  );
}
