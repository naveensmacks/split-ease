import AddMember from "@/components/add-member";
import GroupDetailsWrapper from "@/components/group-details-wrapper";
import GroupInfo from "@/components/group-info";
import MemberList from "@/components/member-list";
import { Button } from "@/components/ui/button";

type GroupMembersProps = {
  params: { slug: string };
};
export default function GroupDetails({ params }: GroupMembersProps) {
  const slug = params.slug;
  return (
    <GroupDetailsWrapper groupId={slug}>
      <GroupInfo />
      <MemberList />
      <AddMember />
      <Button className="mt-6 state-effects mx-4 sm:mx-auto sm:px-44 mb-4 bg-opacity-85 rounded-md">
        Add Expenses
      </Button>
    </GroupDetailsWrapper>
  );
}
