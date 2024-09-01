"use client";
import { useGroupContext } from "@/lib/hooks";
import { cn } from "@/lib/utils";

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
  handleChangeSelectedGroupId(groupId);

  return (
    <div className={cn("px-2 flex flex-col justify-between", className)}>
      {children}
    </div>
  );
}
