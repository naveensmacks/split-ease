"use client";
import { GearIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { useGroupContext } from "@/lib/hooks";
import Link from "next/link";
import GroupInfoHeader from "./group-info-header";

export default function GroupInfoExpanded() {
  const { selectedGroup } = useGroupContext();
  return (
    <div className="flex sm:gap-4 gap-2 rounded-lg min-h-[120px] justify-start items-center sm:max-w-[750px]">
      <GroupInfoHeader />
      {selectedGroup?.groupId && (
        <div className="hidden sm:block">
          <Button className="state-effects opacity-90 w-[100%]" asChild>
            <Link href={`/app/group/${selectedGroup.groupId}/edit`}>
              <GearIcon />
              <span className="ml-1">Edit</span>
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
