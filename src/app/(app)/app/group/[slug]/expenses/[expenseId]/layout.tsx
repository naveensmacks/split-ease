import ExpenseDetailsWrapper from "@/components/expense-details-wrapper";
import React from "react";

export default function layout({
  params,
  children,
}: {
  params: any;
  children: React.ReactNode;
}) {
  return (
    <ExpenseDetailsWrapper expenseId={params.expenseId}>
      {children}
    </ExpenseDetailsWrapper>
  );
}
