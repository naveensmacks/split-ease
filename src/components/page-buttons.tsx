import { cn } from "../lib/utils";

type PageButtonProps = {
  pageNumber: number;
  currentPage: number;
  onClickAction: () => void;
};

export default function PageButton({
  pageNumber,
  currentPage,
  onClickAction,
}: PageButtonProps) {
  return (
    <button
      key={pageNumber}
      className={cn(
        "w-10 h-10 rounded-md justify-center sm:hover:bg-primecolor/50",
        {
          "bg-primecolor/90": currentPage === pageNumber,
          "text-white": currentPage === pageNumber,
        }
      )}
      onClick={onClickAction}
    >
      {pageNumber}
    </button>
  );
}
