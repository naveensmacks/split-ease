"use client";
import { useGroupContext } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

type MemberListProps = {
  groupId: string;
  className?: string;
  children: React.ReactNode;
};
export default function GroupDetailsWrapper({
  groupId,
  className,
  children,
}: MemberListProps) {
  const { handleChangeSelectedGroupId } = useGroupContext();
  //handleChangeSelectedGroupId(groupId);
  //did a rookie mistake by adding state updates inside the rendering code
  //state updates code needs to be run after the code rendered like inide useeffect

  // Defer the state update using useEffect
  useEffect(() => {
    handleChangeSelectedGroupId(groupId);
  }, [groupId, handleChangeSelectedGroupId]);

  return (
    <div className={cn("px-2 flex flex-col justify-between", className)}>
      {children}
    </div>
  );
}
