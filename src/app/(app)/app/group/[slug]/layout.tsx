import GroupDetailsWrapper from "@/components/group-details-wrapper";
import GroupInfoExpanded from "@/components/group-info-expanded";
import NavigationHeader from "@/components/navigation-header";
import NavigationTabs from "@/components/navigation-tabs";

export default async function Layout({
  params,
  children,
}: {
  params: { slug: string };
  children: React.ReactNode;
}) {
  console.log("params: ", params);
  return (
    <GroupDetailsWrapper groupId={params.slug}>
      <NavigationHeader />
      <GroupInfoExpanded />
      <NavigationTabs groupId={params.slug} />
      {children}
    </GroupDetailsWrapper>
  );
}
