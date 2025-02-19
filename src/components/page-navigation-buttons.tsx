import { cn } from "@/lib/utils";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";

type NavigationButtonProps = {
  direction: "prev" | "next";
  showButton: boolean;
  onClickAction: () => void;
};
export default function NavigationButton({
  direction,
  showButton,
  onClickAction,
}: NavigationButtonProps) {
  return (
    <>
      <button
        className={cn("w-10 h-10 flex items-center rounded-md justify-center", {
          "cursor-not-allowed": !showButton,
          "text-zinc-300": !showButton,
        })}
        onClick={onClickAction}
        disabled={!showButton}
      >
        {direction === "prev" && (
          <>
            <ArrowLeftIcon className="w-5 h-5" />
          </>
        )}
        {direction === "next" && (
          <>
            <ArrowRightIcon className="w-5 h-5" />
          </>
        )}
      </button>
    </>
  );
}
