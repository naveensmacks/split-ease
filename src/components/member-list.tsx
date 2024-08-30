import { useGroupContext, useMemberContext } from "@/lib/hooks";
import React from "react";
import H1 from "./h1";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import Image from "next/image";
import usersIcon from "../../public/users.svg";

type MemberListProps = {
  groupId: string;
};
export default function MemberList({ groupId }: MemberListProps) {
  const { memberList } = useMemberContext();
  const { getGroupFromList } = useGroupContext();
  const selectedGroup = getGroupFromList(groupId);
  return (
    <>
      <div className="flex gap-6 rounded-lg  my-2 justify-between items-start sm:w-[600px]">
        <div className="flex flex-col justify-center items-start w-4/5 gap-2">
          <div className="flex gap-2 justify-between">
            <Image
              src={usersIcon}
              alt={"Groups"}
              className="w-8 h-8 sm:w-10 sm:h-10 opacity-80"
            />
            <H1 className="text-2xl sm:text-4xl truncate items-center">
              {selectedGroup?.groupName}
            </H1>
          </div>
          <div className="text-black/60 w-full line-clamp-2">
            {selectedGroup?.groupDescription}
          </div>
        </div>
        <div className="w-fit">
          <Button className="state-effects opacity-90">
            <Pencil1Icon />
            <span className="ml-1 hidden sm:block">Edit</span>
          </Button>
        </div>
      </div>

      <H1 className="my-2 text-xl sm:text-2xl">
        Group Members ({memberList?.length})
      </H1>
      <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-2 max-h-[300px] overflow-y-scroll rounded-md">
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
