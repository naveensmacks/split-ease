import NavigationButton from "./page-navigation-buttons";
import PageButton from "./page-buttons";

type PaginationControlsProps<T> = {
  items: T[];
  itemsPerPage: number;
  range: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};
const getPaginationRange = (
  numberOfPages: number,
  range: number,
  currentPage: number
) => {
  const rangeMedian = Math.floor(range / 2);
  let before: boolean = false;
  let after: boolean = false;
  let paginationRange: number[] = [];
  console.log("numberOfPages: ", numberOfPages);
  console.log("range: ", range);
  console.log("currentPage: ", currentPage);
  console.log("rangeMedian: ", rangeMedian);
  if (numberOfPages < range * 2) {
    paginationRange = Array.from(
      { length: numberOfPages - 2 },
      (_, i) => 2 + i
    );
    console.log("paginationRange: ", paginationRange);
    console.log("after: ", after);
    console.log("before:", before);
    return [before, after, paginationRange] as const;
  }
  if (currentPage - rangeMedian <= 2) {
    console.log("1st block: ");
    paginationRange = Array.from({ length: range - 1 }, (_, i) => 2 + i);
    if (numberOfPages > range + 1) after = true;
    console.log("paginationRange: ", paginationRange);
    console.log("after: ", after);
    console.log("before:", before);
  } else if (
    currentPage - rangeMedian > 2 &&
    currentPage + rangeMedian < numberOfPages - 1
  ) {
    console.log("2nd block: ");
    const rangeStart = currentPage - rangeMedian;
    paginationRange = Array.from({ length: range }, (_, i) => rangeStart + i);
    before = true;
    after = true;
    console.log("paginationRange: ", paginationRange);
    console.log("after: ", after);
    console.log("before:", before);
  } else {
    console.log("3rd block: ");
    if (numberOfPages > range + 1) before = true;
    paginationRange = Array.from(
      { length: range - 1 },
      (_, i) => numberOfPages - range + 1 + i
    );
    console.log("after: ", after);
    console.log("before:", before);
  }

  return [before, after, paginationRange] as const;
};

export default function PaginationControls<T>({
  items,
  itemsPerPage,
  range,
  currentPage,
  setCurrentPage,
}: PaginationControlsProps<T>) {
  const numberOfPages = Math.ceil(items.length / itemsPerPage);
  const [before, after, paginationRange] = getPaginationRange(
    numberOfPages,
    range,
    currentPage
  );
  return (
    <div className="flex items-center justify-between gap-x-1">
      <NavigationButton
        direction="prev"
        showButton={currentPage !== 1}
        onClickAction={() => setCurrentPage((prev) => prev - 1)}
      />
      <PageButton
        pageNumber={1}
        currentPage={currentPage}
        onClickAction={() => setCurrentPage(1)}
      />

      {before && <Dot />}

      {paginationRange.map((pageNumber) => (
        <PageButton
          key={pageNumber}
          pageNumber={pageNumber}
          currentPage={currentPage}
          onClickAction={() => setCurrentPage(pageNumber)}
        />
      ))}
      {after && <Dot />}

      <PageButton
        pageNumber={numberOfPages}
        currentPage={currentPage}
        onClickAction={() => setCurrentPage(numberOfPages)}
      />
      <NavigationButton
        direction="next"
        showButton={currentPage !== numberOfPages}
        onClickAction={() => setCurrentPage((prev) => prev + 1)}
      />
    </div>
  );
}

function Dot() {
  return (
    <div className="w-10 h-10 rounded-md flex justify-center items-center">
      ...
    </div>
  );
}
