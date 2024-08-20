import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

type H1Props = {
  children: React.ReactNode;
  className?: ClassValue;
};

export default function H1({ children, className }: H1Props) {
  return (
    <h1 className={cn("font-medium text-2xl leading-6", className)}>
      {children}
    </h1>
  );
}
