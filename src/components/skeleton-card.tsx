import React from "react";
import Skeleton from "./skeleton";

export default function SkeletonCard() {
  return (
    <div className="flex flex-col px-5 py-4 sm:my-2 gap-y-2">
      <Skeleton className="h-4 w-[125px] sm:w-[250px]" />
      <Skeleton className="h-4 w-[50px] sm:w-[100px]" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-[50px] sm:w-[100px]" />
        <Skeleton className="h-4 w-[50px] sm:w-[100px]" />
      </div>
    </div>
  );
}
