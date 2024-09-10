"use client";
import { useGroupContext } from "@/lib/hooks";
import { useEffect } from "react";

type ExpenseDetailsWrapperProps = {
  groupId: string;
  expenseId: string;
  children: React.ReactNode;
};

export default function ExpenseDetailsWrapper({
  groupId,
  expenseId,
  children,
}: ExpenseDetailsWrapperProps) {
  const { handleChangeSelectedGroupId, handleSelectedExpenseId } =
    useGroupContext();

  useEffect(() => {
    handleChangeSelectedGroupId(groupId);
    handleSelectedExpenseId(expenseId);
  }, [handleChangeSelectedGroupId, handleSelectedExpenseId]);
  return <div>{children}</div>;
}
