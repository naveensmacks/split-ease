import SkeletonCard from "@/components/skeleton-card";

export default function Loading() {
  return (
    <>
      <div className="px-4 pt-4 pb-2" />
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </>
  );
}
