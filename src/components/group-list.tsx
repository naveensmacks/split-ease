"use client";
import { useGroupContext } from "@/lib/hooks";
import Link from "next/link";
import React from "react";

export default function GroupList() {
  const { groupList } = useGroupContext();
  return (
    <>
      {groupList?.map((group) => (
        <Link href={`/app/groups/create/${group.groupId}`} key={group.groupId}>
          <div
            key={group.groupId}
            className="flex flex-col bg-white sm:rounded-lg py-2 sm:py-3  px-4 sm:my-2 border-b border-black/10"
          >
            <div>{group.groupName}</div>
            <div className="text-black/50">
              Balance: <span className="text-orange-400">-500</span>
            </div>
            <div className="flex justify-between text-black/50">
              <div>Members: {group.users.length}</div>
              <div>
                {(() => {
                  const createdDate = group.createdAt;
                  //Format in the Form of May 18,2022
                  return createdDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                })()}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
