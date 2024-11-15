import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};
export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse h-4 w-[100px] rounded-md bg-black/20",
        className
      )}
    />
  );
}
