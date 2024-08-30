import { type ClassValue, clsx } from "clsx";
import { Path, UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms = 1000) {
  if (process.env.NODE_ENV === "development") {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export function setServerFieldErrors<T extends Record<string, any>>(
  fieldErrors: Partial<Record<keyof T, string[]>>,
  setError: UseFormSetError<T>
) {
  const errors = Object.keys(fieldErrors) as Array<keyof T>;
  console.log("errors: ", errors);

  for (const field of errors) {
    const messages = fieldErrors[field];
    if (messages) {
      setError(field as Path<T>, {
        type: "server",
        message: messages.join(", "),
      });
    }
  }
}
