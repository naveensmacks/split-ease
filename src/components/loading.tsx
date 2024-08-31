import SkeletonCard from "@/components/skeleton-card";

export default function Loading() {
  return (
    <>
      <main className="flex flex-grow flex-col mb-4">
        <div className="max-w-[920px] h-full w-full sm:p-3 mx-auto">
          <div className="px-4 pt-4 pb-2" />
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </main>
    </>
  );
}
