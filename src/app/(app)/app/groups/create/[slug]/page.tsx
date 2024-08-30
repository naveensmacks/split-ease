import GroupMembers from "@/components/group-members";
import { getMembersByGroupId, getGroupByGroupId } from "@/lib/server-utils";

type GroupMembersProps = {
  params: { slug: string };
};
export default async function GroupMembersWrapper({
  params,
}: GroupMembersProps) {
  const slug = params.slug;
  const members = await getMembersByGroupId(slug);
  return <GroupMembers members={members} groupId={slug} />;
}
