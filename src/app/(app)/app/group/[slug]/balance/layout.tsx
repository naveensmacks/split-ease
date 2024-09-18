import GroupDetailsWrapper from "@/components/group-details-wrapper";

type BalanceLayoutProps = {
  params: { slug: string; expenseId: string };
  children: React.ReactNode;
};

export default async function BalanceLayout({
  params,
  children,
}: BalanceLayoutProps) {
  return (
    <GroupDetailsWrapper groupId={params.slug}>{children}</GroupDetailsWrapper>
  );
}
