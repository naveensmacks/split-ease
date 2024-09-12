"use client";
import { useGroupContext } from "@/lib/hooks";
import { useEffect } from "react";

type ExpenseDetailsWrapperProps = {
  expenseId: string;
  children: React.ReactNode;
};

export default function ExpenseDetailsWrapper({
  expenseId,
  children,
}: ExpenseDetailsWrapperProps) {
  console.log("expenseIdy: ", expenseId);
  const { handleSelectedExpenseId } = useGroupContext();

  useEffect(() => {
    handleSelectedExpenseId(expenseId);
  }, [handleSelectedExpenseId, expenseId]);
  return <div>{children}</div>;
}
