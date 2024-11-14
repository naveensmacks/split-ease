"use client";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type AuthFormBtnProps = {
  children: React.ReactNode;
  className?: string;
};
export default function AuthFormBtn({ children, className }: AuthFormBtnProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      className={cn(
        "mb-2 mt-5 sm:text-lg state-effects rounded-lg mx-auto w-1/2 sm:w-1/3 bg-opacity-85",
        className
      )}
      disabled={pending}
    >
      {children}
    </Button>
  );
}
