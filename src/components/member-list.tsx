"use client";
import { useGroupContext } from "@/lib/hooks";
import { useState } from "react";
import H1 from "./h1";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export default function MemberList() {
  const { selectedGroupMemberList: memberList } = useGroupContext();
  const [isMemberListVisible, setIsMemberListVisible] = useState(true);
  const toggleMemberListVisibility = () => {
    setIsMemberListVisible((prev) => !prev);
  };
  return (
    <>
      <button
        onClick={toggleMemberListVisibility}
        aria-label="Toggle Member List"
        className="flex gap-2 items-center text-white h-11"
      >
        {isMemberListVisible ? (
          <MinusIcon className="h-5 w-5 sm:h-6 sm:w-6" />
        ) : (
          <PlusIcon className="h-5 w-5 sm:h-6 sm:w-6" />
        )}
        <H1 className="sm:my-2 text-xl sm:text-2xl text-white">
          Group Members ({memberList?.length})
        </H1>
      </button>
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-3 sm:gap-2  overflow-y-scroll rounded-md transition-all duration-500 ease-in-out",
          isMemberListVisible
            ? "max-h-[250px] opacity-100"
            : "max-h-0 opacity-0"
        )}
      >
        {memberList?.map((member) => (
          <div
            key={member.userId}
            className="bg-white sm:rounded-lg px-1 py-1 border-b border-black/10 max-h-[70px]"
          >
            <div className="flex flex-col p-2">
              <div className="truncate">
                {member.firstName + " " + member.lastName}
              </div>
              <div className="truncate min-h-6">
                <span className="text-black/50">
                  {member.email ? member.email : "Guest User"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
