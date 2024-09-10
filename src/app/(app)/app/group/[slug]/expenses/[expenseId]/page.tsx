import ExpenseDetailsView from "@/components/expense-details-view";
import NavigationHeader from "@/components/navigation-header";

type ExpenseSharesPageProps = {
  params: { slug: string; expenseId: string };
};
export default function ExpenseSharesPage({ params }: ExpenseSharesPageProps) {
  const { slug, expenseId } = params;
  return (
    <div>
      <NavigationHeader
        backRoute={`/app/group/${slug}/expenses`}
        editRoute={`/app/group/${slug}/expenses/${expenseId}/edit`}
      />
      <ExpenseDetailsView groupId={slug} expenseId={expenseId} />
    </div>
  );
}
