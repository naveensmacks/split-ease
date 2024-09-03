"use client";
import { useGroupContext } from "@/lib/hooks";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function GroupList() {
  const { groupList } = useGroupContext();
  return (
    <>
      {groupList?.map((group) => (
        <Link href={`/app/group/${group.groupId}/expenses`} key={group.groupId}>
          <div
            key={group.groupId}
            className="flex flex-col bg-white sm:rounded-lg py-2 sm:py-3  px-4 sm:my-2 border-b border-black/10"
          >
            <div className="truncate">{group.groupName}</div>
            <div className="text-black/50">
              Balance: <span className="text-orange-400">-500</span>
            </div>
            <div className="flex justify-between text-black/50">
              <div>Members: {group.users.length}</div>
              <div>{formatDate(new Date(group.createdAt))}</div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
