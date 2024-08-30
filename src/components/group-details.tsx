"use client";
import MemberContextProvider from "@/contexts/member-context-provider";
import { getMembersByGroupId } from "@/lib/server-utils";
import React, { useState } from "react";
import MemberList from "./member-list";
import H1 from "./h1";
import MemberForm from "./member-form";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
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
      <main className="flex flex-grow flex-col mb-4">
        <div className="max-w-[920px] w-full sm:p-3 mx-auto">
          <div className="p-2 flex flex-col justify-between gap-1">
            <GroupInfo groupId={groupId} />
            <MemberList />
            <AddMember groupId={groupId} />
          </div>
        </div>
        <Button className="mt-6 state-effects mx-4 sm:mx-auto sm:px-44 mb-4 bg-opacity-85 rounded-md">
          Add Expenses
        </Button>
      </main>
    </MemberContextProvider>
  );
}
