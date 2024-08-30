import GroupDetails from "@/components/group-details";
import { getMembersByGroupId } from "@/lib/server-utils";

type GroupMembersProps = {
  params: { slug: string };
};
export default async function GroupDetailsWrapper({
  params,
}: GroupMembersProps) {
  const slug = params.slug;
  const members = await getMembersByGroupId(slug);
  return <GroupDetails members={members} groupId={slug} />;
}
