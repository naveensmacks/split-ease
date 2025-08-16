"use client";
import { useGroupContext, useUserContext } from "@/lib/hooks";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function GroupList() {
  const { groupList } = useGroupContext();
  const { user } = useUserContext();
  return (
    <>
      {groupList?.length ? (
        groupList.map((group) => {
          const userBalance = group.balance?.find(
            (balance) => balance.user.userId === user.userId
          );
          const balanceAmount = userBalance?.amount || 0;
          return (
            <Link
              href={`/app/group/${group.groupId}/expenses`}
              key={group.groupId}
            >
              <div
                key={group.groupId}
                className="flex flex-col bg-white sm:rounded-lg py-2 sm:py-3  px-4 sm:my-2 border-b border-black/10"
              >
                <div className="truncate">{group.groupName}</div>
                <div className="text-black/50">
                  My Balance:{" "}
                  <span
                    className={
                      balanceAmount < 0 ? "text-orange-400" : "text-primecolor"
                    }
                  >
                    {balanceAmount + " " + group.currencyType}
                  </span>
                </div>
                <div className="flex justify-between text-black/50">
                  <div>Members: {group.users.length}</div>
                  <div>{formatDate(new Date(group.createdAt))}</div>
                </div>
              </div>
            </Link>
          );
        })
      ) : (
        <EmptyView />
      )}
    </>
  );
}

function EmptyView() {
  return (
    <div className="flex items-center justify-center bg-white text-black/40 rounded-lg border-b border-black/10 content-center min-h-64 text-center">
      <Link
        href="/app/groups/create"
        className="h-15 max-w-96 p-5 flex items-center justify-center"
      >
        You don&apos;t have any groups. Create one now!
      </Link>
    </div>
  );
}
