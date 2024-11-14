import * as React from "react";

import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    return (
      <div
        className={cn(
          "flex justify-between items-center h-9 w-full rounded-md border border-zinc-200 transition-colors  file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "flex-grow px-3 py-1 bg-transparent text-sm placeholder:text-zinc-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {showPassword ? (
          <EyeOpenIcon
            className="m-1.5"
            onClick={() => setShowPassword(false)}
          />
        ) : (
          <EyeClosedIcon
            className="m-1.5"
            onClick={() => setShowPassword(true)}
          />
        )}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
