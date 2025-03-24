"use client";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import AuthFormBtn from "./auth-form-btn";
import { useForm } from "react-hook-form";
import { editAccountSchema, TSignUpForm } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { setServerFieldErrors } from "@/lib/utils";
import { useGroupContext, useUserContext } from "@/lib/hooks";
import { useRouter } from "next/navigation";

export default function AccountDetailsForm() {
  const { handleEditAccountDetails } = useGroupContext();
  const { user } = useUserContext();
  const router = useRouter();
  const {
    register,
    trigger,
    getValues,
    setError,
    formState: { errors },
  } = useForm<TSignUpForm>({
    resolver: zodResolver(editAccountSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName || "",
      email: user.email || "",
    },
  });

  return (
    <form
      className="flex flex-col p-4 rounded-lg bg-white border-b border-black/10 text-black gap-3"
      action={async () => {
        const result = await trigger();
        if (!result) return;
        const actionData = await handleEditAccountDetails(getValues());
        if (actionData.isSuccess) {
          toast.success("Account details updated successfully");
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
        <Label htmlFor="firstName" className="sm:text-lg">
          First Name
        </Label>
        <Input
          className="border-zinc-400 sm:text-lg"
          type="text"
          id="firstName"
          {...register("firstName")}
          disabled={user.hashedPassword === null}
        />
        {errors.firstName && (
          <p className="text-red-500/85">{errors.firstName.message}</p>
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
          disabled={user.hashedPassword === null}
        />
        {errors.lastName && (
          <p className="text-red-500/85">{errors.lastName.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between">
          <Label htmlFor="email" className="sm:text-lg">
            Email
          </Label>
          {user.hashedPassword !== null && (
            <Link
              href="/app/account/edit/email"
              className="text-xs sm:text-sm text-primecolor/85"
            >
              Change Email
            </Link>
          )}
        </div>
        {/* <Input
          className="border-zinc-400 sm:text-lg"
          type="email"
          {...register("email")}
          id="email"
        />
        {errors.email && (
          <p className="text-red-500/85">{errors.email.message}</p>
        )} */}
        <Input
          className="border-zinc-400 sm:text-lg"
          type="email"
          {...register("email")}
          id="email"
          disabled
        />
      </div>
      {user.hashedPassword !== null && (
        <>
          <div className="space-y-1">
            <div className="flex justify-between">
              <Label htmlFor="password" className="sm:text-lg">
                Password
              </Label>
              <Link
                href="/app/account/edit/password"
                className="text-xs sm:text-sm text-primecolor/85"
              >
                Edit Password
              </Link>
            </div>
            <Input
              className="border-zinc-400 sm:text-lg"
              type="password"
              {...register("password")}
              id="password"
            />
            {errors.password && (
              <p className="text-red-500/85">{errors.password.message}</p>
            )}
          </div>
          <AuthFormBtn>Save</AuthFormBtn>
        </>
      )}
    </form>
  );
}
