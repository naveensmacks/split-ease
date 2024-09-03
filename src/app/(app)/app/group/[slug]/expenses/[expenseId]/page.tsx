import NavigationHeader from "@/components/navigation-header";
import React from "react";

type ExpenseSharesPageProps = {
  params: { slug: string; expenseId: string };
};
export default function ExpenseSharesPage({ params }: ExpenseSharesPageProps) {
  const groupId = params.slug;
  const expenseId = params.expenseId;
  return (
    <div>
      <NavigationHeader
        backRoute={`/app/group/${groupId}/expenses`}
        editRoute={`/app/group/${groupId}/expense/${expenseId}/edit`}
      />
    </div>
  );
}
