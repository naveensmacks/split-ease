"use client";
import { changeEmailSchema, TChangeEmailForm } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { PasswordInput } from "./ui/password-input";
import AuthFormBtn from "./auth-form-btn";
import { setServerFieldErrors } from "@/lib/utils";
import { toast } from "sonner";
import { changeEmailId } from "@/actions/actions";
import { useState } from "react";

type EditPasswordFormProps = {
  user: User;
};
export default function ChangeEmailForm({ user }: EditPasswordFormProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    trigger,
    setError,
    getValues,
    formState: { errors },
  } = useForm<TChangeEmailForm>({
    resolver: zodResolver(changeEmailSchema),
  });

  return (
    <form
      className="flex flex-col p-4 rounded-lg bg-white border-b border-black/10 text-black gap-3"
      action={async () => {
        setMessage("");
        const result = await trigger();
        if (!result) return;
        const actionData = await changeEmailId(user.userId, getValues());
        setIsSuccess(actionData.isSuccess);
        setMessage(actionData.message ? actionData.message : "");

        if (actionData.isSuccess) {
          toast.success(actionData.message);
        } else if (!actionData.isSuccess) {
          if ("fieldErrors" in actionData && actionData.fieldErrors) {
            setServerFieldErrors(actionData.fieldErrors, setError);
          } else if ("message" in actionData && actionData.message) {
            toast.error(actionData.message);
          }
        }
      }}
    >
      <div className="space-y-1">
        <Label htmlFor="email" className="sm:text-lg">
          Email
        </Label>
        <Input
          className={`border-zinc-400 sm:text-lg ${
            errors.email ? "border-red-500" : ""
          }`}
          type="email"
          {...register("email")}
          id="email"
          placeholder="Enter your new email address"
          maxLength={100}
          required
        />
        {errors.email && (
          <p className="text-red-500/85 text-xs sm:text-sm">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="password" className="sm:text-lg">
          Current Password
        </Label>
        <PasswordInput
          id="password"
          placeholder="Enter your password to confirm the change"
          {...register("password")}
          className="border-zinc-400 sm:text-lg"
          required
        />
        {errors.password && (
          <p className="text-red-500 text-xs sm:text-sm">
            {errors.password.message}
          </p>
        )}
      </div>
      {isSuccess && (
        <p className="text-primecolor text-xs sm:text-sm">{message}</p>
      )}
      {!isSuccess && (
        <p className="text-red-500 text-xs sm:text-sm">{message}</p>
      )}
      <AuthFormBtn>Update Email</AuthFormBtn>
    </form>
  );
}
