"use client";
import React from "react";
import { useFormState } from "react-dom";
import { forgotPassword } from "@/actions/actions";
import { useForm } from "react-hook-form";
import { forgotPasswordSchema, TForgotPasswordForm } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import AuthFormBtn from "@/components/auth-form-btn";
import H1 from "@/components/h1";
import { toast } from "sonner";

function ForgotPasswordPage() {
  const [results, dispatchForgotPassword] = useFormState(
    forgotPassword,
    undefined
  );

  const {
    register,
    trigger,
    formState: { errors },
  } = useForm<TForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  return (
    <main className="flex flex-grow flex-col justify-center items-left m-auto w-11/12 sm:w-1/2">
      <H1 className="text-lg sm:text-xl mb-1">Forgot password?</H1>
      <p className="text-sm sm:text-lg mb-1">
        Enter your email address. We will send you a link to reset your
        password.
      </p>
      <form
        action={async (formData) => {
          const result = await trigger();
          if (!result) return;
          await dispatchForgotPassword(formData);
          toast.success("Password reset link has been sent to your email");
        }}
      >
        <Input
          className="border-zinc-400 sm:text-lg"
          type="email"
          {...register("email")}
          id="email"
          maxLength={100}
          required
        />
        {errors.email && (
          <p className="text-red-500/85 text-xs">{errors.email.message}</p>
        )}
        {results && results.isSuccess && (
          <p className="text-primecolor/85 text-xs">{results.message}</p>
        )}
        {results && !results.isSuccess && (
          <p className="text-red-500/85 text-xs">{results.message}</p>
        )}

        <AuthFormBtn>Send </AuthFormBtn>
      </form>
    </main>
  );
}

export default ForgotPasswordPage;
