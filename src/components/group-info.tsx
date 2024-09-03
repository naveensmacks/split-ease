"use client";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { useGroupContext } from "@/lib/hooks";
import Link from "next/link";
import GroupInfoHeader from "./group-info-header";

export default function GroupInfo() {
  const { selectedGroup } = useGroupContext();
  return (
    <div className="flex sm:gap-4 gap-2 rounded-lg min-h-[120px] justify-start items-center sm:max-w-[750px]">
      <GroupInfoHeader />
      {selectedGroup?.groupId && (
        <div className="hidden sm:block">
          <Button className="state-effects opacity-90" asChild>
            <Link href={`/app/groups/create/${selectedGroup.groupId}/edit`}>
              <Pencil1Icon />
              <span className="ml-1">Edit</span>
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
