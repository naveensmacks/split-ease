import { cn, extractInitials } from "@/lib/utils";

type DisplayInitialsProps = {
  firstName: string;
  lastName?: string | null;
  className?: string;
};

/**
 * Renders a circle with the first letter of the `firstName` and `lastName`
 * (if provided) inside it.
 *
 * @example
 * <DisplayInitials firstName="John" lastName="Doe" />
 *
 * @param {DisplayInitialsProps} props
 * @returns {JSX.Element}
 */
export default function DisplayInitials({
  firstName,
  lastName,
  className,
}: DisplayInitialsProps) {
  return (
    <div
      className={cn(
        "min-w-10 h-10 rounded-full bg-black/10 flex items-center justify-center",
        className
      )}
    >
      {extractInitials(firstName, lastName)}
    </div>
  );
}
