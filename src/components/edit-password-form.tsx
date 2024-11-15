"use client";
import { editPasswordSchema, TEditPasswordForm } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { PasswordInput } from "./ui/password-input";
import AuthFormBtn from "./auth-form-btn";
import bcrypt from "bcryptjs";
import { useGroupContext } from "@/lib/hooks";
import { setServerFieldErrors } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type EditPasswordFormProps = {
  user: User;
};
export default function EditPasswordForm({ user }: EditPasswordFormProps) {
  const { handleEditPassword } = useGroupContext();
  const router = useRouter();
  const {
    register,
    trigger,
    setError,
    getValues,
    formState: { errors },
  } = useForm<TEditPasswordForm>({
    resolver: zodResolver(editPasswordSchema),
  });

  return (
    <form
      className="flex flex-col p-4 rounded-lg bg-white border-b border-black/10 text-black gap-3"
      action={async () => {
        const result = await trigger();
        if (!result) return;

        const formData = getValues();
        const passwordsMatch = await bcrypt.compare(
          formData.currentPassword as string,
          user.hashedPassword ? user.hashedPassword : ""
        );
        if (!passwordsMatch) {
          setError("currentPassword", {
            message: "Incorrect password",
          });
          return;
        }

        if (formData.currentPassword === formData.newPassword) {
          setError("newPassword", {
            message: "New password must be different from current password",
          });
          return;
        }
        if (formData.newPassword !== formData.confirmNewPassword) {
          setError("confirmNewPassword", {
            message: "Passwords do not match",
          });
          return;
        }

        const actionData = await handleEditPassword(formData);
        if (actionData.isSuccess) {
          toast.success("Password updated successfully");
          //redirect to account page
          router.push(`/app/account`);
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
        <Label htmlFor="password" className="sm:text-lg">
          Current Password
        </Label>
        <PasswordInput
          id="currentPassword"
          placeholder="Enter your current password"
          {...register("currentPassword")}
        />
        {errors.currentPassword && (
          <p className="text-red-500">{errors.currentPassword.message}</p>
        )}
      </div>
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
      <AuthFormBtn>Update Password</AuthFormBtn>
    </form>
  );
}
