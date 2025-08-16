import AddMember from "@/components/add-member";
import GroupDetailsWrapper from "@/components/group-details-wrapper";
import GroupInfo from "@/components/group-info";
import MemberList from "@/components/member-list";
import NavigationHeader from "@/components/navigation-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type GroupMembersProps = {
  params: { slug: string };
};
export default function GroupDetails({ params }: GroupMembersProps) {
  return (
    <GroupDetailsWrapper groupId={params.slug}>
      <NavigationHeader
        backRoute={`/app/groups/create/${params.slug}`}
        editRoute={`/app/group/${params.slug}/edit`}
        useSettingSymbol={true}
      />
      <GroupInfo groupId={params.slug} />
      <MemberList />
      <AddMember />
      <Button
        className="mt-6 state-effects mx-4 sm:mx-auto sm:px-44 mb-4 bg-opacity-85 rounded-md"
        asChild
      >
        <Link href={`/app/group/${params.slug}/expenses`}>Add Expenses</Link>
      </Button>
    </GroupDetailsWrapper>
  );
}
