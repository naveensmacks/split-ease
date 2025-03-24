"use client";
import React, { useState } from "react";
import { resetPassword } from "@/actions/actions";
import { useForm } from "react-hook-form";
import { resetPasswordSchema, TResetPasswordForm } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import AuthFormBtn from "@/components/auth-form-btn";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { setServerFieldErrors } from "@/lib/utils";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const {
    register,
    trigger,
    setError,
    getValues,
    formState: { errors },
  } = useForm<TResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });
  return (
    <form
      className="flex flex-col p-4 rounded-lg bg-white border-b border-black/10 text-black gap-3"
      action={async () => {
        const result = await trigger();
        if (!result) return;

        const formData = getValues();

        if (formData.newPassword !== formData.confirmNewPassword) {
          setError("confirmNewPassword", {
            message: "Passwords do not match",
          });
          return;
        }
        if (!token) {
          setError("confirmNewPassword", {
            message: "No token provided, invalid reset password link",
          });
          return;
        }

        const actionData = await resetPassword(token, formData);
        if (actionData.isSuccess) {
          toast.success(actionData.message);
          //redirect to account page
          router.push(`/login`);
        } else if (!actionData.isSuccess) {
          if ("fieldErrors" in actionData && actionData.fieldErrors) {
            setServerFieldErrors(actionData.fieldErrors, setError);
          } else if ("message" in actionData && actionData.message) {
            toast.error(actionData.message);
            setErrorMessage(actionData.message);
          }
        }
      }}
    >
      <div className="space-y-1">
        <Label htmlFor="newPassword" className="sm:text-lg">
          New Password
        </Label>
        <PasswordInput
          id="newPassword"
          placeholder="Enter your new password"
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <p className="text-red-500">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="confirmPassword" className="sm:text-lg">
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your new password"
          {...register("confirmNewPassword")}
        />
        {errors.confirmNewPassword && (
          <p className="text-red-500">{errors.confirmNewPassword.message}</p>
        )}
      </div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <AuthFormBtn>Reset</AuthFormBtn>
    </form>
  );
}
