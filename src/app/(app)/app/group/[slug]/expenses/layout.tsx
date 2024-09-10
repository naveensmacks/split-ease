import ExpenseDetailsWrapper from "@/components/expense-details-wrapper";
import React from "react";

type ExpenseLayoutProps = {
  params: { slug: string; expenseId: string };
  children: React.ReactNode;
};

export default async function ExpenseLayout({
  params,
  children,
}: ExpenseLayoutProps) {
  return (
    <ExpenseDetailsWrapper groupId={params.slug} expenseId={params.expenseId}>
      {children}
    </ExpenseDetailsWrapper>
  );
}
