"use client";
import MemberContextProvider from "@/contexts/member-context-provider";
import { getMembersByGroupId } from "@/lib/server-utils";
import React from "react";
import MemberList from "./member-list";
import { Button } from "./ui/button";
import GroupInfo from "./group-info";
import AddMember from "./add-member";

type MemberListProps = {
  members: Awaited<ReturnType<typeof getMembersByGroupId>>;
  groupId: string;
};
export default function GroupDetails({ members, groupId }: MemberListProps) {
  return (
    <MemberContextProvider data={members ? members : []}>
      <div className="p-2 flex flex-col justify-between gap-1">
        <GroupInfo groupId={groupId} />
        <MemberList />
        <AddMember groupId={groupId} />
        <Button className="mt-6 state-effects mx-4 sm:mx-auto sm:px-44 mb-4 bg-opacity-85 rounded-md">
          Add Expenses
        </Button>
      </div>
    </MemberContextProvider>
  );
}
