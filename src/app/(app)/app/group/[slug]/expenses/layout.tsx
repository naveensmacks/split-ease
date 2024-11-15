import GroupDetailsWrapper from "@/components/group-details-wrapper";

type ExpenseLayoutProps = {
  params: { slug: string; expenseId: string };
  children: React.ReactNode;
};

export default async function ExpenseLayout({
  params,
  children,
}: ExpenseLayoutProps) {
  return (
    <GroupDetailsWrapper groupId={params.slug}>{children}</GroupDetailsWrapper>
  );
}
