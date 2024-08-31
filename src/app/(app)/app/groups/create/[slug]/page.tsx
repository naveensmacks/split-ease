"use client";
import GroupDetails from "@/components/group-details";
import { useGroupContext } from "@/lib/hooks";
import { getMembersByGroupId } from "@/lib/server-utils";

type GroupMembersProps = {
  params: { slug: string };
};
export default function GroupDetailsWrapper({ params }: GroupMembersProps) {
  const slug = params.slug;
  const { handleChangeSelectedGroupId } = useGroupContext();
  handleChangeSelectedGroupId(slug);
  return <GroupDetails groupId={slug} />;
}
