import AddMember from "@/components/add-member";
import GroupDetailsWrapper from "@/components/group-details-wrapper";
import GroupInfo from "@/components/group-info";
import MemberList from "@/components/member-list";
import NavigationHeader from "@/components/navigation-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type GroupEditProps = {
  params: { slug: string };
};
export default function GroupEdit({ params }: GroupEditProps) {
  return (
    <GroupDetailsWrapper groupId={params.slug}>
      <NavigationHeader
        backRoute={`/app/group/${params.slug}/expenses`}
        editRoute={`/app/groups/create/${params.slug}/edit`}
      />
      <GroupInfo />
      <MemberList />
      <AddMember />
      <Button
        className="mt-6 state-effects mx-4 sm:mx-auto sm:px-44 mb-4 bg-opacity-85 rounded-md"
        asChild
      >
        <Link href={`/app/group/${params.slug}/expenses`}>Save</Link>
      </Button>
    </GroupDetailsWrapper>
  );
}
