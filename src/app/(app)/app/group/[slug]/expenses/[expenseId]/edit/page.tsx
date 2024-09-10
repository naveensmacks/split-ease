import ExpenseForm from "@/components/expense-form";
import H1 from "@/components/h1";
import React from "react";

export default function ExpenseEdit() {
  return (
    <>
      <div className="px-4 py-2">
        <H1 className="text-xl sm:text-2xl text-white">Edit Expense Details</H1>
      </div>
      <ExpenseForm type="edit" />
    </>
  );
}
