"use client";
import MemberContextProvider from "@/contexts/member-context-provider";
import { getMembersByGroupId } from "@/lib/server-utils";
import React from "react";
import MemberList from "./member-list";
import H1 from "./h1";
import MemberForm from "./member-form";

type MemberListProps = {
  members: Awaited<ReturnType<typeof getMembersByGroupId>>;
  groupId: string;
};
export default function GroupMembers({ members, groupId }: MemberListProps) {
  return (
    <MemberContextProvider data={members ? members : []}>
      <main className="flex flex-grow flex-col mb-4">
        <div className="max-w-[920px] w-full sm:p-3 mx-auto">
          <div className="px-2 pt-2 pb-2 flex flex-col justify-between">
            <MemberList groupId={groupId} />
          </div>
          <div className="flex flex-col gap-2 p-2">
            <H1 className="sm:my-2 text-xl sm:text-2xl">Add Member</H1>
            <MemberForm groupId={groupId} />
          </div>
        </div>
      </main>
    </MemberContextProvider>
  );
}
