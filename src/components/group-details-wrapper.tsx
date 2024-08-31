"use client";
import { useGroupContext } from "@/lib/hooks";

type MemberListProps = {
  groupId: string;
  children: React.ReactNode;
};
export default function GroupDetailsWrapper({
  groupId,
  children,
}: MemberListProps) {
  const { handleChangeSelectedGroupId } = useGroupContext();
  handleChangeSelectedGroupId(groupId);

  return (
    <div className="p-2 flex flex-col justify-between gap-1">{children}</div>
  );
}
